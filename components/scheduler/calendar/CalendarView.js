import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import TableCell from "@material-ui/core/TableCell";
import {
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Toolbar,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AllDayPanel,
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";

import { useSemesters } from "../../Semesters";

import CustomAppointmentTooltip from "./CustomAppointmentTooltip";
import CustomAppointmentTooltipHeader from "./CustomAppointmentTooltipHeader";

export default function CoursesCalendar({ height, editCourse, deleteCourse }) {
  const [courses, setCourses] = React.useState([]);
  const [tooltipVisibility, setTooltipVisibility] = React.useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const dayFormatOptions = {
    weekday: isSmallScreen ? "short" : "long",
  };
  const indicatorRef = React.useRef(null);
  const { selectedSemester, semesters } = useSemesters();

  React.useEffect(() => {
    const newCourses = semesters[selectedSemester].courses;

    if (courses.length < newCourses.length) {
      setCourses([
        ...courses,
        ...newCourses.filter(
          (newCourse) =>
            !courses.some((curCourse) => curCourse.id === newCourse.id)
        ),
      ]);
    }

    if (courses.length > newCourses.length) {
      setCourses(
        courses.filter((curCourse) =>
          newCourses.some((newCourse) => newCourse.id === curCourse.id)
        )
      );
    }
  }, [JSON.stringify(semesters[selectedSemester].courses)]);

  React.useEffect(() => {
    if (indicatorRef) {
      indicatorRef.current.scrollIntoView({ block: "center" });
    }
  }, []);

  const Indicator = (props) => {
    return (
      <div ref={indicatorRef}>
        <CurrentTimeIndicator.Indicator {...props} />
      </div>
    );
  };

  const AllDayPanelCell = React.useCallback(
    (props) => (
      <AllDayPanel.Cell
        {...props}
        style={{
          transitionProperty: "all",
          transitionTimingFunction: "ease-in-out",
          height:
            Math.min(courses.filter((course) => course.allDay).length, 3) * 48,
        }}
      ></AllDayPanel.Cell>
    ),
    [courses]
  );

  const AllDayPanelTitleCell = React.useCallback(
    ({ getMessage }) => (
      <Fade in={courses.filter((course) => course.allDay).length > 0}>
        <Typography variant="body2" align="center">
          {getMessage("allDay")}
        </Typography>
      </Fade>
    ),
    [courses]
  );

  const onEditCourse = (course) => {
    setTooltipVisibility(false);
    editCourse(course);
  };

  const onDeleteCourse = (course) => {
    setTooltipVisibility(false);
    deleteCourse(course);
  };

  const Appointment = React.useCallback(
    (props) => (
      <Appointments.Appointment
        {...props}
        style={{ backgroundColor: props.data.color }}
      />
    ),
    [courses]
  );

  return (
    <Scheduler height={height} data={courses}>
      <WeekView
        timeTableCellComponent={(props) => (
          <WeekView.TimeTableCell {...props} style={{ width: 100 }} />
        )}
        dayScaleCellComponent={(props) => (
          <TableCell component="td" style={{ padding: 8, textAlign: "center" }}>
            <Typography
              variant="h5"
              color={props.today ? "primary" : "textSecondary"}
            >
              {new Intl.DateTimeFormat("en-US", dayFormatOptions).format(
                props.startDate
              )}
            </Typography>
          </TableCell>
        )}
      />
      <AllDayPanel
        messages={{ allDay: "Async Courses" }}
        cellComponent={AllDayPanelCell}
        titleCellComponent={AllDayPanelTitleCell}
      />
      <Toolbar />
      <Appointments appointmentComponent={Appointment} />
      <AppointmentTooltip
        showCloseButton
        visible={tooltipVisibility}
        onVisibilityChange={setTooltipVisibility}
        contentComponent={(props) => (
          <CustomAppointmentTooltip {...props} editCourse={onEditCourse} />
        )}
        headerComponent={(props) => (
          <AppointmentTooltip.Header {...props}>
            <CustomAppointmentTooltipHeader
              {...props}
              editCourse={onEditCourse}
              deleteCourse={onDeleteCourse}
            />
          </AppointmentTooltip.Header>
        )}
      />
      <CurrentTimeIndicator indicatorComponent={Indicator} shadePreviousCells />
    </Scheduler>
  );
}
