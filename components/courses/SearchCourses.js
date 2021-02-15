import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List, areEqual } from "react-window";
import composeRefs from "@seznam/compose-react-refs";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

import Course from "./Course";

import { DRAWER_WIDTH, ITEMS_PER_PAGE } from "../../lib/Constants";

export default function SearchCourses({ filters }) {
  const listRef = React.useRef({});
  const itemHeights = React.useRef({});

  const {
    status,
    data,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["search", filters],
    async ({ pageParam = 0, queryKey: [, filters] }) => {
      const response = await axios.get("/api/courses", {
        params: {
          startIndex: pageParam * ITEMS_PER_PAGE,
          endIndex: (pageParam + 1) * ITEMS_PER_PAGE,
          ...filters,
        },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === ITEMS_PER_PAGE ? pages.length : undefined,
    }
  );

  const getLoadedCourses = () => {
    if (data) {
      let numPages = data.pages.length;
      if (numPages > 1) {
        return (
          (numPages - 1) * ITEMS_PER_PAGE +
          data.pages[numPages - 1].length
        );
      }
      return data.pages[0].length;
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
    const course =
      data.pages[Math.floor(index / ITEMS_PER_PAGE)][index % ITEMS_PER_PAGE];

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
  }

  return (
    <div style={{ height: "100%", overflowX: "hidden" }}>
      {status === "loading" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <CircularProgress color="secondary"></CircularProgress>
        </div>
      ) : status === "error" ? (
        <p>Error: {error.message}</p>
      ) : data && getLoadedCourses() > 0 ? (
        <AutoSizer defaultHeight={500}>
          {({ height }) => (
            <InfiniteLoader
              itemCount={
                hasNextPage ? getLoadedCourses() + 1 : getLoadedCourses()
              }
              isItemLoaded={isItemLoaded}
              loadMoreItems={fetchNextPage}
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
      ) : (
        <Typography align="center">No Results.</Typography>
      )}
    </div>
  );
}
