import React, { useState } from 'react';
import { Radar, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { mockAnomalies } from '../mock/anomalies';

export const AnomaliesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAnomaly, setSelectedAnomaly] = useState(mockAnomalies[0]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Subsurface Anomalies & Drift Detection"
        subtitle="Unsupervised multivariate EWMA and rolling z-score residuals flagging deviations from the physics-informed baseline."
        badge="3 Anomalies Flagged"
        badgeType="red"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Anomalies Master List */}
        <div className="lg:col-span-5 space-y-3">
          {mockAnomalies.map((anom) => {
            const isSelected = selectedAnomaly.id === anom.id;
            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-subtle ${
                  isSelected
                    ? 'bg-surface border-petroleum ring-1 ring-petroleum'
                    : 'bg-surface hover:bg-surface-secondary border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink-muted">
                    {anom.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-status-crit">
                      Score: {anom.score} / 100
                    </span>
                    <SeverityBadge severity={anom.severity} />
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-sm text-ink mt-2">
                  {anom.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-ink-muted mt-2 pt-2 border-t border-border-subtle">
                  <span>Metric: {anom.affectedMetric}</span>
                  <span className="font-mono">{anom.timeWindow}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Anomaly Deep-Dive Inspector */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-ink-muted">
                  {selectedAnomaly.id} · Anomaly Inspector
                </span>
                <h2 className="font-heading text-lg font-semibold text-ink mt-0.5">
                  {selectedAnomaly.title}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-ink-muted uppercase block">Anomaly Severity Score</span>
                <span className="font-mono text-2xl font-bold text-status-crit">
                  {selectedAnomaly.score} <span className="text-xs text-ink-muted">/ 100</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle">
                <span className="text-[10px] text-ink-muted uppercase block">Affected Parameter</span>
                <span className="font-semibold text-ink mt-0.5 block">{selectedAnomaly.affectedMetric}</span>
              </div>
              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle">
                <span className="text-[10px] text-ink-muted uppercase block">Detection Window</span>
                <span className="font-semibold text-ink mt-0.5 block">{selectedAnomaly.timeWindow}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-ink-muted uppercase text-[10.5px] tracking-wider block mb-1.5">
                  Multivariate Telemetry Evidence
                </span>
                <ul className="space-y-1.5 list-disc pl-4 text-ink leading-relaxed">
                  {selectedAnomaly.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-surface-secondary rounded-lg border border-border-subtle">
                <span className="font-semibold text-ink-muted uppercase text-[10.5px] tracking-wider block mb-1">
                  Root Cause Hypothesis (PINN Correlation)
                </span>
                <p className="text-ink leading-relaxed">
                  {selectedAnomaly.possibleCause}
                </p>
              </div>

              <div>
                <span className="font-semibold text-ink-muted uppercase text-[10.5px] tracking-wider block mb-1">
                  Operational Impact
                </span>
                <p className="text-ink leading-relaxed">
                  {selectedAnomaly.impact}
                </p>
              </div>

              <div className="p-3 bg-petroleum-tint rounded-lg border border-petroleum/30">
                <span className="font-semibold text-petroleum-deep uppercase text-[10.5px] tracking-wider block mb-1">
                  Recommended Action
                </span>
                <p className="text-ink font-medium leading-relaxed">
                  {selectedAnomaly.recommendedAction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
            {selectedAnomaly.relatedAlertId ? (
              <button
                type="button"
                onClick={() => navigate('/alerts')}
                className="text-petroleum-deep hover:text-ink font-semibold text-xs flex items-center gap-1.5"
              >
                <span>View Linked Alert ({selectedAnomaly.relatedAlertId})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-ink-muted">No linked active alarms</span>
            )}

            <button
              type="button"
              onClick={() => navigate('/srp-pump')}
              className="h-8 px-3 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink text-xs font-semibold transition-colors"
            >
              Inspect Dyno Waveform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
