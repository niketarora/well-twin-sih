import React from 'react';
import { WellComparisonItem } from '../types/ai';
import { ExternalLink, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComparisonTableProps {
  comparison: WellComparisonItem[];
  onSelectWell?: (wellId: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparison, onSelectWell }) => {
  const navigate = useNavigate();

  if (!comparison || comparison.length === 0) return null;

  const handleInspect = (wellId: string) => {
    if (onSelectWell) {
      onSelectWell(wellId);
    } else {
      navigate(`/well/${wellId}/overview`);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('crit')) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-status-crit border border-status-crit/25">
          <AlertCircle className="w-2.5 h-2.5" />
          Critical
        </span>
      );
    }
    if (s.includes('warn') || s.includes('attent')) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-status-warn border border-status-warn/25">
          <AlertTriangle className="w-2.5 h-2.5" />
          Attention
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-status-green border border-status-green/25">
        <CheckCircle className="w-2.5 h-2.5" />
        Optimal
      </span>
    );
  };

  return (
    <div className="mt-2.5 rounded-lg border border-border bg-surface-secondary/40 overflow-hidden text-xs">
      <div className="px-3 py-2 bg-surface border-b border-border flex items-center justify-between">
        <span className="font-heading font-semibold text-[11px] uppercase tracking-wider text-ink">
          Multi-Well Surveillance Comparison
        </span>
        <span className="text-[10px] text-ink-muted font-mono">{comparison.length} Wells Evaluated</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/70 text-[10px] uppercase font-semibold text-ink-muted">
              <th className="py-2 px-2.5">Well</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2 text-right">Oil (BOPD)</th>
              <th className="py-2 px-2 text-right">WC (%)</th>
              <th className="py-2 px-2 text-right">BHT (°C)</th>
              <th className="py-2 px-2 text-right">Fillage (%)</th>
              <th className="py-2 px-2 text-right">Health</th>
              <th className="py-2 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono text-[11px]">
            {comparison.map((well) => (
              <tr key={well.wellId} className="hover:bg-surface/60 transition-colors">
                <td className="py-2 px-2.5 font-bold text-ink whitespace-nowrap">
                  {well.wellCode}
                </td>
                <td className="py-2 px-2 whitespace-nowrap">
                  {getStatusBadge(well.status)}
                </td>
                <td className="py-2 px-2 text-right font-semibold text-ink whitespace-nowrap">
                  {well.oilRateBopd.toFixed(1)}
                </td>
                <td className="py-2 px-2 text-right text-ink-secondary whitespace-nowrap">
                  {well.waterCutPct.toFixed(1)}%
                </td>
                <td className="py-2 px-2 text-right text-ink-secondary whitespace-nowrap">
                  {well.bhtC.toFixed(0)}°C
                </td>
                <td
                  className={`py-2 px-2 text-right font-semibold whitespace-nowrap ${
                    well.fillagePct < 70
                      ? 'text-status-crit'
                      : well.fillagePct < 85
                      ? 'text-status-warn'
                      : 'text-status-green'
                  }`}
                >
                  {well.fillagePct.toFixed(1)}%
                </td>
                <td
                  className={`py-2 px-2 text-right font-bold whitespace-nowrap ${
                    well.healthScore < 50
                      ? 'text-status-crit'
                      : well.healthScore < 75
                      ? 'text-status-warn'
                      : 'text-status-green'
                  }`}
                >
                  {well.healthScore}%
                </td>
                <td className="py-2 px-2 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleInspect(well.wellId)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-petroleum/10 hover:bg-petroleum/20 text-petroleum dark:text-cyan-400 text-[10px] font-semibold transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dominant Concerns Summary Footer */}
      <div className="p-2.5 border-t border-border bg-surface text-[10.5px] space-y-1">
        {comparison.map(
          (well) =>
            well.dominantConcern && (
              <div key={`concern-${well.wellId}`} className="flex items-center gap-1.5 text-ink-secondary">
                <span className="font-bold text-ink font-mono">{well.wellCode}:</span>
                <span>{well.dominantConcern}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
};
