import React, { useEffect, useState } from 'react';
import { Flame, AlertTriangle, CheckCircle2, ArrowRight, TrendingDown, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge';
import { cssPredictionService, CSSNormalizedPrediction } from '../../services/cssApi';
import { mockCssCycle } from '../../mock';

export const CssAnomaliesSection: React.FC = () => {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<CSSNormalizedPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    cssPredictionService
      .getPredictionForCycle(mockCssCycle)
      .then((res) => setPrediction(res))
      .catch((err) => console.warn('CSS anomaly fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !prediction) return null;

  const isRisk = prediction.economic_status !== 'OPTIMAL';
  const statusColor = isRisk ? 'text-status-warn' : 'text-status-green';
  const statusBg = isRisk ? 'bg-amber-500/10' : 'bg-emerald-500/10';
  const statusBorder = isRisk ? 'border-status-warn/30' : 'border-status-green/30';
  const StatusIcon = isRisk ? AlertTriangle : CheckCircle2;

  return (
    <div className={`p-4 rounded-xl border ${statusBorder} ${statusBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle`}>
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-status-warn shrink-0 shadow-xs">
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-ink">
              CSS ML Surveillance · Well BW-017
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${statusBg} ${statusColor} border ${statusBorder}`}>
              {prediction.economic_status === 'CUTOFF_WARNING' ? 'CRITICAL RISK' : prediction.economic_status}
            </span>
            <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Forecast next-month OSR: <strong className="font-mono text-ink">{prediction.forecast_osr.toFixed(3)} m³/t</strong> (Economic floor: 0.18 m³/t).
            Forecasted bitumen production: <strong className="font-mono text-ink">{prediction.predicted_oil_bbl.toLocaleString()} bbl</strong> ({prediction.predicted_oil_m3} m³).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
        <span className="text-[10.5px] font-mono text-ink-muted">
          Model: {prediction.model_version}
        </span>
        <button
          type="button"
          onClick={() => navigate('/css-cycle')}
          className="text-xs font-semibold text-petroleum hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View CSS Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
