import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useHotkeys } from "react-hotkeys-hook";
import { makeStyles } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useSemesters, useDispatchSemesters } from "../components/Semesters";

const CourseScheduler = dynamic(
  () => import("../components/scheduler/CourseScheduler"),
  {
    loading: () => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="secondary"></CircularProgress>
      </div>
    ),
  }
);

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2.1),
    right: theme.spacing(2.1),
  },
}));

export default function Schedule() {
  const classes = useStyles();
  const { undos, redos } = useSemesters();
  const dispatch = useDispatchSemesters();
  const [actionsOpen, setActionsOpen] = React.useState(false);

  useHotkeys("ctrl+z, command+z", () => dispatch({ type: "UNDO" }));
  useHotkeys("ctrl+shift+z, command+shift+z", () => dispatch({ type: "REDO" }));

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
      <CourseScheduler />
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
