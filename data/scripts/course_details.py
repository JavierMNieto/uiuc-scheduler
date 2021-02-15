from lxml import etree as ET
from urllib.request import urlopen
from time import sleep
import numpy as np
import pandas as pd
import re
import os

# ---------------------- Helper functions -----------------------------

def unique_list(series):
    return series.dropna().unique().tolist()

# -------------------------- Course GPAs ------------------------------

df_gpa = pd.read_csv("https://github.com/wadefagen/datasets/raw/master/gpa/uiuc-gpa-dataset.csv").rename(columns={"Year":"year","Term":"term","Subject":"subject","Number":"number","Primary Instructor":"instructor"})

df_gpa["course"] = df_gpa["subject"] + " " + df_gpa["number"].astype(str)

df_gpa["instructor"] = df_gpa['instructor'].str.extract(r'(\w+, \w)')

df_gpa['total_students'] = df_gpa['A+'] + df_gpa['A'] + df_gpa['A-'] + df_gpa['B'] + df_gpa['B+'] + df_gpa['B-'] + df_gpa['C+'] + df_gpa['C'] + df_gpa['C-'] + df_gpa['D+'] + df_gpa['D'] + df_gpa['D-'] + df_gpa['F']

df_gpa['gpa'] = (df_gpa['A+'] * 4 + df_gpa['A'] * 4 + df_gpa['A-'] * 3.67 + df_gpa['B'] * 3 + df_gpa['B+'] * 3.33 + df_gpa['B-'] * 2.67 + df_gpa['C+'] * 2.33 + df_gpa['C'] * 2 + df_gpa['C-'] * 1.67 + df_gpa['D+'] * 1.33 + df_gpa['D'] + df_gpa['D-'] * 0.67) / df_gpa['total_students']

df_gpa = df_gpa.groupby(["year", "term", "course", "instructor"], as_index=False).agg({"gpa": "mean", "total_students": "sum", "A+": "sum", "A": "sum", "A-": "sum", "B+": "sum", "B": "sum", "B-": "sum", "C+": "sum", "C": "sum", "C-": "sum", "D+": "sum", "D": "sum", "D-": "sum", "F": "sum"})

# --------------------------- Catalogs --------------------------------

semesters_directory = "data/raw/"

semesters = []

# Only get course catalogs with gpa data available
for file in os.listdir(os.fsencode(semesters_directory)):
    filename = os.fsdecode(file)
    year = re.search(r"\d{4}", filename)
    if year and int(year.group()) >= df_gpa["year"].min():
        semesters.append(semesters_directory + filename)

# Combine course catalogs
df_course_catalogs = pd.concat([pd.read_csv(semester) for semester in semesters], ignore_index=True)

df_course_catalogs["term"] = df_course_catalogs["term"].str.capitalize()

df_course_catalogs["course"] = df_course_catalogs["subject"] + " " + df_course_catalogs["number"].astype(str)

# ---------------------- Sort by year and term -------------------------

df_course_catalogs["term"] = pd.Categorical(df_course_catalogs["term"], ["Fall","Summer","Spring","Winter"], ordered=True)
df_course_catalogs.sort_values(by=["year","term"], ascending=False, ignore_index=True, inplace=True)

# ---------------------- Fix some irregularities -----------------------

# Description refers to course from before 2010
df_course_catalogs.loc[df_course_catalogs["course"]=="HIST 574", "description"]="Immerses students in major works of recent American religious history. Written from multiple disciplinary perspectives and wrestling with the knotty problems in which religion has been interwoven, these books will give the student a solid foundation in American religious history. 4 graduate hours. No professional credit."

# Descriptions have misformatted course name
df_course_catalogs.loc[df_course_catalogs["course"]=="ASST 104", "description"] = "Same as REL 104. See REL 104."
df_course_catalogs.loc[df_course_catalogs["course"]=="EPOL 551", "description"] = "Same as EOL 570. See EOL 570."

# ---------------------- Latest course info ----------------------------

# For each course get latest course catalog
df_course_info = df_course_catalogs.groupby(["course"], as_index=False).apply(lambda x: x[(x["year"]==x["year"].iloc[0])&(x["term"]==x["term"].iloc[0])])

# Get info of the courses and put all unique gen_eds into one list
df_course_info = df_course_info.groupby(["course"]).agg({"year":"first","term":"first","college":"first","name":"first","description":"first","credit_hours":"first","gen_ed":unique_list})

# --- Change descriptions which refer to equivalent course ('See ...') ---
# Get dataframe of all descriptions with the 'See ...' course.
df_bad_descriptions = df_course_info.loc[df_course_info["description"].str.extract(r"See\s*([A-Z]{2,4}\s*[0-9]{3})").dropna().index]

# Extract the 'See' course (the equivalent course) from the bad description
df_bad_descriptions["see_course"] = df_bad_descriptions["description"].str.extract(r"See\s*([A-Z]{2,4}\s*[0-9]{3})")[0].values

# Set description to the description of the 'See' course
df_bad_descriptions["description"] = df_course_info.loc[df_bad_descriptions["see_course"].values, "description"].values

# Replace any references of the original course with the 'See' Course
df_course_info.loc[df_bad_descriptions.index, "description"] = df_bad_descriptions.apply(lambda row: row["description"].replace(row.name, row["see_course"]), axis=1)

# --- Add GPAs ---
df_course_gpas = df_gpa.groupby("course").agg({"gpa": "mean", "total_students": "sum", "year": "nunique"})
df_course_gpas["students_per_year"] = (df_course_gpas["total_students"]/df_course_gpas["year"]).astype(int)
df_course_gpas.drop(columns="year", inplace=True)

#
df_course_info.merge(df_course_gpas, how="left", on="course")

# ------------------------ Course Sections -----------------------------



# ---------------------- Store it --------------------------------------

df_course_catalogs.to_csv("data/course_catalogs.csv", index=False)
df_gpa.to_csv("data/gpa.csv", index=False)
#df_course_info.to_csv("data/course_info.csv")
#df_course_sections.to_csv("data/course_sections.csv")