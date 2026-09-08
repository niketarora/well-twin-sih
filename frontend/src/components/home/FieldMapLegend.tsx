import React, { useState } from 'react';
import { Info, Compass, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { MapLayerType } from '../../types/field';

interface FieldMapLegendProps {
  activeLayer: MapLayerType;
}

export const FieldMapLegend: React.FC<FieldMapLegendProps> = ({ activeLayer }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const layerDescriptions: Record<MapLayerType, string> = {
    health: 'Color intensity reflects composite multi-physics Twin Health score (0 - 100%).',
    production: 'Marker size & halo scale with instantaneous gross oil extraction rate (BOPD).',
    temperature: 'Marker thermal gradient represents downhole sandface bottom-hole temperature (BHT).',
    fillage: 'Indicates downhole Sucker Rod Pump (SRP) barrel liquid fillage efficiency.',
    cssCycle: 'Categorizes current Cyclic Steam Stimulation (CSS) operational cycle count and phase.',
  };

  // Collapsed Minimal HUD Pill
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setIsCollapsed(false)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-md border border-border text-ink hover:bg-surface text-xs shadow-md transition-all group"
        title="Expand Map Legend"
      >
        <Compass className="w-3.5 h-3.5 text-petroleum dark:text-cyan-400" />
        <span className="font-mono text-[10.5px] font-semibold text-ink-secondary">N 27°32' · E 72°09'</span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-ink">
          <Layers className="w-3 h-3 text-petroleum dark:text-cyan-400" />
          <span>Legend</span>
        </span>
        <ChevronUp className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink transition-colors" />
      </button>
    );
  }

  // Expanded Professional Engineering Legend
  return (
    <div className="bg-surface/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg space-y-2 w-72 transition-all animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Header with Integrated Compass Coordinates & Collapse Toggle */}
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-petroleum dark:text-cyan-400" />
          <span className="font-heading font-semibold text-ink text-[11px] uppercase tracking-wider">
            Map Legend
          </span>
          <span className="text-[10px] text-ink-muted capitalize">· {activeLayer}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9.5px] font-mono text-ink-muted bg-surface-secondary px-1.5 py-0.5 rounded border border-border/50">
            <Compass className="w-2.5 h-2.5 text-petroleum dark:text-cyan-400" />
            <span>N 27°32'</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors"
            title="Collapse Legend"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Semantic Marker Status List */}
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10.5px]">
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
      <div className="flex items-start gap-1.5 pt-1.5 text-[10px] text-ink-muted leading-tight border-t border-border/40">
        <Info className="w-3 h-3 text-petroleum dark:text-cyan-400 shrink-0 mt-0.5" />
        <span>{layerDescriptions[activeLayer]}</span>
      </div>
    </div>
  );
};
