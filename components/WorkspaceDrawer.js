import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
  search: {
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(1.25, 1),
  },
  courses: {
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
}));

export default function WorkspaceDrawer({ courses, ...props }) {
  const classes = useStyles();
  const [showClear, setShowClear] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <SwipeableDrawer {...props}>
      <FormGroup className={classes.search}>
        <TextField
          label="Workspace"
          placeholder="Search Workspace"
          variant="outlined"
          color="secondary"
          value={search}
          onMouseEnter={() => setShowClear(true)}
          onMouseLeave={() => setShowClear(false)}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Fade in={showClear && search !== ""}>
                  <IconButton
                    aria-label="clear search"
                    size="small"
                    onClick={() => setSearch("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Fade>
              </InputAdornment>
            ),
          }}
        />
      </FormGroup>
      <div className={classes.courses}>dfg</div>
    </SwipeableDrawer>
  );
}
