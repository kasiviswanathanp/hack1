import React, { useState } from 'react';
import { ComplaintCluster } from '@/types';
import { cn } from '@/utils';
import { MapPin, Layers, Navigation, ZoomIn, ZoomOut, CheckCircle2, AlertCircle } from 'lucide-react';

export interface HotspotMapProps {
  clusters: ComplaintCluster[];
  selectedCluster: ComplaintCluster | null;
  onSelectCluster: (cluster: ComplaintCluster) => void;
  className?: string;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  clusters,
  selectedCluster,
  onSelectCluster,
  className,
}) => {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'heatmap'>('heatmap');

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          fill: '#ef4444',
          ring: 'rgba(239, 68, 68, 0.4)',
          badge: 'bg-rose-500 text-white',
          border: 'border-rose-300',
        };
      case 'MEDIUM':
        return {
          fill: '#f59e0b',
          ring: 'rgba(245, 158, 11, 0.4)',
          badge: 'bg-amber-500 text-white',
          border: 'border-amber-300',
        };
      default:
        return {
          fill: '#10b981',
          ring: 'rgba(16, 185, 129, 0.4)',
          badge: 'bg-emerald-500 text-white',
          border: 'border-emerald-300',
        };
    }
  };

  return (
    <div className={cn('relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md', className)}>
      {/* Map Header / Layer Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white text-xs font-medium shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">Civic Live Heatmap</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">{clusters.length} Active Wards Monitored</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Layer switcher */}
          <div className="flex bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
            {(['heatmap', 'standard', 'satellite'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer',
                  mapType === type
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Vector Map Surface */}
      <div className="relative w-full h-[450px] md:h-[520px] overflow-hidden select-none bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Background Grid Lines representing street layout */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            {/* Radial glow filter for high severity nodes */}
            <radialGradient id="redGlow">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="amberGlow">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Stylized Chennai Coastline & River Channels (Cooum & Adyar rivers) */}
          <path
            d="M 850 0 C 820 180 840 320 880 600"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="8"
            strokeOpacity="0.3"
          />
          <path
            d="M 50 240 Q 400 260 850 230"
            fill="none"
            stroke="#0284c7"
            strokeWidth="5"
            strokeOpacity="0.25"
          />
          <path
            d="M 50 420 Q 450 430 870 410"
            fill="none"
            stroke="#0284c7"
            strokeWidth="6"
            strokeOpacity="0.25"
          />

          {/* Arterial Roads */}
          <path d="M 100 80 L 800 520" stroke="#334155" strokeWidth="3" strokeDasharray="4 2" />
          <path d="M 200 550 L 750 80" stroke="#334155" strokeWidth="3" strokeDasharray="4 2" />
          <circle cx="500" cy="300" r="180" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="6 3" />

          {/* Render Hotspot Clusters */}
          {clusters.map((cluster, i) => {
            // Coordinate mapping to SVG canvas
            const positions = [
              { x: 340, y: 190 }, // Anna Nagar
              { x: 490, y: 280 }, // T. Nagar
              { x: 620, y: 410 }, // Adyar
              { x: 420, y: 460 }, // Velachery
              { x: 680, y: 320 }, // Mylapore
              { x: 410, y: 160 }, // Kilpauk
            ];
            const pos = positions[i % positions.length];
            const colors = getSeverityColor(cluster.severityLevel);
            const isSelected = selectedCluster?.id === cluster.id;

            return (
              <g
                key={cluster.id}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectCluster(cluster)}
              >
                {/* Heatmap blur radius */}
                {mapType === 'heatmap' && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={cluster.totalCount * 1.5}
                    fill={cluster.severityLevel === 'HIGH' ? 'url(#redGlow)' : 'url(#amberGlow)'}
                    className="animate-pulse"
                  />
                )}

                {/* Outer ripple ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 32 : 24}
                  fill={colors.ring}
                  className={isSelected ? 'animate-ping' : ''}
                />

                {/* Inner marker node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 16 : 12}
                  fill={colors.fill}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 3 : 2}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                />

                {/* Cluster Count Label */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {cluster.totalCount}
                </text>

                {/* Area Tag */}
                <text
                  x={pos.x}
                  y={pos.y - (isSelected ? 26 : 20)}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize={isSelected ? '12' : '10'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="bg-black/80 px-2 py-0.5 rounded shadow-sm"
                  pointerEvents="none"
                >
                  {cluster.areaName}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-white">
          <span className="font-semibold text-slate-400">Concentration:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span>High (&gt;35)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span>Medium (20-35)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Low (&lt;20)</span>
          </span>
        </div>
      </div>

      {/* Selected Hotspot Intelligence Panel (Section 14 requirements) */}
      {selectedCluster && (
        <div className="p-5 bg-white border-t border-slate-200 text-left">
          <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Civic Cluster Intelligence
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                    selectedCluster.severityLevel === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedCluster.severityLevel === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  )}
                >
                  {selectedCluster.severityLevel} Priority Area
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>AREA: {selectedCluster.areaName}</span>
                <span className="text-xs font-normal text-slate-500 font-mono">
                  ({selectedCluster.ward})
                </span>
              </h3>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{selectedCluster.totalCount}</span>
              <span className="text-xs text-slate-500 block">Total Reported</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
              <span className="text-[11px] text-slate-500 block uppercase font-semibold">
                Open Grievances
              </span>
              <span className="text-lg font-bold text-amber-700">{selectedCluster.openCount}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
              <span className="text-[11px] text-slate-500 block uppercase font-semibold">
                Resolved Issues
              </span>
              <span className="text-lg font-bold text-emerald-700">{selectedCluster.resolvedCount}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
              <span className="text-[11px] text-slate-500 block uppercase font-semibold">
                Avg Response Time
              </span>
              <span className="text-lg font-bold text-blue-700">
                {selectedCluster.averageResponseTimeHours} hrs
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
              <span className="text-[11px] text-slate-500 block uppercase font-semibold">
                Top Issue Category
              </span>
              <span className="text-lg font-bold text-slate-900 truncate block">
                {selectedCluster.topCategory}
              </span>
            </div>
          </div>

          {/* Category Breakdown list (Road Damage: 42, Water Leakage: 11, Drainage: 8...) */}
          <div>
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Category Incident Breakdown
            </h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedCluster.categoryBreakdown).map(([cat, count]) => (
                <div
                  key={cat}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs"
                >
                  <span className="font-medium text-slate-700">{cat}:</span>
                  <span className="font-bold text-blue-600 font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
