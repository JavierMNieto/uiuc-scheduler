import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import Sections from "./sections/Sections";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1, 1),
    },
  },
}));

export default function CouseInfoModal({ open, handleClose, ...courseProps }) {
  const classes = useStyles();
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { courseId, creditHours, description } = courseProps;

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      aria-labelledby="course-info-modal"
    >
      <DialogTitle id="course-info-modal-title">{courseId}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>{creditHours}</DialogContentText>
        <DialogContentText>{description}</DialogContentText>
        <Sections {...courseProps} handleClose={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
