import React from "react";
import TextField from "@material-ui/core/TextField";
import { matchSorter } from "match-sorter";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import OverflowTipChip from "../OverflowTipChip";

import { CollegeSubject as CollegeSubjectAutocomplete } from "./Autocompletes";
import { Colleges, Subjects, CollegeSubjects } from "../../lib/Data";

const getValidSubjects = (colleges) => {
  colleges = colleges.length === 0 ? Object.keys(Colleges) : colleges;
  let validSubjects = [];
  for (let college of colleges) {
    validSubjects = validSubjects.concat(CollegeSubjects[college]);
  }
  return validSubjects.sort((a, b) => a.localeCompare(b));
}

export default function CollegeSubject({
  colleges,
  subjects,
  onChange,
  lastFilterChange,
}) {
  let validSubjects = getValidSubjects(colleges);

  const handleCollegesChange = (event, value) => {
    onChange({
      college: value,
      subject: subjects.filter(function (valid) {
        return this.indexOf(valid) >= 0;
      }, getValidSubjects(value)),
    });
  };

  const filterOptions = (options, { inputValue }) =>
    matchSorter(
      options.map((key) => {
        return { value: key, label: Subjects[key] };
      }),
      inputValue,
      { keys: ["value", "label"] }
    ).map((option) => option.value);

  return (
    <React.Fragment>
      <CollegeSubjectAutocomplete
        multiple
        disableCloseOnSelect={lastFilterChange === "college"}
        limitTags={1}
        options={Object.keys(Colleges)}
        filterSelectedOptions
        getOptionLabel={(college) => Colleges[college]}
        value={colleges}
        onChange={handleCollegesChange}
        renderTags={(value, getTagProps) =>
          value.map((college, index) => (
            <OverflowTipChip
              {...getTagProps({ index })}
              key={college}
              label={Colleges[college]}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="College(s)" placeholder="College" />
        )}
      />
      <CollegeSubjectAutocomplete
        multiple
        disableCloseOnSelect={lastFilterChange === "subject"}
        limitTags={2}
        options={validSubjects}
        filterSelectedOptions
        getOptionLabel={(subject) => Subjects[subject]}
        value={subjects}
        filterOptions={filterOptions}
        onChange={(e, value) => onChange({ subject: value })}
        renderTags={(value, getTagProps) =>
          value.map((subject, index) => (
            <Tooltip
              placement="top"
              arrow
              key={subject}
              title={<span style={{ fontSize: 11 }}>{Subjects[subject]}</span>}
            >
              <Chip
                {...getTagProps({ index })}
                label={subject}
              />
            </Tooltip>
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Subject(s)" placeholder="Subject" />
        )}
      />
    </React.Fragment>
  );
}
