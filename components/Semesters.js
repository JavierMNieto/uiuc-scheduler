import { createContext, useContext, useReducer } from "react";
import moment from "moment";
import { YearTerms } from "../lib/Data";
import { getRandomAppointmentColor, getrRuleDays } from "../lib/Utils";
import {
  courseTimeFormat,
  courseDateFormat,
  courseTimeZone,
} from "../lib/Constants";

const curYear = parseInt(Object.keys(YearTerms).slice(-1)[0]);
const curTerm = YearTerms[curYear].slice(-1)[0];

const defaultSchedulerProps = (year, term) => {
  let startDate, endDate, numMonths;
  if (term === "Winter") {
    startDate = "12-20";
    endDate = "01-20";
    numMonths = 2;
  } else if (term === "Spring") {
    startDate = "01-20";
    endDate = "05-07";
    numMonths = 5;
  } else if (term === "Summer") {
    startDate = "05-07";
    endDate = "08-07";
    numMonths = 4;
  } else {
    startDate = "08-07";
    endDate = "12-20";
    numMonths = 5;
  }
  return {
    startDate: moment(`${year}-${startDate}Z`, courseDateFormat),
    endDate: moment(`${year}-${endDate}Z`, courseDateFormat),
    startHour: 5,
    endHour: 18,
    excludedDays: [0, 6],
    numMonths: numMonths,
  };
};

const getSemester = (year, term) => {
  return {
    schedulerProps: defaultSchedulerProps(year, term),
    courses: [],
  };
};

export const isFutureSemester = (semester) => {
  if (!/\d{4}\s(Winter|Spring|Summer|Fall)/.test(semester)) {
    return false;
  }
  const latestEndDate = getSemester(curYear, curTerm).schedulerProps.endDate;
  const [year, term] = semester.split(" ");
  const startDate = getSemester(year, term).schedulerProps.startDate;
  return moment(startDate).isAfter(latestEndDate);
};

const defaultSemesters = () => {
  let semesters = {};
  for (let year = curYear - 4; year < curYear + 4; year++) {
    for (let term of ["Spring", "Fall"]) {
      semesters[`${year} ${term}`] = getSemester(year, term);
    }
  }
  return semesters;
};

const schedulerProps = (semesterKey, courses) => {
  const [year, term] = semesterKey.split(" ");
  let props = defaultSchedulerProps(year, term);
  for (let i = 0; i < courses.length; i++) {
    const { start_date, end_date, start_time, end_time, rRule = "" } = courses[
      i
    ];
    if (
      start_date &&
      (i === 0 || moment(start_date, courseDateFormat).isBefore(props.startDate))
    ) {
      props.startDate = moment(start_date, courseDateFormat);
    }
    if (
      end_date &&
      (i === 0 || moment(end_date, courseDateFormat).isAfter(props.endDate))
    ) {
      props.endDate = moment(end_date, courseDateFormat);
    }
    if (end_time) {
      const start_hour = moment(
        `${start_time} ${start_date} ${courseTimeZone}`,
        `${courseTimeFormat} ${courseDateFormat} Z`
      ).hour();
      const end_hour = moment(
        `${end_time} ${end_date} ${courseTimeZone}`,
        `${courseTimeFormat} ${courseDateFormat} Z`
      ).hour();

      if (start_hour < props.startHour) {
        props.startHour = Math.max(start_hour - 1, 0);
      }
      if (end_hour > props.endHour) {
        props.endHour = Math.min(end_hour + 1, 24);
      }
    }
    if (rRule.includes("SU,") || rRule.includes("SA,")) {
      props.excludedDays = [];
    }
  }
  return props;
};

