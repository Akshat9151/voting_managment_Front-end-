import React, { useState } from 'react';
import { MAP_LOCATIONS } from '../../services/mockData';
import { MapPin, AlertTriangle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { MapBooth } from '../../types';

export const InteractiveBoothMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('rampur');
  const [selectedBooth, setSelectedBooth] = useState<MapBooth | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const loc = MAP_LOCATIONS[selectedLocation] || MAP_LOCATIONS.rampur;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.7));
  const handleReset = () => { setZoom(1); setSelectedBooth(null); };

  return (
    <div className="space-y-4">
      {/* Header Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-700">Area:</span>
          <select
            value={selectedLocation}
            onChange={(e) => { setSelectedLocation(e.target.value); setSelectedBooth(null); }}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="rampur">Gram Panchayat Rampur (Jaipur Rural)</option>
            <option value="shivaji">Ward 12 – Shivaji Nagar</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shadow-xs cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shadow-xs cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shadow-xs cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Reset Map"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Area */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
        {/* Radar Background Grid & Circles */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Concentric Radar Rings */}
          <div className="absolute w-[500px] h-[500px] border border-sky-500/10 rounded-full" />
          <div className="absolute w-[360px] h-[360px] border border-sky-500/20 rounded-full" />
          <div className="absolute w-[220px] h-[220px] border border-sky-500/30 rounded-full" />
          <div className="absolute w-full h-[1px] bg-sky-500/15" />
          <div className="absolute h-full w-[1px] bg-sky-500/15" />

          {/* Booth Markers */}
          {loc.booths.map((b) => {
            const isSelected = selectedBooth?.id === b.id;
            const isSensitive = b.sensitive === 'Sensitive';

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBooth(b)}
                style={{ left: `${(b.x / 600) * 100}%`, top: `${(b.y / 450) * 100}%` }}
                className={clsx(
                  'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-200 z-10',
                  isSelected && 'scale-125 z-20'
                )}
              >
                {/* Pulsing halo */}
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform',
                    isSensitive
                      ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 animate-pulse'
                      : 'bg-sky-500 text-white ring-4 ring-sky-500/30'
                  )}
                >
                  B{b.id}
                </div>

                {/* Hover / Active Badge */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-bold px-2 py-1 rounded-md border border-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {b.name} ({b.turnout})
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="font-bold text-white text-xs">{loc.name}</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> Normal Booths ({loc.totalBooths - (loc.sensitiveBooths.includes('1') ? 1 : 0)})
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Sensitive ({loc.sensitiveBooths})
          </div>
        </div>
      </div>

      {/* Selected Booth Detail Card */}
      {selectedBooth && (
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold bg-sky-600 text-white px-2 py-0.5 rounded-md">
                Booth {selectedBooth.id}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{selectedBooth.name}</h4>
              {selectedBooth.sensitive === 'Sensitive' && (
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Alert
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Incharge: <strong>{selectedBooth.incharge}</strong> • Registered Voters: <strong>{selectedBooth.voters}</strong> • Turnout Target: <strong>{selectedBooth.turnout}</strong>
            </div>
          </div>
          <button
            onClick={() => setSelectedBooth(null)}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 underline cursor-pointer"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};
