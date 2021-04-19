import React from "react";
import dynamic from "next/dynamic";
import AutoSizer from "react-virtualized-auto-sizer";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import ListIcon from "@material-ui/icons/List";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import {
  useSemesters,
  useDispatchSemesters,
  isFutureSemester,
} from "../Semesters";

const CalendarView = dynamic(() => import("./calendar/CalendarView"));

const TableView = dynamic(() => import("./table/TableView"));

const useStyles = makeStyles((theme) => ({
  selectOutlined: {
    padding: theme.spacing(1.85, 1.5, 1.85, 1),
  },
  pageToolbar: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      minHeight: 64,
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: 56,
    },
  },
}));

export default function Scheduler() {
  const classes = useStyles();
  const [showSchedule, setShowSchedule] = React.useState(true);
  const { selectedSemester, semesters } = useSemesters();
  const dispatch = useDispatchSemesters();

  const setSemester = (semester) => {
    dispatch({
      type: "CHANGE_SEMESTER",
      semester: semester,
    });
  };

  const editCourse = (course) => {
    dispatch({
      type: "EDIT_COURSE",
      semester: selectedSemester,
      course: course,
    });
  };

  const deleteCourse = (course) => {
    dispatch({
      type: "REMOVE_COURSE",
      semester: selectedSemester,
      id: course.id,
    });
  };

  return (
    <>
      <div className={classes.pageToolbar}>
        <Tooltip
          placement="bottom"
          arrow
          title={
            <span style={{ fontSize: 11 }}>
              {showSchedule ? "Show Table View" : "Show Calendar View"}
            </span>
          }
        >
          {!isFutureSemester(selectedSemester) && (
            <IconButton
              onClick={() => setShowSchedule(!showSchedule)}
              style={{ zIndex: 10 }}
            >
              {showSchedule ? <ListIcon /> : <CalendarViewDayIcon />}
            </IconButton>
          )}
        </Tooltip>
        <Select
          value={selectedSemester}
          onChange={(event) => setSemester(event.target.value)}
          variant="outlined"
          classes={{
            outlined: classes.selectOutlined,
            iconOutlined: "",
          }}
          style={{ zIndex: 10, marginRight: "48px" }}
        >
          {Object.keys(semesters).map((semester) => (
            <MenuItem value={semester} key={semester}>
              {semester}
            </MenuItem>
          ))}
        </Select>
      </div>
      <AutoSizer disableWidth>
        {({ height }) =>
          !isFutureSemester(selectedSemester) && showSchedule ? (
            <CalendarView
              height={height}
              editCourse={editCourse}
              deleteCourse={deleteCourse}
            />
          ) : (
            <TableView
              {...semesters[selectedSemester]}
              height={height}
              editCourse={editCourse}
              deleteCourse={deleteCourse}
            />
          )
        }
      </AutoSizer>
    </>
  );
}
