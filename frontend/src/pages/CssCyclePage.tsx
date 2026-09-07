import React, { useEffect, useState } from 'react';
import { Flame, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
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
    <div className="space-y-6">
      <SectionHeader
        title="Cyclic Steam Stimulation (CSS) Cycle Intelligence"
        subtitle="Multi-cycle steam injection monitoring, thermal soak falloff tracking, and thermodynamic oil–steam ratio (OSR) economic floor forecasting."
        badge={`Cycle ${cycle.currentCycle} · Day ${cycle.dayInPhase} of ${cycle.totalPhaseDays}`}
        badgeType="amber"
      />

      {/* 4 Primary CSS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Cumulative Steam Injected
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">
              {cycle.cumulativeSteamInjected.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-ink-muted">tonnes</span>
          </div>
          <span className="text-[11px] text-status-green font-medium mt-1 block">
            Target Compliance: {cycle.targetCompliancePct}%
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Mean Injection Pressure
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">
              {cycle.meanInjectionPressure}
            </span>
            <span className="font-mono text-xs text-ink-muted">bar</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">
            Fracture Safety Margin: +{cycle.fractureMarginBar} bar
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Cumulative Oil This Cycle
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">
              {cycle.cumulativeOilThisCycle.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-ink-muted">bbl</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">
            50.7% of {cycle.cycleTargetOilBbl.toLocaleString()} bbl target
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle border-l-[3px] border-l-status-green">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Instantaneous OSR
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-green">
              {cycle.instantaneousOSR}
            </span>
            <span className="font-mono text-xs text-ink-muted">m³/t</span>
          </div>
          <span className="text-[11px] text-status-green font-medium mt-1 block">
            +{((cycle.instantaneousOSR - cycle.economicCutoffOSR)).toFixed(2)} above economic floor
          </span>
        </div>
      </div>

      {/* 4-Phase Lifecycle Progression Banner */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <h2 className="font-heading text-base font-semibold text-ink">
            Cycle 4 Operational Lifecycle Phases
          </h2>
          <span className="text-xs text-ink-muted">Click any phase to view verified telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          ? 'bg-status-warn-bg text-status-warn-deep border-status-warn'
                          : phase.state.includes('Complete')
                          ? 'bg-status-green-bg text-status-green-deep border-status-green'
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

      {/* Selected Phase Detail & OSR Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: OSR Multi-Cycle History Bar Chart */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <h3 className="font-heading text-sm font-semibold text-ink">
                  Multi-Cycle Oil–Steam Ratio (OSR) Progression
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Historical thermodynamic efficiency vs. economic cutoff threshold (0.18 m³/t)
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-status-warn">
                Floor: 0.18 m³/t
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={osrChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF0F3" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 11, fill: '#17212B', fontWeight: 600 }} />
                  <YAxis domain={[0, 0.7]} unit=" m³/t" tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#17212B', borderColor: '#17212B', borderRadius: 8, color: '#FFFFFF', fontSize: 11 }}
                    formatter={(val: any) => [`${val} m³/t`, 'Instantaneous OSR']}
                  />
                  <ReferenceLine y={0.18} stroke="#D95C5C" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: 'Economic Floor 0.18', fill: '#D95C5C', fontSize: 10, position: 'insideTopRight' }} />
                  <Bar dataKey="osr" radius={[4, 4, 0, 0]}>
                    {osrChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isActive ? '#C69A45' : '#D1D7DC'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-border-subtle text-xs text-ink-secondary flex items-center justify-between">
            <span>Cycle 4 is pacing well above the cutoff. Projected economic cutoff occurs in ~52 days around day 90.</span>
          </div>
        </section>

        {/* Right: Selected Phase Parameter Deep-Dive */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-petroleum-deep uppercase tracking-wider">
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
            <span className="text-petroleum-deep font-semibold">100.8% Target Met</span>
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
                  className={`hover:bg-canvas/80 transition-colors ${
                    h.status === 'Active' ? 'bg-petroleum-tint/50 font-semibold' : ''
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
                  <td className="py-3 px-4 text-right font-bold text-petroleum-deep">
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
