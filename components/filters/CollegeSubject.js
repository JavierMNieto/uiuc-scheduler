import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";

import OverflowTipChip from "../OverflowTipChip";
import { CollegeSubject as CollegeSubjectAutocomplete } from "./Autocompletes";
import { Colleges, CollegeSubjects } from "../../lib/Data";

const SEARCH_SUBJECTS = gql`
  query SearchSubjects(
    $search: String!
    $colleges: [String!]
    $skip: Int
    $limit: Int
  ) {
    searchSubjects(
      searchString: $search
      colleges: $colleges
      offset: $skip
      first: $limit
    ) {
      subjectId
      name
    }
  }
`;

const getValidSubjects = (colleges) => {
  colleges = colleges.length === 0 ? Object.keys(Colleges) : colleges;
  let validSubjects = [];
  for (let college of colleges) {
    validSubjects = validSubjects.concat(CollegeSubjects[college]);
  }
  return validSubjects;
};

export default function CollegeSubject({
  colleges,
  subjects,
  onChange,
  lastFilterChange,
}) {
  const [subjectInputValue, setSubjectInputValue] = React.useState("");
  const [subjectValueNames, setSubjectValueNames] = React.useState({});
  const [searchSubjects, { loading, data: subjectData }] = useLazyQuery(
    SEARCH_SUBJECTS
  );

  const getSubjects = React.useCallback(() => {
    if (subjectData && subjectInputValue !== "") {
      return subjectData.searchSubjects.reduce(
        (prev, subject) => ({
          ...prev,
          [subject.subjectId]: subject.name,
        }),
        {}
      );
    }
    return [];
  }, [subjectData]);

  const handleSubjectInputChange = (event, newInputValue) => {
    setSubjectInputValue(newInputValue);
    searchSubjects({
      variables: { search: newInputValue, colleges: colleges },
    });
  };

  const handleCollegesChange = (event, value) => {
    onChange({
      college: value,
      subject: subjects.filter(function (valid) {
        return this.indexOf(valid) >= 0;
      }, getValidSubjects(value)),
    });
  };

  const handleSubjectsChange = (event, value) => {
    setSubjectValueNames({
      ...subjectValueNames,
      [value]: getSubjects()[value],
    });
    onChange({ subject: value });
  };

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
        onInputChange={handleSubjectInputChange}
        inputValue={subjectInputValue}
        disableCloseOnSelect={lastFilterChange === "subject"}
        limitTags={2}
        options={Object.keys(getSubjects())}
        filterOptions={(subject) => subject}
        filterSelectedOptions
        getOptionLabel={(subject) => getSubjects()[subject]}
        value={subjects}
        loading={loading}
        noOptionsText={
          subjectInputValue ? "No subjects" : "Search for subjects"
        }
        onChange={handleSubjectsChange}
        renderTags={(value, getTagProps) =>
          value.map((subject, index) => (
            <Tooltip
              placement="top"
              arrow
              key={subject}
              title={
                <span style={{ fontSize: 11 }}>
                  {subjectValueNames[subject]}
                </span>
              }
            >
              <Chip {...getTagProps({ index })} label={subject} />
            </Tooltip>
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Subject(s)"
            placeholder="Subject"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="secondary" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </React.Fragment>
  );
}
