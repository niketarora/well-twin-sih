import React, { useEffect, useState } from 'react';
import { Flame, ArrowRight, CheckCircle2, Clock, AlertCircle, ArrowDown, Activity, Layers, Gauge, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { cssCycleService } from '../services';
import { CssCycleState } from '../types';

export const CssCyclePage: React.FC = () => {
  const [cycle, setCycle] = useState<CssCycleState | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<'injection' | 'soak' | 'production' | 'cooling'>('production');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cssCycleService.getCssCycle().then((data) => {
      setCycle(data);
      setLoading(false);
    });
  }, []);

  if (loading || !cycle) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="kpis" />
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const selectedPhase = cycle.phases.find((p) => p.id === selectedPhaseId) || cycle.phases[2];

  const osrChartData = cycle.history.map((h, i) => ({
    cycle: h.cycle,
    osr: h.osr,
    isActive: h.status === 'Active',
  }));

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Cyclic Steam Stimulation (CSS) Cycle Intelligence"
        subtitle="Multi-cycle steam injection surveillance, thermal soak decay kinetics, and thermodynamic oil–steam ratio (OSR) economic cutoffs."
        badge={`Cycle ${cycle.currentCycle} · Day ${cycle.dayInPhase} of ${cycle.totalPhaseDays}`}
        badgeType="amber"
      />

      {/* 4-Phase Progression (INJECTION -> SOAK -> PRODUCTION -> COOLING) */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
          <div>
            <h2 className="font-heading text-base font-semibold text-ink">
              CSS Lifecycle Progression: Injection → Soak → Production → Cooling
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Current state: Phase 3 (Production · Day 38 of 90) transitioning into gradual cooling phase
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-petroleum-tint text-petroleum font-bold border border-petroleum/30 self-start sm:self-auto">
            Cycle 4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {cycle.phases.map((phase) => {
            const isSelected = selectedPhaseId === phase.id;
            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface border-petroleum ring-1 ring-petroleum shadow-md'
                    : 'bg-surface hover:bg-surface-secondary/60 border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink-muted">
                      PHASE {phase.number}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        phase.state.includes('Active')
                          ? 'bg-status-warn-bg text-status-warn border-status-warn/40'
                          : phase.state.includes('Complete')
                          ? 'bg-status-green-bg text-status-green border-status-green/40'
                          : 'bg-surface-secondary text-ink-muted border-border'
                      }`}
                    >
                      {phase.state}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-ink mt-2">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-1 line-clamp-2">
                    {phase.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-2 gap-2 text-[11px] font-mono">
                  {phase.parameters.slice(0, 2).map((p, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-ink-muted text-[10px] truncate">{p.label}</span>
                      <span className="font-semibold text-ink truncate">{p.value} {p.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Thermodynamic Parameter Coupling Strip (Temp -> Viscosity -> Mobility -> Inflow -> Pump -> Production) */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
        <div className="flex items-center justify-between pb-2.5 border-b border-border mb-3">
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-ink">
            CSS Cycle Thermodynamic Bridge Pipeline
          </span>
          <span className="font-mono text-[11px] text-ink-muted">Physical Variable Transformation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 bg-surface-secondary rounded border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">1. Temperature</span>
            <span className="font-bold text-status-warn mt-1">214.8 °C</span>
            <span className="text-[10px] text-ink-muted">−0.04 °C/h</span>
          </div>

          <div className="p-2.5 bg-surface-secondary rounded border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">2. Viscosity</span>
            <span className="font-bold text-status-warn mt-1">84.0 cP</span>
            <span className="text-[10px] text-ink-muted">Andrade creep</span>
          </div>

          <div className="p-2.5 bg-surface-secondary rounded border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">3. Mobility</span>
            <span className="font-bold text-ink mt-1">4.88 mD/cP</span>
            <span className="text-[10px] text-ink-muted">k / μ ratio</span>
          </div>

          <div className="p-2.5 bg-surface-secondary rounded border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">4. Inflow</span>
            <span className="font-bold text-petroleum mt-1">205 BOPD</span>
            <span className="text-[10px] text-ink-muted">Radial delivery</span>
          </div>

          <div className="p-2.5 bg-surface-secondary rounded border border-border-subtle flex flex-col items-center border-l-2 border-l-status-crit">
            <span className="text-[9.5px] text-ink-muted uppercase">5. Pump Fillage</span>
            <span className="font-bold text-status-crit mt-1">84.6 %</span>
            <span className="text-[10px] text-status-crit">Fluid pound onset</span>
          </div>

          <div className="p-2.5 bg-surface-secondary rounded border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted uppercase">6. Surface Output</span>
            <span className="font-bold text-status-warn mt-1">184.2 BOPD</span>
            <span className="text-[10px] text-status-crit">−7.0% Deficit</span>
          </div>
        </div>
      </div>

      {/* Selected Phase Detail & OSR Progression Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: OSR Multi-Cycle History Bar Chart */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <h3 className="font-heading text-sm font-semibold text-ink">
                  Multi-Cycle Oil–Steam Ratio (OSR) Progression
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Thermodynamic recovery efficiency vs. economic cutoff threshold (0.18 m³/t)
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-status-warn">
                Floor: 0.18 m³/t
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={osrChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 11, fill: 'var(--ink)', fontWeight: 600 }} stroke="var(--border)" />
                  <YAxis domain={[0, 0.7]} unit=" m³/t" tick={{ fontSize: 10, fill: 'var(--ink-muted)' }} stroke="var(--border)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: 8,
                      color: 'var(--ink)',
                      fontSize: 11,
                      boxShadow: 'var(--shadow-card)',
                    }}
                    formatter={(val: any) => [`${val} m³/t`, 'Instantaneous OSR']}
                  />
                  <ReferenceLine
                    y={0.18}
                    stroke="var(--status-crit)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{ value: 'Economic Floor 0.18', fill: 'var(--status-crit)', fontSize: 10, position: 'insideTopRight' }}
                  />
                  <Bar dataKey="osr" radius={[4, 4, 0, 0]}>
                    {osrChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isActive ? 'var(--petroleum)' : 'var(--border-dark)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-border-subtle text-xs text-ink-secondary flex items-center justify-between">
            <span>Cycle 4 is pacing well above the cutoff. Projected economic floor occurs in ~52 days around day 90.</span>
          </div>
        </section>

        {/* Right: Selected Phase Parameter Deep-Dive */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-petroleum uppercase tracking-wider">
                  Phase {selectedPhase.number} Focus
                </span>
                <h3 className="font-heading text-sm font-semibold text-ink mt-0.5">
                  {selectedPhase.name} Verified Parameters
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink border border-border">
                {selectedPhase.state}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed mb-4">
              {selectedPhase.summary}
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              {selectedPhase.parameters.map((param, idx) => (
                <div key={idx} className="p-3 bg-surface-secondary rounded-lg border border-border-subtle flex items-center justify-between">
                  <span className="text-ink-secondary font-sans">{param.label}</span>
                  <span className="font-semibold text-ink text-sm">
                    {param.value} <span className="text-xs text-ink-muted font-normal">{param.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
            <span>Field Dispatched: Thermal SG-04</span>
            <span className="text-petroleum font-semibold">100.8% Target Met</span>
          </div>
        </section>
      </div>

      {/* Historical Cycles Comparison Table */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="pb-3 border-b border-border mb-4">
          <h3 className="font-heading text-base font-semibold text-ink">
            Baghewala Well BW-017 CSS Historical Performance Matrix
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Cross-cycle comparison of injected steam volume, total recovered bitumen, peak rates, and cycle lifetimes
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-secondary text-ink-secondary font-semibold text-[10.5px] uppercase tracking-wider border-b border-border">
                <th className="py-2.5 px-4">Cycle</th>
                <th className="py-2.5 px-4 text-right">Steam Injected</th>
                <th className="py-2.5 px-4 text-right">Cumulative Oil</th>
                <th className="py-2.5 px-4 text-right">OSR (m³/t)</th>
                <th className="py-2.5 px-4 text-right">Peak Rate</th>
                <th className="py-2.5 px-4">Cycle Duration</th>
                <th className="py-2.5 px-4">Lifecycle State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono">
              {cycle.history.map((h, i) => (
                <tr
                  key={i}
                  className={`hover:bg-canvas-subtle transition-colors ${
                    h.status === 'Active' ? 'bg-petroleum-tint font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-semibold text-ink flex items-center gap-2">
                    {h.status === 'Active' && <span className="w-2 h-2 rounded-full bg-petroleum animate-pulse" />}
                    {h.cycle}
                  </td>
                  <td className="py-3 px-4 text-right text-ink">
                    {h.steamInjectedTonnes.toLocaleString()} t
                  </td>
                  <td className="py-3 px-4 text-right text-ink">
                    {h.cumulativeOilBbl.toLocaleString()} bbl
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-petroleum">
                    {h.osr.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-ink">
                    {h.peakRateBOPD} BOPD
                  </td>
                  <td className="py-3 px-4 text-ink-secondary font-sans">
                    {h.durationDays} days
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <StatusBadge status={h.status} />
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
