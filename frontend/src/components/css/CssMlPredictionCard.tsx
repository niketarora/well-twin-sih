import React, { useEffect, useState, useMemo } from 'react';
import {
  Cpu,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Bot,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge';
import { CssCycleState } from '../../types';
import {
  CSSNormalizedPrediction,
  RawCSSSensitivityResponse,
  cssPredictionService,
} from '../../services/cssApi';
import { useAiCopilot } from '../../features/ai-copilot/hooks/useAiCopilot';

interface CssMlPredictionCardProps {
  cycle: CssCycleState;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const CssMlPredictionCard: React.FC<CssMlPredictionCardProps> = ({
  cycle,
  title = 'Twin 1 ML Engine · CSS Field-Month Thermal Surrogate',
  subtitle = 'Trained on ANP thermal recovery field data · Independent CatBoost API on Render',
  className = '',
}) => {
  const { openWithPrompt } = useAiCopilot();
  const [prediction, setPrediction] = useState<CSSNormalizedPrediction | null>(null);
  const [sensitivity, setSensitivity] = useState<RawCSSSensitivityResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sensitivityLoading, setSensitivityLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showSensitivity, setShowSensitivity] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer for Render cold-start awareness
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Memoize cycle signature to avoid duplicate fetches on unrelated renders
  const cycleSignature = useMemo(
    () => `${cycle.currentCycle}-${cycle.cumulativeSteamInjected}-${cycle.history.length}`,
    [cycle.currentCycle, cycle.cumulativeSteamInjected, cycle.history.length]
  );

  const fetchPrediction = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await cssPredictionService.getPredictionForCycle(cycle, { forceRefresh });
      setPrediction(res);
    } catch (err: any) {
      console.error('CSS ML inference failed:', err);
      setError('CSS model temporarily unavailable. Surveillance continuing offline.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSensitivity = async () => {
    if (sensitivity) return;
    setSensitivityLoading(true);
    try {
      const res = await cssPredictionService.getSensitivityForCycle(cycle);
      setSensitivity(res);
    } catch (err) {
      console.warn('Sensitivity analysis failed:', err);
    } finally {
      setSensitivityLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [cycleSignature]);

  const handleToggleSensitivity = () => {
    const nextState = !showSensitivity;
    setShowSensitivity(nextState);
    if (nextState && !sensitivity) {
      fetchSensitivity();
    }
  };

  // Status configuration based on economic OSR threshold (0.18 m³/t floor)
  const statusConfig = {
    OPTIMAL: {
      label: 'OPTIMAL THERMAL RECOVERY',
      color: 'text-status-green',
      bg: 'bg-emerald-500/10',
      border: 'border-status-green/30',
      leftBorder: 'border-l-status-green',
      icon: CheckCircle2,
      desc: 'Projected OSR is safely pacing above the 0.18 m³/t economic floor',
    },
    WATCH: {
      label: 'ECONOMIC DECLINE WATCH',
      color: 'text-status-warn',
      bg: 'bg-amber-500/10',
      border: 'border-status-warn/30',
      leftBorder: 'border-l-status-warn',
      icon: AlertTriangle,
      desc: 'OSR approaching economic threshold; monitor rate of heat dissipation',
    },
    CUTOFF_WARNING: {
      label: 'ECONOMIC CUTOFF BREACH RISK',
      color: 'text-status-crit',
      bg: 'bg-red-500/10',
      border: 'border-status-crit/30',
      leftBorder: 'border-l-status-crit',
      icon: TrendingDown,
      desc: 'Forecasted recovery below 0.18 m³/t economic floor; prepare for cycle turnaround',
    },
  }[prediction?.economic_status || 'WATCH'];

  const StatusIcon = statusConfig.icon;

  return (
    <section
      className={`bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-subtle border-l-4 ${statusConfig.leftBorder} flex flex-col gap-4 transition-all ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-petroleum-tint border border-petroleum/30 flex items-center justify-center text-petroleum dark:text-cyan-400 shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-sm font-semibold text-ink">
                {title}
              </h3>
              <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
              {prediction?.is_fallback && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-status-warn border border-status-warn/30">
                  Calibrated Surrogate
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() =>
              openWithPrompt(
                `Analyze the CSS ML model forecast for Well BW-017: The CatBoost surrogate forecasts next-month bitumen production of ${prediction?.predicted_oil_m3 || 2387.4} m³ (${prediction?.predicted_oil_bbl?.toLocaleString() || '15,016'} bbl) with an instantaneous OSR of ${prediction?.forecast_osr || 0.193} m³/t (economic cutoff floor is 0.18 m³/t). What thermal soak kinetics and depletion risks should the operator prepare for?`
              )
            }
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-petroleum-tint text-petroleum border border-petroleum/30 hover:bg-petroleum/20 transition-colors"
            title="Ask AI Copilot to explain this prediction"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Explain with AI</span>
          </button>

          <button
            type="button"
            onClick={() => fetchPrediction(true)}
            disabled={loading}
            className="p-1.5 text-ink-muted hover:text-ink rounded-lg border border-border hover:bg-surface-secondary transition-colors"
            title="Re-run ML prediction"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-petroleum' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State (with Render cold-start indicator) */}
      {loading && !prediction && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 bg-surface-secondary/40 rounded-xl border border-dashed border-border">
          <RefreshCw className="w-6 h-6 text-petroleum animate-spin" />
          <span className="font-heading text-xs font-semibold text-ink">
            Analyzing CSS cycle kinetics & thermal response...
          </span>
          <span className="text-[11px] text-ink-muted">
            Querying deployed CatBoost model on Render {elapsedSeconds > 2 && `(${elapsedSeconds}s)`}
          </span>
          {elapsedSeconds > 8 && (
            <span className="text-[10px] text-status-warn font-mono mt-1">
              Render container waking from idle sleep — standby...
            </span>
          )}
        </div>
      )}

      {/* Error / Offline Banner (Non-blocking) */}
      {error && !loading && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-status-warn/30 text-xs flex items-center justify-between text-status-warn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchPrediction(true)}
            className="underline hover:text-ink font-semibold ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Prediction Results Display */}
      {prediction && (
        <div className="space-y-4">
          {/* Status & Headline Banner */}
          <div
            className={`p-3.5 rounded-xl border ${statusConfig.border} ${statusConfig.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <StatusIcon className={`w-5 h-5 ${statusConfig.color} shrink-0 mt-0.5 sm:mt-0`} />
              <div>
                <span className={`font-mono text-xs font-bold tracking-wide uppercase ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <p className="text-xs text-ink-secondary mt-0.5 font-medium">
                  {statusConfig.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs self-start sm:self-auto border-t sm:border-t-0 border-border/50 pt-2 sm:pt-0">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] text-ink-muted uppercase">Target Forecast</span>
                <span className="font-semibold text-ink">{prediction.forecast_month}</span>
              </div>
              <div className="flex flex-col items-start sm:items-end border-l border-border pl-3">
                <span className="text-[10px] text-ink-muted uppercase">Model Version</span>
                <span className="font-semibold text-ink truncate max-w-[130px]" title={prediction.model_version}>
                  {prediction.model_version}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Model KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-subtle flex flex-col justify-between">
              <span className="text-[10.5px] text-ink-muted uppercase font-semibold">
                Forecasted Bitumen
              </span>
              <div className="mt-1">
                <div className="font-mono text-lg sm:text-xl font-bold text-ink">
                  {prediction.predicted_oil_m3.toLocaleString()} <span className="text-xs font-normal text-ink-muted">m³</span>
                </div>
                <span className="font-mono text-xs text-petroleum font-semibold">
                  ≈ {prediction.predicted_oil_bbl.toLocaleString()} bbl
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-subtle flex flex-col justify-between">
              <span className="text-[10.5px] text-ink-muted uppercase font-semibold">
                Instantaneous OSR
              </span>
              <div className="mt-1">
                <div className={`font-mono text-lg sm:text-xl font-bold ${statusConfig.color}`}>
                  {prediction.forecast_osr.toFixed(3)}{' '}
                  <span className="text-xs font-normal text-ink-muted">m³/t</span>
                </div>
                <span className="font-mono text-[11px] text-ink-muted">
                  Floor: {prediction.economic_floor_osr.toFixed(2)} m³/t
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-subtle flex flex-col justify-between">
              <span className="text-[10.5px] text-ink-muted uppercase font-semibold">
                Steam-to-Oil Ratio
              </span>
              <div className="mt-1">
                <div className="font-mono text-lg sm:text-xl font-bold text-ink">
                  {prediction.steam_intensity.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-ink-muted">t/m³</span>
                </div>
                <span className="font-mono text-[11px] text-ink-muted">Thermal intensity</span>
              </div>
            </div>

            <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-subtle flex flex-col justify-between">
              <span className="text-[10.5px] text-ink-muted uppercase font-semibold">
                Current Steam Injected
              </span>
              <div className="mt-1">
                <div className="font-mono text-lg sm:text-xl font-bold text-ink">
                  {prediction.baseline_steam_t.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-ink-muted">t</span>
                </div>
                <span className="font-mono text-[11px] text-ink-muted">Cycle 4 cumulative</span>
              </div>
            </div>
          </div>

          {/* Collapsible Feature & Diagnostics Inspector */}
          <div className="border-t border-border-subtle pt-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-ink-muted hover:text-ink py-1.5 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-petroleum" />
                <span>Feature Pipeline & Telemetry Input Mapping</span>
              </span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-2.5 p-3 rounded-xl bg-surface-secondary/50 border border-border-subtle text-xs space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div>
                    <span className="text-ink-muted text-[10px] block font-sans">Source Basin:</span>
                    <strong className="text-ink">Bikaner-Nagaur</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted text-[10px] block font-sans">Field Identifier:</span>
                    <strong className="text-ink">Baghewala (RJ)</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted text-[10px] block font-sans">Historical Cycles:</span>
                    <strong className="text-ink">{cycle.history.length} cycles fed (min 4)</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted text-[10px] block font-sans">Unit Translation:</span>
                    <strong className="text-petroleum">bbl → m³ (×0.15898)</strong>
                  </div>
                </div>

                {prediction.warnings.length > 0 && (
                  <div className="pt-2 border-t border-border-subtle text-[11px] text-ink-muted space-y-1">
                    <span className="font-semibold text-status-warn text-[10.5px] uppercase block">
                      Model Scientific Disclaimers:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {prediction.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive What-If Sensitivity Simulation Toggle */}
          <div className="border-t border-border-subtle pt-2">
            <button
              type="button"
              onClick={handleToggleSensitivity}
              className="flex items-center justify-between w-full text-xs font-semibold text-petroleum hover:text-petroleum/80 py-1.5 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>What-If Steam Injection Sensitivity Analysis (Candidate Scenarios)</span>
              </span>
              {showSensitivity ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSensitivity && (
              <div className="mt-2.5 p-3 rounded-xl bg-surface-secondary/40 border border-border-subtle space-y-3">
                {sensitivityLoading ? (
                  <div className="py-4 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-petroleum" />
                    <span>Evaluating candidate steam sensitivity curves...</span>
                  </div>
                ) : sensitivity ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-[10px] uppercase text-ink-muted border-b border-border">
                          <th className="py-1.5 px-2">Steam Delta</th>
                          <th className="py-1.5 px-2 text-right">Candidate Steam (t)</th>
                          <th className="py-1.5 px-2 text-right">Predicted Next Oil (m³)</th>
                          <th className="py-1.5 px-2 text-right">Forecast Oil (bbl)</th>
                          <th className="py-1.5 px-2 text-right">SOR (t/m³)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {sensitivity.scenarios.map((sc, idx) => {
                          const isBaseline = sc.steam_change_percent === 0;
                          const oilBbl = Math.round(sc.predicted_next_field_oil_m3 * 6.2898);
                          return (
                            <tr
                              key={idx}
                              className={`hover:bg-surface-secondary ${
                                isBaseline ? 'bg-petroleum-tint font-bold text-petroleum' : 'text-ink'
                              }`}
                            >
                              <td className="py-2 px-2 font-sans font-semibold">
                                {sc.steam_change_percent > 0 ? `+${sc.steam_change_percent}%` : `${sc.steam_change_percent}%`}
                                {isBaseline && ' (Current)'}
                              </td>
                              <td className="py-2 px-2 text-right">{sc.candidate_steam_t.toLocaleString()} t</td>
                              <td className="py-2 px-2 text-right">{sc.predicted_next_field_oil_m3.toLocaleString()} m³</td>
                              <td className="py-2 px-2 text-right font-semibold">{oilBbl.toLocaleString()} bbl</td>
                              <td className="py-2 px-2 text-right text-ink-secondary">
                                {sc.steam_production_ratio_t_per_m3.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-xs text-ink-muted">No sensitivity data available.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
