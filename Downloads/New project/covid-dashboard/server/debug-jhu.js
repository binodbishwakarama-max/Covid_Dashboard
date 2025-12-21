const axios = require('axios');

async function checkJHU() {
    try {
        console.log("Fetching JHU data...");
        const res = await axios.get('https://disease.sh/v3/covid-19/jhucsse', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const data = res.data;
        console.log(`Total Records: ${data.length}`);

        // Sample a few records
        console.log("Sample Records:");
        console.log(JSON.stringify(data.slice(0, 3), null, 2));

        // Check for 'city' field vs 'province'
        const hasCity = data.filter(d => d.city).length;
        const hasProvince = data.filter(d => d.province).length;
        console.log(`Records with 'city': ${hasCity}`);
        console.log(`Records with 'province': ${hasProvince}`);

        // Check for specific capitals (e.g., Paris, London, Tokyo)
        const paris = data.find(d => d.city === 'Paris' || d.province === 'Paris' || (d.county === 'Paris'));
        console.log("Paris data:", paris || "Not found");

    } catch (e) {
        console.error(e.message);
    }
}

checkJHU();
