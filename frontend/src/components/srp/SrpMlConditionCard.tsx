import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Bot, ChevronDown, ChevronUp, Cpu, Info } from 'lucide-react';
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge';
import { SRPPredictionResult, srpApi } from '../../services/srpApi';
import { SrpTwinState } from '../../types';
import { mapSrpTwinToModelInput } from '../../adapters/srpFeatureAdapter';
import { useAiCopilot } from '../../features/ai-copilot/hooks/useAiCopilot';

interface SrpMlConditionCardProps {
  twin: SrpTwinState;
  dynoSurfacePoints?: number[][];
  selectedCycleLabel?: string;
  className?: string;
}

export const SrpMlConditionCard: React.FC<SrpMlConditionCardProps> = ({
  twin,
  dynoSurfacePoints,
  selectedCycleLabel = 'Current Cycle',
  className = '',
}) => {
  const { openWithPrompt } = useAiCopilot();
  const [prediction, setPrediction] = useState<SRPPredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFeatureDetails, setShowFeatureDetails] = useState<boolean>(true);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const input = mapSrpTwinToModelInput(twin, dynoSurfacePoints);
      const res = await srpApi.predictCondition(input);
      setPrediction(res);
    } catch (err) {
      console.error('SRP ML prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [twin.strokeRate, twin.barrelFillage, twin.peakPolishedRodLoad, twin.minPolishedRodLoad, dynoSurfacePoints]);

  const conditionConfig = {
    NORMAL: {
      color: 'text-status-green',
      bg: 'bg-emerald-500/10',
      border: 'border-status-green/30',
      badgeBorder: 'border-l-status-green',
      icon: CheckCircle2,
      label: 'NORMAL',
      desc: 'Pattern aligns with learned normal envelope',
    },
    WARNING: {
      color: 'text-status-warn',
      bg: 'bg-amber-500/10',
      border: 'border-status-warn/30',
      badgeBorder: 'border-l-status-warn',
      icon: AlertTriangle,
      label: 'WARNING',
      desc: 'Elevated reconstruction error; monitor fillage',
    },
    CRITICAL: {
      color: 'text-status-crit',
      bg: 'bg-red-500/10',
      border: 'border-status-crit/30',
      badgeBorder: 'border-l-status-crit',
      icon: ShieldAlert,
      label: 'CRITICAL',
      desc: 'Severe operational divergence from baseline',
    },
  }[prediction?.condition || 'NORMAL'];

  const IconComponent = conditionConfig.icon;

  // Percentage on a progressive scale for visual gauge bar
  const score = prediction?.anomaly_score || 0;
  const warnThresh = prediction?.warning_threshold || 0.001276;
  const critThresh = prediction?.critical_threshold || 0.007778;

  let gaugePct = 0;
  if (score < warnThresh) {
    gaugePct = (score / warnThresh) * 40;
  } else if (score < critThresh) {
    gaugePct = 40 + ((score - warnThresh) / (critThresh - warnThresh)) * 40;
  } else {
    gaugePct = Math.min(100, 80 + ((score - critThresh) / critThresh) * 20);
  }

  return (
    <div
      className={`bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-subtle border-l-4 ${conditionConfig.badgeBorder} flex flex-col gap-4 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-petroleum/10 border border-petroleum/20 flex items-center justify-center text-petroleum dark:text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-sm font-semibold text-ink">
                SRP Autoencoder Anomaly Detector
              </h4>
              <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
            </div>
            <p className="text-[11px] text-ink-muted">
              Deep reconstruction neural net assessing multivariate kinematics ({selectedCycleLabel})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink-muted border border-border">
            {prediction?.model_version || 'srp-autoencoder-v1'}
          </span>
          <button
            type="button"
            onClick={fetchPrediction}
            disabled={loading}
            className="p-1 rounded-md hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors"
            title="Re-run ML Inference"
            aria-label="Re-run ML Inference"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Condition Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Big Condition Stamp */}
        <div className="md:col-span-4 flex items-center gap-3.5 p-3 rounded-lg bg-surface-secondary/70 border border-border-subtle">
          <div className={`p-2.5 rounded-lg ${conditionConfig.bg} ${conditionConfig.border} border shrink-0`}>
            <IconComponent className={`w-6 h-6 ${conditionConfig.color}`} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-ink-muted block tracking-wider">
              Evaluated Condition
            </span>
            <div className={`font-heading text-lg font-bold ${conditionConfig.color}`}>
              {conditionConfig.label}
            </div>
            <span className="text-[10.5px] text-ink-muted leading-tight block mt-0.5">
              {conditionConfig.desc}
            </span>
          </div>
        </div>

        {/* Center: Anomaly Score & Threshold Benchmarks */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-ink-secondary">Reconstruction MSE Score:</span>
            <span className="font-mono text-base font-bold text-ink">
              {loading ? 'Analyzing...' : score.toFixed(6)}
            </span>
          </div>

          {/* 3-Tier Multi-Segment Gauge */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden flex relative border border-border-subtle">
              {/* Normal Zone (0 - 40%) */}
              <div className="h-full w-[40%] bg-emerald-500/20 border-r border-emerald-500/40" />
              {/* Warning Zone (40% - 80%) */}
              <div className="h-full w-[40%] bg-amber-500/20 border-r border-amber-500/40" />
              {/* Critical Zone (80% - 100%) */}
              <div className="h-full w-[20%] bg-red-500/20" />

              {/* Indicator needle */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-ink rounded-full shadow-sm transition-all duration-500 -ml-0.5"
                style={{ left: `${Math.max(2, Math.min(98, gaugePct))}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-ink-muted">
              <span>0.0</span>
              <span className="text-status-warn">Warn: {warnThresh.toFixed(6)}</span>
              <span className="text-status-crit">Crit: {critThresh.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action to Consult Copilot */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              openWithPrompt(
                `Explain why the SRP Autoencoder flagged condition "${prediction?.condition}" with anomaly score ${score.toFixed(6)} on well BW-17. Analyze pump fillage (${twin.barrelFillage}%), polished rod loads, and dyno card fluid pound mechanics.`
              )
            }
            className="w-full h-8 px-2.5 rounded-lg bg-petroleum text-white hover:bg-petroleum-dark text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Copilot Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFeatureDetails(!showFeatureDetails)}
            className="w-full h-7 px-2 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink-muted hover:text-ink text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <span>{showFeatureDetails ? 'Hide Feature Details' : 'Show 6 Input Features'}</span>
            {showFeatureDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 6-Feature Telemetry Input Vector Section */}
      {showFeatureDetails && (
        <div className="pt-3 border-t border-border-subtle space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-semibold text-ink uppercase tracking-wider">
                Model Input Vector (Canonical 6 Features Fed to Autoencoder)
              </span>
              <DataProvenanceBadge type="OBSERVED" size="sm" />
            </div>
            <span className="text-[10.5px] text-ink-muted font-mono">
              Auto-extracted from Frontend SCADA &amp; Dynamometer Polygon
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
              <span className="text-[9.5px] text-ink-muted uppercase block font-sans font-medium">1. SPM</span>
              <div className="mt-1">
                <span className="font-bold text-sm text-ink">{twin.strokeRate}</span>
                <span className="text-[10px] text-ink-muted ml-1">SPM</span>
              </div>
              <span className="text-[9px] text-ink-muted mt-0.5">VFD Surface Speed</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
              <span className="text-[9.5px] text-ink-muted uppercase block font-sans font-medium">2. Fillage</span>
              <div className="mt-1">
                <span className={`font-bold text-sm ${twin.barrelFillage < 90 ? 'text-status-crit' : 'text-status-green'}`}>
                  {twin.barrelFillage}%
                </span>
              </div>
              <span className="text-[9px] text-ink-muted mt-0.5">Traveling Valve</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
              <span className="text-[9.5px] text-ink-muted uppercase block font-sans font-medium">3. Min Rod Load</span>
              <div className="mt-1">
                <span className="font-bold text-sm text-ink">{twin.minPolishedRodLoad}</span>
                <span className="text-[10px] text-ink-muted ml-1">kN</span>
              </div>
              <span className="text-[9.5px] text-ink-secondary font-semibold mt-0.5">
                {Math.round(prediction?.inputs?.min_rod_weight ?? (twin.minPolishedRodLoad * 224.81))} lbf
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
              <span className="text-[9.5px] text-ink-muted uppercase block font-sans font-medium">4. Max Rod Load (PPRL)</span>
              <div className="mt-1">
                <span className="font-bold text-sm text-status-crit">{twin.peakPolishedRodLoad}</span>
                <span className="text-[10px] text-ink-muted ml-1">kN</span>
              </div>
              <span className="text-[9.5px] text-status-crit font-semibold mt-0.5">
                {Math.round(prediction?.inputs?.max_rod_weight ?? (twin.peakPolishedRodLoad * 224.81))} lbf
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
              <span className="text-[9.5px] text-ink-muted uppercase block font-sans font-medium">5. Dyno Area</span>
              <div className="mt-1">
                <span className="font-bold text-sm text-ink">
                  {Math.round((prediction?.inputs?.dynamometer_area ?? 157985) / 737.56)}
                </span>
                <span className="text-[10px] text-ink-muted ml-1">kJ</span>
              </div>
              <span className="text-[9.5px] text-ink-secondary font-semibold mt-0.5">
                {Math.round(prediction?.inputs?.dynamometer_area ?? 157985)} ft·lbf
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
              <span className="text-[9.5px] text-ink-muted uppercase block font-sans font-medium">6. Rod Load Range</span>
              <div className="mt-1">
                <span className="font-bold text-sm text-ink">
                  {(twin.peakPolishedRodLoad - twin.minPolishedRodLoad).toFixed(1)}
                </span>
                <span className="text-[10px] text-ink-muted ml-1">kN</span>
              </div>
              <span className="text-[9.5px] text-ink-secondary font-semibold mt-0.5">
                {Math.round(prediction?.inputs?.rod_load_range ?? ((twin.peakPolishedRodLoad - twin.minPolishedRodLoad) * 224.81))} lbf
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Interpretation Disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-ink-muted bg-surface-secondary/40 p-2.5 rounded-lg border border-border-subtle">
        <Info className="w-3.5 h-3.5 text-ink-muted shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong>Engineering Note:</strong> Anomaly detection assesses multivariate divergence from learned normal operating kinematics. A CRITICAL condition flags an abnormal mechanical pattern (e.g. traveling valve fluid pound / severe fillage deficit) and is not a confirmed rod breakage.
        </p>
      </div>
    </div>
  );
};
