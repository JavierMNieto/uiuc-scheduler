import { neo4jgraphql, cypherQuery } from "neo4j-graphql-js";
import { extractQueryResult } from "neo4j-graphql-js/dist/utils";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";

function courseCategoryFilters(genEdsBy, { colleges, subjects, genEds }) {
  let match = "";
  let constraints = [];

  if (subjects && subjects.length > 0) {
    match += "MATCH (subject:Subject)-[:HAS_COURSE]->(course) ";
    constraints.push("subject.subjectId IN $subjects");
  }

  if (colleges && colleges.length > 0 && constraints.length === 0) {
    match +=
      "MATCH (college:College)-[:HAS_SUBJECT]->(:Subject)-[:HAS_COURSE]->(course) ";
    constraints.push("college.collegeId IN $colleges");
  }

  if (genEds && genEds.length > 0) {
    constraints.push(
      genEdsBy +
        "(x in $genEds WHERE (course)-[:SATISFIES]->(:GenEd {genEdId: x}))"
    );
  }

  if (constraints.length === 0) {
    return "";
  }

  return `
    ${match}
    WHERE ${constraints.join(" AND ")}
    WITH course
  `;
}

function courseSectionFilters({ years, terms, partOfTerms, attributes }) {
  let match = "MATCH (course)-[:HAS_SECTION]->(section:Section)";
  let constraints = [];

  if (years && years.length > 0) {
    constraints.push("section.year IN $years");
  }

  if (terms && terms.length > 0) {
    constraints.push("section.term IN $terms");
  }

  if (partOfTerms && partOfTerms.length > 0) {
    constraints.push("section.partOfTerm IN $partOfTerms");
  }

  if (attributes && attributes.length > 0) {
    // TODO: Section Attributes
  }

  if (constraints.length === 0) {
    return "";
  }

  return `
    ${match}
    WHERE ${constraints.join(" AND ")}
    WITH course, section
  `;
}

function courseMeetingFilters(hasSection, { instructors }) {
  let match = "MATCH (section)-[:HAS_MEETING]->(meeting:Meeting) ";
  let constraints = [];

  if (!hasSection) {
    match = "MATCH (course)-[:HAS_SECTION]->(section:Section) " + match;
  }

  if (instructors && instructors.length > 0) {
    match += "MATCH (meeting)<-[:TEACHES]-(instructor:Instructor) ";
    constraints.push("instructor.name in $instructors");
  }

  if (constraints.length === 0) {
    return "";
  }

  return `
    ${match}
    WHERE ${constraints.join(" AND ")}
  `;
}

export default {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Query: {
    searchSubjects: async (parent, args, context, resolveInfo) => {
      const { searchString, colleges } = args;

      let [query, queryParams] = cypherQuery(args, context, resolveInfo);
      let match = "";

      // Remove default match
      query = query.replace(query.substr(0, query.indexOf("RETURN") - 1), "");

      if (searchString && searchString.trim() !== "") {
        match = `
          CALL db.index.fulltext.queryNodes("subject", "subjectId: "+$searchString+"*^1.05 name: "+$searchString+"*")
          YIELD node AS subject
        `;
      } else {
        match = "MATCH (subject:Subject) ";
      }

      if (colleges && colleges.length > 0) {
        match += `
          WHERE any(collegeId in $colleges WHERE (subject)<-[:HAS_SUBJECT]-(:College {collegeId: collegeId}))
        `;
      }

      query = match + query;

      let session = context.driver.session();

      let result;

      try {
        result = await session.readTransaction((tx) => {
          return tx.run(query, queryParams);
        });
      } finally {
        session.close();
      }
      return extractQueryResult(result, resolveInfo.returnType);
    },
    searchInstructors: (parent, args, context, resolveInfo) => {
      return neo4jgraphql(parent, args, context, resolveInfo);
    },
    searchCourses: async (parent, args, context, resolveInfo) => {
      const {
        searchString,
        genEdsBy,
        offset,
        first,
        orderBy,
        ...filters
      } = args;

      let [query, queryParams] = cypherQuery(args, context, resolveInfo);

      // Remove default match, if searchString exists then remove orderBy statement
      query = query.replace(
        query.substr(
          0,
          query.indexOf(`${orderBy && !searchString ? "WITH" : "RETURN"}`) - 1
        ),
        "WITH DISTINCT course"
      );

      let matches = "";

      if (searchString && searchString.trim() !== "") {
        matches = `
          CALL db.index.fulltext.queryNodes("course", "courseId: "+$searchString+"^1.05 name: "+$searchString+"~") 
          YIELD node AS course
        `;
      } else {
        matches = "MATCH (course:Course) ";
      }

      matches += courseCategoryFilters(genEdsBy, filters);

      let sectionMatches = courseSectionFilters(filters);

      matches += sectionMatches;
      matches += courseMeetingFilters(sectionMatches !== "", filters);

      query = matches + query;

      let session = context.driver.session();

      let result;

      try {
        result = await session.readTransaction((tx) => {
          return tx.run(query, queryParams);
        });
      } finally {
        session.close();
      }
      return extractQueryResult(result, resolveInfo.returnType);
    },
  },
};
