import React, { useEffect, useState } from 'react';
import { Layers, ArrowDown, ShieldCheck, Thermometer, Gauge, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { WellboreTwinState } from '../types';
import { mockWellboreDepthProfile } from '../mock/digitalTwin/wellbore';

export const WellborePage: React.FC = () => {
  const [twin, setTwin] = useState<WellboreTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    digitalTwinService.getWellboreTwin().then((data) => {
      setTwin(data);
      setLoading(false);
    });
  }, []);

  if (loading || !twin) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Twin 2: Wellbore Hydraulics & Inflow Dynamics"
        subtitle="Multiphase Beggs–Brill pipe hydraulics propagating thermal reservoir drawdown up the 7-inch casing toward the downhole sucker rod pump intake."
        badge="Zero Gas Lock / Stable Inflow"
        badgeType="green"
      />

      {/* Critical Pump Intake Conditions Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Pump Intake Pressure (PIP)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.pumpIntakePressure}</span>
            <span className="font-mono text-xs text-ink-muted">bar</span>
          </div>
          <span className="text-[11px] text-status-green font-medium mt-1 block">
            Safe Submergence: +7.0 bar
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Pump Intake Temp (PIT)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.pumpIntakeTemperature}</span>
            <span className="font-mono text-xs text-ink-muted">°C</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">
            Thermal gradient 0.12 °C/m
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle border-l-[3px] border-l-status-warn">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Fluid Viscosity @ Intake
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-warn">{twin.pumpIntakeViscosity}</span>
            <span className="font-mono text-xs text-ink-muted">cP</span>
          </div>
          <span className="text-[11px] text-status-warn font-medium mt-1 block">
            Elevated Drag (+8 cP vs Res)
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Multiphase Flow Regime
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-lg font-bold text-ink leading-tight">{twin.flowRegime}</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">
            Uniform emulsion mix
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Sand & Solids Influx
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.sandInfluxPct}</span>
            <span className="font-mono text-xs text-ink-muted">%</span>
          </div>
          <span className="text-[11px] text-status-green font-medium mt-1 block">
            Liner Screen Intact (&lt; 0.25%)
          </span>
        </div>
      </div>

      {/* Wellbore Schematic & Depth Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: TVD Depth vs Pressure & Temperature Trajectory Chart */}
        <section className="lg:col-span-8 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <h3 className="font-heading text-sm font-semibold text-ink">
                  Wellbore Depth Profiles: Pressure (bar) & Temperature (°C)
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Surface wellhead (0 m) down to perfs midpoint (1,280 m TVD)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-petroleum flex items-center gap-1">● Pressure (bar)</span>
                <span className="text-status-info flex items-center gap-1">● Temp (°C)</span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockWellboreDepthProfile} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF0F3" />
                  <XAxis dataKey="depth" unit=" m TVD" tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#17212B', borderColor: '#17212B', borderRadius: 8, color: '#FFFFFF', fontSize: 11 }}
                    formatter={(val: any, name: any) => [val, name === 'pressure' ? 'Pressure (bar)' : 'Temp (°C)']}
                    labelFormatter={(depth: any) => `TVD Depth: ${depth} m`}
                  />
                  <ReferenceLine x={428.5} stroke="#C69A45" strokeDasharray="4 4" label={{ value: 'Pump Intake 428.5m', fill: '#C69A45', fontSize: 10 }} />
                  <ReferenceLine x={1280} stroke="#3FA66B" strokeDasharray="4 4" label={{ value: 'Perfs 1280m', fill: '#3FA66B', fontSize: 10 }} />
                  <Line type="monotone" dataKey="pressure" stroke="#C69A45" strokeWidth={2} dot={{ r: 4, fill: '#C69A45' }} name="pressure" />
                  <Line type="monotone" dataKey="temperature" stroke="#4F8FC4" strokeWidth={2} dot={{ r: 4, fill: '#4F8FC4' }} name="temperature" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border-subtle grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-ink-secondary">
            <div><strong>Casing:</strong> 7" 26# L-80</div>
            <div><strong>Tubing:</strong> 3.5" EUE J-55</div>
            <div><strong>Fluid SG:</strong> 0.982 kg/m³</div>
            <div><strong>Head:</strong> 31.2 bar Hydrostatic</div>
          </div>
        </section>

        {/* Right: Structural Wellbore Schematic Progression */}
        <section className="lg:col-span-4 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-border mb-3">
              <h3 className="font-heading text-sm font-semibold text-ink">
                Completion Schematic Trace
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">Physical component hierarchy</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <span className="font-semibold text-ink">Surface Wellhead (WHP)</span>
                <span className="text-ink-muted">0 m TVD · 18.4 bar</span>
              </div>
              <div className="flex justify-center my-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-ink-muted" />
              </div>
              <div className="p-2.5 rounded bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <span className="font-semibold text-ink">7" Production Casing</span>
                <span className="text-ink-muted">0 – 1,280 m</span>
              </div>
              <div className="flex justify-center my-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-ink-muted" />
              </div>
              <div className="p-2.5 rounded bg-petroleum-tint border border-petroleum/40 flex items-center justify-between">
                <span className="font-semibold text-petroleum-deep">SRP Pump Intake & Gas Anchor</span>
                <span className="text-ink-secondary">428.5 m · 38.2 bar</span>
              </div>
              <div className="flex justify-center my-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-ink-muted" />
              </div>
              <div className="p-2.5 rounded bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <span className="font-semibold text-ink">Slotted Sand Control Screen</span>
                <span className="text-ink-muted">950 – 1,280 m</span>
              </div>
              <div className="flex justify-center my-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-ink-muted" />
              </div>
              <div className="p-2.5 rounded bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <span className="font-semibold text-ink">Mandhali Formation Midpoint</span>
                <span className="text-status-green font-semibold">1,280 m · 42.6 bar</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle text-xs text-ink-secondary">
            <strong className="text-ink">Engineer Interpretation:</strong> No gas locking or sand bridge observed. Thermal fluid transport between perforations and pump intake is smooth, but fluid viscosity elevates by +8 cP as temperature cools from 214.8°C to 184.2°C along the column.
          </div>
        </section>
      </div>
    </div>
  );
};
