import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import pink from "@material-ui/core/colors/pink";
import purple from "@material-ui/core/colors/purple";
import indigo from "@material-ui/core/colors/indigo";
import blue from "@material-ui/core/colors/blue";
import teal from "@material-ui/core/colors/teal";
import orange from "@material-ui/core/colors/orange";
import blueGrey from "@material-ui/core/colors/blueGrey";
import { indexOf } from "lodash";

export const theme = {
  palette: {
    primary: {
      light: "#395082",
      main: "#002855",
      dark: "#00002c",
    },
    secondary: {
      light: "#ff7c53",
      main: "#E84927",
      dark: "#BE2D0E",
    },
  },
};

export const lightTheme = createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    type: "light",
  },
});

export const darkTheme = createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    type: "dark",
  },
});

export const FILTER_COLORS = {
  YearTerm: theme.palette.primary.main,
  CollegeSubject: blue[800],
  SectionAttribute: orange[800],
  GenEd: theme.palette.secondary.main,
  Instructor: teal[800],
};

export const APPOINTMENT_COLORS = [
  red[400],
  red[800],
  pink[400],
  pink[800],
  purple[400],
  purple[800],
  indigo[400],
  indigo[900],
  blue[500],
  teal[400],
  blueGrey[400],
  blueGrey[800]
]