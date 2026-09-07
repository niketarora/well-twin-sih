import React, { useState } from 'react';
import { Lightbulb, ArrowRight, ShieldCheck, Cpu, GitBranch, CheckCircle2, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { mockAiInsight } from '../mock/aiInsights';

export const AiInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHorizon, setSelectedHorizon] = useState<'24h' | '72h' | '7d' | '90d'>('72h');

  const insight = mockAiInsight;
  const horizonData = insight.horizons[selectedHorizon];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Predictive Forecaster & Explainable AI Copilot"
        subtitle="Physics-informed causal reasoning, gradient-boosted SHAP feature attributions, and forward multi-horizon production envelopes."
        badge="Grounded Physics Reasoning"
        badgeType="amber"
      />

      {/* Main Engineering Insight Banner */}
      <section className="bg-surface border border-border border-l-4 border-l-status-warn rounded-xl p-6 shadow-subtle flex flex-col justify-between">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] uppercase font-semibold tracking-wider text-status-warn-deep bg-status-warn-bg px-2 py-0.5 rounded border border-status-warn">
                AI Engineering Insight · Confidence {insight.confidence}%
              </span>
              <span className="text-xs text-ink-muted font-mono">Model PINN-X4</span>
            </div>

            <h2 className="font-heading text-lg font-semibold text-ink mt-2">
              {insight.title}
            </h2>

            <p className="text-xs text-ink-secondary mt-1 max-w-4xl leading-relaxed">
              {insight.summary}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-semibold text-ink-muted block">Observed Net Oil Deficit</span>
            <span className="font-mono text-2xl font-bold text-status-crit">−13.8 BOPD</span>
            <span className="text-[11px] text-status-crit font-medium block">−7.0% vs expected</span>
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="mt-5 pt-4 border-t border-border-subtle">
          <span className="text-[10.5px] uppercase font-semibold tracking-wider text-ink-muted block mb-2">
            Verified Subsystem Evidence
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {insight.evidence.map((ev, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface-secondary border border-border-subtle">
                <span className="text-[10.5px] text-ink-muted block font-sans">{ev.label}</span>
                <span className="font-bold text-ink text-sm mt-0.5 block">{ev.value}</span>
                <span className="text-[10.5px] text-status-warn mt-0.5 block">{ev.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Stage Explainable AI Causal Physics Pipeline */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
          <div>
            <h3 className="font-heading text-base font-semibold text-ink flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-petroleum" />
              <span>Explainable AI • Causal Physics Propagation Pipeline</span>
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Traceable physical cause-and-effect cascade leading to the 72h forecasted lift stress and production gap
            </p>
          </div>
          <span className="font-mono text-[11px] font-semibold text-ink px-2.5 py-1 rounded bg-surface-secondary border border-border">
            PINN Gradient Chain
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {insight.causalChain.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 rounded-xl bg-surface-secondary border border-border-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-petroleum text-white font-mono text-xs font-bold flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-status-crit">
                    {step.metricChange}
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-xs text-ink">
                  {step.title}
                </h4>
                <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-border-subtle">
                <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-petroleum rounded-full w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Predictive Forecast Horizons & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Forecast Horizon Selector & Readout */}
        <section className="lg:col-span-7 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
              <div>
                <h3 className="font-heading text-sm font-semibold text-ink">
                  Forward Production Forecast & Uncertainty Envelope
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Extrapolating current cooling decay trajectory to future production cutoffs
                </p>
              </div>

              <div className="inline-flex rounded-lg border border-border bg-surface-secondary p-0.5 shrink-0 self-start sm:self-auto">
                {(['24h', '72h', '7d', '90d'] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setSelectedHorizon(h)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      selectedHorizon === h
                        ? 'bg-petroleum text-white shadow-sm'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {h.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Horizon Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle">
                <span className="text-[10.5px] uppercase font-semibold text-ink-muted block font-sans">
                  Forecast Net Oil Rate
                </span>
                <span className="text-xl font-bold text-ink mt-1 block">
                  {horizonData.forecastOilRate} <span className="text-xs text-ink-muted font-normal">BOPD</span>
                </span>
                <span className="text-[11px] text-status-warn mt-0.5 block">
                  {horizonData.oilDeltaPct}% from current (P10: {horizonData.upperP10} / P90: {horizonData.lowerP90})
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle">
                <span className="text-[10.5px] uppercase font-semibold text-ink-muted block font-sans">
                  Reservoir BHT Cooling
                </span>
                <span className="text-xl font-bold text-ink mt-1 block">
                  {horizonData.bhtForecast} <span className="text-xs text-ink-muted font-normal">°C</span>
                </span>
                <span className="text-[11px] text-status-warn mt-0.5 block">
                  {horizonData.bhtDelta} °C ({horizonData.coolingRate} °C/h)
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle">
                <span className="text-[10.5px] uppercase font-semibold text-ink-muted block font-sans">
                  Lift Motor Power Draw
                </span>
                <span className="text-xl font-bold text-ink mt-1 block">
                  {horizonData.liftMotorPower} <span className="text-xs text-ink-muted font-normal">kW</span>
                </span>
                <span className="text-[11px] text-status-crit mt-0.5 block">
                  +{horizonData.motorPowerDelta} kW (viscous drag escalation)
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle">
                <span className="text-[10.5px] uppercase font-semibold text-ink-muted block font-sans">
                  Oil–Steam Ratio (OSR)
                </span>
                <span className="text-xl font-bold text-status-green mt-1 block">
                  {horizonData.oilSteamRatio} <span className="text-xs text-ink-muted font-normal">m³/t</span>
                </span>
                <span className="text-[11px] text-status-green mt-0.5 block">
                  Above economic limit (0.18 m³/t floor)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Horizon Selected: {horizonData.label}</span>
            <button
              type="button"
              onClick={() => navigate('/recommendations')}
              className="text-petroleum-deep hover:text-ink font-semibold flex items-center gap-1"
            >
              <span>Execute Mitigation Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>

        {/* Right: SHAP Feature Importance Ranking */}
        <section className="lg:col-span-5 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-border mb-3">
              <h3 className="font-heading text-sm font-semibold text-ink">
                Physics Gradient Feature Importance (SHAP)
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Relative contribution to the active production deficit
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              {insight.featureImportance.map((feat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-ink">{feat.featureName}</span>
                    <span className="font-mono font-semibold text-ink">{feat.importancePct} %</span>
                  </div>
                  <div className="h-2 w-full bg-surface-subtle rounded overflow-hidden">
                    <div
                      className="h-full rounded bg-petroleum transition-all duration-300"
                      style={{ width: `${feat.importancePct}%` }}
                    />
                  </div>
                  <span className="text-[10.5px] text-ink-muted mt-0.5 block">
                    Subsystem: {feat.subsystem}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border-subtle text-xs text-ink-secondary">
            <strong>Conclusion:</strong> Thermal conduction (44%) and sucker rod fillage (28%) represent 72% of the variance. Trimming pump speed directly addresses the fillage deficit.
          </div>
        </section>
      </div>
    </div>
  );
};
