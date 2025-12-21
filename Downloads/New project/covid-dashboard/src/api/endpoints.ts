import { apiClient } from './client';
import type { LocationData } from '../types';

interface BackendResponse<T> {
    status: string;
    data: T;
}

// Maps backend types to frontend LocationData interface
export const covidApi = {
    getGlobal: async (): Promise<LocationData> => {
        const res = await apiClient.get<BackendResponse<any>>('/global');
        const d = res.data.data;
        return {
            name: "Global",
            regionType: "global",
            cases: d.totalCases,
            deaths: d.totalDeaths,
            recovered: d.totalRecovered,
            vaccinated: d.totalVaccinated,
            active: d.totalActive,
            updated: d.updated,
            lat: 0,
            lng: 0,
            iso2: 'OWID_WRL'
        } as LocationData;
    },

    getCountries: async (): Promise<LocationData[]> => {
        const res = await apiClient.get<BackendResponse<any[]>>('/countries');
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        return list.map((d: any) => ({
            name: d.name,
            regionType: 'country',
            iso2: d.countryCode,
            lat: d.latitude,
            lng: d.longitude,
            cases: d.confirmed,
            deaths: d.deaths,
            recovered: d.recovered,
            active: d.active,
            vaccinated: d.vaccinated,
            population: d.population,
            updated: d.lastUpdated
        }));
    },

    getCountryWithCities: async (iso: string): Promise<LocationData[]> => {
        // This can fetch cities for a specific country
        const res = await apiClient.get<BackendResponse<any[]>>(`/country/${iso}/cities`);
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        return list.map((d: any) => ({
            name: d.name,
            regionType: 'city',
            iso2: iso,
            lat: d.lat,
            lng: d.lng,
            cases: d.confirmed,
            deaths: d.deaths,
            recovered: d.recovered,
            active: 0, // Cities often don't have active data in JHU efficiently
            vaccinated: 0,
            updated: d.updated
        }));
    },

    getAllCities: async (): Promise<LocationData[]> => {
        const res = await apiClient.get<BackendResponse<any[]>>('/cities/all');
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        return list.map((d: any) => ({
            name: d.name,
            regionType: 'city',
            iso2: undefined, // Global cities might not have simple ISO here, but that's fine for points
            lat: d.lat,
            lng: d.lng,
            cases: d.confirmed,
            deaths: d.deaths,
            recovered: d.recovered,
            active: 0,
            vaccinated: 0,
            updated: d.updated
        }));
    },

    // History fetched via Backend Proxy
    getHistory: async (queryName: string, days: string = '30') => {
        let category = 'global';
        let query = '';

        if (queryName !== 'all') {
            category = 'country';
            query = queryName;
        }

        try {
            // New Backend Endpoint: /history/:category/:query?days=30
            const url = query
                ? `/history/${category}/${query}?days=${days}`
                : `/history/${category}?days=${days}`;
            const res = await apiClient.get<BackendResponse<any>>(url);

            // Backend returns { status: 'success', data: ... }
            if (res.data.status === 'success') {
                return res.data.data;
            }
            return null;
        } catch (e) {
            console.error("History fetch failed", e);
            return null;
        }
    }
};
