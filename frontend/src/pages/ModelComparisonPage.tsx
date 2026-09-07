import React, { useEffect, useState } from 'react';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { ModelValidationItem } from '../types';

export const ModelComparisonPage: React.FC = () => {
  const [items, setItems] = useState<ModelValidationItem[]>([]);
  const [agreement, setAgreement] = useState(93);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    digitalTwinService.getModelValidation().then((data) => {
      setItems(data.items);
      setAgreement(data.agreement);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Model Validation & Drift Detection"
        subtitle="Continuous quantitative comparison between physics-informed digital twin models and measured SCADA observations."
        badge={`Model Agreement: ${agreement}%`}
        badgeType="amber"
      />

      {/* Model Drift Notification Banner */}
      <div className="bg-surface border border-border border-l-4 border-l-status-warn rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-status-warn shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-ink text-sm">
                LOCALIZED MODEL DRIFT DETECTED: SUCKER ROD PUMP & SURFACE EFFLUENT
              </span>
              <span className="px-2 py-0.5 rounded bg-status-warn-bg text-status-warn-deep font-semibold text-[10px] uppercase border border-status-warn">
                Attention
              </span>
            </div>
            <p className="text-ink-secondary mt-0.5 leading-relaxed">
              Reservoir and Wellbore models exhibit high agreement (96% and 94%). However, pump fillage has drifted −7.5% off predicted expectation, propagating a −7.0% net oil deficit at the surface test separator.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Triggering hydro-thermal parameter recalibration...')}
          className="h-8 px-3 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recalibrate Model</span>
        </button>
      </div>

      {/* 4 Model Health Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.twinId}
            className={`bg-surface border rounded-xl p-4 shadow-subtle flex flex-col justify-between ${
              item.status === 'Attention'
                ? 'border-status-warn/40 border-l-[3px] border-l-status-warn'
                : 'border-border'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                {item.twinName}
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-mono text-2xl font-bold text-ink">
                  {item.confidence} <span className="text-xs font-normal text-ink-muted">%</span>
                </span>
                <StatusBadge status={item.status} />
              </div>
              <span className="text-xs text-ink-secondary font-medium mt-1 block">
                {item.keyMetric}
              </span>
            </div>

            <div className="mt-4 pt-2.5 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
              <span className="text-ink-muted font-sans">Deviation:</span>
              <span
                className={`font-semibold ${
                  item.deviationPct < -5 ? 'text-status-crit' : 'text-status-green'
                }`}
              >
                {item.deviation} ({item.deviationPct}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Model Comparison Table */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="pb-3 border-b border-border mb-4">
          <h3 className="font-heading text-base font-semibold text-ink">
            Quantitative Subsystem Model Validation Matrix
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Detailed breakdown of physics predicted values versus actual SCADA observations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-secondary text-ink-secondary font-semibold text-[10.5px] uppercase tracking-wider border-b border-border">
                <th className="py-2.5 px-4">Subsystem Twin</th>
                <th className="py-2.5 px-4">Primary Physical Metric</th>
                <th className="py-2.5 px-4 text-right">Digital Twin Predicted</th>
                <th className="py-2.5 px-4 text-right">SCADA Measured</th>
                <th className="py-2.5 px-4 text-right">Residual Deviation</th>
                <th className="py-2.5 px-4 text-right">Model Confidence</th>
                <th className="py-2.5 px-4">Validation State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono">
              {items.map((m) => (
                <tr
                  key={m.twinId}
                  className={`hover:bg-canvas/80 transition-colors ${
                    m.status === 'Attention' ? 'bg-status-warn-bg/25' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-semibold text-ink">
                    {m.twinName}
                  </td>
                  <td className="py-3 px-4 font-sans text-ink-secondary">
                    {m.keyMetric}
                  </td>
                  <td className="py-3 px-4 text-right text-ink">
                    {m.predictedValue}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-petroleum-deep">
                    {m.actualValue}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold ${
                      m.deviationPct < -5 ? 'text-status-crit' : 'text-status-green'
                    }`}
                  >
                    {m.deviation} ({m.deviationPct}%)
                  </td>
                  <td className="py-3 px-4 text-right text-ink">
                    {m.confidence} %
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <StatusBadge status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
