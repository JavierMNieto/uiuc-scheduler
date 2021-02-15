import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";

export default function Search({ search, onChange }) {
  const [showClear, setShowClear] = React.useState(false);

  return (
    <TextField
      label="Search Courses"
      placeholder="Keywords"
      variant="outlined"
      name="search"
      color="secondary"
      value={search}
      onChange={onChange}
      onMouseEnter={() => setShowClear(true)}
      onMouseLeave={() => setShowClear(false)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Fade in={showClear && search !== ""}>
              <IconButton
                aria-label="clear search"
                size="small"
                onClick={() => onChange({ search: "" })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fade>
            <IconButton
              onMouseEnter={() => setShowClear(false)}
              onMouseLeave={() => setShowClear(true)}
              aria-label="search courses"
              type="submit"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
