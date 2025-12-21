# Frontend Integration Guide

The backend has been rebuilt to be more robust and structured. Follow these steps to connect your React frontend.

## 1. Base URL
Update your API client (Axios/Fetch) to point to the new backend:
`http://localhost:3000/api`

## 2. Global Data
**Old Endpoint:** `GET /api/live` (returned everything mixed)
**New Endpoint:** `GET /summary/global`

**Response Format:**
```json
{
  "status": "success",
  "data": {
    "totalCases": 123456,
    "totalDeaths": 1234,
    "totalRecovered": 12000,
    "totalActive": 10000,
    "totalVaccinated": 500000,
    "updated": 1702567890000
  }
}
```

## 3. Country Data (Map & List)
**Old Endpoint:** `GET /api/live` (parsed array)
**New Endpoint:** `GET /summary/countries`

**Response Format:**
```json
{
  "status": "success",
  "results": 200,
  "data": [
    {
      "regionType": "country",
      "name": "USA",
      "countryCode": "US",
      "latitude": 37.09,
      "longitude": -95.71,
      "confirmed": 100000,
      "deaths": 1000,
      "...": "..."
    }
  ]
}
```

## 4. Updates Required in Frontend Code
1. **Search for** calls to `/api/live`.
2. **Replace** with separate calls to `/summary/global` (for top bar) and `/summary/countries` (for globe/list).
3. **Update Types**: Ensure your frontend interfaces match the new JSON structure.
   - `cases` -> `totalCases` (Global) or `confirmed` (Country)
   - `lat`/`lng` -> `latitude`/`longitude`

## 5. Testing
1. Ensure Backend is running (`npm run dev` in `server/`).
2. Start Frontend (`npm run dev` in root`).
3. Check Network tab in DevTools to confirm calls to new endpoints are 200 OK.
