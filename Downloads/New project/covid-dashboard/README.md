# Virus Analytics Pro

A commercial-grade, executive 3D dashboard for monitoring global COVID-19 statistics. Designed for high-level decision making with real-time data, advanced visualizations, and "Glassmorphism" UI.

## 🚀 Key Features

### 1. Global Command Center
-   **Realistic 3D Globe**: NASA "Night Lights" visualization with real-time data markers.
-   **Smooth Zoom**: Semantic zoom transitions from Global View -> Country Level -> City Level.
-   **Live Data Streams**: Direct integration with `disease.sh` for up-to-the-minute statistics.

### 2. "Executive" Analytics
-   **Global Overview**: Default "Reset" view showing worldwide aggregates instantly on load.
-   **Insight Context**: Automated text generation (e.g., "High recovery rate detected") based on data ratios.
-   **Comparative Metrics**: Percentage-based trend indicators vs historical averages.
-   **Multi-Dimensional Charts**: Switch between **Timeline** (Cases), **Progress** (Vaccines), and **Outcomes** (Deaths/Recovered).

### 3. Professional Polish
-   **Premium Dark Mode**: Deep slate palette (`#0B0F19`) optimized for long-term viewing.
-   **Glassmorphism UI**: High-blur, semi-transparent panels for a modern SaaS aesthetic.
-   **Data Integrity**: "N/A" fallbacks and robust error handling—no silent failures.
-   **Export Capability**: One-click **CSV Export** for offline analysis.

---

## 🛠️ Developer Guide

### Quick Start
1.  **Install**: `npm install`
2.  **Run**: `npm run dev` -> Open `http://localhost:5173`
3.  **Debug Mode**: Open `http://localhost:5173/?debug=true` to see the developer diagnostics overlay (Frame rate, API counters, Active State).

### Architecture Map
-   **`src/components/Globe`**: The 3D Engine. Handles the `react-globe.gl` instance and coordinate mapping.
-   **`src/components/UI/DataPanel.tsx`**: The "Brain". Handles data visualization, chart rendering (`recharts`), and insight generation.
-   **`src/components/UI/TopBar.tsx`**: Navigation & Global Controls (Metric switching, Export).
-   **`src/services/api.ts`**: Data Layer. 
    -   `fetchAllData()`: Parallel fetching of Global, Country, and City data.
    -   `fetchHistoricalData()`: On-demand lazy loading of time-series data.
-   **`src/hooks/useCovidData.ts`**: Custom React Hook mediating state between the API and the UI components.

### Diagnostics
The app includes a hidden `DebugPanel` component.
-   **Trigger**: Add `?debug=true` to the URL.
-   **Monitors**:
    -   **Data Ingestion**: Shows exact count of countries/cities loaded.
    -   **State**: Displays currently active region (or "Global Default").
    -   **Metric**: Confirms which data type (Cases/Deaths/etc) is driving the visualization.

---

## 🎨 Design System
-   **Primary Background**: `#0B0F19` (Deep Void)
-   **Active / Cases**: `#F59E0B` (Amber-500)
-   **Critical / Deaths**: `#DC2626` (Red-600)
-   **Recovered**: `#10B981` (Emerald-500)
-   **Vaccinated**: `#3B82F6` (Blue-500)
-   **Font**: `Inter` (UI) + `Monospace` (Data/Numbers)

---

### License
MIT
