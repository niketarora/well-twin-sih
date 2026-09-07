import React from 'react';
import { Search, X, Layers, Filter } from 'lucide-react';
import { MapLayerType, WellStatusFilter, FieldWell } from '../../types/field';

interface WellFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: WellStatusFilter;
  onStatusFilterChange: (status: WellStatusFilter) => void;
  activeLayer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
  wells: FieldWell[];
}

export const WellFilters: React.FC<WellFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  activeLayer,
  onLayerChange,
  wells,
}) => {
  // Compute counts for filter pills
  const counts = {
    all: wells.length,
    producing: wells.filter(w => w.status === 'Optimal').length,
    attention: wells.filter(w => w.status === 'Attention Required').length,
    critical: wells.filter(w => w.status === 'Critical').length,
    css: wells.filter(w => w.status === 'CSS-Active').length,
    shutin: wells.filter(w => w.status === 'Shut-In').length,
  };

  const statusOptions: { id: WellStatusFilter; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All Wells', count: counts.all },
    { id: 'producing', label: 'Producing', count: counts.producing, color: 'text-emerald-700 dark:text-emerald-400' },
    { id: 'attention', label: 'Attention', count: counts.attention, color: 'text-amber-700 dark:text-amber-400' },
    { id: 'critical', label: 'Critical', count: counts.critical, color: 'text-red-700 dark:text-red-400' },
    { id: 'css', label: 'CSS Active', count: counts.css, color: 'text-sky-700 dark:text-sky-400' },
    { id: 'shutin', label: 'Shut-In', count: counts.shutin, color: 'text-ink-muted' },
  ];

  const layerOptions: { id: MapLayerType; label: string }[] = [
    { id: 'health', label: 'Well Health' },
    { id: 'production', label: 'Production (BOPD)' },
    { id: 'temperature', label: 'Temperature (BHT)' },
    { id: 'fillage', label: 'SRP Fillage' },
    { id: 'cssCycle', label: 'CSS Cycle' },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle space-y-3.5">
      {/* Search and Status Pills Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search well ID, pad or sector (e.g. BW-17, Pad 03)..."
            className="w-full h-9 pl-9 pr-8 bg-surface-secondary border border-border rounded-lg text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-petroleum transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[11px] font-medium text-ink-muted flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {statusOptions.map((opt) => {
            const active = statusFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onStatusFilterChange(opt.id)}
                className={`h-7 px-2.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  active
                    ? 'bg-petroleum text-white shadow-sm'
                    : 'bg-surface-secondary hover:bg-border/60 text-ink border border-border/80'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-surface text-ink-muted border border-border/60'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Layer Switcher Row */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60 flex-wrap">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-petroleum dark:text-cyan-400" />
          <span className="text-xs font-semibold text-ink">Map Layer Visualization:</span>
        </div>

        <div className="flex items-center gap-1 bg-surface-secondary p-0.5 rounded-lg border border-border/70 flex-wrap">
          {layerOptions.map((layer) => {
            const active = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => onLayerChange(layer.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  active
                    ? 'bg-surface text-petroleum dark:text-cyan-400 font-semibold shadow-xs border border-border/60'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {layer.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
