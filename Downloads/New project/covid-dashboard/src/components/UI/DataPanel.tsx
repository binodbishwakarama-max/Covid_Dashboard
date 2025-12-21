import React, { useEffect, useState } from 'react';
import type { LocationData } from '../../types';
import type { HistoricalData } from '../../types/history';
import { covidApi } from '../../api/endpoints';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Syringe, HeartPulse, Loader2, Globe } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis } from 'recharts';

interface DataPanelProps {
    selectedLocation: LocationData | null;
    secondLocation: LocationData | null;
    globalStats: LocationData | null;
    historyDays: string;
}

const DataPanel: React.FC<DataPanelProps> = ({ selectedLocation, secondLocation, globalStats, historyDays }) => {
    const [history, setHistory] = useState<HistoricalData | null>(null);
    const [loading, setLoading] = useState(false);
    const [chartMode, setChartMode] = useState<'cases' | 'daily' | 'vax' | 'outcomes'>('cases');

    // Use selected location or fall back to global
    const activeData = selectedLocation || globalStats;
    const isGlobal = !selectedLocation;

    useEffect(() => {
        let isMounted = true;
        if (activeData) {
            setLoading(true);
            const queryName = isGlobal ? 'all' : activeData.name;

            covidApi.getHistory(queryName, historyDays).then(data => {
                if (isMounted) {
                    setHistory(data);
                    setLoading(false);
                }
            }).catch(() => {
                if (isMounted) setLoading(false);
            });
        }
        return () => { isMounted = false; };
    }, [activeData, isGlobal, historyDays]);

    // Helper: Generate Insight Sentence
    const getInsight = (loc: LocationData) => {
        const ratio = loc.recovered / loc.cases;
        const trend = "Variables indicate stabilizing trends.";
        if (ratio > 0.9) return `High recovery rate detected (${(ratio * 100).toFixed(1)}%). Public health measures effective.`;
        if (ratio < 0.8) return `Recovery rate lags below average. Healthcare resource monitoring advised.`;
        return trend;
    };

    const formatNumber = (num: number | undefined | null) => {
        if (num === undefined || num === null) return "N/A";
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    };

    if (!activeData) {
        return (
            <div className="w-[400px] h-full glass-panel border-l border-white/5 flex flex-col justify-center items-center text-center p-8 absolute right-0 top-16 bottom-0 z-40 bg-brand-900/90 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-status-active" size={24} />
                    <p className="text-sm font-medium text-brand-400">CONNECTING TO GLOBAL FEED...</p>
                </div>
            </div>
        );
    }

    // Chart Data Preparation
    const timeline = history?.timeline || history;
    const casesData = timeline?.cases;

    const chartData = casesData ? Object.keys(casesData).map((date, index, array) => {
        const currentCases = casesData[date];
        const prevCases = index > 0 ? casesData[array[index - 1]] : currentCases;
        const dailyCases = currentCases - prevCases;

        return {
            date,
            cases: currentCases,
            daily: dailyCases > 0 ? dailyCases : 0,
            deaths: timeline.deaths ? timeline.deaths[date] : 0,
            recovered: timeline.recovered ? timeline.recovered[date] : 0,
            vaccines: timeline.vaccines ? timeline.vaccines[date] || 0 : 0
        }
    }) : [];


    // Helper: Calculate Trend %
    const calculateTrend = (dataRecord: Record<string, number> | undefined) => {
        if (!dataRecord) return 0;
        const dates = Object.keys(dataRecord);
        if (dates.length < 2) return 0;
        const last = dataRecord[dates[dates.length - 1]];
        const prev = dataRecord[dates[dates.length - 2]];
        if (prev === 0) return 0;
        return ((last - prev) / prev) * 100;
    };

    const caseTrend = timeline?.cases ? calculateTrend(timeline.cases) : 0;
    const deathTrend = timeline?.deaths ? calculateTrend(timeline.deaths) : 0;

    // COMPARE VIEW RENDERING
    if (secondLocation) {
        return (
            <div className="w-[450px] h-full glass-panel border-l border-white/5 absolute right-0 top-16 bottom-0 z-40 bg-brand-900/95 backdrop-blur-xl flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <div className="p-1.5 bg-brand-800 rounded-md">
                        <ArrowUpRight size={16} className="text-status-active" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-widest">COMPARATIVE ANALYSIS</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {/* Comparison Header */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-brand-800/30 rounded-xl border border-white/5">
                            <h3 className="text-xl font-bold text-white truncate">{selectedLocation?.name}</h3>
                            <div className="h-1 w-8 bg-brand-400 mx-auto mt-2 rounded-full"></div>
                        </div>
                        <div className="text-center p-4 bg-status-active/5 rounded-xl border border-status-active/20">
                            <h3 className="text-xl font-bold text-status-active truncate">{secondLocation.name}</h3>
                            <div className="h-1 w-8 bg-status-active mx-auto mt-2 rounded-full"></div>
                        </div>
                    </div>

                    {/* Stat Rows */}
                    {[
                        { label: 'CASES', key: 'cases', color: 'text-white' },
                        { label: 'DEATHS', key: 'deaths', color: 'text-status-critical' },
                        { label: 'RECOVERED', key: 'recovered', color: 'text-status-recovered' },
                        { label: 'POPULATION', key: 'population', color: 'text-brand-400' }
                    ].map(stat => {
                        const val1 = (selectedLocation as any)[stat.key];
                        const val2 = (secondLocation as any)[stat.key];
                        const diff = val2 - val1;
                        const percent = val1 > 0 ? ((diff / val1) * 100).toFixed(1) : '0';

                        return (
                            <div key={stat.key} className="p-4 bg-brand-800/20 rounded-xl border border-white/5 hover:bg-brand-800/40 transition-colors">
                                <div className="text-xs font-bold text-brand-400 mb-3 tracking-widest text-center">{stat.label}</div>
                                <div className="flex justify-between items-center px-2">
                                    <div className={`text-lg font-mono font-bold ${stat.color}`}>{formatNumber(val1)}</div>
                                    <div className="flex flex-col items-center">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff > 0 ? 'bg-status-active/20 text-status-active' : 'bg-brand-700 text-brand-400'}`}>
                                            {diff > 0 ? '+' : ''}{diff < 0 ? '-' : ''}{Math.abs(Number(percent))}%
                                        </span>
                                    </div>
                                    <div className={`text-lg font-mono font-bold ${stat.color}`}>{formatNumber(val2)}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[400px] h-full glass-panel border-l border-white/5 absolute right-0 top-16 bottom-0 z-40 bg-brand-900/90 backdrop-blur-xl flex flex-col">

            {/* Header / Region Name */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                    {/* Show Flag only if not Global and has iso2 */}
                    {!isGlobal && activeData.iso2 && (
                        <img
                            src={`https://flagcdn.com/24x18/${activeData.iso2.toLowerCase()}.png`}
                            className="h-4 rounded-sm"
                            alt="flag"
                        />
                    )}
                    {isGlobal && <Globe size={14} className="text-brand-400" />}
                    <span className="text-xs font-bold text-brand-400 tracking-wider">
                        {isGlobal ? "GLOBAL OVERVIEW" : "REGION ANALYSIS"}
                    </span>
                </div >
                <h2 className="text-3xl font-bold text-white tracking-tight">{activeData.name}</h2>
            </div >

            {/* Insight Box */}
            < div className="p-6 bg-brand-800/50 border-b border-white/5" >
                <div className="flex gap-3">
                    <div className="mt-1">
                        <TrendingUp size={16} className="text-status-active" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white leading-relaxed">
                            {getInsight(activeData)}
                        </p>
                        <p className="text-xs text-brand-400 mt-2">
                            Latest data stream updated: {new Date(activeData.updated).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div >

            {/* Metrics Grid */}
            < div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1" >

                {/* Key Metrics Row */}
                < div className="grid grid-cols-2 gap-4" >
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-brand-400">TOTAL CASES</span>
                            {caseTrend !== 0 && (
                                <span className={`text-xs font-bold ${caseTrend > 0 ? 'text-status-active bg-status-active/10' : 'text-status-recovered bg-status-recovered/10'} px-2 py-0.5 rounded flex items-center gap-1`}>
                                    {caseTrend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                    {Math.abs(caseTrend).toFixed(1)}%
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-mono text-white tracking-tight tabular-nums">
                            {formatNumber(activeData.cases)}
                        </div>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end">
                            {deathTrend !== 0 && (
                                <span className={`text-xs font-bold ${deathTrend > 0 ? 'text-status-critical bg-status-critical/10' : 'text-status-recovered bg-status-recovered/10'} px-2 py-0.5 rounded flex items-center gap-1 mr-auto`}>
                                    {deathTrend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                    {Math.abs(deathTrend).toFixed(1)}%
                                </span>
                            )}
                            <span className="text-xs font-medium text-brand-400">TOTAL DEATHS</span>
                        </div>
                        <div className="text-2xl font-mono text-status-critical tracking-tight tabular-nums">
                            {formatNumber(activeData.deaths)}
                        </div>
                    </div>
                </div >

                <div className="h-px bg-white/5 w-full"></div>

                {/* Advanced Analytics Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white tracking-wider">ANALYTICS VIEW</span>
                            {chartData.length > 0 && (
                                <span className="text-[10px] text-brand-400 font-mono mt-0.5">
                                    {new Date(chartData[0].date).toLocaleDateString()} - {new Date(chartData[chartData.length - 1].date).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="flex bg-brand-800 rounded-lg p-0.5 border border-white/5">
                            <button
                                onClick={() => setChartMode('cases')}
                                className={`p-1.5 rounded-md transition-all ${chartMode === 'cases' ? 'bg-brand-700 text-white shadow-sm' : 'text-brand-400 hover:text-white'}`}
                                title="Cases Trend"
                            >
                                <Activity size={14} />
                            </button>
                            <button
                                onClick={() => setChartMode('daily')}
                                className={`p-1.5 rounded-md transition-all ${chartMode === 'daily' ? 'bg-brand-700 text-white shadow-sm' : 'text-brand-400 hover:text-white'}`}
                                title="Daily New Cases"
                            >
                                <TrendingUp size={14} />
                            </button>
                            <button
                                onClick={() => setChartMode('vax')}
                                className={`p-1.5 rounded-md transition-all ${chartMode === 'vax' ? 'bg-brand-700 text-white shadow-sm' : 'text-brand-400 hover:text-white'}`}
                                title="Vaccination Progress"
                            >
                                <Syringe size={14} />
                            </button>
                            <button
                                onClick={() => setChartMode('outcomes')}
                                className={`p-1.5 rounded-md transition-all ${chartMode === 'outcomes' ? 'bg-brand-700 text-white shadow-sm' : 'text-brand-400 hover:text-white'}`}
                                title="Outcomes"
                            >
                                <HeartPulse size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="h-48 w-full -ml-2">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-xs text-brand-400 animate-pulse">
                                Retrieving historical data...
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                {chartMode === 'cases' ? (
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="date" hide />
                                        <Line type="monotone" dataKey="cases" stroke="#FFD700" strokeWidth={2} dot={false} filter="drop-shadow(0 0 4px #FFD700)" />
                                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px', color: '#fff' }} />
                                    </LineChart>
                                ) : chartMode === 'daily' ? (
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="date" hide />
                                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px', color: '#fff' }} />
                                        <Bar dataKey="daily" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                ) : chartMode === 'vax' ? (
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorVax" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" hide />
                                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="vaccines" stroke="#00FFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorVax)" filter="drop-shadow(0 0 4px #00FFFF)" />
                                    </AreaChart>
                                ) : (
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="date" hide />
                                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px', color: '#fff' }} />
                                        <Bar dataKey="deaths" stackId="a" fill="#FF0055" />
                                        <Bar dataKey="recovered" stackId="a" fill="#00FF99" />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-brand-400">
                                No historical data available
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default DataPanel;
