export interface CovidStats {
    cases: number;
    deaths: number;
    recovered: number;
    vaccinated?: number;
    active?: number;
    updated: number; // timestamp
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface LocationData extends CovidStats {
    name: string;
    iso2?: string; // Country code (US, IN)
    iso3?: string; // Country code (USA, IND)
    lat: number;
    lng: number;
    population?: number;
    flag?: string;
    type?: 'country' | 'city' | 'global';
    regionType?: 'country' | 'city' | 'global';
}

export interface DiseaseShCountry {
    country: string;
    countryInfo: {
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
    population: number;
    updated: number;
}

export interface DiseaseShJHU {
    country: string;
    province: string;
    city?: string; // Add city as optional
    county?: string;
    updatedAt: string;
    stats: {
        confirmed: number;
        deaths: number;
        recovered: number;
    };
    coordinates: {
        latitude: string;
        longitude: string;
    };
}
