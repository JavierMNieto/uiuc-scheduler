from pathlib import Path
import pandas as pd

terms = [
    "data/2021-Winter.csv",
    "data/2021-Spring.csv"
] + [
    "data/{}-{}.csv".format(year, term)
    for year in range(2010, 2021) 
      for term in ["Winter", "Spring", "Summer", "Fall"] 
        if Path("data/{}-{}.csv".format(year, term)).is_file()
]

courses_catalog = pd.concat([pd.read_csv(term) for term in terms], ignore_index=True)
