import { useState, useEffect, useCallback } from 'react';
import { covidApi } from '../api/endpoints';
import type { LocationData } from '../types';

export const useCovidData = () => {
    const [countries, setCountries] = useState<LocationData[]>([]);
    const [cities, setCities] = useState<LocationData[]>([]);
    const [globalData, setGlobalData] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial Data Load (Global + Countries)
    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                const [global, countryList, cityList] = await Promise.all([
                    covidApi.getGlobal(),
                    covidApi.getCountries(),
                    covidApi.getAllCities()
                ]);
                setGlobalData(global);
                setCountries(countryList);
                setCities(cityList);
            } catch (err) {
                console.error("Failed to load initial data", err);
                setError("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, []);

    // On-demand City Fetching
    const fetchCitiesForCountry = useCallback(async (iso: string) => {
        if (!iso) return;
        try {
            console.log(`Fetching cities for ${iso}...`);
            const cityList = await covidApi.getCountryWithCities(iso);
            setCities(cityList);
        } catch (err) {
            console.error(`Failed to load cities for ${iso}`, err);
            // Don't set global error, just maybe warn or clearing cities
            setCities([]);
        }
    }, []);

    return {
        countries,
        cities,
        globalData,
        loading,
        error,
        fetchCitiesForCountry // Expose this function
    };
};
