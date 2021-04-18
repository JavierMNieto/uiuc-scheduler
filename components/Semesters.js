import { createContext, useContext, useReducer } from "react";
import { YearTerms } from "../lib/Data";
import { getRandomAppointmentColor, getrRuleDays } from "../lib/Utils";
import {
  courseTimeFormat,
  courseDateFormat,
  courseTimeZone,
} from "../lib/Constants";

const curYear = parseInt(Object.keys(YearTerms).slice(-1)[0]);
const curTerm = YearTerms[curYear].slice(-1)[0];

const getSemester = () => ({
  schedulerProps: {
    startHour: 5,
    endHour: 18,
    excludedDays: [0, 6],
  },
  courses: [],
});

export const isFutureSemester = (semester) => {
  if (!/\d{4}\s(Winter|Spring|Summer|Fall)/.test(semester)) {
    return false;
  }
  return false;
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
      id: course.courseId + course.crn + course.type,
      title: course.courseId,
      allDay: !course.days || course.days.trim() === "",
    };

    if (course.allDay) {
      state.semesters[semester].courses.push({
        ...appointmentCourse,
        startDate: course.startDate,
        endDate: course.endDate,
      });
    } else {
      const endDate = new Date(
        `${course.endTime} ${course.startDate} ${courseTimeZone}`
      );
      endDate.setFullYear(2050);
      state.semesters[semester].courses.push({
        ...appointmentCourse,
        startDate: new Date(
          `${course.startTime} ${course.startDate} ${courseTimeZone}`
        ),
        endDate: new Date(
          `${course.endTime} ${course.startDate} ${courseTimeZone}`
        ),
        rRule: `INTERVAL=1;FREQ=WEEKLY;BYDAY=${getrRuleDays(
          course.days
        )};UNTIL=${endDate
          .toISOString()
          .replaceAll("-", "")
          .replaceAll(":", "")
          .replace(".000", "")}`,
      });
    }
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
