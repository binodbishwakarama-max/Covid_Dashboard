# COVID-19 Analytics Backend

Production-ready backend for the COVID-19 3D Dashboard. Built with Node.js, Express, and TypeScript.

## Features

- **Reliable Data**: Fetches data from `disease.sh` (aggregated from JHU, Worldometers, etc.).
- **Performance**: In-memory caching (5-minute TTL) for instant responses.
- **Type Safety**: Full TypeScript implementation.
- **Security**: Helmet headers and CORS configuration.

## API Endpoints

### Health Check
- `GET /api/health`
- Checks if the API is running.

### Global Summary
- `GET /api/summary/global`
- Returns global stats: cases, deaths, recovered, active, vaccinated.

### Countries
- `GET /api/summary/countries`
- Returns a list of all countries with their stats and coordinates.

### Country Detail
- `GET /api/summary/country/:code`
- Get specific country data by ISO2 code (e.g., `US`, `GB`) or name.

## Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Configuration
Env variables can be set in a `.env` file (see `server/src/config/env.ts` for defaults):
- `PORT`: Server port (default 3000)
- `CACHE_TTL`: Cache duration in seconds (default 300)
