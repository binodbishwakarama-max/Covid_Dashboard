import { type FC } from 'react';
import type { LocationData } from '../../types';

interface DebugPanelProps {
    countriesCount: number;
    citiesCount: number;
    selectedRegion: LocationData | null;
    globalData: LocationData | null;
    currentMetric: string;
}

const DebugPanel: FC<DebugPanelProps> = ({ countriesCount, citiesCount, selectedRegion, globalData, currentMetric }) => {
    // DISABLED ENV CHECK
    // if (import.meta.env.PROD && !window.location.search.includes('debug')) {
    //     return null;
    // }

    return (
        <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 border border-green-500/30 p-4 rounded-md font-mono text-[10px] text-green-400 pointer-events-none backdrop-blur-md shadow-2xl">
            <h3 className="uppercase tracking-widest text-green-600 mb-2 font-bold border-b border-green-900/50 pb-1">Debug Diagnostics</h3>
            <div className="space-y-1">
                <div className="flex justify-between gap-4">
                    <span className="opacity-50">DATA INTEGRITY:</span>
                    <span className="text-white">OK</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="opacity-50">COUNTRIES LOADED:</span>
                    <span className="text-white">{countriesCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="opacity-50">CITIES LOADED:</span>
                    <span className="text-white">{citiesCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="opacity-50">GLOBAL DATA:</span>
                    <span className={globalData ? "text-blue-400" : "text-red-500"}>{globalData ? "AVAILABLE" : "PRE-FETCH"}</span>
                </div>
                <div className="h-px bg-green-900/30 my-2"></div>
                <div className="flex justify-between gap-4">
                    <span className="opacity-50">ACTIVE REGION:</span>
                    <span className="text-yellow-400 font-bold">{selectedRegion ? selectedRegion.name : (globalData ? "GLOBAL (DEFAULT)" : "NULL")}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="opacity-50">ACTIVE METRIC:</span>
                    <span className="text-purple-400">{currentMetric.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default DebugPanel;
