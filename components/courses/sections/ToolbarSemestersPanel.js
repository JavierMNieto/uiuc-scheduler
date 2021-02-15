import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  Template,
  TemplatePlaceholder,
  Plugin,
  TemplateConnector,
} from "@devexpress/dx-react-core";

const getSemestersMap = (semestersList) => {
  let semesters = {};
  for (const [year, term] of semestersList) {
    semesters[year] = (semesters[year] || []).concat(term);
  }
  return semesters;
};

export default function SemesterSelect({
  semesters: semestersList,
  year,
  term,
  onYearChange,
  onTermChange,
}) {
  const semesters = getSemestersMap(semestersList);

  const handleYearChange = (event) => {
    if (semesters[event.target.value].indexOf(term) === -1) {
      onTermChange({
        target: {
          value: semesters[event.target.value][0],
        },
      });
    }
    onYearChange(event);
  };

  return (
    <Plugin name="SemestersSelect">
      <Template name="toolbarContent">
        <TemplateConnector>
          {() => (
            <React.Fragment>
              <Select value={year} onChange={handleYearChange}>
                {Object.keys(semesters)
                  .reverse()
                  .map((year) => (
                    <MenuItem value={year} key={year}>
                      {year}
                    </MenuItem>
                  ))}
              </Select>
              <Select value={term} onChange={onTermChange}>
                {semesters[year].map((term) => (
                  <MenuItem value={term} key={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </React.Fragment>
          )}
        </TemplateConnector>
        <TemplatePlaceholder />
      </Template>
    </Plugin>
  );
}
