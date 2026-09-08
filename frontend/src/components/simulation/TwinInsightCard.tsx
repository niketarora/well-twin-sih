import React from 'react';
import { Lightbulb, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { SimulationOutputs } from '../../utils/wellSimulation';

interface TwinInsightCardProps {
  outputs: SimulationOutputs;
}

export const TwinInsightCard: React.FC<TwinInsightCardProps> = ({ outputs }) => {
  const {
    scenarioScore,
    currentScore,
    scoreDelta,
    scenarioBadge,
    insight,
  } = outputs;

  // Determine badge styling
  const badgeConfig = {
    'BETTER OPERATING REGION': {
      bg: 'bg-status-green/15',
      text: 'text-status-green',
      border: 'border-status-green/30',
      icon: CheckCircle2,
    },
    'BALANCED SCENARIO': {
      bg: 'bg-status-info/15',
      text: 'text-status-info',
      border: 'border-status-info/30',
      icon: ShieldCheck,
    },
    'INEFFICIENT SCENARIO': {
      bg: 'bg-status-warn/15',
      text: 'text-status-warn',
      border: 'border-status-warn/30',
      icon: AlertTriangle,
    },
    'HIGH-RISK SCENARIO': {
      bg: 'bg-status-crit/15',
      text: 'text-status-crit',
      border: 'border-status-crit/30',
      icon: AlertTriangle,
    },
  }[scenarioBadge];

  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 shadow-subtle flex flex-col justify-between">
      {/* Top Header: Score Comparison + Classification Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-petroleum/10 border border-petroleum/20 flex items-center justify-center text-petroleum">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink font-heading flex items-center gap-1.5">
              <span>Digital Twin Scenario Evaluation</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-ink-muted border border-border-subtle font-mono">
                Deterministic Model
              </span>
            </h3>
            <p className="text-xs text-ink-muted">
              Holistic balance across extraction, rod fatigue, and thermal/electrical efficiency
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono tracking-wide ${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border}`}
        >
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{scenarioBadge}</span>
        </div>
      </div>

      {/* Middle: Composite Scenario Score */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="bg-canvas/60 rounded-lg p-3 border border-border-subtle flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Baseline Field Score</div>
          <div className="text-2xl font-mono font-bold text-ink-secondary mt-0.5">
            {currentScore}{' '}
            <span className="text-xs font-normal text-ink-muted">/ 100</span>
          </div>
        </div>

        <div className="bg-petroleum/5 rounded-lg p-3 border border-petroleum/30 flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-petroleum">Scenario Score</div>
          <div className="text-2xl font-mono font-extrabold text-petroleum mt-0.5">
            {scenarioScore}{' '}
            <span className="text-xs font-normal text-petroleum">/ 100</span>
          </div>
        </div>

        <div className="bg-canvas/60 rounded-lg p-3 border border-border-subtle flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Variance vs Baseline</div>
          <div
            className={`text-2xl font-mono font-bold mt-0.5 flex items-center gap-1 ${
              scoreDelta >= 0 ? 'text-status-green' : 'text-status-crit'
            }`}
          >
            {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
            <span className="text-xs font-normal text-ink-muted">pts</span>
          </div>
        </div>
      </div>

      {/* Bottom: Natural Language Digital Twin Insight */}
      <div className="bg-surface-secondary/60 rounded-lg p-3.5 border border-border/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-ink mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-heading">Twin Insight</span>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed font-sans">
          {insight}
        </p>
      </div>
    </div>
  );
};