const reducer = (state, action) => {
  const { undos, redos, ...currentState } = JSON.parse(JSON.stringify(state));

  if (action.type === "UNDO") {
    if (state.undos.length === 0) {
      return state;
    }
    state.redos.push(currentState);
    const pastState = state.undos.pop();
    return {
      ...state,
      ...pastState,
    };
  }

  if (action.type === "REDO") {
    if (state.redos.length === 0) {
      return state;
    }
    state.undos.push(currentState);
    const futureState = state.redos.pop();
    return {
      ...state,
      ...futureState,
    };
  }

  var { semester } = action;

  if (action.type === "ADD_COURSE") {
    if (!state.semesters[semester]) {
      state.semesters[semester] = getSemester(semester);
    }

    const { course } = action;
    const appointmentCourse = {
      ...course,
      color: getRandomAppointmentColor(
        state.semesters[semester].courses.map((course) => course.color)
      ),
      id: state.semesters[semester].courses.length,
      title: `${course.subject} ${course.number}`,
      allDay: !course.days || course.days.trim() === "",
    };

    if (course.allDay) {
      state.semesters[semester].courses.push({
        ...appointmentCourse,
        startDate: course.start_date,
        endDate: course.end_date,
      });
    } else {
      state.semesters[semester].courses.push({
        ...appointmentCourse,
        startDate: moment(
          `${course.start_time} ${course.start_date} ${courseTimeZone}`,
          `${courseTimeFormat} ${courseDateFormat} Z`
        ),
        endDate: moment(
          `${course.end_time} ${course.start_date} ${courseTimeZone}`,
          `${courseTimeFormat} ${courseDateFormat} Z`
        ),
        rRule: `RRULE:INTERVAL=1;FREQ=WEEKLY;BYDAY=${getrRuleDays(
          course.days
        )};UNTIL=${moment(
          `${course.end_time} ${course.end_date} ${courseTimeZone}`,
          `${courseTimeFormat} ${courseDateFormat} Z`
        ).format("YYYYMMDDTHHmmss")}Z`,
      });
    }

    state.semesters[semester].schedulerProps = schedulerProps(
      semester,
      state.semesters[semester].courses
    );
  } else if (action.type === "EDIT_COURSE") {
    const { course: newCourse } = action;

    const index = state.semesters[semester].courses.findIndex(
      (course) => course.id === newCourse.id
    );

    if (index === -1) {
      return state;
    }

    state.semesters[semester].courses[index] = newCourse;
  } else if (action.type === "REMOVE_COURSE") {
    const index = state.semesters[semester].courses.findIndex(
      (course) => course.id === action.id
    );
    if (index === -1) {
      return state;
    }
    state.semesters[semester].courses.splice(index, 1);
    state.semesters[semester].schedulerProps = schedulerProps(
      semester,
      state.semesters[semester].courses
    );
  } else if (action.type === "ADD_SEMESTER") {
    if (!state.semesters[semester]) {
      state.semesters[semester] = getSemester(semester);
    }
  } else if (action.type === "REMOVE_SEMESTER") {
    const index = Object.keys(state.semesters).indexOf(action.semester);
    if (index === -1) {
      return state;
    }
    delete state.semesters[semester];
    semester = Object.keys(state.semesters)[
      Object.keys(state.semesters).length % (index - 1)
    ];
  } else if (action.type === "CHANGE_SEMESTER") {
  } else {
    throw new Error(`Unknown action: ${action.type}`);
  }

  state.undos.push(currentState);
  state.redos = [];

  return {
    ...state,
    selectedSemester: semester,
  };
};

const SemestersStateContext = createContext();
const SemestersDispatchContext = createContext();

export const defaultValue = {
  selectedSemester: `${curYear} ${curTerm}`,
  semesters: defaultSemesters(),
  undos: [],
  redos: [],
};

export const SemestersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultValue);
  return (
    <SemestersDispatchContext.Provider value={dispatch}>
      <SemestersStateContext.Provider value={state}>
        {children}
      </SemestersStateContext.Provider>
    </SemestersDispatchContext.Provider>
  );
};

export const useSemesters = () => useContext(SemestersStateContext);
export const useDispatchSemesters = () => useContext(SemestersDispatchContext);
