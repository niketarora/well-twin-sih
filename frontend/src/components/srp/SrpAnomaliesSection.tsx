import React, { useEffect, useState } from 'react';
import { Cpu, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Activity, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge';
import { FieldSrpCondition, SRPPredictionHistory, srpApi } from '../../services/srpApi';

export const SrpAnomaliesSection: React.FC = () => {
  const navigate = useNavigate();
  const [fieldWells, setFieldWells] = useState<FieldSrpCondition[]>([]);
  const [history, setHistory] = useState<SRPPredictionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([srpApi.getFieldConditions(), srpApi.getHistory('well-bw-017')])
      .then(([wells, hist]) => {
        setFieldWells(wells);
        setHistory(hist);
      })
      .finally(() => setLoading(false));
  }, []);

  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'CRITICAL':
        return {
          color: 'text-status-crit',
          bg: 'bg-red-500/10',
          border: 'border-status-crit/30',
          dot: 'bg-status-crit',
        };
      case 'WARNING':
        return {
          color: 'text-status-warn',
          bg: 'bg-amber-500/10',
          border: 'border-status-warn/30',
          dot: 'bg-status-warn',
        };
      default:
        return {
          color: 'text-status-green',
          bg: 'bg-emerald-500/10',
          border: 'border-status-green/30',
          dot: 'bg-status-green',
        };
    }
  };

  return (
    <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-petroleum/10 border border-petroleum/20 flex items-center justify-center text-petroleum dark:text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-semibold text-ink">
                SRP Autoencoder Field Surveillance &amp; Trend Logs
              </h3>
              <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Multi-well autoencoder kinematic reconstruction tracking across Baghewala heavy oil reservoir
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-secondary text-ink border border-border self-start sm:self-auto">
          Model: <strong>srp-autoencoder-v1</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Field-Wide Wells Status Table */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Active Well Autoencoder Matrix
            </span>
            <span className="text-[11px] font-mono text-ink-muted">
              Thresholds: Warn 0.001276 · Crit 0.007778
            </span>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-secondary text-ink-secondary font-semibold text-[10.5px] uppercase tracking-wider border-b border-border">
                  <th className="py-2.5 px-3">Well Code</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3 font-mono text-right">MSE Score</th>
                  <th className="py-2.5 px-3">Diagnostic Classification</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {fieldWells.map((w) => {
                  const style = getConditionStyle(w.condition);
                  return (
                    <tr
                      key={w.well_id}
                      className={`hover:bg-canvas-subtle transition-colors ${
                        w.condition === 'CRITICAL' ? 'bg-status-crit-bg/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-ink flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span>{w.well_code}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded border ${style.bg} ${style.color} ${style.border}`}
                        >
                          {w.condition}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right font-semibold text-ink">
                        {w.anomaly_score.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-3 text-ink-secondary font-medium truncate max-w-[200px]">
                        {w.status_label}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/well/${w.well_id}/srp-pump`)}
                          className="text-petroleum hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: BW-017 Inference Progression Timeline */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              BW-017 Anomaly Score Progression
            </span>
            <span className="text-[11px] font-mono text-status-crit font-semibold">
              Fluid Pound Inception
            </span>
          </div>

          <div className="border border-border rounded-xl p-3 bg-surface-secondary/40 space-y-2.5">
            {history.slice(0, 5).map((item, idx) => {
              const style = getConditionStyle(item.condition);
              const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border-subtle text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                    <span className="font-mono text-ink-muted">{dateStr}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${style.bg} ${style.color} ${style.border}`}
                    >
                      {item.condition}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-ink-muted font-mono">
                      Fillage: <strong className="text-ink">{item.pump_fillage}%</strong>
                    </span>
                    <span className="font-mono font-bold text-ink">
                      Score: {item.anomaly_score.toFixed(6)}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-[11px] text-ink-muted">
                Divergence accelerated over last 48 hours
              </span>
              <button
                type="button"
                onClick={() => navigate('/well/well-bw-017/srp-pump')}
                className="text-petroleum hover:underline font-semibold text-xs flex items-center gap-1"
              >
                <span>View Full Dyno Card</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
