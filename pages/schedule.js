import React from "react";
import Head from "next/head";
import { useHotkeys } from "react-hotkeys-hook";
import AutoSizer from "react-virtualized-auto-sizer";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";
import Tooltip from "@material-ui/core/Tooltip";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import IconButton from "@material-ui/core/IconButton";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import ListIcon from "@material-ui/icons/List";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";

import {
  useSemesters,
  useDispatchSemesters,
  isFutureSemester,
} from "../components/Semesters";

import CalendarView from "../components/scheduler/calendar/CalendarView";
import TableView from "../components/scheduler/table/TableView";

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
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2.1),
    right: theme.spacing(2.1),
  },
}));

export default function Schedule() {
  const classes = useStyles();
  const { selectedSemester, semesters, undos, redos } = useSemesters();
  const dispatch = useDispatchSemesters();
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const [showSchedule, setShowSchedule] = React.useState(true);

  useHotkeys("ctrl+z, command+z", () => dispatch({ type: "UNDO" }));
  useHotkeys("ctrl+shift+z, command+shift+z", () => dispatch({ type: "REDO" }));

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

  const actions = [
    {
      icon: <AddIcon />,
      name: "Add New Semester",
      callback: () => {
        console.log("Add");
      },
    },
    {
      icon: <DeleteIcon />,
      name: "Delete This Semester",
      callback: () => {
        console.log("Delete");
      },
    },
    {
      icon: <UndoIcon />,
      name: "Undo",
      callback: () => {
        dispatch({ type: "UNDO" });
      },
    },
    {
      icon: <RedoIcon />,
      name: "Redo",
      callback: () => {
        dispatch({ type: "REDO" });
      },
    },
  ];

  return (
    <>
      <Head>
        <title>UIUC Scheduler - Schedule</title>
      </Head>
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
          <Grow in={!isFutureSemester(selectedSemester)}>
            <IconButton
              onClick={() => setShowSchedule(!showSchedule)}
              style={{ zIndex: 10 }}
            >
              {showSchedule ? <ListIcon /> : <CalendarViewDayIcon />}
            </IconButton>
          </Grow>
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
              {...semesters[selectedSemester]}
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
      <Grow in>
        <SpeedDial
          ariaLabel="Schedule Actions"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          open={actionsOpen}
          onOpen={() => setActionsOpen(true)}
          onClose={() => setActionsOpen(false)}
          FabProps={{
            color: "secondary",
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.callback}
              disabled={
                (action.name === "Undo" && undos.length === 0) ||
                (action.name === "Redo" && redos.length === 0)
              }
            />
          ))}
        </SpeedDial>
      </Grow>
    </>
  );
}

Schedule.tabValue = 1;
Schedule.hasSearch = true;
Schedule.hasWorkspace = true;
