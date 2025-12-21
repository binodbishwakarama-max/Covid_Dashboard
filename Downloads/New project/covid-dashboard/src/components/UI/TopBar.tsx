import { type FC } from 'react';
import { Activity, GitCompare, RotateCcw, Download } from 'lucide-react';

interface TopBarProps {
    currentMetric: 'cases' | 'deaths' | 'recovered' | 'vaccinated';
    onMetricChange: (metric: 'cases' | 'deaths' | 'recovered' | 'vaccinated') => void;
    onReset: () => void;
    compareMode: boolean;
    onToggleCompare: () => void;
    onExport: () => void;
    // onDateFilterClick removed as it is unused
    fps: number;
    onFpsChange: (fps: number) => void;
    historyDays: string;
    onHistoryDaysChange: (days: string) => void;
}

const TopBar: FC<TopBarProps> = ({ currentMetric, onMetricChange, onReset, compareMode, onToggleCompare, onExport, fps, onFpsChange, historyDays, onHistoryDaysChange }) => {
    return (
        <div className="h-16 flex items-center justify-between px-6 z-50 absolute top-0 left-0 right-0 glass-panel border-b border-white/5">
            {/* Branding */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-800 flex items-center justify-center border border-white/5">
                    <Activity className="text-status-active" size={18} />
                </div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                    VIRUS ANALYTICS <span className="text-brand-400 font-normal">PRO</span>
                </h1>
            </div>

            {/* Center: Metric Selector */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <div className="flex bg-brand-900/50 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
                    <MetricTab
                        active={currentMetric === 'cases'}
                        onClick={() => onMetricChange('cases')}
                        label="CASES"
                        color="text-status-active"
                    />
                    <MetricTab
                        active={currentMetric === 'deaths'}
                        onClick={() => onMetricChange('deaths')}
                        label="DEATHS"
                        color="text-status-critical"
                    />
                    <MetricTab
                        active={currentMetric === 'recovered'}
                        onClick={() => onMetricChange('recovered')}
                        label="RECOVERED"
                        color="text-status-recovered"
                    />
                    <MetricTab
                        active={currentMetric === 'vaccinated'}
                        onClick={() => onMetricChange('vaccinated')}
                        label="VACCINATED"
                        color="text-status-vaccine"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* FPS Control */}
                <div className="flex items-center gap-2 mr-2 group">
                    <span className="text-[10px] font-bold text-brand-400 tracking-wider">FPS</span>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        step="1"
                        value={fps}
                        onChange={(e) => onFpsChange(parseInt(e.target.value))}
                        className="w-20 h-1 bg-brand-800 rounded-lg appearance-none cursor-pointer accent-status-active hover:accent-status-active/80"
                        title={`Target FPS: ${fps}`}
                    />
                    <span className="text-[10px] font-mono text-white w-4">{fps}</span>
                </div>

                <div className="h-4 w-px bg-white/10"></div>

                {/* Date Filter */}
                <div className="flex bg-brand-800 rounded-md border border-white/5 p-0.5">
                    {['30', '90', 'all'].map((day) => (
                        <button
                            key={day}
                            onClick={() => onHistoryDaysChange(day)}
                            className={`px-3 py-1 text-[10px] font-bold uppercase transition-all rounded-[4px] ${historyDays === day
                                ? 'bg-brand-600 text-white shadow-sm'
                                : 'text-brand-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {day === 'all' ? 'ALL' : `${day}D`}
                        </button>
                    ))}
                </div>

                {/* Export */}
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-400 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-md"
                >
                    <Download size={14} />
                    EXPORT
                </button>

                <div className="h-4 w-px bg-white/10"></div>

                {/* Compare Toggle */}
                <button
                    onClick={onToggleCompare}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${compareMode
                        ? 'bg-status-active/10 text-status-active border-status-active/20'
                        : 'text-brand-400 hover:text-white border-transparent hover:bg-white/5'
                        }`}
                >
                    <GitCompare size={14} />
                    COMPARE
                </button>

                {/* Reset */}
                <button
                    onClick={onReset}
                    className="p-2 text-brand-400 hover:text-white transition-colors hover:bg-white/5 rounded-md"
                    title="Reset View"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
};

const MetricTab = ({ active, onClick, label, color }: { active: boolean, onClick: () => void, label: string, color: string }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${active
            ? 'bg-brand-800 text-white shadow-sm ring-1 ring-white/10'
            : 'text-brand-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <span className={active ? color : ''}>{label}</span>
    </button>
);

export default TopBar;
