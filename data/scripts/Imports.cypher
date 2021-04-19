// Initial import of catalog data into Neo4j.
// Run these queries in order from top to bottom.

// -------- Nodes -------- //

// Colleges
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/nodes/college_nodes.csv" as collegeProperties
CREATE (college:College)
SET college += collegeProperties

// Subjects
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/nodes/subject_nodes.csv" as subjectProperties
CREATE (subject:Subject)
SET subject += subjectProperties

// Courses
:auto USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/nodes/course_nodes.csv" as courseProperties
CREATE (course:Course)
SET course += courseProperties
SET course.number = toInteger(course.number)

// Gen Eds
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/nodes/gen_ed_nodes.csv" as genEdProperties
CREATE (genEd:GenEd)
SET genEd += genEdProperties

// Sections
:auto USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/nodes/section_nodes.csv" as sectionProperties
CREATE (section:Section)
SET section += sectionProperties
SET section.crn = toInteger(section.crn)
SET section.year = toInteger(section.year)
SET section.gpa = toFloat(section.gpa)
SET section.`A+` = toInteger(section.`A+`)
SET section.`A` = toInteger(section.`A`)
SET section.`A-` = toInteger(section.`A-`)
SET section.`B+` = toInteger(section.`B+`)
SET section.`B` = toInteger(section.`B`)
SET section.`B-` = toInteger(section.`B-`)
SET section.`C+` = toInteger(section.`C+`)
SET section.`C` = toInteger(section.`C`)
SET section.`C-` = toInteger(section.`C-`)
SET section.`D+` = toInteger(section.`D+`)
SET section.`D` = toInteger(section.`D`)
SET section.`D-` = toInteger(section.`D-`)
SET section.`F` = toInteger(section.`F`)

// Create Indexes
CREATE INDEX FOR (college:College) ON (college.collegeId);
CREATE INDEX FOR (subject:Subject) ON (subject.subjectId);
CREATE INDEX FOR (course:Course) ON (course.courseId);
CREATE INDEX FOR (genEd:GenEd) ON (genEd.genEdId);
CREATE INDEX FOR (section:Section) ON (section.crn, section.year, section.term);

// Meetings/Instructors/Buildings
:auto USING PERIODIC COMMIT 100
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/nodes/meeting_nodes.csv" as props
MATCH (section:Section {crn: toInteger(props.crn),
                        year: toInteger(props.year), 
                        term: props.term})
WITH props, section
CREATE (meeting:Meeting {startDate: props.startDate, 
                        endDate: props.endDate, 
                        startTime: props.startTime, 
                        endTime: props.endTime, 
                        typeId: props.typeId,
                        meeting: props.meeting,
                        name: props.name,
                        days: props.days})
CREATE (section)-[:HAS_MEETING]->(meeting)
WITH props, meeting
UNWIND split(props.instructor, ':') AS instructorName
MERGE (instructor:Instructor {name: instructorName})
CREATE (instructor)-[:TEACHES]->(meeting)
WITH props, meeting
WHERE props.building IS NOT NULL
MERGE (building:Building {name: props.building})
MERGE (meeting)-[located:LOCATED_IN]->(building)
ON CREATE
  SET located.room = props.room

// Create More Indexes
CREATE INDEX FOR (instructor:Instructor) ON (instructor.name);
CREATE INDEX FOR (building:Building) ON (building.name);

// -------- Relationships -------- //

// College -> Subject
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/relationships/college_to_subjects.csv" as collegeSubjects
MATCH (college:College {collegeId: collegeSubjects.collegeId})
MATCH (subject:Subject {subjectId: collegeSubjects.subjectId})
CREATE (college)-[:HAS_SUBJECT]->(subject)

// Subject -> Course
:auto USING PERIODIC COMMIT 100
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/relationships/subjects_to_courses.csv" as subjectCourses
MATCH (subject:Subject {subjectId: subjectCourses.subjectId}) 
MATCH (course:Course {courseId: subjectCourses.courseId})
CREATE (subject)-[:HAS_COURSE]->(course)

// Course -> Section
:auto USING PERIODIC COMMIT 100
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/relationships/courses_to_sections.csv" as courseSections
MATCH (course:Course {courseId: courseSections.courseId})
MATCH (section:Section {crn: toInteger(courseSections.crn), year: toInteger(courseSections.year), term: courseSections.term})
CREATE (course)-[:HAS_SECTION]->(section)

// Course -> GenEd
:auto USING PERIODIC COMMIT 100
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/AIDA-UIUC/uiuc-scheduler/master/data/neo4j/relationships/gen_eds_to_courses.csv" as courseGenEds
MATCH (course:Course {courseId: courseGenEds.courseId})
MATCH (genEd:GenEd {genEdId: courseGenEds.genEdId})
CREATE (course)-[:SATISFIES]->(genEd)