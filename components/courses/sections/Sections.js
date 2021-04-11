import React from "react";
import moment from "moment";
import { gql, useQuery } from "@apollo/client";
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

const getMeetingValue = (row, column, index = 0) =>
  row.meetings[index][column] || "N/A";

const getTimeValue = (row, column, index = 0) =>
  row.meetings[index].endTime
    ? `${row.meetings[index].startTime} - ${row.meetings[index].endTime}`
    : "Asychronous";

const getLocationValue = (row, column, index = 0) =>
  row.meetings[index].location
    ? `#${row.meetings[index].location.room} ${row.meetings[index].location.Building.name}`
    : "N/A";

const columns = [
  { name: "crn", title: "CRN" },
  {
    name: "section",
    title: "Section",
    getCellValue: (row) => row.section,
  },
  {
    name: "name",
    title: "Type",
    getCellValue: getMeetingValue,
  },
  {
    name: "time",
    title: "Time",
    getCellValue: getTimeValue,
  },
  {
    name: "days",
    title: "Days",
    getCellValue: getMeetingValue,
  },
  {
    name: "location",
    title: "Location",
    getCellValue: getLocationValue,
  },
  {
    name: "instructors",
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
      return row.meetings.some(({ name: type }) => type === value);
    },
  },
  {
    columnName: "time",
    predicate: (value, filter, row) => {
      if (filter.value === "") {
        return true;
      }
      const times = row.meetings.map(({ endTime }, index) =>
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
      return row.meetings.some(({ days }) => days === value);
    },
  },
  {
    columnName: "location",
    predicate: (value, filter, row) => {
      if (filter.value === "") {
        return true;
      }
      const locations = row.meetings.map(({ location }, index) =>
        getLocationValue(row, index)
      );
      return locations.indexOf(filter.value) >= 0;
    },
  },
  {
    columnName: "instructors",
    predicate: (value, filter, row) => {
      if (filter.value.length === 0) {
        return true;
      }
      const instructors = row.meetings
        .map(({ instructors }) => instructors.map(({ name }) => name))
        .flat(2);
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
  },
  {
    columnName: "name",
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
  },
  {
    columnName: "location",
  },
  {
    columnName: "instructors",
  },
];

const defaultColumnWidths = [
  { columnName: "crn", width: 80 },
  { columnName: "section", width: 100 },
  { columnName: "name", width: 150 },
  { columnName: "time", width: 200 },
  { columnName: "days", width: 175 },
  { columnName: "location", width: 200 },
  { columnName: "instructors", width: 200 },
];

const RowDetail = ({ row }) => {
  //row["Date Range"] = row["Start Date"]
  //  ? `${row["Start Date"]} - ${row["End Date"]}`
  //  : null;
  let validDetails = Object.keys(row).filter(
    (detail) => /^[A-Z]/.test(detail) && row[detail]
  );

  return (
    <Table size="small">
      <TableBody>
        {validDetails.map((detail) => (
          <TableRow key={detail}>
            <TableCell style={{ width: "15%" }} variant="head" component="th">
              {detail.replaceAll("_", " ")}
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
  return row.meetings[index - 1].instructors.length * 32 + 4;
};

const cellComponent = ({
  colSpan,
  column: { name: columnName, getCellValue = (row) => row[name] || "N/A" },
  row,
  tableColumn,
  tableRow,
  value,
}) => {
  let body = value;

  if (columnName === "instructors") {
    body = (
      <React.Fragment>
        {row.meetings.map(({ instructors }, index) => (
          <div
            key={JSON.stringify(instructors) + index}
            style={{ marginTop: meetingMarginTop(row, index) / 2 }}
          >
            {instructors.map(({ name: instructor }, index) => (
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
  } else if (columnName !== "crn") {
    body = (
      <React.Fragment>
        {row.meetings.map((meeting, index) => (
          <div
            key={JSON.stringify(meeting) + index}
            style={{ marginTop: meetingMarginTop(row, index) }}
          >
            {getCellValue(row, columnName, index)}
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

const GET_SECTIONS = gql`
  query GetSections($course: ID!, $year: Int!, $term: String!) {
    Course(filter: { courseId: $course }) {
      sections(filter: { year: $year, term: $term }) {
        crn
        section
        Part_Of_Term: partOfTerm
        Section_Info: sectionInfo
        Section_Notes: sectionNotes
        Section_Attributes: sectionAttributes
        Section_Capp_Area: sectionCappArea
        Section_Co_Request: sectionCoRequest
        Section_Special_Approval: sectionSpecialApproval
        meetings {
          name
          days
          startDate
          endDate
          startTime
          endTime
          location {
            room
            Building {
              name
            }
          }
          instructors {
            name
          }
        }
      }
    }
  }
`;

export default function Sections({ handleClose, ...courseProps }) {
  const { courseId, semesters, name, filters = {} } = courseProps;
  const { selectedSemester } = useSemesters();
  const dispatch = useDispatchSemesters();
  const [year, setYear] = React.useState(semesters[0][0]);
  const [term, setTerm] = React.useState(semesters[0][1]);
  const [expandedRowIds, setExpandedRowIds] = React.useState([]);
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { loading, error, data } = useQuery(GET_SECTIONS, {
    variables: { course: courseId, year: year, term: term },
  });

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

  const getSections = () => (data ? data.Course[0].sections : []);

  const handleAddCourse = (row) => {
    for (const meeting of row.meetings) {
      dispatch({
        type: "ADD_COURSE",
        semester: `${year} ${term}`,
        course: {
          ...courseProps,
          crn: row.crn,
          section: row.section,
          type: meeting.name,
          start_time: meeting.startTime,
          end_time: meeting.endTime,
          days: meeting.days,
          instructors: meeting.instructors.map(({ name }) => name),
          room: meeting.location ? meeting.location.room : "",
          building: meeting.location ? meeting.location.Building.name : "",
          allDay: meeting.endTime === null,
          start_date: meeting.startDate,
          end_date: meeting.endDate,
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
        {loading ? (
          <LinearProgress color="secondary" />
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <p>No data</p>
        )}
      </td>
    ),
    [loading, status]
  );

  const FilterCell = React.useCallback(
    ({
      column: { name: columnName, getCellValue },
      filter = {},
      filteringEnabled,
      onFilter,
      tableColumn,
      tableRow,
    }) => {
      return (
        <TableCell style={{ padding: 8 }}>
          {filteringEnabled ? (
            columnName === "instructors" ? (
              <Instructor
                multiple
                limitTags={1}
                onChange={(e, value) => onFilter({ value: value })}
                options={[
                  ...new Set(
                    getSections()
                      .map(({ meetings }) =>
                        meetings.map(({ instructors }) =>
                          instructors.map(({ name }) => name)
                        )
                      )
                      .flat(3)
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
                    getSections()
                      .map((row) =>
                        row.meetings.map((meeting, index) =>
                          getCellValue(row, columnName, index)
                        )
                      )
                      .flat(2)
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
      );
    },
    [getSections()]
  );

  return (
    <Grid rows={getSections()} columns={columns}>
      <SearchState />
      {getSections().length > 0 && (
        <FilteringState
          columnExtensions={filteringStateColumnExtensions}
          defaultFilters={[
            {
              columnName: "instructors",
              value:
                [
                  ...new Set(
                    getSections()
                      .map(({ meetings }) =>
                        meetings.map(({ instructors }) =>
                          instructors.map(({ name }) => name)
                        )
                      )
                      .flat(4)
                  ),
                ].filter((value) => filters.instructor.indexOf(value) > -1) ||
                [],
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
      {getSections().length > 0 && (
        <TableFilterRow cellComponent={FilterCell} />
      )}
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
