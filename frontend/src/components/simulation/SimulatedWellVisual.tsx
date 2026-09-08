import React from 'react';
import { AlertCircle, CheckCircle2, Flame, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { SimulationOutputs, BaselineWellConfig, ScenarioInputs } from '../../utils/wellSimulation';

interface SimulatedWellVisualProps {
  baseline: BaselineWellConfig;
  inputs: ScenarioInputs;
  outputs: SimulationOutputs;
}

export const SimulatedWellVisual: React.FC<SimulatedWellVisualProps> = ({
  baseline,
  inputs,
  outputs,
}) => {
  const {
    simulatedPumpFillage,
    simulatedResTemp,
    mechanicalRisk,
    fluidMobility,
    wellHealthScore,
  } = outputs;

  // Stroke animation duration derived from SPM (e.g. 8.4 SPM = 7.14s per cycle)
  const cycleDurationSec = Math.max(2.5, Math.min(12, 60 / inputs.spm));

  // Determine thermal heat color
  const tempRatio = Math.max(0, Math.min(1, (simulatedResTemp - 140) / (260 - 140)));
  const thermalColor =
    tempRatio > 0.65 ? '#ef4444' : tempRatio > 0.4 ? '#f97316' : '#3b82f6';

  const isFluidPound = simulatedPumpFillage < 80.0;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-petroleum" />
          <span className="text-xs font-bold text-ink font-heading">
            Subsurface Dynamic Digital Twin
          </span>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
            mechanicalRisk === 'SEVERE'
              ? 'bg-status-crit/15 text-status-crit border-status-crit/30'
              : mechanicalRisk === 'HIGH'
              ? 'bg-status-warn/15 text-status-warn border-status-warn/30'
              : 'bg-status-green/15 text-status-green border-status-green/30'
          }`}
        >
          {mechanicalRisk} RISK
        </span>
      </div>

      {/* SVG Well Schematic */}
      <div className="relative flex-1 min-h-[260px] bg-canvas/60 rounded-lg border border-border-subtle overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 320 280"
          className="w-full h-full max-h-[260px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Thermal gradient */}
            <linearGradient id="thermalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={thermalColor} stopOpacity="0.05" />
              <stop offset="100%" stopColor={thermalColor} stopOpacity="0.35" />
            </linearGradient>

            {/* Oil fill pattern */}
            <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Ground surface line */}
          <line x1="20" y1="65" x2="300" y2="65" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 2" />
          <text x="25" y="60" fill="var(--ink-muted)" fontSize="9" fontFamily="monospace">SURFACE (0 m)</text>

          {/* Sucker Rod Pumping Unit schematic (Surface) */}
          {/* Samson post */}
          <polygon points="120,65 140,25 145,25 155,65" fill="#64748b" opacity="0.6" />
          {/* Walking beam rocking */}
          <g>
            <style>
              {`
                @keyframes beamRock {
                  0% { transform: rotate(-4deg); }
                  50% { transform: rotate(4deg); }
                  100% { transform: rotate(-4deg); }
                }
                .walking-beam {
                  transform-origin: 142px 25px;
                  animation: beamRock ${cycleDurationSec}s ease-in-out infinite;
                }
                @keyframes rodCycle {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(14px); }
                  100% { transform: translateY(0px); }
                }
                .sucker-rod {
                  animation: rodCycle ${cycleDurationSec}s ease-in-out infinite;
                }
              `}
            </style>
            <g className="walking-beam">
              <rect x="85" y="22" width="115" height="6" rx="2" fill="#475569" />
              {/* Horse head */}
              <path d="M 85,25 Q 70,35 72,50" stroke="#334155" strokeWidth="4" fill="none" />
              {/* Counterweight */}
              <circle cx="195" cy="25" r="7" fill="#64748b" />
            </g>
          </g>

          {/* Wellhead Casing */}
          <rect x="68" y="58" width="10" height="12" fill="#334155" rx="1" />

          {/* Wellbore Casing (Vertical) */}
          <rect x="65" y="68" width="16" height="150" fill="var(--surface-secondary)" stroke="var(--border)" strokeWidth="1" />

          {/* Reciprocating Sucker Rod String */}
          <g className="sucker-rod">
            {/* Polished Rod */}
            <line x1="73" y1="46" x2="73" y2="200" stroke="#0ea5e9" strokeWidth="2" />
            {/* Pump Plunger */}
            <rect x="68" y="172" width="10" height="16" fill="#0284c7" rx="1" />
          </g>

          {/* Pump Barrel (Downhole) */}
          <rect x="66" y="168" width="14" height="42" fill="none" stroke="#64748b" strokeWidth="1.5" />

          {/* Pump Fillage indicator in barrel */}
          <rect
            x="67"
            y={210 - (simulatedPumpFillage / 100) * 38}
            width="12"
            height={(simulatedPumpFillage / 100) * 38}
            fill="#b45309"
            opacity="0.8"
          />

          {/* Perforations */}
          <line x1="61" y1="216" x2="65" y2="216" stroke="#f59e0b" strokeWidth="2" />
          <line x1="81" y1="216" x2="85" y2="216" stroke="#f59e0b" strokeWidth="2" />
          <line x1="61" y1="224" x2="65" y2="224" stroke="#f59e0b" strokeWidth="2" />
          <line x1="81" y1="224" x2="85" y2="224" stroke="#f59e0b" strokeWidth="2" />

          {/* Thermal Steam Chamber (Reservoir bottom) */}
          <ellipse
            cx="73"
            cy="235"
            rx="55"
            ry="25"
            fill="url(#thermalGrad)"
            stroke={thermalColor}
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <text x="73" y="240" textAnchor="middle" fill={thermalColor} fontSize="10" fontWeight="bold">
            {simulatedResTemp.toFixed(1)}°C
          </text>
          <text x="73" y="252" textAnchor="middle" fill="var(--ink-muted)" fontSize="8">
            Steam Chamber Zone
          </text>

          {/* Right Callouts & Telemetry Markers */}
          {/* Fillage Callout */}
          <line x1="80" y1="188" x2="160" y2="175" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="160" y="162" width="140" height="30" rx="6" fill="var(--surface-elevated)" stroke="var(--border)" />
          <text x="168" y="176" fill="var(--ink-muted)" fontSize="8" fontWeight="bold">PUMP BARREL FILLAGE</text>
          <text x="168" y="188" fill={isFluidPound ? '#ef4444' : '#10b981'} fontSize="11" fontWeight="bold">
            {simulatedPumpFillage.toFixed(1)}% {isFluidPound ? '(! Pound)' : '(Optimal)'}
          </text>

          {/* Cadence Callout */}
          <line x1="140" y1="25" x2="220" y2="35" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="220" y="22" width="85" height="26" rx="4" fill="var(--surface-elevated)" stroke="var(--border)" />
          <text x="226" y="34" fill="var(--ink-muted)" fontSize="7" fontWeight="bold">LIFT SPEED</text>
          <text x="226" y="44" fill="var(--ink)" fontSize="10" fontWeight="bold">{inputs.spm.toFixed(1)} SPM</text>

          {/* Fluid Mobility Callout */}
          <rect x="160" y="215" width="140" height="38" rx="6" fill="var(--surface-elevated)" stroke="var(--border)" />
          <text x="168" y="228" fill="var(--ink-muted)" fontSize="8" fontWeight="bold">FORMATION MOBILITY</text>
          <text x="168" y="240" fill={fluidMobility === 'GOOD' ? '#10b981' : fluidMobility === 'MODERATE' ? '#f59e0b' : '#ef4444'} fontSize="11" fontWeight="bold">
            {fluidMobility} ({outputs.viscosityTrend} VISC)
          </text>
        </svg>

        {/* Fluid pound alert overlay */}
        {isFluidPound && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-status-crit/20 border border-status-crit text-status-crit rounded-md text-[11px] font-bold backdrop-blur-sm animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Severe Fluid Pound Risk (&lt;80% Fillage)</span>
          </div>
        )}
      </div>

      {/* Footer summary chips */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-canvas/60 rounded-lg p-1.5 border border-border-subtle">
          <div className="text-[9px] font-bold text-ink-muted uppercase">Health Index</div>
          <div className="text-xs font-mono font-bold text-ink">{wellHealthScore}/100</div>
        </div>
        <div className="bg-canvas/60 rounded-lg p-1.5 border border-border-subtle">
          <div className="text-[9px] font-bold text-ink-muted uppercase">Rod Cadence</div>
          <div className="text-xs font-mono font-bold text-ink">{inputs.spm.toFixed(1)} SPM</div>
        </div>
        <div className="bg-canvas/60 rounded-lg p-1.5 border border-border-subtle">
          <div className="text-[9px] font-bold text-ink-muted uppercase">Res. Temp</div>
          <div className="text-xs font-mono font-bold text-ink">{simulatedResTemp.toFixed(1)} °C</div>
        </div>
      </div>
    </div>
  );
};
