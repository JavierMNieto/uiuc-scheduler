import { gql } from "@apollo/client";

export default gql`
  scalar JSON
  scalar JSONObject

  enum GenEdsBy {
    all
    any
  }

  type College {
    collegeId: ID!
    name: String!
    subjects: [Subject!]! @relation(name: "HAS_SUBJECT", direction: OUT)
  }

  type Subject {
    subjectId: ID!
    name: String!
    college: College @relation(name: "HAS_SUBJECT", direction: IN)
    courses: [Course!]! @relation(name: "HAS_COURSE", direction: OUT)
  }

  type Course {
    courseId: ID!
    name: String!
    number: Int!
    creditHours: String
    description: String
    gpa: Float
      @cypher(
        statement: """
        MATCH (this)-[:HAS_SECTION]->(section:Section)
        WITH DISTINCT section.gpa as gpa
        RETURN avg(gpa)
        """
      )
    semesters: JSON!
      @cypher(
        statement: """
        MATCH (this)-[:HAS_SECTION]->(section:Section)
        WITH DISTINCT [section.year, section.term] as semester
        WITH semester,
          CASE semester[1]
            WHEN "Winter" THEN 3
            WHEN "Spring" THEN 2
            WHEN "Summer" THEN 1
            ELSE 0
          END as termSortOrder
        ORDER BY semester[0] DESC, termSortOrder
        RETURN collect(semester)
        """
      )
    subject: Subject @relation(name: "HAS_COURSE", direction: IN)
    sections: [Section!]! @relation(name: "HAS_SECTION", direction: OUT)
    genEds: [GenEd] @relation(name: "SATISFIES", direction: OUT)
  }

  type GenEdCategory {
    genEdCategoryId: ID!
    name: String!
    genEds: [GenEd!]! @relation(name: "HAS_GENED", direction: OUT)
  }

  type GenEd {
    genEdId: ID!
    name: String!
    courses: [Course!]! @relation(name: "SATISFIES", direction: IN)
    genEdCategory: GenEdCategory @relation(name: "HAS_GENED", direction: IN)
  }

  type Section {
    year: Int!
    term: String!
    crn: Int!
    partOfTerm: String
    gpa: Float
    totalStudents: Int
      @cypher(
        statement: """
        RETURN this.\`A+\` + this.\`A\` + this.\`A-\` +
               this.\`B+\` + this.\`B\` + this.\`B-\` +
               this.\`C+\` + this.\`C\` + this.\`C-\` +
               this.\`D+\` + this.\`D\` + this.\`D-\` +
               this.\`F\`
        """
      )
    section: String!
    sectionInfo: String
    sectionNotes: String
    sectionAttributes: String
    sectionCappArea: String
    sectionCoRequest: String
    sectionSpecialApproval: String
    course: Course @relation(name: "HAS_SECTION", direction: IN)
    meetings: [Meeting!]! @relation(name: "HAS_MEETING", direction: OUT)
  }

  type Year {
    name: Int!
    sections: [Section!]! @relation(name: "DURING_YEAR", direction: IN)
    terms: [Term!]! @relation(name: "HAS_TERM", direction: OUT)
  }

  type Term {
    name: ID!
    sections: [Section!]! @relation(name: "DURING_TERM", direction: IN)
    year: [Year!]! @relation(name: "HAS_TERM", direction: IN)
    partOfTerms: [PartOfTerm!]!
      @relation(name: "HAS_PARTOFTERM", direction: OUT)
  }

  type PartOfTerm {
    partOfTermId: ID!
    name: String
    sections: [Section!]! @relation(name: "DURING_PARTOFTERM", direction: OUT)
    term: [Term!]! @relation(name: "HAS_PARTOFTERM", direction: IN)
  }

  type Meeting {
    typeId: String!
    name: String!
    days: String
    startDate: String
    endDate: String
    startTime: String
    endTime: String
    section: Section @relation(name: "HAS_MEETING", direction: IN)
    instructors: [Instructor] @relation(name: "TEACHES", direction: IN)
    location: Location
  }

  type Instructor {
    name: String!
    meetings: [Meeting] @relation(name: "TEACHES", direction: OUT)
  }

  type Building {
    name: String!
    meetings: [Location]
  }

  type Location @relation(name: "LOCATED_IN") {
    from: Meeting!
    to: Building!
    room: String
  }

  type Query {
    searchSubjects(
      searchString: String!
      colleges: [String!]
      offset: Int! = 0
      first: Int! = 15
    ): [Subject]
    searchInstructors(
      searchString: String!
      offset: Int! = 0
      first: Int! = 15
    ): [Instructor]
      @cypher(
        statement: """
        MATCH (instructor:Instructor)
        WHERE instructor.name =~ "(?i)"+$searchString+".*"
        RETURN instructor SKIP toInteger($offset) LIMIT toInteger($first)
        """
      )
    searchCourses(
      searchString: String
      years: [Int!]
      terms: [String!]
      partOfTerms: [String!]
      colleges: [String!]
      subjects: [String!]
      genEds: [String!]
      attributes: [String!]
      instructors: [String!]
      genEdsBy: GenEdsBy! = any
      orderBy: [_CourseOrdering!]! = courseId_asc
      offset: Int! = 0
      first: Int! = 10
    ): [Course]
  }
`;
