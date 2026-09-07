import React from 'react';
import { ArrowRight, Droplets, Thermometer, Gauge, Flame, Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FieldWell } from '../../types/field';

interface WellListProps {
  wells: FieldWell[];
  selectedWellId: string | null;
  onSelectWell: (wellId: string) => void;
  onOpenWell: (well: FieldWell) => void;
}

export const WellList: React.FC<WellListProps> = ({
  wells,
  selectedWellId,
  onSelectWell,
  onOpenWell,
}) => {
  if (wells.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center space-y-2">
        <p className="text-sm font-semibold text-ink">No wells match the current filter criteria.</p>
        <p className="text-xs text-ink-muted">Try clearing the search query or selecting a different status filter.</p>
      </div>
    );
  }

  const getStatusBadge = (status: FieldWell['status']) => {
    switch (status) {
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Baghewala Well Inventory ({wells.length} Wells Active)
        </h2>
        <span className="text-[11px] text-ink-muted">
          Click row to locate on map · Click Open to view workstation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {wells.map((well) => {
          const isSelected = selectedWellId === well.id;
          return (
            <div
              key={well.id}
              onClick={() => onSelectWell(well.id)}
              className={`group bg-surface rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden p-3.5 space-y-3 shadow-subtle hover:shadow-md ${
                isSelected
                  ? 'border-petroleum dark:border-cyan-400 ring-2 ring-petroleum/20'
                  : 'border-border hover:border-petroleum/50'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-ink group-hover:text-petroleum dark:group-hover:text-cyan-400 transition-colors">
                      {well.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(well.status)}`}>
                      {well.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {well.pad} · {well.sector}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWell(well);
                  }}
                  className="h-7 px-2.5 rounded-md bg-petroleum/10 hover:bg-petroleum hover:text-white text-petroleum dark:bg-petroleum/20 dark:text-cyan-400 dark:hover:bg-petroleum text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Status reason snippet */}
              {well.statusReason && (
                <p className="text-[11px] text-ink-muted line-clamp-2 leading-relaxed bg-surface-secondary/50 p-2 rounded-lg border border-border/50">
                  {well.statusReason}
                </p>
              )}

              {/* Telemetry Metric Badges */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                <div className="p-1.5 rounded-md bg-surface-secondary/70 border border-border/60">
                  <span className="text-[9.5px] uppercase font-medium text-ink-muted block">Oil</span>
                  <span className="text-xs font-bold text-ink block mt-0.5">{well.oilRateBopd}</span>
                  <span className="text-[9px] text-ink-muted">BOPD</span>
                </div>
                <div className="p-1.5 rounded-md bg-surface-secondary/70 border border-border/60">
                  <span className="text-[9.5px] uppercase font-medium text-ink-muted block">BHT</span>
                  <span className="text-xs font-bold text-ink block mt-0.5">{well.bottomHoleTempC}</span>
                  <span className="text-[9px] text-ink-muted">°C</span>
                </div>
                <div className="p-1.5 rounded-md bg-surface-secondary/70 border border-border/60">
                  <span className="text-[9.5px] uppercase font-medium text-ink-muted block">Fillage</span>
                  <span className="text-xs font-bold text-ink block mt-0.5">{well.srpFillagePct}</span>
                  <span className="text-[9px] text-ink-muted">%</span>
                </div>
                <div className="p-1.5 rounded-md bg-surface-secondary/70 border border-border/60">
                  <span className="text-[9.5px] uppercase font-medium text-ink-muted block">CSS</span>
                  <span className="text-xs font-bold text-ink block mt-0.5">#{well.cycle}</span>
                  <span className="text-[9px] text-ink-muted">Day {well.dayInCycle}</span>
                </div>
              </div>

              {/* Twin Health Score Strip */}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-xs">
                  <Activity className="w-3.5 h-3.5 text-petroleum dark:text-cyan-400" />
                  <span className="text-ink-muted font-medium">Twin Health:</span>
                  <span className="font-bold text-ink">{well.healthScore}%</span>
                </div>

                <div className="flex-1 max-w-[120px] h-1.5 bg-surface-secondary rounded-full overflow-hidden border border-border/40">
                  <div
                    className={`h-full rounded-full ${
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
