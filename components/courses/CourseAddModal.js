import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import {
  useSemesters,
  useDispatchSemesters,
  isFutureSemester,
} from "../Semesters";

export default function CouseAddModal({
  open,
  handleClose,
  subject,
  number,
  course = `${subject} ${number}`,
  semesters: courseSemesters,
}) {
  const { selectedSemester, semesters: scheduleSemesters } = useSemesters();
  const dispatch = useDispatchSemesters();
  const [semester, setSemester] = React.useState("Workspace");
  const [typeTimesValues, setTypeTimesValues] = React.useState({});

  const validSemesters = React.useCallback(() => {
    let semesters = [];
    for (const [year, term] of courseSemesters) {
      if (scheduleSemesters[`${year} ${term}`]) {
        semesters.push(`${year} ${term}`);
      }
    }
    return semesters;
  }, [courseSemesters, selectedSemester, scheduleSemesters]);

  const { status, data: sections = [], error, isFetching } = useQuery(
    ["sections", course, semester],
    async ({ queryKey: [, course, semester] }) => {
      if (isFutureSemester(semester)) {
        throw new Error("Invalid Semester!");
      }
      const [year, term] = semester.split(" ");
      const response = await axios.get("/api/sections", {
        params: {
          course: course,
          year: year,
          term: term,
        },
      });
      return response.data;
    },
    { enabled: open && !isFutureSemester(semester) }
  );

  const handleAddCourse = () => {
    console.log(typeTimesValues);
  };

  const typeTimesOptions = React.useCallback(() => {
    let typeTimes = {};
    for (const section of sections) {
      const typeKey = section.type.join(",");
      typeTimes[typeKey] = (typeTimes[typeKey] || []).concat(
        section.start_time.map((start_time, index) =>
          start_time === "ARRANGED"
            ? "Asynchronous"
            : `${start_time} - ${section.end_time[index]}`
        )
      );
    }
    Object.keys(typeTimes).map(
      (typeKey) => (typeTimes[typeKey] = [...new Set(typeTimes[typeKey])])
    );
    return typeTimes;
  }, [sections]);

  React.useEffect(() => {
    if (open && !isFetching) {
      if (isFutureSemester(semester)) {
        if (semester === "Workshop") {
        } else {
        }
        console.log("Add invalid semester");
      } else {
        let autoAdd = true;
        for (const [type, times] of Object.entries(typeTimesOptions())) {
          if (times.length > 1) {
            autoAdd = false;
          }
          setTypeTimesValues((prevValues) => ({
            ...prevValues,
            [type]: times[0],
          }));
        }
        if (autoAdd) {
          handleAddCourse();
        }
      }
    }
  }, [selectedSemester, open, isFetching, sections]);

  React.useEffect(() => {
    if (validSemesters().indexOf(selectedSemester) !== -1) {
      setSemester(selectedSemester);
    }
  }, [selectedSemester]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open && (!isFetching || selectedSemester !== semester)}
      onClose={handleClose}
      aria-labelledby="course-modal"
    >
      <DialogTitle id="course-modal-title">Add {course}</DialogTitle>
      <DialogContent>
        <Select
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
        >
          {["Workspace", ...Object.keys(scheduleSemesters)].map(
            (semesterKey) => (
              <MenuItem
                key={semesterKey}
                value={semesterKey}
                disabled={
                  semesterKey !== "Workspace" &&
                  validSemesters().indexOf(semesterKey) === -1 &&
                  !isFutureSemester(semesterKey)
                }
              >
                {semesterKey}
              </MenuItem>
            )
          )}
        </Select>
        {status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          Object.keys(typeTimesOptions()).map((type) => (
            <FormControl key={type}>
              <InputLabel id={type}>
                {type.split(",").map((val) => (
                  <div key={val}>{val}</div>
                ))}
              </InputLabel>
              <Select
                value={typeTimesValues[type]}
                onChange={(event) =>
                  setTypeTimesValues((prevValues) => ({
                    ...prevValues,
                    [type]: event.target.value,
                  }))
                }
                labelId={type}
              >
                {typeTimesOptions()[type].map((times) => (
                  <MenuItem key={times} value={times}>
                    {times.split(",").map((time) => (
                      <div key={time}>{time}</div>
                    ))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddCourse} color="inherit">
          OK
        </Button>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/*
<Autocomplete
          freeSolo
          forcePopupIcon
          options={["Workspace", ...Object.keys(scheduleSemesters)]}
          value={semester}
          getOptionDisabled={(option) =>
            validSemesters().indexOf(option) === -1 && option !== "Workspace"
          }
          renderInput={(params) => (
            <TextField {...params} margin="normal" variant="outlined" />
          )}
        />
        */
