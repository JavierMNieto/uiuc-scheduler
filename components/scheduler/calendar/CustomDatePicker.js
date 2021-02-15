import React from "react";
import moment from "moment";
import { DatePicker } from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default React.memo(function CustomDatePicker({
  currentView,
  currentDate,
  setCurrentDate,
  startDate,
  endDate,
}) {
  const isXS = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  const getDisplayDate = React.useCallback(() => {
    if (currentView === "Day") {
      return moment(currentDate).format("MMM D, YYYY");
    }
    let startDay, endDay;
    if (currentView === "Semester") {
      startDay = moment(startDate);
      endDay = moment(endDate);
    } else {
      startDay = moment(currentDate).startOf("week");
      endDay = moment(currentDate).endOf("week");
    }
    if (
      startDay.year() === endDay.year() &&
      startDay.month() === endDay.month()
    ) {
      return `${startDay.format("D")} - ${endDay.format("D")} ${startDay.format(
        "MMM"
      )} ${startDay.year()}`;
    }
    if (startDay.year() === endDay.year()) {
      return `${startDay.format("MMM D")} - ${endDay.format(
        "MMM D"
      )}, ${startDay.year()}`;
    }
    return `${startDay.format("MMM D, YYYY")} - ${endDay.format(
      "MMM D, YYYY"
    )}`;
  }, [currentView, currentDate, startDate, endDate]);

  return (
    <DatePicker
      value={currentDate}
      onChange={setCurrentDate}
      variant="inline"
      disableToolbar
      minDate={startDate}
      maxDate={endDate}
      TextFieldComponent={({ onClick, inputRef }) => (
        <div style={{ display: "inline-block" }} ref={inputRef}>
          {isXS ? (
            <IconButton
              variant="outlined"
              disabled={currentView === "Semester"}
              onClick={onClick}
            >
              <CalendarTodayIcon />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              disabled={currentView === "Semester"}
              onClick={onClick}
            >
              {getDisplayDate()}
            </Button>
          )}
        </div>
      )}
    />
  );
});
