import React from 'react';
import { Minus, Plus, ArrowUpRight, ArrowDownRight, Minus as Dash } from 'lucide-react';
import { ParameterConfig } from '../../utils/wellSimulation';

interface ParameterSliderProps {
  config: ParameterConfig;
  currentValue: number;
  scenarioValue: number;
  onChange: (value: number) => void;
  isHero?: boolean;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  config,
  currentValue,
  scenarioValue,
  onChange,
  isHero = false,
}) => {
  const delta = scenarioValue - currentValue;
  const deltaPct = currentValue !== 0 ? ((delta / currentValue) * 100) : 0;
  const isChanged = Math.abs(delta) > (config.step / 2);

  const handleDecrement = () => {
    const next = Math.max(config.min, +(scenarioValue - config.step).toFixed(2));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(config.max, +(scenarioValue + config.step).toFixed(2));
    onChange(next);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  // Format decimals based on step size
  const formatVal = (val: number) => {
    if (config.step < 0.1) return val.toFixed(2);
    if (config.step < 1) return val.toFixed(1);
    return val.toLocaleString();
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 p-3.5 sm:p-4 ${
        isHero
          ? 'bg-petroleum/5 border-petroleum/40 shadow-sm ring-1 ring-petroleum/20'
          : isChanged
          ? 'bg-surface border-petroleum/30 shadow-subtle'
          : 'bg-surface border-border hover:border-border-hover'
      }`}
    >
      {/* Top Header: Title, Category Badge, and Delta */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink font-heading">{config.label}</span>
          {isHero && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-petroleum text-white rounded">
              Primary SRP Lift
            </span>
          )}
        </div>

        {/* Delta indicator */}
        <div className="flex items-center gap-1">
          {isChanged ? (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                delta > 0
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
              }`}
            >
              {delta > 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {delta > 0 ? '+' : ''}
              {deltaPct.toFixed(1)}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-mono text-ink-muted px-1.5 py-0.5 rounded bg-surface-secondary">
              <Dash className="w-2.5 h-2.5" />
              Baseline
            </span>
          )}
        </div>
      </div>

      {/* Numeric Comparison: Current vs Scenario */}
      <div className="grid grid-cols-2 gap-2 bg-canvas/60 rounded-lg p-2.5 border border-border-subtle mb-3">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Current Field</div>
          <div className="text-sm font-mono font-bold text-ink-secondary">
            {formatVal(currentValue)}{' '}
            <span className="text-xs font-normal text-ink-muted">{config.unit}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold tracking-wider text-petroleum">Scenario Target</div>
          <div className="text-base font-mono font-extrabold text-petroleum">
            {formatVal(scenarioValue)}{' '}
            <span className="text-xs font-medium text-petroleum">{config.unit}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls: [-] [ Slider ] [+] */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={scenarioValue <= config.min}
          className="w-8 h-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary active:scale-95 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-ink transition-all shadow-subtle shrink-0"
          title={`Decrease ${config.label} by ${config.step} ${config.unit}`}
          aria-label={`Decrease ${config.label}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={scenarioValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-petroleum focus:outline-none focus:ring-1 focus:ring-petroleum"
            aria-label={config.label}
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={scenarioValue >= config.max}
          className="w-8 h-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary active:scale-95 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-ink transition-all shadow-subtle shrink-0"
          title={`Increase ${config.label} by ${config.step} ${config.unit}`}
          aria-label={`Increase ${config.label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Min / Max bounds footer */}
      <div className="flex justify-between items-center text-[10px] font-mono text-ink-muted mt-1.5 px-0.5">
        <span>Min: {formatVal(config.min)} {config.unit}</span>
        <span className="text-ink-muted truncate max-w-[150px] text-center">{config.description}</span>
        <span>Max: {formatVal(config.max)} {config.unit}</span>
      </div>
    </div>
  );
};
