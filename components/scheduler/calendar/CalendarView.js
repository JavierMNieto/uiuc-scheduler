import React from "react";
import moment from "moment";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Toolbar,
  DayView,
  WeekView,
  MonthView,
  ViewSwitcher,
  DateNavigator,
  Appointments,
  AppointmentTooltip,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import CustomDatePicker from "./CustomDatePicker";
import CustomAppointmentTooltip from "./CustomAppointmentTooltip";
import CustomAppointmentTooltipHeader from "./CustomAppointmentTooltipHeader";

const useStyles = makeStyles((theme) => ({
  navigationButton: {
    position: "absolute",
    [theme.breakpoints.up("sm")]: {
      top: 78,
    },
    [theme.breakpoints.down("xs")]: {
      top: 70,
    },
    zIndex: 10,
  },
}));

export default function CoursesCalendar({
  height,
  courses = [],
  schedulerProps: {
    startDate,
    endDate,
    startHour,
    endHour,
    excludedDays,
    numMonths,
  },
  editCourse,
  deleteCourse,
}) {
  const classes = useStyles();
  const [currentView, setCurrentView] = React.useState("Week");
  const [currentDate, setCurrentDate] = React.useState(startDate);

  React.useEffect(() => {
    setCurrentDate((prevCurrent) =>
      moment(prevCurrent).isBefore(startDate) ? startDate : prevCurrent
    );
  }, [startDate]);

  const navigationButtonDisabled = (direction) => {
    if (direction === "back") {
      return moment(currentDate).subtract(1, currentView).isBefore(startDate);
    }
    return moment(currentDate).add(1, currentView).isAfter(endDate);
  };

  const AllDayPanelRow = React.useCallback(
    (props) => (
      <AllDayPanel.Row
        {...props}
        style={{
          height:
            Math.min(courses.filter((course) => course.allDay).length, 3) * 48,
        }}
      />
    ),
    [courses]
  );

  return (
    <Scheduler height={height} data={courses} key={JSON.stringify(courses)}>
      <ViewState
        currentDate={currentView === "Semester" ? startDate : currentDate}
        onCurrentDateChange={setCurrentDate}
        currentViewName={currentView}
        onCurrentViewNameChange={setCurrentView}
      />
      <DayView name="Day" startDayHour={startHour} endDayHour={endHour} />
      <WeekView
        name="Week"
        timeTableCellComponent={(props) => (
          <WeekView.TimeTableCell {...props} style={{ width: 100 }} />
        )}
        dayScaleCellComponent={(props) => (
          <WeekView.DayScaleCell {...props} style={{ width: 100 }} />
        )}
        excludedDays={excludedDays}
        startDayHour={startHour}
        endDayHour={endHour}
      />
      <MonthView
        name="Semester"
        intervalCount={numMonths || 5}
        timeTableCellComponent={(props) => (
          <MonthView.TimeTableCell {...props} style={{ width: 100 }} />
        )}
        dayScaleCellComponent={(props) => (
          <MonthView.DayScaleCell {...props} style={{ width: 100 }} />
        )}
      />
      {currentView === "Week" && (
        <AllDayPanel
          messages={{ allDay: "Async Courses" }}
          rowComponent={AllDayPanelRow}
        />
      )}
      <Toolbar />
      <DateNavigator
        openButtonComponent={() => (
          <CustomDatePicker
            currentDate={currentDate}
            currentView={currentView}
            setCurrentDate={setCurrentDate}
            startDate={startDate}
            endDate={endDate}
          />
        )}
        navigationButtonComponent={({ type, onClick }) => (
          <React.Fragment>
            {currentView !== "Semester" && (
              <div
                className={classes.navigationButton}
                style={{ left: type === "back" ? 8 : 38 }}
              >
                <IconButton
                  onClick={onClick}
                  disabled={navigationButtonDisabled(type)}
                  size="small"
                >
                  {type === "back" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
            )}
          </React.Fragment>
        )}
      />
      <ViewSwitcher />
      <Appointments
        appointmentComponent={(props) => (
          <Appointments.Appointment
            {...props}
            style={{ backgroundColor: props.data.color }}
          />
        )}
      />
      <AppointmentTooltip
        showCloseButton
        contentComponent={(props) => (
          <CustomAppointmentTooltip
            {...props}
            editCourse={editCourse}
            deleteCourse={deleteCourse}
          />
        )}
        headerComponent={(props) => (
          <AppointmentTooltip.Header {...props}>
            <CustomAppointmentTooltipHeader
              {...props}
              editCourse={editCourse}
              deleteCourse={deleteCourse}
            />
          </AppointmentTooltip.Header>
        )}
      />
    </Scheduler>
  );
}
