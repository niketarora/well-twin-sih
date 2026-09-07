import React from 'react';
import { X, ArrowRight, AlertTriangle, Flame, Activity, Droplets, Thermometer, Gauge } from 'lucide-react';
import { FieldWell } from '../../types/field';

interface WellPopupProps {
  well: FieldWell;
  onClose: () => void;
  onOpenWell: (well: FieldWell) => void;
}

export const WellPopup: React.FC<WellPopupProps> = ({ well, onClose, onOpenWell }) => {
  const getStatusBadge = () => {
    switch (well.status) {
      case 'Optimal':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Attention Required':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Critical':
        return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
      case 'CSS-Active':
        return 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30';
      case 'Shut-In':
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30';
      default:
        return 'bg-surface-secondary text-ink-muted border-border';
    }
  };

  return (
    <div className="w-72 bg-surface/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="p-3 bg-surface-secondary/70 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-ink tracking-tight">{well.code}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge()}`}>
              {well.status}
            </span>
          </div>
          <p className="text-[11px] text-ink-muted mt-0.5">
            {well.pad} · {well.sector}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-border/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body: Telemetry Snapshot */}
      <div className="p-3 space-y-2.5 text-xs">
        <div className="grid grid-cols-2 gap-2">
          {/* Oil Rate */}
          <div className="p-2 rounded-lg bg-surface-secondary/60 border border-border/70">
            <div className="flex items-center gap-1 text-[10px] text-ink-muted font-medium">
              <Droplets className="w-3 h-3 text-petroleum dark:text-cyan-400" />
              <span>Oil Rate</span>
            </div>
            <div className="text-sm font-bold text-ink mt-0.5">
              {well.oilRateBopd} <span className="text-[10px] font-normal text-ink-muted">BOPD</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-2 rounded-lg bg-surface-secondary/60 border border-border/70">
            <div className="flex items-center gap-1 text-[10px] text-ink-muted font-medium">
              <Thermometer className="w-3 h-3 text-amber-500" />
              <span>BHT</span>
            </div>
            <div className="text-sm font-bold text-ink mt-0.5">
              {well.bottomHoleTempC} <span className="text-[10px] font-normal text-ink-muted">°C</span>
            </div>
          </div>

          {/* SRP Fillage */}
          <div className="p-2 rounded-lg bg-surface-secondary/60 border border-border/70">
            <div className="flex items-center gap-1 text-[10px] text-ink-muted font-medium">
              <Gauge className="w-3 h-3 text-emerald-500" />
              <span>SRP Fillage</span>
            </div>
            <div className="text-sm font-bold text-ink mt-0.5">
              {well.srpFillagePct}%
            </div>
          </div>

          {/* CSS Cycle */}
          <div className="p-2 rounded-lg bg-surface-secondary/60 border border-border/70">
            <div className="flex items-center gap-1 text-[10px] text-ink-muted font-medium">
              <Flame className="w-3 h-3 text-sky-500" />
              <span>CSS Cycle</span>
            </div>
            <div className="text-sm font-bold text-ink mt-0.5">
              #{well.cycle} <span className="text-[10px] font-normal text-ink-muted">(Day {well.dayInCycle})</span>
            </div>
          </div>
        </div>

        {/* Health Progress Bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-ink-muted flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3 text-petroleum dark:text-cyan-400" />
              <span>Twin Health Score</span>
            </span>
            <span className="font-bold text-ink">{well.healthScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden border border-border/50">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                well.healthScore > 80
                  ? 'bg-emerald-500'
                  : well.healthScore > 55
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${well.healthScore}%` }}
            />
          </div>
        </div>

        {/* Active Alert Note */}
        {well.activeAlertsCount > 0 && well.topAlert && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-tight">{well.topAlert}</span>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-2.5 bg-surface-secondary/70 border-t border-border">
        <button
          type="button"
          onClick={() => onOpenWell(well)}
          className="w-full h-8 px-3 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Open Well Overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
