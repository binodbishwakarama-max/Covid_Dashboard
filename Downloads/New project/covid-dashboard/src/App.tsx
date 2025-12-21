import { useState, Suspense, lazy, useCallback, useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import TopBar from './components/UI/TopBar';
import DataPanel from './components/UI/DataPanel';
import DebugPanel from './components/UI/DebugPanel';
import { useCovidData } from './hooks/useCovidData';
import type { LocationData } from './types';
import { Loader2, Activity } from 'lucide-react';
import { Toast } from './components/UI/Toast';

// Lazy load the heavy 3D component
const Globe = lazy(() => import('./components/Globe/Globe'));

function App() {
  const { countries, cities, loading, globalData, fetchCitiesForCountry, error } = useCovidData();
  const [viewMode, setViewMode] = useState<'country' | 'city'>('country');
  const [currentMetric, setCurrentMetric] = useState<'cases' | 'deaths' | 'recovered' | 'vaccinated'>('cases');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fps, setFps] = useState(60);
  const [historyDays, setHistoryDays] = useState('30');

  // Selection State
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [secondLocation, setSecondLocation] = useState<LocationData | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  // Memoize data filtering to prevent Globe re-renders
  const globeCountries = useMemo(() => countries.filter(c => c && typeof c.cases === 'number'), [countries]);
  const globeCities = useMemo(() => cities.filter(c => c && typeof c.cases === 'number'), [cities]);


  // Re-verify the logic above: 
  // If in compare mode:
  // 1. If nothing selected, select it.
  // 2. If same clicked, deselect.
  // 3. If diff clicked, set second. 
  // My previous code had logic issues with closure. Let's fix it properly.

  const handleLocationSelectOptimized = useCallback((data: LocationData) => {
    setCompareMode(currentCompareMode => {
      if (!currentCompareMode) {
        setSelectedLocation(data);
        setSecondLocation(null);
        if (data.regionType === 'country' && data.iso2) fetchCitiesForCountry(data.iso2);
        return currentCompareMode;
      }

      // Compare Mode Logic
      setSelectedLocation(currentSelection => {
        if (!currentSelection) {
          if (data.regionType === 'country' && data.iso2) fetchCitiesForCountry(data.iso2);
          return data;
        }
        if (currentSelection.name === data.name) {
          return null;
        }
        setSecondLocation(data);
        return currentSelection;
      });
      return currentCompareMode;
    });
  }, [fetchCitiesForCountry]);


  const toggleCompareMode = useCallback(() => {
    setCompareMode(prev => {
      if (prev) setSecondLocation(null); // Reset second on disable
      return !prev;
    });
  }, []);

  const handleExport = useCallback(() => {
    // Need access to current selection. Using refs or dependency.
    // Since this is a button click, re-creating it when selection changes is acceptable.
    // But better to pull from state directly.
    const activeData = selectedLocation || globalData;
    if (!activeData) return;

    // Create CSV content
    const headers = ['Region', 'Type', 'Cases', 'Deaths', 'Recovered', 'Population', 'Updated'];
    const row = [
      activeData.name,
      activeData.type || activeData.regionType || 'Unknown',
      activeData.cases,
      activeData.deaths,
      activeData.recovered,
      activeData.population,
      new Date(activeData.updated).toISOString()
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + row.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `covid_report_${activeData.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedLocation, globalData]);

  // Diagnostics
  if (!loading) {
    console.groupCollapsed('Data Ingestion Diagnostics');
    console.log('Global Data:', globalData);
    console.log('Countries Count:', countries.length);
    console.log('Cities Count:', cities.length);
    console.log('Current Active View:', selectedLocation || "Global Default");
    console.groupEnd();
    console.groupEnd();
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-900 flex-col gap-4">
        <Activity size={48} className="text-status-critical" />
        <h1 className="text-status-critical text-2xl font-bold tracking-wider">SYSTEM MALFUNCTION</h1>
        <p className="text-brand-400 font-mono bg-black/30 px-4 py-2 rounded">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded border border-white/10 transition-colors uppercase text-sm tracking-widest"
        >
          Reinitialize System
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-status-active" size={32} />
          <p className="text-sm font-medium text-brand-400 tracking-wide">INITIALIZING DATA STREAMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-900">
      <ErrorBoundary>
        {/* Top Bar - Fixed Z-Index */}
        <TopBar
          currentMetric={currentMetric}
          onMetricChange={setCurrentMetric}
          onReset={() => {
            setSelectedLocation(null);
            setSecondLocation(null);
            setViewMode('country');
          }}
          compareMode={compareMode}
          onToggleCompare={toggleCompareMode}
          onExport={handleExport}
          fps={fps}
          onFpsChange={setFps}
          historyDays={historyDays}
          onHistoryDaysChange={setHistoryDays}
        />

        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

        {/* Main Content Area */}
        <div className="absolute inset-0 flex">

          {/* Globe Container (Full Width by default) */}
          <div className="flex-1 relative bg-brand-900">
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center text-brand-400 text-xs tracking-widest">LOADING 3D SECURE ENVIRONMENT...</div>
            }>
              <Globe
                countries={globeCountries}
                cities={globeCities}
                viewMode={viewMode}
                currentMetric={currentMetric}
                onViewModeChange={setViewMode}
                onPlotClick={handleLocationSelectOptimized}
                fpsLimit={fps}
              />
            </Suspense>
          </div>

          {/* Insight Panel */}
          <DataPanel
            selectedLocation={selectedLocation}
            secondLocation={secondLocation}
            globalStats={globalData}
            historyDays={historyDays}
          />

        </div>

        {import.meta.env.DEV && (
          <DebugPanel
            countriesCount={countries.length}
            citiesCount={cities.length}
            selectedRegion={selectedLocation}
            globalData={globalData}
            currentMetric={currentMetric}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
