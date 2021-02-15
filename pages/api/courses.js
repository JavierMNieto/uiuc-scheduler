import fs from "fs";
import path from "path";
import zlib from "zlib";
import sortedUniqBy from "lodash/sortedUniqBy";
import sortedIndexOf from "lodash/sortedIndexOf";
//import memoize from "lodash/memoize";
import { matchSorter } from "match-sorter";

//import FilterCoursesArr from "../../data/filter_courses.json";
import CoursesInfoMap from "../../data/courses_info.json";

const FilterCoursesArr = JSON.parse(
  zlib.gunzipSync(fs.readFileSync(path.resolve("data/filter_courses.json.gz")))
);

const defaultFilters = {
  year: [],
  term: [],
  partOfTerm: [],
  college: [],
  subject: [],
  genEd: [],
  attribute: [],
  instructor: [],
};

FilterCoursesArr.sort((a, b) =>
  `${a.subject} ${a.number}`.localeCompare(`${b.subject} ${b.number}`)
);

//const keyResolver = (...args) => JSON.stringify(args);

const filterCourses = (genEdsBy, filters) => {
  return sortedUniqBy(
    FilterCoursesArr.filter((course) => {
      for (const [filter, values] of Object.entries(filters)) {
        if (values.length > 0 && filter === "genEd") {
          if (genEdsBy === "all") {
            for (const genEd of values) {
              if (course[genEd] === 0) {
                return false;
              }
            }
          } else {
            if (!values.some((genEd) => course[genEd] === 1)) {
              return false;
            }
          }
        } else if (
          values.length > 0 &&
          sortedIndexOf(values, course[filter]) === -1
        ) {
          return false;
        }
      }
      return true;
    }),
    (course) => `${course.subject} ${course.number}`
  ).map((course) => CoursesInfoMap[`${course.subject} ${course.number}`]);
};

const searchCourses = (search, genEdsBy, filters) => {
  search = search.trim();

  if (search === "") {
    return filterCourses(genEdsBy, filters);
  }

  return matchSorter(filterCourses(genEdsBy, filters), search, {
    keys: [(course) => `${course.subject} ${course.number}`, "name"],
  });
};

export default (req, res) => {
  const startIndex = req.query["startIndex"] || 0,
    endIndex = req.query["endIndex"] || 10,
    search = req.query["search"] || "",
    genEdsBy = req.query["genEdsBy"] || "any";

  let filters = {};

  for (const [filter, defaultValue] of Object.entries(defaultFilters)) {
    filters[filter] = []
      .concat(req.query[`${filter}[]`] || defaultValue)
      .sort((a, b) => a.localeCompare(b));
    if (filter === "year") {
      filters[filter] = filters[filter].map((year) => parseInt(year));
    }
  }

  const courses = searchCourses(search, genEdsBy, filters);
  res.status(200).json(courses.slice(startIndex, endIndex));
  /*
  if (req.query["initial"]) {
    res.json({
      total: courses.length,
      courses: courses.slice(startIndex, endIndex),
    });
  } else {
    res.json(courses.slice(startIndex, endIndex));
  }
  */
};
