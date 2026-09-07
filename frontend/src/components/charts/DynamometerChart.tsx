import React, { useState } from 'react';
import { mockDynoLoops } from '../../mock/digitalTwin/srp';
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface DynamometerChartProps {
  className?: string;
}

export const DynamometerChart: React.FC<DynamometerChartProps> = ({ className = '' }) => {
  const [selectedLoopKey, setSelectedLoopKey] = useState<'current' | 'previous' | 'baseline'>('current');
  const [showSurface, setShowSurface] = useState(true);
  const [showDownhole, setShowDownhole] = useState(true);

  const currentLoop = mockDynoLoops[selectedLoopKey];

  // Wide-format viewBox: 1200 x 410 (matches 1:1 standard workstation scale factor)
  // Plot Area: X from 70 to 1140 (width = 1070px), Y from 350 down to 40 (height = 310px)
  const dx = (x: number) => (70 + (x / 4) * 1070).toFixed(1);
  const dy = (y: number) => (350 - (y / 120) * 310).toFixed(1);

  const loopToPoints = (pts: number[][]) => pts.map(([x, y]) => `${dx(x)},${dy(y)}`).join(' ');

  const surfacePoly = loopToPoints(currentLoop.surface);
  const downholePoly = loopToPoints(currentLoop.downhole);

  const yTicks = [0, 20, 40, 60, 80, 100, 120];
  const xTicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];

  const diagnosticData = {
    current: {
      displacement: '3.65 m',
      fillage: '84.6%',
      fillageStatus: 'Deficit · Sluggish',
      fillageColor: 'text-status-crit',
      inception: '2.80 m (Downstroke)',
      inceptionDesc: 'Fluid pound impact detected',
      inceptionColor: 'text-status-crit',
      minMargin: '+24.6 kN',
      minMarginDesc: 'Above rod float threshold',
      peakLoad: '88.4 kN',
      cardClassification: 'Severe Fluid Pound / Incomplete Fill',
    },
    previous: {
      displacement: '3.65 m',
      fillage: '87.2%',
      fillageStatus: 'Moderate Deficit',
      fillageColor: 'text-status-warn',
      inception: '2.80 m (Downstroke)',
      inceptionDesc: 'Incipient fluid pound collapse',
      inceptionColor: 'text-status-warn',
      minMargin: '+25.4 kN',
      minMarginDesc: 'Adequate rod tension margin',
      peakLoad: '88.2 kN',
      cardClassification: 'Incipient Fluid Pound · Transition',
    },
    baseline: {
      displacement: '3.65 m',
      fillage: '98.2%',
      fillageStatus: 'Optimal Full Barrel',
      fillageColor: 'text-status-green',
      inception: 'None Detected',
      inceptionDesc: 'Continuous hydrostatic damping',
      inceptionColor: 'text-status-green',
      minMargin: '+26.6 kN',
      minMarginDesc: 'Normal buoyant string tension',
      peakLoad: '89.2 kN',
      cardClassification: 'Normal Full Pump Chamber',
    },
  }[selectedLoopKey];

  return (
    <div className={`bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col gap-3.5 ${className}`}>
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading text-base font-semibold text-ink">
              Full-Cycle Dynamometer Load Card
            </h3>
            <span className="px-2 py-0.5 rounded bg-surface-secondary text-ink font-mono text-[11px] font-semibold border border-border">
              {currentLoop.label}
            </span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                selectedLoopKey === 'current'
                  ? 'bg-red-500/10 text-status-crit border border-status-crit/30'
                  : selectedLoopKey === 'previous'
                  ? 'bg-amber-500/10 text-status-warn border border-status-warn/30'
                  : 'bg-emerald-500/10 text-status-green border border-status-green/30'
              }`}
            >
              {diagnosticData.cardClassification}
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
            Real-time polished rod displacement (m) vs string load (kN) coupled with mathematical downhole pump card projection and traveling valve timing.
          </p>
        </div>

        {/* View toggles & Cycle switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="inline-flex rounded-lg border border-border bg-surface-secondary p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setShowSurface(!showSurface)}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1.5 ${
                showSurface
                  ? 'bg-petroleum text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showSurface ? 'bg-white' : 'bg-petroleum'}`} />
              <span>Surface Loop</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDownhole(!showDownhole)}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1.5 ${
                showDownhole
                  ? 'bg-status-info text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showDownhole ? 'bg-white' : 'bg-status-info'}`} />
              <span>Downhole Pump</span>
            </button>
          </div>

          <div className="inline-flex rounded-lg border border-border bg-surface-secondary p-0.5">
            <button
              type="button"
              onClick={() => setSelectedLoopKey('current')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                selectedLoopKey === 'current'
                  ? 'bg-surface text-ink shadow-sm font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Current Cycle
            </button>
            <button
              type="button"
              onClick={() => setSelectedLoopKey('previous')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                selectedLoopKey === 'previous'
                  ? 'bg-surface text-ink shadow-sm font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Prev Cycle (24h)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLoopKey('baseline')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                selectedLoopKey === 'baseline'
                  ? 'bg-surface text-ink shadow-sm font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Pre-Steam Baseline
            </button>
          </div>
        </div>
      </div>

      {/* Sleek, Professional Engineering Legend Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-ink-muted font-sans flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded bg-petroleum inline-block" />
            <span className="text-ink text-xs font-medium">Surface Card (Polished Rod)</span>
            <span className="font-mono text-[11px] text-ink-muted">· Peak 88.4 kN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded bg-status-info inline-block" />
            <span className="text-ink text-xs font-medium">Downhole Card (Pump Projection)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t border-dashed border-status-info inline-block" />
            <span className="text-ink-secondary text-xs">Ideal 100% Envelope</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-status-crit font-mono font-medium flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-status-crit inline-block" />
            Yield Limit: 90.0 kN
          </span>
          <span className="text-ink-muted">·</span>
          <span className="font-mono text-ink-secondary">Inception: 2.80 m</span>
        </div>
      </div>

      {/* SVG Plotter with 1:1 proportional viewBox scale */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 1200 410"
          className="w-full h-auto min-w-[700px] select-none overflow-visible"
          role="img"
          aria-label="Full-Cycle Dynamometer Load Card"
        >
          {/* Grid Canvas Background */}
          <rect
            x="70"
            y="38"
            width="1070"
            height="312"
            rx="4"
            fill="var(--canvas-subtle)"
            opacity="0.4"
          />

          {/* Y-Axis Title (Cleanly at top-left, not rotated) */}
          <text
            x="70"
            y="25"
            className="font-mono text-[10.5px] font-semibold tracking-wider uppercase fill-ink-muted"
          >
            Polished Rod Load (kN)
          </text>

          {/* Horizontal grid lines & Y-axis labels */}
          {yTicks.map((val) => {
            const y = dy(val);
            const isZero = val === 0;
            return (
              <g key={`y-${val}`}>
                <line
                  x1="70"
                  y1={y}
                  x2="1140"
                  y2={y}
                  className={isZero ? 'stroke-border' : 'stroke-border-subtle'}
                  strokeWidth={isZero ? '1.5' : '1'}
                  strokeDasharray={isZero ? '' : '3 3'}
                />
                <text
                  x="60"
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="font-mono text-[10px] fill-ink-muted"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Rod Yield Limit Critical Line (90 kN) */}
          <g>
            <line
              x1="70"
              y1={dy(90)}
              x2="1140"
              y2={dy(90)}
              stroke="var(--status-crit)"
              strokeWidth="1"
              strokeDasharray="5 3"
              opacity="0.75"
            />
            <text
              x="1136"
              y={parseFloat(dy(90)) - 6}
              textAnchor="end"
              className="font-mono text-[10px] font-semibold fill-status-crit"
            >
              Yield Limit: 90.0 kN
            </text>
          </g>

          {/* Vertical grid lines & X-axis labels */}
          {xTicks.map((val) => {
            const x = dx(val);
            const isMajor = val === 0 || val === 1.0 || val === 2.0 || val === 3.0 || val === 4.0;
            return (
              <g key={`x-${val}`}>
                <line
                  x1={x}
                  y1="38"
                  x2={x}
                  y2="350"
                  className={isMajor ? 'stroke-border-subtle' : 'stroke-border-subtle/50'}
                  strokeWidth="1"
                  strokeDasharray={isMajor ? '' : '2 2'}
                />
                <text
                  x={x}
                  y="368"
                  textAnchor="middle"
                  className={`font-mono text-[10px] ${
                    isMajor ? 'fill-ink font-medium' : 'fill-ink-muted'
                  }`}
                >
                  {val.toFixed(1)}m
                </text>
              </g>
            );
          })}

          {/* X-Axis Title (Centered) */}
          <text
            x="605"
            y="392"
            textAnchor="middle"
            className="font-mono text-[10.5px] font-medium tracking-wider uppercase fill-ink-muted"
          >
            Polished Rod Displacement (m) · 3.65 m Total Stroke Length
          </text>

          {/* Ideal Theoretical 100% Full Pump Card Envelope */}
          <g>
            <rect
              x={dx(0.15)}
              y={dy(60)}
              width={parseFloat(dx(3.4)) - parseFloat(dx(0.15))}
              height={parseFloat(dy(14)) - parseFloat(dy(60))}
              rx="2"
              fill="rgba(56, 189, 248, 0.04)"
              stroke="var(--status-info)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={parseFloat(dx(0.22))}
              y={parseFloat(dy(60)) + 14}
              className="font-mono text-[9.5px] font-medium fill-status-info opacity-75 tracking-wider uppercase"
            >
              100% Ideal Pump Envelope
            </text>
          </g>

          {/* Downhole Projected Pump Card (Cyan) */}
          {showDownhole && (
            <g>
              <polyline
                points={downholePoly}
                fill="rgba(56, 189, 248, 0.14)"
                stroke="var(--status-info)"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Surface Polished Rod Card (Petroleum Gold) */}
          {showSurface && (
            <g>
              <polyline
                points={surfacePoly}
                fill="var(--petroleum-tint)"
                stroke="var(--petroleum)"
                strokeWidth="2.25"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Phase Annotations (Calibrated to match site typography) */}
          {showSurface && (
            <g>
              <text
                x={dx(1.8)}
                y={parseFloat(dy(88.4)) - 8}
                textAnchor="middle"
                className="font-mono text-[10px] font-medium fill-petroleum opacity-85"
              >
                ▲ Upstroke (Peak 88.4 kN)
              </text>
              <text
                x={dx(1.4)}
                y={parseFloat(dy(25.4)) + 15}
                textAnchor="middle"
                className="font-mono text-[10px] font-medium fill-ink-muted opacity-80"
              >
                ▼ Downstroke (Min 24.6 kN)
              </text>
            </g>
          )}

          {/* Fluid Pound Inception Callout (Cleanly proportioned) */}
          {currentLoop.fluidPoundPoint && (
            <g>
              {/* Vertical guideline */}
              <line
                x1={dx(currentLoop.fluidPoundPoint.x)}
                y1="38"
                x2={dx(currentLoop.fluidPoundPoint.x)}
                y2="350"
                stroke="var(--status-crit)"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.75"
              />

              {/* Point circle */}
              <circle
                cx={dx(currentLoop.fluidPoundPoint.x)}
                cy={dy(currentLoop.fluidPoundPoint.y)}
                r="7"
                fill="var(--status-crit)"
                opacity="0.25"
              />
              <circle
                cx={dx(currentLoop.fluidPoundPoint.x)}
                cy={dy(currentLoop.fluidPoundPoint.y)}
                r="3.5"
                fill="var(--status-crit)"
                stroke="var(--surface)"
                strokeWidth="1.5"
              />

              {/* Leader Line directed to the left into open plot area */}
              <polyline
                points={`
                  ${dx(currentLoop.fluidPoundPoint.x)},${dy(currentLoop.fluidPoundPoint.y)}
                  ${parseFloat(dx(currentLoop.fluidPoundPoint.x)) - 35},${parseFloat(dy(currentLoop.fluidPoundPoint.y)) - 25}
                  ${parseFloat(dx(currentLoop.fluidPoundPoint.x)) - 65},${parseFloat(dy(currentLoop.fluidPoundPoint.y)) - 25}
                `}
                fill="none"
                stroke="var(--status-crit)"
                strokeWidth="1"
              />

              {/* Callout Badge */}
              <rect
                x={parseFloat(dx(currentLoop.fluidPoundPoint.x)) - 265}
                y={parseFloat(dy(currentLoop.fluidPoundPoint.y)) - 38}
                width="200"
                height="26"
                rx="4"
                fill="var(--surface)"
                stroke="var(--status-crit)"
                strokeWidth="1"
                opacity="0.95"
              />

              <text
                x={parseFloat(dx(currentLoop.fluidPoundPoint.x)) - 165}
                y={parseFloat(dy(currentLoop.fluidPoundPoint.y)) - 21}
                textAnchor="middle"
                className="font-mono text-[10px] font-bold fill-status-crit"
              >
                ⚠ Fluid Pound @ 2.80 m (−71% fill)
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Dyno Diagnostic Summary Footer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-surface-secondary/70 rounded-xl border border-border text-xs">
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted text-[10px] uppercase tracking-wider font-semibold">
              Stroke Length
            </span>
            <Activity className="w-3.5 h-3.5 text-petroleum" />
          </div>
          <span className="font-mono font-bold text-ink text-sm">
            {diagnosticData.displacement}
          </span>
          <span className="text-[11px] text-ink-muted">Rated polished rod travel</span>
        </div>

        <div className="flex flex-col gap-1 p-2 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted text-[10px] uppercase tracking-wider font-semibold">
              Pump Barrel Fillage
            </span>
            <span className={`w-2 h-2 rounded-full ${selectedLoopKey === 'baseline' ? 'bg-status-green' : 'bg-status-crit animate-pulse'}`} />
          </div>
          <span className={`font-mono font-bold text-sm ${diagnosticData.fillageColor}`}>
            {diagnosticData.fillage}
          </span>
          <span className="text-[11px] text-ink-secondary">{diagnosticData.fillageStatus}</span>
        </div>

        <div className="flex flex-col gap-1 p-2 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted text-[10px] uppercase tracking-wider font-semibold">
              Pound Inception
            </span>
            {selectedLoopKey === 'baseline' ? (
              <CheckCircle className="w-3.5 h-3.5 text-status-green" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-status-crit" />
            )}
          </div>
          <span className={`font-mono font-bold text-sm ${diagnosticData.inceptionColor}`}>
            {diagnosticData.inception}
          </span>
          <span className="text-[11px] text-ink-secondary">{diagnosticData.inceptionDesc}</span>
        </div>

        <div className="flex flex-col gap-1 p-2 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted text-[10px] uppercase tracking-wider font-semibold">
              Minimum Load Margin
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-status-green" />
          </div>
          <span className="font-mono font-bold text-status-green text-sm">
            {diagnosticData.minMargin}
          </span>
          <span className="text-[11px] text-ink-secondary">{diagnosticData.minMarginDesc}</span>
        </div>
      </div>
    </div>
  );
};
