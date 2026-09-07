import React from 'react';
import { Info } from 'lucide-react';
import { MapLayerType } from '../../types/field';

interface FieldMapLegendProps {
  activeLayer: MapLayerType;
}

export const FieldMapLegend: React.FC<FieldMapLegendProps> = ({ activeLayer }) => {
  const layerDescriptions: Record<MapLayerType, string> = {
    health: 'Color intensity reflects composite multi-physics Twin Health score (0 - 100%).',
    production: 'Marker size & halo scale with instantaneous gross oil extraction rate (BOPD).',
    temperature: 'Marker thermal gradient represents downhole sandface bottom-hole temperature (BHT).',
    fillage: 'Indicates downhole Sucker Rod Pump (SRP) barrel liquid fillage efficiency.',
    cssCycle: 'Categorizes current Cyclic Steam Stimulation (CSS) operational cycle count and phase.',
  };

  return (
    <div className="bg-surface/95 backdrop-blur-md border border-border rounded-lg p-2.5 shadow-sm space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between border-b border-border/50 pb-1">
        <span className="font-semibold text-ink text-[10px] uppercase tracking-wider">Map Legend</span>
        <span className="text-[9.5px] text-ink-muted capitalize">Layer: {activeLayer}</span>
      </div>

      {/* Semantic Marker Status List */}
      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-600 ring-1 ring-emerald-500/20 shrink-0" />
          <span className="text-ink truncate">Producing / Optimal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 border border-amber-600 ring-1 ring-amber-500/20 shrink-0" />
          <span className="text-ink truncate">Attention Required</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 border border-red-600 ring-1 ring-red-500/20 shrink-0" />
          <span className="text-ink truncate">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 border border-sky-600 ring-1 ring-sky-500/20 shrink-0" />
          <span className="text-ink truncate">CSS Active (Steam)</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <span className="w-2 h-2 rounded-full bg-slate-400 border border-slate-500 ring-1 ring-slate-400/20 shrink-0" />
          <span className="text-ink truncate">Shut-In / Workover</span>
        </div>
      </div>

      {/* Active Layer Context Hint */}
      <div className="flex items-start gap-1 pt-1 text-[9.5px] text-ink-muted leading-tight border-t border-border/40">
        <Info className="w-3 h-3 text-petroleum dark:text-cyan-400 shrink-0 mt-0.5" />
        <span>{layerDescriptions[activeLayer]}</span>
      </div>
    </div>
  );
};
