import React, { useState } from 'react';
import { mockDynoLoops } from '../../mock/digitalTwin/srp';

interface DynamometerChartProps {
  className?: string;
}

export const DynamometerChart: React.FC<DynamometerChartProps> = ({ className = '' }) => {
  const [selectedLoopKey, setSelectedLoopKey] = useState<'current' | 'previous' | 'baseline'>('current');

  const currentLoop = mockDynoLoops[selectedLoopKey];

  // Map displacement (0 to 4m) to SVG X (60 to 670)
  const dx = (x: number) => (60 + (x / 4) * 610).toFixed(1);
  // Map string load (0 to 120 kN) to SVG Y (338 down to 30)
  const dy = (y: number) => (338 - (y / 120) * 308).toFixed(1);

  const loopToPoints = (pts: number[][]) => pts.map(([x, y]) => `${dx(x)},${dy(y)}`).join(' ');

  const surfacePoly = loopToPoints(currentLoop.surface);
  const downholePoly = loopToPoints(currentLoop.downhole);

  const yTicks = [0, 20, 40, 60, 80, 100, 120];
  const xTicks = [0, 1.0, 2.0, 3.0, 4.0];

  return (
    <div className={`bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col gap-4 ${className}`}>
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-ink">
              Full-Cycle Dynamometer Load Card
            </h3>
            <span className="px-2 py-0.5 rounded bg-surface-secondary text-ink font-mono text-[11px] font-semibold border border-border">
              {currentLoop.label}
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Continuous surface rod displacement (m) vs string load (kN) with theoretical downhole projection
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex rounded-lg border border-border bg-surface-secondary p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedLoopKey('current')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              selectedLoopKey === 'current'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Current Cycle
          </button>
          <button
            type="button"
            onClick={() => setSelectedLoopKey('previous')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              selectedLoopKey === 'previous'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Prev Cycle (24h)
          </button>
          <button
            type="button"
            onClick={() => setSelectedLoopKey('baseline')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              selectedLoopKey === 'baseline'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Pre-Steam
          </button>
        </div>
      </div>

      {/* SVG Plotter */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 720 370"
          className="w-full h-auto min-w-[580px] select-none"
          role="img"
          aria-label="SRP Dyno Card Plot"
        >
          {/* Background grid */}
          <rect x="60" y="30" width="610" height="308" fill="#F8F9FA" />

          {/* Horizontal grid lines and Y-axis labels (Load in kN) */}
          {yTicks.map((val) => {
            const y = dy(val);
            return (
              <g key={`y-${val}`}>
                <line x1="60" y1={y} x2="670" y2={y} stroke="#E2E6EA" strokeWidth="1" strokeDasharray={val === 0 || val === 90 ? '' : '3 3'} />
                <text x="52" y={y} textAnchor="end" dominantBaseline="middle" className="font-mono text-[10px] fill-ink-muted">
                  {val} kN
                </text>
              </g>
            );
          })}

          {/* Section 2 Yield Limit Warning Line (90 kN) */}
          <line x1="60" y1={dy(90)} x2="670" y2={dy(90)} stroke="#D95C5C" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="660" y={parseFloat(dy(90)) - 6} textAnchor="end" className="font-mono text-[10px] font-semibold fill-status-crit">
            Rod Yield Limit: 90.0 kN
          </text>

          {/* Vertical grid lines and X-axis labels (Stroke displacement in m) */}
          {xTicks.map((val) => {
            const x = dx(val);
            return (
              <g key={`x-${val}`}>
                <line x1={x} y1="30" x2={x} y2="338" stroke="#E2E6EA" strokeWidth="1" />
                <text x={x} y="356" textAnchor="middle" className="font-mono text-[10px] fill-ink-muted">
                  {val.toFixed(1)} m
                </text>
              </g>
            );
          })}

          {/* Ideal Theoretical Pump Envelope */}
          <rect
            x={dx(0.15)}
            y={dy(60)}
            width={parseFloat(dx(3.4)) - parseFloat(dx(0.15))}
            height={parseFloat(dy(15)) - parseFloat(dy(60))}
            fill="rgba(79, 143, 196, 0.04)"
            stroke="#4F8FC4"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Downhole Pump Card */}
          <polyline
            points={downholePoly}
            fill="rgba(79, 143, 196, 0.12)"
            stroke="#4F8FC4"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Surface Polished Rod Card */}
          <polyline
            points={surfacePoly}
            fill="rgba(198, 154, 69, 0.10)"
            stroke="#C69A45"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Fluid Pound Callout if present */}
          {currentLoop.fluidPoundPoint && (
            <g>
              <circle
                cx={dx(currentLoop.fluidPoundPoint.x)}
                cy={dy(currentLoop.fluidPoundPoint.y)}
                r="6"
                fill="#D95C5C"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <line
                x1={dx(currentLoop.fluidPoundPoint.x)}
                y1={dy(currentLoop.fluidPoundPoint.y)}
                x2={parseFloat(dx(currentLoop.fluidPoundPoint.x)) + 35}
                y2={parseFloat(dy(currentLoop.fluidPoundPoint.y)) + 30}
                stroke="#D95C5C"
                strokeWidth="1.5"
              />
              <rect
                x={parseFloat(dx(currentLoop.fluidPoundPoint.x)) + 20}
                y={parseFloat(dy(currentLoop.fluidPoundPoint.y)) + 30}
                width="210"
                height="24"
                rx="4"
                fill="#17212B"
              />
              <text
                x={parseFloat(dx(currentLoop.fluidPoundPoint.x)) + 125}
                y={parseFloat(dy(currentLoop.fluidPoundPoint.y)) + 46}
                textAnchor="middle"
                className="font-mono text-[10.5px] font-semibold fill-white"
              >
                {currentLoop.fluidPoundPoint.label}
              </text>
            </g>
          )}

          {/* Legend */}
          <g transform="translate(70, 45)">
            <rect x="0" y="0" width="280" height="28" rx="4" fill="rgba(255,255,255,0.92)" stroke="#E2E6EA" />
            <line x1="12" y1="14" x2="32" y2="14" stroke="#C69A45" strokeWidth="2.5" />
            <text x="38" y="18" className="font-sans text-[11px] font-medium fill-ink">
              Surface Card (Peak 88.4 kN)
            </text>
            <line x1="170" y1="14" x2="190" y2="14" stroke="#4F8FC4" strokeWidth="2" />
            <text x="196" y="18" className="font-sans text-[11px] font-medium fill-ink">
              Downhole Projected
            </text>
          </g>
        </svg>
      </div>

      {/* Dyno Diagnostic Summary Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-surface-secondary rounded-lg border border-border-subtle text-xs">
        <div>
          <span className="text-ink-muted text-[11px] block">Pump Displacement</span>
          <span className="font-mono font-semibold text-ink text-sm">3.65 m stroke</span>
        </div>
        <div>
          <span className="text-ink-muted text-[11px] block">Calculated Fillage</span>
          <span className="font-mono font-semibold text-status-crit text-sm">84.6 % (Sluggish)</span>
        </div>
        <div>
          <span className="text-ink-muted text-[11px] block">Downstroke Inception</span>
          <span className="font-mono font-semibold text-status-crit text-sm">2.80 m (Pound)</span>
        </div>
        <div>
          <span className="text-ink-muted text-[11px] block">Minimum Load Margin</span>
          <span className="font-mono font-semibold text-status-green text-sm">+24.6 kN (No Float)</span>
        </div>
      </div>
    </div>
  );
};
