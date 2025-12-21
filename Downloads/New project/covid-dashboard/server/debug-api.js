const axios = require('axios');

const BASE_URL = 'https://disease.sh/v3/covid-19';

async function testV3() {
    try {
        console.log('Testing /all...');
        const r1 = await axios.get(`${BASE_URL}/all`);
        console.log('/all Status:', r1.status);
        console.log('/all Data Type:', typeof r1.data);

        console.log('Testing /vaccine/coverage/global...');
        const r2 = await axios.get(`${BASE_URL}/vaccine/coverage/global?lastdays=1`);
        console.log('/vaccine Status:', r2.status);
        console.log('/vaccine Data Type:', typeof r2.data);
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Response Status:', e.response.status);
            console.error('Response Data:', e.response.data);
        }
    }
}

testV3();
