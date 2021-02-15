import pandas as pd

terms = [
    "data/2021-Winter.csv",
    "data/2021-Spring.csv"
] + [
    "data/{}-{}.csv".format(year, term)
    for year in range(2010, 2021) for term in ["Winter", "Spring", "Summer", "Fall"] if (year > 2014 and term == "Winter") or term != "Winter"
]

courses = pd.concat([pd.read_csv(term) for term in terms], ignore_index=True)
courses.to_csv("data/courses.csv", index=False)