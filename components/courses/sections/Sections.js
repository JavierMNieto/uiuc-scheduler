import React from "react";
import axios from "axios";
import moment from "moment";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import LinearProgress from "@material-ui/core/LinearProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { useQuery } from "react-query";
import {
  FilteringState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  SearchState,
  RowDetailState,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  Toolbar,
  SearchPanel,
  ColumnChooser,
  TableColumnVisibility,
  TableRowDetail,
} from "@devexpress/dx-react-grid-material-ui";

import InstructorChip from "../../InstructorChip";
import ToolbarSemestersPanel from "./ToolbarSemestersPanel";

import { Instructor } from "../../filters/Autocompletes";
import { useSemesters, useDispatchSemesters } from "../../Semesters";

import { courseTimeFormat, courseTimeZone } from "../../../lib/Constants";

const getTimeValue = (row, column, index = 0) =>
  row.end_time[index]
    ? `${row.start_time[index]} - ${row.end_time[index]}`
    : "Asychronous";

const getLocationValue = (row, column, index = 0) =>
  row.building[index] ? `#${row.room[index]} ${row.building[index]}` : "N/A";

const compareArrValue = (a, b) => a[0].localeCompare(b[0]);

const columns = [
  { name: "crn", title: "CRN" },
  {
    name: "section",
    title: "Section",
  },
  {
    name: "type",
    title: "Type",
  },
  {
    name: "time",
    title: "Time",
    getCellValue: getTimeValue,
  },
  {
    name: "days",
    title: "Days",
  },
  {
    name: "location",
    title: "Location",
    getCellValue: getLocationValue,
  },
  {
    name: "instructor",
    title: "Instructor(s)",
  },
];

const filteringColumnExtensions = [
  {
    columnName: "type",
    predicate: (value, filter, row) => {
      if (filter.value === "") {
        return true;
      }
      return row.type.indexOf(filter.value) >= 0;
    },
  },
  {
    columnName: "time",
    predicate: (value, filter, row) => {
      if (filter.value === "") {
        return true;
      }
      const times = row.end_time.map((end_time, index) =>
        getTimeValue(row, index)
      );
      return times.indexOf(filter.value) >= 0;
    },
  },
  {
    columnName: "days",
    predicate: (value, filter, row) => {
      if (filter.value === "") {
        return true;
      }
      return row.days.indexOf(filter.value) >= 0;
    },
  },
  {
    columnName: "location",
    predicate: (value, filter, row) => {
      if (filter.value === "") {
        return true;
      }
      const locations = row.room.map((room, index) =>
        getLocationValue(row, index)
      );
      return locations.indexOf(filter.value) >= 0;
    },
  },
  {
    columnName: "instructor",
    predicate: (value, filter, row) => {
      if (filter.value.length === 0) {
        return true;
      }
      const instructors = row.instructor.flat();
      return filter.value.some(
        (filterInstructor) => instructors.indexOf(filterInstructor) >= 0
      );
    },
  },
];

const filteringStateColumnExtensions = [
  { columnName: "crn", filteringEnabled: false },
];

const sortingStateColumnExtensions = [
  {
    columnName: "section",
    compare: compareArrValue,
  },
  {
    columnName: "type",
    compare: compareArrValue,
  },
  {
    columnName: "time",
    compare: (a, b) => {
      a = moment(
        a.split(" - ")[0] + " " + courseTimeZone,
        `${courseTimeFormat} Z`
      );
      b = moment(
        b.split(" - ")[0] + " " + courseTimeZone,
        `${courseTimeFormat} Z`
      );
      return a.isSame(b) ? 0 : a.isBefore(b) ? -1 : 1;
    },
  },
  {
    columnName: "days",
    compare: compareArrValue,
  },
  {
    columnName: "location",
    compare: compareArrValue,
  },
  {
    columnName: "instructor",
    compare: (a, b) => compareArrValue(a[0], b[0]),
  },
];

const defaultColumnWidths = [
  { columnName: "crn", width: 80 },
  { columnName: "section", width: 100 },
  { columnName: "type", width: 150 },
  { columnName: "time", width: 200 },
  { columnName: "days", width: 175 },
  { columnName: "location", width: 200 },
  { columnName: "instructor", width: 200 },
];

