import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { gql, useLazyQuery } from "@apollo/client";
import { VariableSizeList as List, areEqual } from "react-window";
import composeRefs from "@seznam/compose-react-refs";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import Course from "./Course";
import { DRAWER_WIDTH, ITEMS_PER_PAGE } from "../../lib/Constants";

const SEARCH_COURSES = gql`
  query SearchCourses(
    $search: String
    $year: [Int!]
    $term: [String!]
    $partOfTerm: [String!]
    $college: [String!]
    $subject: [String!]
    $genEd: [String!]
    $attribute: [String!]
    $instructor: [String!]
    $genEdsBy: GenEdsBy! = any
    $orderBy: [_CourseOrdering!]! = courseId_asc
    $skip: Int! = 0
    $limit: Int! = 10
  ) {
    searchCourses(
      searchString: $search
      years: $year
      terms: $term
      partOfTerms: $partOfTerm
      colleges: $college
      subjects: $subject
      genEds: $genEd
      attributes: $attribute
      instructors: $instructor
      genEdsBy: $genEdsBy
      orderBy: $orderBy
      offset: $skip
      first: $limit
    ) {
      courseId
      name
      description
      creditHours
      gpa
      semesters
      genEds {
        name
      }
    }
  }
`;

export default function SearchCourses({ filters }) {
  const listRef = React.useRef({});
  const itemHeights = React.useRef({});
  const [searchCourses, { data, loading, error, fetchMore }] = useLazyQuery(
    SEARCH_COURSES
  );
  const [hasNextPage, setHasNextPage] = React.useState(false);

  // TODO: Apply filters
  React.useEffect(() => {
    searchCourses({
      variables: { skip: 0, limit: ITEMS_PER_PAGE, ...filters },
    });
  }, [filters]);

  React.useEffect(() => {
    if (data) {
      setHasNextPage(data.searchCourses.length % ITEMS_PER_PAGE === 0);
    } else {
      setHasNextPage(false);
    }
  }, [data]);

  const loadMore = () => {
    fetchMore({
      variables: {
        skip: data.searchCourses.length,
        limit: ITEMS_PER_PAGE,
        ...filters,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.searchCourses.length === 0) {
          setHasNextPage(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          searchCourses: [...previousResult.searchCourses, ...fetchMoreResult.searchCourses],
        });
      },
    });
  };

  const getLoadedCourses = () => {
    if (data) {
      return data.searchCourses.length;
    }
    return 0;
  };

  const getItemHeight = (index) => {
    return itemHeights.current[index] + 8 || 150;
  };

  const isItemLoaded = (index) => !hasNextPage || index < getLoadedCourses();

  const Row = React.memo(({ index, style }) => {
    if (isItemLoaded(index)) {
      return (
        <div style={style}>
          <CourseItem index={index} />
        </div>
      );
    }
    return (
      <div
        style={{
          ...style,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          color="secondary"
          style={{
            marginTop: (style.height - 40) / 2,
          }}
        ></CircularProgress>
      </div>
    );
  }, areEqual);

  const CourseItem = ({ index }) => {
    const itemRef = React.useRef({});
    const course = data.searchCourses[index];

    React.useEffect(() => {
      if (itemRef.current) {
        setItemHeight(index, itemRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, [itemRef]);

    return (
      <div ref={itemRef}>
        <Course {...course} filters={filters} />
      </div>
    );
  };

  const setItemHeight = (index, size) => {
    listRef.current.resetAfterIndex(0);
    itemHeights.current = { ...itemHeights.current, [index]: size };
  };

  return (
    <div style={{ height: "100%", overflowX: "hidden" }}>
      {error ? (
        <p>Error: {error.message}</p>
      ) : data && getLoadedCourses() > 0 ? (
        <AutoSizer defaultHeight={500}>
          {({ height }) => (
            <InfiniteLoader
              itemCount={
                hasNextPage ? getLoadedCourses() + 1 : getLoadedCourses()
              }
              isItemLoaded={isItemLoaded}
              loadMoreItems={loadMore}
              threshold={4}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  height={height}
                  itemCount={
                    hasNextPage ? getLoadedCourses() + 1 : getLoadedCourses()
                  }
                  itemSize={getItemHeight}
                  ref={composeRefs(ref, listRef)}
                  width={DRAWER_WIDTH}
                  onItemsRendered={onItemsRendered}
                  estimatedItemSize={150}
                >
                  {Row}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      ) : loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <CircularProgress color="secondary"></CircularProgress>
        </div>
      ) : (
        <Typography align="center">No Results.</Typography>
      )}
    </div>
  );
}
