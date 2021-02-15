import React from "react";
import clsx from "clsx";

import FormGroup from "@material-ui/core/FormGroup";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ClearIcon from "@material-ui/icons/Clear";
import Fade from "@material-ui/core/Fade";

import YearTerm from "./filters/YearTerm";
import CollegeSubject from "./filters/CollegeSubject";
import Instructor from "./filters/Instructor";
import GenEd from "./filters/GenEd";
import SectionAttribute from "./filters/SectionAttribute";
import Search from "./filters/Search";

import { DEFAULT_FILTERS } from "../lib/Constants";

const useStyles = makeStyles((theme) => ({
  filters: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: theme.spacing(1.25, 1),
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  clearButton: {
    position: "absolute",
    marginTop: 1.5,
  },
  collapseFilters: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    maxHeight: 525,
    width: "100%",
    overflowY: "auto",
    paddingBottom: theme.spacing(1.25),
  },
}));

export default function Filters({ setSearchFilters }) {
  const classes = useStyles();
  const [lastFilterChange, setLastFilterChange] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [filters, setFilters] = React.useState(DEFAULT_FILTERS);

  const handleFiltersChange = (event) => {
    if (event.target) {
      event = {
        [event.target.name]: event.target.value,
      };
    }
    setLastFilterChange(Object.keys(event)[0]);
    setFilters({
      ...filters,
      ...event,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setExpanded(false);
    setSearchFilters(filters);
  };

  const showClearFilters = React.useCallback(() => {
    const { search: defaultSearch, ...defaultCollapseFilters } = DEFAULT_FILTERS;
    const { search, ...collapseFilters } = filters;
    return (
      JSON.stringify(defaultCollapseFilters) !== JSON.stringify(collapseFilters)
    );
  }, [DEFAULT_FILTERS, filters]);

  return (
    <form
      autoComplete="off"
      className={classes.filters}
      onSubmit={handleSearch}
    >
      <FormGroup>
        <Search search={filters.search} onChange={handleFiltersChange} />
      </FormGroup>
      <Button
        onClick={(event) => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label="show filters"
      >
        <ExpandMoreIcon
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
        />
        Filters
      </Button>
      <Fade className={classes.clearButton} in={showClearFilters()}>
        <Tooltip placement="right" arrow title="Clear all Filters">
          <IconButton size="small" onClick={() => setFilters(DEFAULT_FILTERS)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Fade>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={classes.collapseFilters}>
          <YearTerm
            years={filters.year}
            terms={filters.term}
            partOfTerms={filters.partOfTerm}
            onChange={handleFiltersChange}
            lastFilterChange={lastFilterChange}
          />
          <CollegeSubject
            colleges={filters.college}
            subjects={filters.subject}
            onChange={handleFiltersChange}
            lastFilterChange={lastFilterChange}
          />
          <GenEd
            genEds={filters.genEd}
            genEdsBy={filters.genEdsBy}
            onChange={handleFiltersChange}
          />
          <SectionAttribute
            attributes={filters.attribute}
            onChange={handleFiltersChange}
          />
          <Instructor
            instructors={filters.instructor}
            onChange={handleFiltersChange}
          />
        </div>
      </Collapse>
    </form>
  );
}
