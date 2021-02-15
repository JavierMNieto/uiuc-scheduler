import { withStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FILTER_COLORS } from "../../lib/Theme";

const styles = (filter) => ({
  root: {
    "& label.Mui-focused": {
      color: FILTER_COLORS[filter],
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: FILTER_COLORS[filter],
    },
    "& .MuiChip-root": {
      backgroundColor: FILTER_COLORS[filter],
    },
  },
})

export const CollegeSubject = withStyles(styles("CollegeSubject"))(Autocomplete);
export const GenEd = withStyles(styles("GenEd"))(Autocomplete);
export const Instructor = withStyles(styles("Instructor"))(Autocomplete);
export const SectionAttribute = withStyles(styles("SectionAttribute"))(Autocomplete);
export const YearTerm = withStyles(styles("YearTerm"))(Autocomplete);