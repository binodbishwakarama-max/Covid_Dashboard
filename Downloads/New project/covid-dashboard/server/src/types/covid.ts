export interface CovidData {
    regionType: 'global' | 'country' | 'city';
    name: string;
    countryCode?: string;
    latitude: number;
    longitude: number;
    confirmed: number;
    deaths: number;
    recovered: number;
    active: number;
    vaccinated: number;
    population?: number;
    lastUpdated: number;
}

export interface GlobalSummary {
    totalCases: number;
    totalDeaths: number;
    totalRecovered: number;
    totalActive: number;
    totalVaccinated: number;
    updated: number;
}

// disease.sh types (partial)
export interface DiseaseShCountry {
    country: string;
    countryInfo: {
        _id: number;
        iso2: string;
        iso3: string;
        lat: number;
        long: number;
        flag: string;
    };
    cases: number;
    todayCases: number;
    deaths: number;
    todayDeaths: number;
    recovered: number;
    todayRecovered: number;
    active: number;
    critical: number;
    casesPerOneMillion: number;
    deathsPerOneMillion: number;
    tests: number;
    testsPerOneMillion: number;
    population: number;
    continent: string;
    oneCasePerPeople: number;
    oneDeathPerPeople: number;
    oneTestPerPeople: number;
    activePerOneMillion: number;
    recoveredPerOneMillion: number;
    criticalPerOneMillion: number;
    updated: number;
}

export interface DiseaseShGlobal {
    updated: number;
    cases: number;
    todayCases: number;
    deaths: number;
    todayDeaths: number;
    recovered: number;
    todayRecovered: number;
    active: number;
    critical: number;
    casesPerOneMillion: number;
    deathsPerOneMillion: number;
    tests: number;
    testsPerOneMillion: number;
    population: number;
    oneCasePerPeople: number;
    oneDeathPerPeople: number;
    oneTestPerPeople: number;
    activePerOneMillion: number;
    recoveredPerOneMillion: number;
    criticalPerOneMillion: number;
    affectedCountries: number;
}

export interface DiseaseShVaccineGlobal {
    [date: string]: number;
}
