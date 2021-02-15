import React from "react";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PaletteIcon from "@material-ui/icons/Palette";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import RoomIcon from '@material-ui/icons/Room';
import { HexColorPicker } from "react-colorful";

import { APPOINTMENT_COLORS } from "../../../lib/Theme";
import InstructorChip from "../../InstructorChip";

import "react-colorful/dist/index.css";

export default function CustomAppointmentTooltip({
  appointmentData: course,
  editCourse,
}) {
  const [color, setColor] = React.useState(course.color);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleColorPickerClose = () => {
    if (course.color !== color) {
      editCourse({
        ...course,
        color: color,
      });
    }
    setAnchorEl(null);
  };

  return (
    <Grid container alignItems="center" style={{ paddingBottom: 20 }}>
      <Grid item xs={2} style={{ textAlign: "center" }}>
        <IconButton
          size="small"
          style={{
            padding: 5,
            backgroundColor: color,
          }}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <PaletteIcon />
        </IconButton>
      </Grid>
      <Grid item xs={10}>
        <Typography>{course.name}</Typography>
      </Grid>
      {course.instructors.length > 0 && (
        <React.Fragment>
          <Grid item xs={2} style={{ textAlign: "center", marginTop: 5 }}>
            {course.instructors.length > 1 ? <PeopleIcon /> : <PersonIcon />}
          </Grid>
          <Grid item xs={10}>
            {course.instructors.map((instructor, index) => (
              <React.Fragment key={instructor + index}>
                {Boolean(instructor) && (
                  <div>
                    <InstructorChip value={instructor} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </React.Fragment>
      )}
      {course.building && (
        <React.Fragment>
          <Grid item xs={2} style={{ textAlign: "center" }}>
            <RoomIcon />
          </Grid>
          <Grid item xs={10}>
            <Typography>{course.building}</Typography>
          </Grid>
        </React.Fragment>
      )}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            overflow: "visible",
            borderRadius: "8px 8px 0 0",
          },
        }}
      >
        <HexColorPicker
          color={color}
          onChange={(newColor) => setColor(newColor)}
        />
        <div style={{ maxWidth: 200, textAlign: "center" }}>
          {APPOINTMENT_COLORS.map((aColor) => (
            <IconButton
              key={aColor}
              style={{
                margin: 2,
                backgroundColor: aColor,
              }}
              onClick={() => setColor(aColor)}
            ></IconButton>
          ))}
        </div>
      </Popover>
    </Grid>
  );
}
