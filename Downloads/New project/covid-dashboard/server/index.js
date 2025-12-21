const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Internal Cache to avoid banning
let cache = {
    data: null,
    lastUpdated: 0,
    TTL: 5 * 60 * 1000 // 5 minutes
};

const normalizeCountryName = (name) => {
    const map = {
        'USA': 'United States',
        'UK': 'United Kingdom',
        'S. Korea': 'South Korea',
        'UAE': 'United Arab Emirates',
        'CAR': 'Central African Republic',
        'DRC': 'Democratic Republic of the Congo',
        'Congo': 'Republic of the Congo'
    };
    return map[name] || name;
};

const parseNumber = (str) => {
    if (!str) return 0;
    return parseInt(str.replace(/,/g, '').replace(/\+/g, '') || '0', 10);
};

const scrapeData = async () => {
    // Check cache
    if (cache.data && (Date.now() - cache.lastUpdated < cache.TTL)) {
        return cache.data;
    }

    try {
        console.log('Fetching live data from Worldometers...');
        const { data } = await axios.get('https://www.worldometers.info/coronavirus/');
        const $ = cheerio.load(data);

        const countries = [];
        let globalStats = {
            cases: 0,
            deaths: 0,
            recovered: 0,
            active: 0,
            updated: Date.now()
        };

        // Parse Table
        $('#main_table_countries_today tbody tr').each((i, el) => {
            const tds = $(el).find('td');
            if (tds.length < 5) return;

            // Worldometers Table Indexes (Approximate, requires checking)
            // 0: #, 1: Country, 2: TotalCases, 3: NewCases, 4: TotalDeaths, 5: NewDeaths, 6: TotalRecovered, 7: NewRecovered, 8: ActiveCases

            const name = $(tds[1]).text().trim();
            if (['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania', 'World', 'Total:'].includes(name)) return;

            const totalCases = parseNumber($(tds[2]).text());
            const totalDeaths = parseNumber($(tds[4]).text());
            const totalRecovered = parseNumber($(tds[6]).text());
            const activeCases = parseNumber($(tds[8]).text());

            if (name) {
                countries.push({
                    name: normalizeCountryName(name),
                    cases: totalCases,
                    deaths: totalDeaths,
                    recovered: totalRecovered,
                    active: activeCases,
                    lat: 0, // Frontend will merge with coordinates
                    lng: 0
                });

                // Aggregate Global (or could parse the 'World' row directly, but aggregation is safer)
                globalStats.cases += totalCases;
                globalStats.deaths += totalDeaths;
                globalStats.recovered += totalRecovered;
                globalStats.active += activeCases;
            }
        });

        const result = { global: globalStats, countries };

        // Update Cache
        cache.data = result;
        cache.lastUpdated = Date.now();

        return result;
    } catch (error) {
        console.error('Scraping failed:', error.message);
        throw error;
    }
};

app.get('/api/live', async (req, res) => {
    try {
        const data = await scrapeData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch live data' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Scraper running on http://localhost:${PORT}`);
});