const RowDetail = ({ row }) => {
  row["Date Range"] = row["Start Date"]
    ? `${row["Start Date"]} - ${row["End Date"]}`
    : null;
  let validDetails = Object.keys(row).filter(
    (detail) => /^[A-Z]/.test(detail) && row[detail]
  );

  return (
    <Table size="small">
      <TableBody>
        {validDetails.map((detail) => (
          <TableRow key={detail}>
            <TableCell style={{ width: "15%" }} variant="head" component="th">
              {detail}
            </TableCell>
            <TableCell align="left">{row[detail]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const meetingMarginTop = (row, index) => {
  if (index === 0) return 0;
  return row.instructor[index - 1].length * 32 + 4;
};

const cellComponent = ({
  colSpan,
  column: {
    name,
    getCellValue = (row, index = 0) => row[name][index] || "N/A",
  },
  row,
  tableColumn,
  tableRow,
  value,
}) => {
  let body = value;

  if (name === "instructor") {
    body = (
      <React.Fragment>
        {row.instructor.map((instructors, index) => (
          <div
            key={JSON.stringify(instructors) + index}
            style={{ marginTop: meetingMarginTop(row, index) / 2 }}
          >
            {instructors.map((instructor, index) => (
              <React.Fragment key={instructor + index}>
                {Boolean(instructor) && (
                  <div>
                    <InstructorChip value={instructor} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </React.Fragment>
    );
  } else if (name !== "crn") {
    body = (
      <React.Fragment>
        {row.section.map((section, index) => (
          <div
            key={JSON.stringify(section) + index}
            style={{ marginTop: meetingMarginTop(row, index) }}
          >
            {getCellValue(row, (index = index))}
          </div>
        ))}
      </React.Fragment>
    );
  }

  return (
    <VirtualTable.Cell
      colSpan={colSpan}
      tableRow={tableRow}
      tableColumn={tableColumn}
    >
      {body}
    </VirtualTable.Cell>
  );
};

export default function Sections({ handleClose, ...courseProps }) {
  const { subject, number, semesters, name, filters = {} } = courseProps;
  const course = `${subject} ${number}`;
  const { selectedSemester } = useSemesters();
  const dispatch = useDispatchSemesters();
  const [year, setYear] = React.useState(semesters[0][0]);
  const [term, setTerm] = React.useState(semesters[0][1]);
  const [expandedRowIds, setExpandedRowIds] = React.useState([]);
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { status, data: sections = [], error, isFetching } = useQuery(
    ["sections", course, year, term],
    async ({ queryKey: [, course, year, term] }) => {
      const response = await axios.get("/api/sections", {
        params: {
          course: course,
          year: year,
          term: term,
        },
      });
      return response.data;
    }
  );

  React.useEffect(() => {
    const [selectedYear, selectedTerm] = selectedSemester.split(" ");
    for (const [courseYear, courseTerm] of semesters) {
      if (courseYear == selectedYear && courseTerm === selectedTerm) {
        setYear(courseYear);
        setTerm(courseTerm);
      }
    }
  }, [selectedSemester]);

  React.useEffect(() => {
    if (expandedRowIds.length > 0) {
      setExpandedRowIds([]);
    }
  }, [year, term]);

  const handleAddCourse = (row) => {
    for (let i = 0; i < row.section.length; i++) {
      dispatch({
        type: "ADD_COURSE",
        semester: `${year} ${term}`,
        course: {
          ...courseProps,
          crn: row.crn,
          type: row.type[i],
          start_time: row.start_time[i],
          end_time: row.end_time[i],
          days: row.days[i],
          instructors: row.instructor[i],
          room: row.room[i],
          building: row.building[i],
          allDay: row.end_time[i] === null,
          start_date: row.start_date,
          end_date: row.end_date,
        },
      });
    }
    //handleClose();
  };

  const LoadingState = React.useCallback(
    () => (
      <td
        colSpan={columns.length + 2}
        style={{ textAlign: "center", verticalAlign: "middle" }}
      >
        {isFetching ? (
          <LinearProgress color="secondary" />
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <p>No data</p>
        )}
      </td>
    ),
    [isFetching, status]
  );

  const FilterCell = React.useCallback(
    ({
      column: {
        name,
        getCellValue = (row, index = 0) => row[name][index] || "N/A",
      },
      filter = {},
      filteringEnabled,
      onFilter,
      tableColumn,
      tableRow,
    }) => (
      <TableCell style={{ padding: 8 }}>
        {filteringEnabled ? (
          name === "instructor" ? (
            <Instructor
              multiple
              limitTags={1}
              onChange={(e, value) => onFilter({ value: value })}
              options={[
                ...new Set(
                  sections
                    .map((section) => section.instructor)
                    .flat(2)
                    .filter((instructor) => Boolean(instructor))
                ),
              ]}
              value={filter === null ? [] : filter.value || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Last, First Initial"
                  margin="none"
                />
              )}
            />
          ) : (
            <Select
              displayEmpty
              margin="none"
              value={filter === null ? "" : filter.value || ""}
              onChange={(event) => onFilter({ value: event.target.value })}
              style={{
                maxWidth: tableColumn.width - 10,
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {[
                ...new Set(
                  sections
                    .map((row) =>
                      row.section.map((section, index) =>
                        getCellValue(row, index)
                      )
                    )
                    .flat()
                ),
              ]
                .filter((value) => value !== "N/A")
                .map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
            </Select>
          )
        ) : (
          <React.Fragment />
        )}
      </TableCell>
    ),
    [sections]
  );

  return (
    <Grid rows={sections} columns={columns}>
      <SearchState />
      {sections.length > 0 && (
        <FilteringState
          columnExtensions={filteringStateColumnExtensions}
          defaultFilters={[
            {
              columnName: "instructor",
              value:
                [...new Set(sections.map((row) => row.instructor))].filter(
                  (value) => filters.instructor.indexOf(value) > -1
                ) || [],
            },
          ]}
        />
      )}
      <IntegratedFiltering columnExtensions={filteringColumnExtensions} />
      <SortingState
        defaultSorting={[{ columnName: "time", direction: "asc" }]}
      />
      <IntegratedSorting columnExtensions={sortingStateColumnExtensions} />
      <RowDetailState
        expandedRowIds={expandedRowIds}
        onExpandedRowIdsChange={setExpandedRowIds}
      />
      <VirtualTable
        height={fullScreen ? "65vh" : "50vh"}
        columnExtensions={defaultColumnWidths}
        noDataCellComponent={LoadingState}
        cellComponent={cellComponent}
      />
      <TableHeaderRow showSortingControls />
      <TableRowDetail
        contentComponent={RowDetail}
        toggleColumnWidth={80}
        toggleCellComponent={({
          colSpan,
          tableRow,
          tableColumn,
          expanded,
          onToggle,
          row,
        }) => (
          <VirtualTable.Cell
            colSpan={colSpan}
            tableRow={tableRow}
            tableColumn={tableColumn}
            style={{
              paddingLeft: "8px",
            }}
          >
            <Tooltip
              arrow
              placement="top-start"
              title={`${expanded ? "Hide" : "Show"} Details`}
            >
              <IconButton size="small" onClick={onToggle}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              placement="top-start"
              title={`Add to ${year} ${term} Schedule`}
            >
              <IconButton size="small" onClick={() => handleAddCourse(row)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </VirtualTable.Cell>
        )}
      />
      <TableColumnVisibility />
      {sections.length > 0 && <TableFilterRow cellComponent={FilterCell} />}
      <Toolbar />
      <SearchPanel />
      <ColumnChooser />
      <ToolbarSemestersPanel
        semesters={semesters}
        year={year}
        term={term}
        onYearChange={(event) => setYear(event.target.value)}
        onTermChange={(event) => setTerm(event.target.value)}
      />
    </Grid>
  );
}

/*
import {
  Template,
  TemplatePlaceholder,
  TemplateConnector,
} from "@devexpress/dx-react-core";

<Template name="root">
  <TemplateConnector>
    {({ rows: filteredRows }) => {
      //console.log(filteredRows);
      return <TemplatePlaceholder />;
    }}
  </TemplateConnector>
</Template>
*/
