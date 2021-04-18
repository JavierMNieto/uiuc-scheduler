import React from "react";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ListIcon from "@material-ui/icons/List";
import DeleteIcon from "@material-ui/icons/Delete";

export default function CustomAppointmentTooltip({
  onDeleteButtonClick,
  appointmentData: course,
  editCourse,
  deleteCourse
}) {
  return (
    <React.Fragment>
      <IconButton onClick={console.log}>
        <ListIcon />
      </IconButton>
      <IconButton onClick={() => deleteCourse(course)}>
        <DeleteIcon />
      </IconButton>
    </React.Fragment>
  );
}
