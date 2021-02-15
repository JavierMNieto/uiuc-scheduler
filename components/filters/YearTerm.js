import React from "react";
import TextField from "@material-ui/core/TextField";

import { YearTerm as YearTermAutocomplete } from "./Autocompletes";
import { YearTerms, PartOfTerms, TermPartOfTerms } from "../../lib/Data";

const getValidTerms = (years) => {
  years = years.length === 0 ? Object.keys(YearTerms) : years;
  let validTerms = [];
  for (let year of years) {
    validTerms = validTerms.concat(YearTerms[year]);
  }
  return [...new Set(validTerms)].sort((a, b) => a.localeCompare(b));
}

const getValidPartOfTerms = (terms) => {
  terms = terms.length === 0 ? Object.keys(TermPartOfTerms) : terms;
  let validPartOfTerms = [];
  for (let term of terms) {
    validPartOfTerms = validPartOfTerms.concat(TermPartOfTerms[term]);
  }
  return [...new Set(validPartOfTerms)].sort((a, b) => a.localeCompare(b));
}

export default function YearTerm({
  years,
  terms,
  partOfTerms,
  lastFilterChange,
  onChange,
}) {
  let validTerms = getValidTerms(years);
  let validPartOfTerms = getValidPartOfTerms(
    terms.length === 0 ? validTerms : terms
  );

  const handleYearsChange = (event, value) => {
    handleTermsChange({
      year: value,
    });
  };

  const handleTermsChange = (event, value) => {
    if (value) {
      event = {
        term: value,
      };
    } else {
      validTerms = getValidTerms(event.year);
      event = {
        ...event,
        term: terms.filter(function (valid) {
          return this.indexOf(valid) >= 0;
        }, validTerms),
      };
    }
    event = {
      ...event,
      partOfTerm: partOfTerms.filter(function (valid) {
        return this.indexOf(valid) >= 0;
      }, getValidPartOfTerms(
        event.term.length === 0 ? validTerms : event.term
      )),
    };
    onChange(event);
  };

  return (
    <React.Fragment>
      <YearTermAutocomplete
        multiple
        disableCloseOnSelect={lastFilterChange === "year"}
        limitTags={2}
        options={Object.keys(YearTerms).sort((a, b) => b.localeCompare(a))}
        filterSelectedOptions
        value={years}
        onChange={handleYearsChange}
        renderInput={(params) => (
          <TextField {...params} label="Year(s)" placeholder="Year" />
        )}
      />
      <YearTermAutocomplete
        multiple
        disableCloseOnSelect={lastFilterChange === "term"}
        limitTags={2}
        options={validTerms}
        filterSelectedOptions
        value={terms}
        onChange={handleTermsChange}
        renderInput={(params) => (
          <TextField {...params} label="Term(s)" placeholder="Term" />
        )}
      />
      <YearTermAutocomplete
        multiple
        disableCloseOnSelect={lastFilterChange === "partOfTerm"}
        limitTags={1}
        options={validPartOfTerms}
        filterSelectedOptions
        getOptionLabel={(partOfTerm) => PartOfTerms[partOfTerm]}
        value={partOfTerms}
        onChange={(e, value) => onChange({ partOfTerm: value })}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Part of Term(s)"
            placeholder="Part of Term"
          />
        )}
      />
    </React.Fragment>
  );
}
