import pandas as pd

# From https://github.com/wadefagen/datasets/blob/master/gpa/uiuc-gpa-dataset.csv by Wade Fagen-Ulmschneider
# Get gpa dataset including GPAs of sections from 2010
df_gpa = pd.read_csv("https://github.com/wadefagen/datasets/raw/master/gpa/uiuc-gpa-dataset.csv").rename(columns={"Year":"year","Term":"term","Subject":"subject","Number":"number","Primary Instructor":"instructor"})

df_gpa["course"] = df_gpa["subject"] + " " + df_gpa["number"].astype(str)

df_gpa["instructor"] = df_gpa['instructor'].str.extract(r'(\w+, \w)')

df_gpa['total_students'] = df_gpa['A+'] + df_gpa['A'] + df_gpa['A-'] + df_gpa['B'] + df_gpa['B+'] + df_gpa['B-'] + df_gpa['C+'] + df_gpa['C'] + df_gpa['C-'] + df_gpa['D+'] + df_gpa['D'] + df_gpa['D-'] + df_gpa['F']

df_gpa['gpa'] = (df_gpa['A+'] * 4 + df_gpa['A'] * 4 + df_gpa['A-'] * 3.67 + df_gpa['B'] * 3 + df_gpa['B+'] * 3.33 + df_gpa['B-'] * 2.67 + df_gpa['C+'] * 2.33 + df_gpa['C'] * 2 + df_gpa['C-'] * 1.67 + df_gpa['D+'] * 1.33 + df_gpa['D'] + df_gpa['D-'] * 0.67) / df_gpa['total_students']

df_gpa = df_gpa.groupby(["year", "term", "course", "instructor"], as_index=False).agg({"gpa": "mean", "total_students": "sum", "A+": "sum", "A": "sum", "A-": "sum", "B+": "sum", "B": "sum", "B-": "sum", "C+": "sum", "C": "sum", "C-": "sum", "D+": "sum", "D": "sum", "D-": "sum", "F": "sum"})

df_gpa.to_csv("data/gpa.csv", index=False)