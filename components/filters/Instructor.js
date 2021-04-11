import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Instructor as InstructorAutocomplete } from "./Autocompletes";
import InstructorChip from "../InstructorChip";

const SEARCH_INSTRUCTORS = gql`
  query SearchInstructors($search: String!, $skip: Int, $limit: Int) {
    searchInstructors(searchString: $search, offset: $skip, first: $limit) {
      name
    }
  }
`;

export default function Instructor({ instructors, onChange }) {
  const [inputValue, setInputValue] = React.useState("");
  const [searchInstructors, { loading, data }] = useLazyQuery(
    SEARCH_INSTRUCTORS
  );

  const getOptions = React.useCallback(() => {
    if (data && inputValue !== "") {
      return data.searchInstructors.map((instructor) => instructor.name);
    }
    return [];
  }, [data]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    searchInstructors({ variables: { search: newInputValue } });
  };

  return (
    <InstructorAutocomplete
      multiple
      options={getOptions()}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      filterOptions={(options) => options}
      loading={loading}
      noOptionsText={inputValue ? "No instructors" : "Search for instructors"}
      onChange={(e, value) => onChange({ instructor: value })}
      value={instructors}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Instructor(s)"
          placeholder="Instructor (Last Name, First Initial)"
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
      renderTags={(value, getTagProps) =>
        value.map((name, index) => (
          <InstructorChip
            key={name + index}
            value={name}
            {...getTagProps(index)}
          />
        ))
      }
    />
  );
}
