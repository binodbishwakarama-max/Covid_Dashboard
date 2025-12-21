import axios from 'axios';
import { cacheService } from './CacheService';
import { AppError } from '../utils/AppError';
import { CovidData, DiseaseShCountry, DiseaseShGlobal, GlobalSummary } from '../types/covid';

const BASE_URL = 'https://disease.sh/v3/covid-19';

const axiosInstance = axios.create({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

export class CovidDataService {

    public async getGlobalSummary(): Promise<GlobalSummary> {
        const cacheKey = 'global_summary';
        const cached = cacheService.get<GlobalSummary>(cacheKey);
        if (cached) return cached;

        try {
            console.log('Fetching Global Summary from disease.sh...');
            console.log('Fetching Global Summary from disease.sh...');

            // Fetch Global Data (Critical)
            const globalRes = await axiosInstance.get<DiseaseShGlobal>(`${BASE_URL}/all`);

            // Fetch Vaccine Data (Non-Critical)
            let vaccines = 0;
            try {
                const vaccineRes = await axiosInstance.get<any>(`${BASE_URL}/vaccine/coverage?lastdays=1`);
                vaccines = Object.values(vaccineRes.data)[0] as number || 0;
            } catch (vErr) {
                console.warn('Failed to fetch global vaccine data, defaulting to 0', vErr);
            }

            const summary: GlobalSummary = {
                totalCases: globalRes.data.cases,
                totalDeaths: globalRes.data.deaths,
                totalRecovered: globalRes.data.recovered,
                totalActive: globalRes.data.active,
                totalVaccinated: vaccines,
                updated: globalRes.data.updated
            };

            cacheService.set(cacheKey, summary);
            return summary;
        } catch (error) {
            console.error('Failed to fetch Global Summary', error);
            throw new AppError('Failed to fetch global summary data', 503);
        }
    }

    public async getAllCountries(): Promise<CovidData[]> {
        const cacheKey = 'all_countries';
        const cached = cacheService.get<CovidData[]>(cacheKey);
        if (cached) return cached;

        try {
            console.log('Fetching All Countries from disease.sh...');
            const response = await axiosInstance.get<DiseaseShCountry[]>(`${BASE_URL}/countries`);

            // Normalize
            const countries: CovidData[] = response.data.map(d => ({
                regionType: 'country',
                name: d.country,
                countryCode: d.countryInfo.iso2,
                latitude: d.countryInfo.lat,
                longitude: d.countryInfo.long,
                confirmed: d.cases,
                deaths: d.deaths,
                recovered: d.recovered,
                active: d.active,
                vaccinated: 0, // disease.sh countries endpoint doesn't return vaccines easily without separate calls. 0 for now or fetch separately if critical.
                population: d.population,
                lastUpdated: d.updated
            }));

            cacheService.set(cacheKey, countries);
            return countries;
        } catch (error) {
            console.error('Failed to fetch Countries', error);
            throw new AppError('Failed to fetch countries data', 503);
        }
    }

    public async getCountry(code: string): Promise<CovidData> {
        const cacheKey = `country_${code}`;
        const cached = cacheService.get<CovidData>(cacheKey);
        if (cached) return cached;

        try {
            // Check if we have the monolithic list cached, and find it there first to save API calls
            const allCountries = cacheService.get<CovidData[]>('all_countries');
            if (allCountries) {
                const found = allCountries.find(c => c.countryCode === code.toUpperCase() || c.name.toLowerCase() === code.toLowerCase());
                if (found) return found;
            }

            console.log(`Fetching Country ${code} from disease.sh...`);
            const response = await axiosInstance.get<DiseaseShCountry>(`${BASE_URL}/countries/${code}`);

            const data: CovidData = {
                regionType: 'country',
                name: response.data.country,
                countryCode: response.data.countryInfo.iso2,
                latitude: response.data.countryInfo.lat,
                longitude: response.data.countryInfo.long,
                confirmed: response.data.cases,
                deaths: response.data.deaths,
                recovered: response.data.recovered,
                active: response.data.active,
                vaccinated: 0,
                population: response.data.population,
                lastUpdated: response.data.updated
            };

            cacheService.set(cacheKey, data);
            return data;

        } catch (error) {
            console.error(`Failed to fetch country ${code}`, error);
            throw new AppError(`Failed to fetch data for country: ${code}`, 404);
        }
    }

    public async getCountryCities(iso: string): Promise<any[]> {
        const cacheKey = `cities_${iso}`;
        const cached = cacheService.get<any[]>(cacheKey);
        if (cached) return cached;

        try {
            console.log(`Fetching Cities for ${iso} from JHU data...`);
            // JHU data is a big array, we cache the WHOLE thing first if not exists
            let allJHU = cacheService.get<any[]>('jhu_data_all');
            if (!allJHU) {
                const response = await axiosInstance.get<any[]>(`${BASE_URL}/jhucsse`);
                allJHU = response.data;
                cacheService.set('jhu_data_all', allJHU);
            }

            if (!allJHU) return [];

            // Filter by ISO2 or Country Name
            // JHU data structure: { country: "US", province: "New York", stats: {...}, coordinates: {...} }
            // It doesn't always have ISO codes easily, but we can match by Country Name or assume strict mapping.
            // Disease.sh JHU data has "country" field.

            // We need to resolve ISO to Country Name first because JHU uses Names
            // We can search our ALL COUNTRIES cache to find the name for this ISO
            const allCountries = await this.getAllCountries();
            const countryMeta = allCountries.find(c => c.countryCode === iso.toUpperCase());

            if (!countryMeta) {
                // Fallback: try to match ISO as name (unlikely to work but safety net)
                throw new AppError('Invalid Country Code', 400);
            }

            const targetName = countryMeta.name;
            console.log(`Filtering cities for country name: ${targetName}`);

            const cities = allJHU.filter(item =>
                item.country === targetName ||
                item.country === iso.toUpperCase() // Just in case
            ).map(item => ({
                name: item.city || item.province,
                regionType: 'city',
                lat: parseFloat(item.coordinates.latitude),
                lng: parseFloat(item.coordinates.longitude),
                confirmed: item.stats.confirmed,
                deaths: item.stats.deaths,
                recovered: item.stats.recovered,
                updated: new Date(item.updatedAt).getTime()
            }));

            cacheService.set(cacheKey, cities);
            return cities;

        } catch (error) {
            console.error('Failed to fetch/filter City Data', error);
            // Don't crash if cities fail, just return empty
            return [];
        }
    }

    public async getAllCities(): Promise<any[]> {
        const cacheKey = 'all_cities_global';
        const cached = cacheService.get<any[]>(cacheKey);
        if (cached) return cached;

        try {
            console.log('Fetching ALL Cities (Global) from JHU data...');
            let allJHU = cacheService.get<any[]>('jhu_data_all');
            if (!allJHU) {
                const response = await axiosInstance.get<any[]>(`${BASE_URL}/jhucsse`);
                allJHU = response.data;
                cacheService.set('jhu_data_all', allJHU, 3600);
            }

            if (!allJHU) return [];

            // Map ALL items to City format
            const cities = allJHU.map(item => ({
                name: item.city || item.province || item.country, // Fallback
                regionType: 'city',
                lat: parseFloat(item.coordinates.latitude),
                lng: parseFloat(item.coordinates.longitude),
                confirmed: item.stats.confirmed,
                deaths: item.stats.deaths,
                recovered: item.stats.recovered,
                updated: new Date(item.updatedAt).getTime()
            }));

            cacheService.set(cacheKey, cities);
            return cities;
        } catch (error) {
            console.error('Failed to fetch Global Cities', error);
            console.log('Falling back to Country Centers as City/Capital nodes...');
            // Fallback: Use Countries as Cities (Points)
            const countries = await this.getAllCountries();
            return countries.map(c => ({
                ...c,
                regionType: 'city', // Treat as city for zoom logic
                name: c.name // Keep country name or append ' Center'
            }));
        }
    }
    public async getHistory(category: string, query?: string, days: string = '30'): Promise<any> {
        const cacheKey = `history_${category}_${query || 'all'}_${days}`;
        const cached = cacheService.get<any>(cacheKey);
        if (cached) return cached;

        try {
            console.log(`Fetching History for ${category} ${query || ''} (Last ${days} days)...`);

            let historyUrl = `${BASE_URL}/historical/all?lastdays=${days}`;
            let vaccineUrl = `${BASE_URL}/vaccine/coverage?lastdays=${days}`;

            if (category === 'country' && query) {
                const encodedQuery = encodeURIComponent(query);
                historyUrl = `${BASE_URL}/historical/${encodedQuery}?lastdays=${days}`;
                vaccineUrl = `${BASE_URL}/vaccine/coverage/countries/${encodedQuery}?lastdays=${days}`;
            }

            const [historyRes, vaccineRes] = await Promise.all([
                axiosInstance.get(historyUrl).catch(e => ({ data: null })), // Soft fail for history
                axiosInstance.get(vaccineUrl).catch(e => ({ data: null }))  // Soft fail for vaccines
            ]);

            let data: any = historyRes.data;
            let vaccines = vaccineRes.data;

            // Normalization of History Data
            if (category === 'country' && data) {
                if (data.timeline) {
                    data = data.timeline;
                } else if (Array.isArray(data) && data[0] && data[0].timeline) {
                    data = data[0].timeline;
                }
            } else if (category === 'country' && !data) {
                // If history failed, maybe only return empty structure so vaccine can still work?
                // Or just init empty
                data = { cases: {}, deaths: {}, recovered: {} };
            }

            // Normalization of Vaccine Data
            // Global returns { date: count, ... } directly
            // Country returns { timeline: { date: count } } OR just { date: count }?
            // disease.sh docs say: /vaccine/coverage/countries/:country -> { timeline: ... }
            if (category === 'country' && vaccines && vaccines.timeline) {
                vaccines = vaccines.timeline;
            }

            // Merge Vaccines into Data
            // Data structure expected: { cases: {}, deaths: {}, recovered: {}, vaccines: {} }
            if (data) {
                // Fix date format mismatch? 
                // History uses "M/D/YY" (e.g., "1/22/20"). 
                // Vaccine uses "M/D/YY" usually.
                data.vaccines = vaccines || {};
            }

            // Consolidate response
            const finalData = category === 'country' ? { timeline: data } : data;

            // Cache
            if (finalData) {
                cacheService.set(cacheKey, finalData, 3600);
            }

            return finalData;

        } catch (error) {
            console.error('Failed to fetch History', error);
            return null;
        }
    }
}

export const covidDataService = new CovidDataService();
