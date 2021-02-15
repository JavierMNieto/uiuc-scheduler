import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List, areEqual } from "react-window";

import Course from "./Course";

export default React.memo(function WorkspaceDrawer({
  courses,
  isDropDisabled = false,
  isDragDisabled = false,
}) {
  const listRef = React.useRef({});
  const itemHeights = React.useRef({});

  const getItemHeight = (index) => {
    return itemHeights.current[index] + 8 || 180;
  };

  const Item = React.memo(({ index, style }) => {
    const course = courses[index];
    const itemRef = React.useRef({});

    React.useEffect(() => {
      if (itemRef.current) {
        setItemHeight(index, itemRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, []);

    return (
      <div style={style}>
        <div ref={itemRef}>
          <Draggable
            key={course.id}
            draggableId={JSON.stringify(course)}
            index={index}
            isDragDisabled={isDragDisabled}
          >
            {(provided, snapshot) => (
              <Course {...course} provided={provided} snapshot={snapshot} />
            )}
          </Draggable>
        </div>
      </div>
    );
  }, areEqual);

  const setItemHeight = (index, size) => {
    listRef.current.resetAfterIndex(0);
    itemHeights.current = { ...itemHeights.current, [index]: size };
  };

  return (
    <AutoSizer defaultHeight={500} defaultWidth={300}>
      {({ height }) => (
        <Droppable
          droppableId="workspace"
          mode="virtual"
          isDropDisabled={isDropDisabled}
          renderClone={(provided, snapshot, rubric) => (
            <Course
              {...courses[rubric.source.index]}
              provided={provided}
              snapshot={snapshot}
            />
          )}
        >
          {(provided, snapshot) => (
            <List
              ref={listRef}
              outerRef={provided.innerRef}
              itemCount={courses.length}
              itemSize={getItemHeight}
              height={height - 50}
              width={300}
              estimatedItemSize={180}
            >
              {Item}
            </List>
          )}
        </Droppable>
      )}
    </AutoSizer>
  );
});
