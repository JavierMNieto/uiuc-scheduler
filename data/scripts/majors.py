import requests
import json
from bs4 import BeautifulSoup

with requests.get("http://catalog.illinois.edu/undergraduate") as response:
    majors = []

    soup = BeautifulSoup(response.content, 'html.parser')
    
    # get html list of majors
    majors_html = soup.select("#atozindex h4")
    
    for x in range(len(majors_html)):
        major = majors_html[x]
        
        # if this "major" has margin style on it, then it's a concentration of a major
        if major.has_attr("style"):
            # title of the major of the concentrations
            title = majors_html[x - 1].find('a').text
            
            # So for each concentration of the major, 
            # include the title of the major with the concentration title
            for conc in major.find_all('a'):
                majors.append({
                    "label": title + " - " + conc.text,
                    "value": conc.get("href")
                })
        elif not majors_html[min(len(majors_html) - 1, x + 1)].has_attr("style"):
            major = major.find('a')
            majors.append({
                    "label": major.text,
                    "value": major.get("href")
                })    

if __name__ == "__main__":
    with open("data/majors.json", "w+") as f:
        json.dump(majors, f)