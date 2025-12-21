from django.shortcuts import render
import requests
from bs4 import BeautifulSoup

URL= "https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data"

headers ={
    'User-Agent': 'Mozilla/5.0 (windows NT 10.0; Win64; x64) Applewebkit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
}

country_names=[]
total_cases=[]
total_deaths=[]
combined_cases=[]

def fetch():
    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content,'html.parser')
    row = soup.find('table')
    row = row.find('tbody')
    row = row.find_all('tr')[:-1]
    for i in range(1,100):
        th= row[i].find('th')
        country_names.append(th.text.strip())
        tds=row[i].find_all('td')[1:] 
        total_cases.append(tds[0].text.strip())
        total_deaths.append(tds[1].text.strip())
    for i in range(1,99):
        tmp = []
        tmp.append(country_names[i])
        tmp.append(total_cases[i])
        tmp.append(total_deaths[i])
        combined_cases.append(tmp)
        #[["india",123,1],["USA",456,1],2], ...]

fetch()
print(combined_cases)

def index(req):
    return render(req,"covid_dashboard/index.html", {
        "combined_cases": combined_cases

    })





