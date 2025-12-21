import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import GlobeT from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';
import type { LocationData } from '../../types';

interface GlobeProps {
    countries: LocationData[];
    cities: LocationData[];
    viewMode: 'country' | 'city';
    currentMetric: 'cases' | 'deaths' | 'recovered' | 'vaccinated';
    onViewModeChange?: (mode: 'country' | 'city') => void;
    onPlotClick?: (data: LocationData) => void;
    fpsLimit?: number;
}

const Globe: React.FC<GlobeProps> = (props) => {
    const { countries, cities, viewMode, currentMetric, onViewModeChange, onPlotClick } = props;
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [isMounted, setIsMounted] = useState(false);
    const [geoJson, setGeoJson] = useState<any>(null);
    const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Fetch GeoJSON for Heatmap Borders
        fetch('//unpkg.com/world-atlas/countries-110m.json')
            .then(res => res.json())
            .then(data => {
                setGeoJson(data);
            })
            .catch(err => console.error("Failed to load map borders", err));

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Safe access to controls and renderer for custom FPS loop
        if (globeEl.current && isMounted) {
            let animationFrameId: number;

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const globe = globeEl.current as any;
                const controls = globe.controls();
                const renderer = globe.renderer();
                const scene = globe.scene();
                const camera = globe.camera();

                // Stop default loop
                renderer.setAnimationLoop(null);

                // Configure Controls
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.3; // Slower for realism
                controls.enableZoom = true;
                controls.dampingFactor = 0.1;

                // Custom Render Loop
                let lastFrameTime = 0;
                const fpsInterval = 1000 / (props.fpsLimit || 60);

                const animate = (time: number) => {
                    animationFrameId = requestAnimationFrame(animate);

                    const delta = time - lastFrameTime;

                    if (delta > fpsInterval) {
                        lastFrameTime = time - (delta % fpsInterval);
                        controls.update();
                        renderer.render(scene, camera);

                        // Check zoom logic
                        const altitude = globe.pointOfView().altitude;
                        if (altitude !== undefined) {
                            if (altitude < 0.5 && viewMode !== 'city') onViewModeChange?.('city');
                            else if (altitude > 0.8 && viewMode !== 'country') onViewModeChange?.('country');
                        }
                    }
                };

                animate(performance.now());

                return () => cancelAnimationFrame(animationFrameId);

            } catch (e) {
                console.warn("Globe control/render error", e);
            }
        }
    }, [viewMode, onViewModeChange, isMounted, props.fpsLimit]);

    // Data Map for O(1) Access
    const countryMap = useMemo(() => {
        const map = new Map<string, LocationData>();
        countries.forEach(c => {
            if (c.iso2) map.set(c.iso2, c);
            map.set(c.name.toLowerCase(), c);
        });
        return map;
    }, [countries]);

    // Max Value for Heatmap Scaling
    const maxVal = useMemo(() => {
        return Math.max(...countries.map(c => c[currentMetric] || 0));
    }, [countries, currentMetric]);

    // Color Interpolator function
    const getPolygonColor = useCallback((d: any) => {
        const iso2 = d.properties.ISO_A2;
        const country = countryMap.get(iso2);

        if (!country) return 'rgba(0,0,0,0)'; // Transparent if no data

        // Check hover state
        if (hoveredPolygon === iso2) return 'rgba(255, 255, 255, 0.3)';

        const val = country[currentMetric] || 0;
        const intensity = Math.min(val / (maxVal * 0.2), 1); // Logarithmic-ish cap at 20% of max to show variety

        // Color Palettes based on Metric
        // Cases: Gold/Orange intensity
        // Deaths: Red intensity
        // Recovered: Green intensity
        // Vaccinated: Blue intensity

        // Base Opacity
        const opacity = 0.1 + (intensity * 0.5); // 0.1 to 0.6 opacity

        switch (currentMetric) {
            case 'deaths':
                return `rgba(220, 38, 38, ${opacity})`;
            case 'recovered':
                return `rgba(16, 185, 129, ${opacity})`;
            case 'vaccinated':
                return `rgba(59, 130, 246, ${opacity})`;
            default: // cases
                return `rgba(245, 158, 11, ${opacity})`;
        }
    }, [countryMap, currentMetric, maxVal, hoveredPolygon]);

    const getTooltip = useCallback((d: object) => {
        // Keep the rich tooltip for hover on points
        const data = d as LocationData;
        if (!data || !data.name) return '';
        return `
          <div class="px-4 py-3 bg-brand-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl font-sans min-w-[200px] z-50">
            <div class="text-sm font-bold text-white mb-2 border-b border-white/10 pb-2 flex justify-between">
                <span>${data.name}</span>
                <span class="text-[10px] text-brand-400 font-normal self-center uppercase">${data.regionType || 'Region'}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
               <span class="text-brand-400">Cases</span> <span class="text-right font-mono text-white">${(data.cases || 0).toLocaleString()}</span>
               <span class="text-brand-400">Deaths</span> <span class="text-right font-mono text-status-critical">${(data.deaths || 0).toLocaleString()}</span>
               <span class="text-brand-400">Recovered</span> <span class="text-right font-mono text-status-recovered">${(data.recovered || 0).toLocaleString()}</span>
               ${data.vaccinated ? `<span class="text-brand-400">Vaccinated</span> <span class="text-right font-mono text-status-active">${data.vaccinated.toLocaleString()}</span>` : ''}
            </div>
          </div>
        `;
    }, []);

    const getHtmlElement = useCallback((d: object) => {
        const data = d as LocationData;
        if (!data) return document.createElement('div');
        const el = document.createElement('div');
        el.style.pointerEvents = 'none';
        el.className = 'transform -translate-x-1/2 -translate-y-1/2 cursor-default';

        // Only show detailed cards for cities when zoomed in
        if (viewMode === 'city') {
            el.innerHTML = `
              <div class="px-2 py-1 bg-black/70 backdrop-blur-sm border border-white/20 rounded flex flex-col items-center shadow-lg">
                 <span class="text-[10px] font-bold text-white whitespace-nowrap mb-0.5">${data.name}</span>
                 <div class="grid grid-cols-2 gap-x-2 text-[8px] leading-tight">
                    <span class="text-status-active">C: ${(data.cases || 0).toLocaleString()}</span>
                    <span class="text-status-critical">D: ${(data.deaths || 0).toLocaleString()}</span>
                 </div>
              </div>
            `;
            return el;
        }

        // Default minimal marker for countries (optional, current rendered via polygon labels usually)
        return el;
    }, [viewMode]);

    if (!isMounted) return null;

    return (
        <GlobeT
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#000000"
            // Realistic Textures
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

            // Atmosphere
            atmosphereColor="#lightskyblue" // Lighter blue for realism
            atmosphereAltitude={0.2}

            // Polygons (Heatmap)
            polygonsData={geoJson?.features || []}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} // Subtle borders
            polygonCapColor={getPolygonColor}
            polygonStrokeColor={() => '#334155'} // Slate-700 borders, very subtle
            polygonAltitude={0.01} // Slightly raised surface
            polygonLabel={({ properties: d }: any) => {
                const c = countryMap.get(d.ISO_A2);
                return c ? `<div class="px-2 py-1 bg-black/80 text-white text-xs rounded border border-white/10">${c.name}: ${c[currentMetric]?.toLocaleString()}</div>` : d.ADMIN;
            }}
            onPolygonHover={(d: any) => setHoveredPolygon(d ? d.properties.ISO_A2 : null)}
            onPolygonClick={(d: any) => {
                const c = countryMap.get(d.properties.ISO_A2);
                if (c) onPlotClick?.(c);
            }}

            // Cities (Points) - Only show if zoomed in
            pointsData={viewMode === 'city' ? cities : []}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => '#FFFFFF'}
            pointAltitude={0.02} // Lower altitude closer to surface
            pointRadius={0.15} // Slightly visible dots
            pointLabel={getTooltip} // Use tooltip for cities too

            // HTML Elements (Labels)
            htmlElementsData={viewMode === 'city' ? cities : []}
            htmlLat="lat"
            htmlLng="lng"
            htmlElement={getHtmlElement}
            htmlAltitude={0.03} // Just above points
        />
    );
};

const GlobeMemo = React.memo(Globe);
export default GlobeMemo;
