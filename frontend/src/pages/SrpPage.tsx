import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, ArrowRight, Gauge, Layers, Zap, ArrowDown, BatteryCharging, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DynamometerChart } from '../components/charts/DynamometerChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
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
    <div className="space-y-5">
      <SectionHeader
        title="Twin 3: Sucker Rod Pump (SRP) & Artificial Lift Diagnostics"
        subtitle="Downhole traveling valve kinematics, real-time dynamometer load loop decomposition, and 3-tier rod string Goodman fatigue stress tracking."
        badge="Attention: Fluid Pound @ 2.80m"
        badgeType="red"
      />

      {/* Causal Relationship Banner (Viscosity -> Load -> Fillage -> Efficiency -> Energy) */}
      <div className="bg-surface border border-border border-l-4 border-l-status-crit rounded-xl p-4 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-border mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-crit shrink-0" />
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-ink">
              Artificial Lift Physical Causal Propagation
            </span>
          </div>
          <span className="text-[10.5px] font-mono text-status-crit font-bold bg-status-crit-bg px-2 py-0.5 rounded border border-status-crit/30 self-start md:self-auto">
            Recommended Action: Trim VFD from 8.4 to 7.8 SPM
          </span>
        </div>

        {/* 5-Step Causal Cascade */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded bg-surface-secondary border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">1. Viscosity Rise</span>
            <span className="font-bold text-status-warn mt-1">+11% (84 cP)</span>
            <span className="text-[10px] text-ink-muted">Reservoir cooling</span>
          </div>

          <div className="p-2 rounded bg-surface-secondary border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">2. Higher Load</span>
            <span className="font-bold text-status-crit mt-1">+6.2% Drag</span>
            <span className="text-[10px] text-ink-muted">Downstroke drag</span>
          </div>

          <div className="p-2 rounded bg-surface-secondary border border-border-subtle flex flex-col items-center border-l-2 border-l-status-crit">
            <span className="text-[9.5px] text-ink-muted uppercase">3. Lower Fillage</span>
            <span className="font-bold text-status-crit mt-1">84.6% (−3.6%)</span>
            <span className="text-[10px] text-status-crit">Fluid pound @ 2.80m</span>
          </div>

          <div className="p-2 rounded bg-surface-secondary border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">4. Lower Efficiency</span>
            <span className="font-bold text-status-warn mt-1">86.2% (−4.1%)</span>
            <span className="text-[10px] text-ink-muted">Chamber deficit</span>
          </div>

          <div className="p-2 rounded bg-surface-secondary border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">5. Higher Energy</span>
            <span className="font-bold text-status-crit mt-1">+12.4% kWh/m³</span>
            <span className="text-[10px] text-ink-muted">34.8 kWh/m³</span>
          </div>
        </div>
      </div>

      {/* 8 Primary SRP Mechanical Diagnostics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Pump Fillage */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Fillage</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-status-crit mt-1.5">
            {twin.barrelFillage}%
          </div>
          <span className="text-[10px] text-status-crit mt-0.5 block truncate">Target &gt;90%</span>
        </div>

        {/* 2. Pump Efficiency */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Efficiency</span>
            <DataProvenanceBadge type="ESTIMATED" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-ink mt-1.5">
            86.2%
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5 block truncate">Volumetric</span>
        </div>

        {/* 3. Rod Load */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">PPRL Load</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-status-crit mt-1.5">
            {twin.peakPolishedRodLoad} <span className="text-[10px] text-ink-muted">kN</span>
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5 block truncate">Yield 90.0 kN</span>
        </div>

        {/* 4. Production Capacity */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Capacity</span>
            <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-petroleum mt-1.5">
            205 <span className="text-[10px] text-ink-muted">BOPD</span>
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5 block truncate">At 100% fill</span>
        </div>

        {/* 5. Energy Consumption */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Energy</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-status-warn mt-1.5">
            34.8 <span className="text-[10px] text-ink-muted">kWh/m³</span>
          </div>
          <span className="text-[10px] text-status-warn mt-0.5 block truncate">+12% vs base</span>
        </div>

        {/* 6. Floating Risk */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Floating</span>
            <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-status-green mt-1.5">
            Normal
          </div>
          <span className="text-[10px] text-status-green mt-0.5 block truncate">+24.6 kN margin</span>
        </div>

        {/* 7. Unsetting Risk */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Unsetting</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="font-mono text-xl font-bold text-status-green mt-1.5">
            None
          </div>
          <span className="text-[10px] text-status-green mt-0.5 block truncate">Anchor holding</span>
        </div>

        {/* 8. Abnormal Loading */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-subtle border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-semibold text-ink-muted truncate">Loading</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <div className="font-mono text-sm font-bold text-status-crit mt-2 leading-tight">
            Fluid Pound
          </div>
          <span className="text-[10px] text-status-crit mt-0.5 block truncate">@ 2.80 m stroke</span>
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
                  className={`hover:bg-canvas-subtle transition-colors ${
                    rod.stressRatio > 80 ? 'bg-status-warn-bg/30' : ''
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
                      <div className="w-16 h-1.5 bg-canvas rounded overflow-hidden">
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
