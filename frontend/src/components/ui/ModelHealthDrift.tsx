import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowRight, Gauge, Activity, RefreshCw } from 'lucide-react';

interface ModelHealthDriftProps {
  className?: string;
}

export const ModelHealthDrift: React.FC<ModelHealthDriftProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const twins = [
    { name: 'Reservoir / Thermal', score: 96, status: 'Stable', isCrit: false },
    { name: 'Wellbore Hydrodynamics', score: 94, status: 'Stable', isCrit: false },
    { name: 'SRP Lift Dynamics', score: 89, status: 'Attention', isCrit: true },
    { name: 'Surface Production', score: 91, status: 'Stable', isCrit: false },
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${className}`}>
      {/* Model Health (7 Cols) */}
      <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-petroleum" />
              <h3 className="font-heading text-xs md:text-sm font-semibold text-ink">
                Coupled Model Health & Accuracy
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ink-muted">
                Validation: 14m ago
              </span>
              <span className="font-mono text-xs font-bold text-petroleum bg-petroleum-tint px-2 py-0.5 rounded border border-petroleum/30">
                OVERALL 93%
              </span>
            </div>
          </div>

          {/* Sub-models grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {twins.map((t) => (
              <div
                key={t.name}
                className="p-2.5 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-ink block">
                    {t.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.isCrit ? 'bg-status-crit animate-pulse' : 'bg-status-green'
                      }`}
                    />
                    <span
                      className={`text-[10.5px] font-medium ${
                        t.isCrit ? 'text-status-crit' : 'text-status-green-deep'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono text-base font-bold ${
                      t.isCrit ? 'text-status-crit' : 'text-ink'
                    }`}
                  >
                    {t.score}%
                  </span>
                  <div className="w-14 h-1.5 bg-canvas rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${
                        t.isCrit ? 'bg-status-crit' : 'bg-status-green'
                      }`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
          <span>Data Coverage: <strong className="font-mono text-ink">99.4%</strong> SCADA Telemetry</span>
          <span>Max Cross-Twin Residual: <strong className="font-mono text-status-warn">4.2% MAPE</strong></span>
        </div>
      </div>

      {/* Model Drift Warning (5 Cols) */}
      <div className="lg:col-span-5 bg-surface border border-border border-l-4 border-l-status-warn rounded-xl p-4 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-status-warn-deep flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-status-warn" />
              Model Drift Diagnostic
            </span>
            <span className="font-mono text-[11px] font-bold text-status-crit bg-status-crit-bg px-1.5 py-0.5 rounded border border-status-crit/30">
              7.0% Deficit
            </span>
          </div>

          <h4 className="font-heading text-xs md:text-sm font-semibold text-ink mt-2">
            Early Model Drift Detected on Production Twin
          </h4>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            Predicted <span className="font-mono font-semibold text-ink">198.0 BOPD</span> vs Actual <span className="font-mono font-semibold text-status-warn-deep">184.2 BOPD</span>.
          </p>

          <div className="mt-2.5 bg-surface-secondary p-2.5 rounded border border-border-subtle">
            <span className="text-[10px] uppercase font-semibold text-ink-muted tracking-wider block">
              Key Contributors:
            </span>
            <ul className="text-xs text-ink space-y-1 mt-1 font-mono">
              <li className="flex items-center justify-between">
                <span className="text-ink-secondary">• Reservoir cooling falloff</span>
                <span className="text-status-warn">−3.8 °C</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-secondary">• Downhole viscosity elevation</span>
                <span className="text-status-warn">+11.0 %</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-secondary">• Pump fillage restriction</span>
                <span className="text-status-crit">−3.6 %</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => navigate('/model-comparison')}
            className="w-full h-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold flex items-center justify-between px-3 transition-colors"
          >
            <span>Open Model Validation Deep Dive</span>
            <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
          </button>
        </div>
      </div>
    </div>
  );
};
