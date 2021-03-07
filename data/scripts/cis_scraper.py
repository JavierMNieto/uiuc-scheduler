from lxml import etree as ET
from urllib.request import urlopen
from time import sleep
import re
import csv
from threading import Thread

# ---------------------- Fields --------------------------------------

fields = ["year",
          "term",
          "college",
          "subject",
          "subject_name",
          "number",
          "name",
          "description",
          "credit_hours",
          "gen_ed",
          "gen_ed_name",
          "crn",
          "section",
          "section_info",
          "section_notes",
          "section_attributes",
          "section_capp_area",
          "section_co_request",
          "section_special_approval",
          "part_of_term",
          "start_date",
          "end_date",
          "meeting",
          "type",
          "type_name",
          "start_time",
          "end_time",
          "days",
          "room",
          "building",
          "instructor"]

# ---------------------- Helper functions -----------------------------

def url_open(url):
    retrycount = 0
    s = None
    while s is None:
        try:
            s = urlopen(url, timeout=50)
        except:
            print(url)
            retrycount += 1
            if retrycount > 6:
                raise
            sleep(2)

    return s

def text_or_none(xml, find, pattern=None, attrib=None):
    if xml.find(find) is not None:
        text = xml.find(find)
        if attrib is not None:
            text = text.attrib[attrib]
        else:
            text = text.text
        if pattern is not None:
            match = re.match(pattern, text)
            if match is not None:
                return match.group(1) or None
            return None
        return text or None
    return None

def build_url(*args):
    url = "https://courses.illinois.edu/cisapp/explorer/schedule"
    for arg in args:
        url += "/" + str(arg)
    return url + ".xml"   

# ---------------------- Get Semester Data -----------------------------
         

def write_semester_csv(year, term):
    row = {
        "year": str(year),
        "term": term.capitalize()
    }
    
    writer = csv.DictWriter(open("data/raw/{}-{}.csv".format(row["year"],row["term"]), "w+", newline='', encoding='utf-8'), fieldnames=fields)
    writer.writeheader()
    
    url = build_url(row["year"], row["term"].lower())
        
    for subject in ET.parse(url_open(url)).iter("subject"):
        row["subject"] = subject.attrib["id"]

        url = build_url(row["year"], row["term"].lower(), row["subject"])
        subject_info = ET.parse(url_open(url))

        row["college"] = text_or_none(subject_info, "collegeCode")
        row["subject_name"] = text_or_none(subject_info, "label")

        print("Getting {} {} {}...".format(row["year"], row["term"], row["subject"]))
        for course in subject_info.iter("course"):
            row["number"] = course.attrib["id"]
            
            url = build_url(row["year"], row["term"].lower(), row["subject"], row["number"])
            course_info = ET.parse(url_open(url))
            
            row["name"]         = text_or_none(course_info, "label")
            row["description"]  = text_or_none(course_info, "description")
            row["credit_hours"] = text_or_none(course_info, "creditHours")
            row["section_attributes"] = text_or_none(course_info, "sectionDegreeAttributes")
                
            for section in course_info.iter("section"):
                row["crn"] = section.attrib["id"]
                
                url = build_url(row["year"], row["term"].lower(), row["subject"], row["number"], row["crn"])
                section_info = ET.parse(url_open(url))

                row["section"]       = text_or_none(section_info, "sectionNumber")
                row["section_info"]  = text_or_none(section_info, "sectionText")
                row["section_notes"] = text_or_none(section_info, "sectionNotes")
                row["section_capp_area"] = text_or_none(section_info, "sectionCappArea")
                row["section_attributes"] = row["section_attributes"] or text_or_none(section_info, "sectionDegreeAttributes")
                row["section_co_request"] = text_or_none(section_info, "sectionCoRequest")
                row["section_special_approval"] = text_or_none(section_info, "specialApproval")
                row["part_of_term"]  = text_or_none(section_info, "partOfTerm")
                row["start_date"]    = text_or_none(section_info, "startDate")
                row["end_date"]      = text_or_none(section_info, "endDate")

                for meeting in section_info.iter("meeting"):
                    row["meeting"] = meeting.attrib["id"]
                    row["type"] = text_or_none(meeting, "type", attrib="code")
                    row["type_name"] = text_or_none(meeting, "type")
                    row["days"] = text_or_none(meeting, "daysOfTheWeek")
                    row["room"] = text_or_none(meeting, "roomNumber")
                    row["start_time"]  = text_or_none(meeting, "start")
                    row["end_time"]    = text_or_none(meeting, "end")
                    row["building"]    = text_or_none(meeting, "buildingName")
                    
                    instructors = meeting.iter("instructor")
                                        
                    if next(meeting.iter("instructor"),None) is None:
                        instructors = [None]
                    
                    for instructor in instructors:
                        row["instructor"] = instructor if instructor is None else instructor.text
                        
                        categories = course_info.find("genEdCategories")
                        
                        if categories is not None:
                            for cat in categories.iter("category"):
                                for genEd in cat.find("{http://rest.cis.illinois.edu}genEdAttributes").iter("genEdAttribute"):
                                    row["gen_ed"] = genEd.attrib["code"]
                                    row["gen_ed_name"] = genEd.text
                                    writer.writerow(row)
                        else:
                            row["gen_ed"] = None
                            writer.writerow(row)
                            
# Get past semesters               
if __name__ == "__main__":
    threads = []
    for year in ET.parse(url_open("https://courses.illinois.edu/cisapp/explorer/schedule.xml")).iter("calendarYear"):
        for term in ET.parse(url_open(year.attrib["href"])).iter("term"):
            thread = Thread(target=write_semester_csv, args=(year.text, term.text[:-5]))
            thread.start()
            threads.append(thread)
    
    for thread in threads:
        thread.join()