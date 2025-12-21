export interface HistoricalData {
    country?: string;
    province?: string[];
    timeline?: {
        cases: Record<string, number>;
        deaths: Record<string, number>;
        recovered: Record<string, number>;
        vaccines?: Record<string, number>;
    };
    // Support for flat structure (Global / Backend Normalized)
    cases?: Record<string, number>;
    deaths?: Record<string, number>;
    recovered?: Record<string, number>;
    vaccines?: Record<string, number>;
}
