import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, ArrowRight, Gauge, Layers, Zap } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DynamometerChart } from '../components/charts/DynamometerChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { SrpTwinState } from '../types';
import { mockRodTaperAnalysis } from '../mock/digitalTwin/srp';

export const SrpPage: React.FC = () => {
  const [twin, setTwin] = useState<SrpTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    digitalTwinService.getSrpTwin().then((data) => {
      setTwin(data);
      setLoading(false);
    });
  }, []);

  if (loading || !twin) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Twin 3: Sucker Rod Pump (SRP) & Artificial Lift Diagnostics"
        subtitle="Downhole traveling valve kinematics, real-time dynamometer load loop decomposition, and 3-tier rod string Goodman fatigue stress tracking."
        badge="Attention: Fluid Pound @ 2.80m"
        badgeType="red"
      />

      {/* Causal Chain Banner */}
      <div className="bg-surface border border-border border-l-4 border-l-status-crit rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-crit shrink-0" />
          <div className="leading-snug">
            <span className="font-heading font-semibold text-ink">Active Causal Physics Coupling:</span>
            <span className="text-ink-secondary ml-1.5">
              Reservoir Cooling (−0.04°C/h) → Viscosity Creep (84 cP) → Inflow Lag → Pump Fillage Drop (84.6%) → Downstroke Fluid Pound @ 2.80 m → Section-2 Rod Stress (81.5%).
            </span>
          </div>
        </div>
        <span className="font-mono text-status-crit-deep font-semibold whitespace-nowrap bg-status-crit-bg px-2 py-1 rounded">
          Recommended: Trim VFD to 8.0 SPM
        </span>
      </div>

      {/* 5 Primary SRP Mechanical KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">Kinematic Speed</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.strokeRate}</span>
            <span className="font-mono text-xs text-ink-muted">SPM</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">Target 8.50 SPM · VFD 42.8 Hz</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">Stroke Length</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.strokeLength}</span>
            <span className="font-mono text-xs text-ink-muted">m</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">Effective stroke 3.08 m</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle border-l-[3px] border-l-status-crit">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">Pump Vol. Fillage</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-crit">{twin.barrelFillage}</span>
            <span className="font-mono text-xs text-ink-muted">%</span>
          </div>
          <span className="text-[11px] text-status-crit font-medium mt-1 block">Design Floor: 90.0 %</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle border-l-[3px] border-l-status-crit">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">Peak Polished Rod Load</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-crit">{twin.peakPolishedRodLoad}</span>
            <span className="font-mono text-xs text-ink-muted">kN</span>
          </div>
          <span className="text-[11px] text-status-crit font-medium mt-1 block">Yield Limit: 90.0 kN</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">Gearbox Torque</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.gearboxTorquePct}</span>
            <span className="font-mono text-xs text-ink-muted">%</span>
          </div>
          <span className="text-[11px] text-status-green font-medium mt-1 block">265.4 of 456 kN·m Rating</span>
        </div>
      </div>

      {/* Interactive Full-Cycle Dynamometer Card */}
      <DynamometerChart />

      {/* Rod String Fatigue & Tapered Section Stress Table */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
          <div>
            <h3 className="font-heading text-base font-semibold text-ink">
              Tapered Rod String Goodman Stress Analysis
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Calculated cyclic fatigue loading, Goodman stress margins, and buoyancy corrections across Norris 97 special alloy
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-secondary px-3 py-1.5 rounded-lg border border-border self-start sm:self-auto text-xs">
            <span className="font-medium text-ink">Total String Yield Margin:</span>
            <span className="font-mono font-bold text-status-green">+48.0 MPa</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-secondary text-ink-secondary font-semibold text-[10.5px] uppercase tracking-wider border-b border-border">
                <th className="py-2.5 px-4">Rod Section</th>
                <th className="py-2.5 px-4">Material Specification</th>
                <th className="py-2.5 px-3">Diameter</th>
                <th className="py-2.5 px-4">Depth Interval</th>
                <th className="py-2.5 px-4 text-right">Peak Stress</th>
                <th className="py-2.5 px-4 text-right">Yield Limit</th>
                <th className="py-2.5 px-4">Stress Ratio (%)</th>
                <th className="py-2.5 px-4">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {mockRodTaperAnalysis.map((rod, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-canvas/80 transition-colors ${
                    rod.stressRatio > 80 ? 'bg-status-warn-bg/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-semibold text-ink">{rod.section}</td>
                  <td className="py-2.5 px-4 text-ink-secondary">{rod.material}</td>
                  <td className="py-2.5 px-3 font-mono text-ink">{rod.diameter}</td>
                  <td className="py-2.5 px-4 font-mono text-ink-muted">{rod.interval}</td>
                  <td className="py-2.5 px-4 font-mono text-right font-semibold text-ink">
                    {rod.peakStress} MPa
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-ink-muted">
                    {rod.yieldLimit} MPa
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-subtle rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${rod.stressRatio}%`,
                            backgroundColor: rod.statusColor,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold" style={{ color: rod.statusColor }}>
                        {rod.stressRatio} %
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={rod.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
