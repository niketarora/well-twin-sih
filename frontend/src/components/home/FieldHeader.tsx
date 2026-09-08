import React from 'react';
import { Layers, Activity, Droplets, AlertTriangle, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';
import { FieldSummary } from '../../types/field';

interface FieldHeaderProps {
  summary: FieldSummary;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const FieldHeader: React.FC<FieldHeaderProps> = ({ summary, onRefresh, isRefreshing }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-petroleum/10 text-petroleum dark:bg-petroleum/20 dark:text-cyan-400 border border-petroleum/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Asset ID: {summary.fieldCode}</span>
            </span>
            <span className="text-xs font-medium text-ink-muted">
              {summary.basin} · {summary.formation}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight mt-1 flex items-center gap-3">
            BAGHEWALA FIELD
            <span className="text-sm font-normal text-ink-muted">
              Rajasthan · Heavy Oil · CSS + SRP
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 px-3 rounded-lg border border-border bg-surface-secondary hover:bg-surface text-ink text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Refresh field surveillance data"
          >
            <Clock className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Updated {summary.lastUpdated}</span>
          </button>
        </div>
      </div>

      {/* Field Level KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Total Wells */}
        <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border/80 flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">Total Wells</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-ink">{summary.totalWells}</span>
            <span className="text-[10px] text-ink-muted">slots</span>
          </div>
        </div>

        {/* Producing Wells */}
        <div className="p-2.5 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Producing</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{summary.producingWells}</span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">active</span>
          </div>
        </div>

        {/* Attention Wells */}
        <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">Attention</span>
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{summary.attentionWells}</span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">degraded</span>
          </div>
        </div>

        {/* Critical Wells */}
        <div className="p-2.5 rounded-lg bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-red-700 dark:text-red-400">Critical</span>
            <ShieldAlert className="w-3 h-3 text-red-600 dark:text-red-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-red-700 dark:text-red-400">{summary.criticalWells}</span>
            <span className="text-[10px] text-red-600/80 dark:text-red-400/80">urgent</span>
          </div>
        </div>

        {/* Total Production BOPD */}
        <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border/80 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">Field Output</span>
            <Droplets className="w-3 h-3 text-petroleum dark:text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-ink">{summary.totalProductionBopd}</span>
            <span className="text-[10px] text-ink-muted">BOPD</span>
          </div>
        </div>

        {/* Avg Health & BHT */}
        <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border/80 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">Avg Health</span>
            <Activity className="w-3 h-3 text-petroleum dark:text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-ink">{summary.fieldAvgHealthScore}%</span>
            <span className="text-[10px] text-ink-muted">{summary.fieldAvgBhtC}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
