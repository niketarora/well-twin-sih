import React, { useEffect, useState } from 'react';
import { Flame, Layers, TrendingDown, Thermometer, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SteamPlumeSvg } from '../components/charts/SteamPlumeSvg';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { ReservoirTwinState } from '../types';
import { mockViscosityVsTempCurve, mockReservoirThermalTrajectory } from '../mock/digitalTwin/reservoir';

export const ReservoirPage: React.FC = () => {
  const [twin, setTwin] = useState<ReservoirTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    digitalTwinService.getReservoirTwin().then((data) => {
      setTwin(data);
      setLoading(false);
    });
  }, []);

  if (loading || !twin) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Twin 1: Reservoir / Thermal Simulation"
        subtitle="Hydro-thermal energy transport, steam chamber growth, and temperature-dependent viscosity attenuation across the Eocene Mandhali heavy sand."
        badge="Cycle 4 · Soak Decay"
        badgeType="amber"
      />

      {/* Grouped Input / In-situ Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: CSS Injection Parameters */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
              <Flame className="w-4 h-4 text-petroleum" />
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-ink">
                CSS Injection Stage Inputs
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Cumulative Steam</span>
                <span className="font-mono font-medium text-ink">12,400 tonnes</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Wellhead Pressure</span>
                <span className="font-mono font-medium text-ink">115.0 bar</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Steam Quality</span>
                <span className="font-mono font-medium text-ink">80.0 % dry saturated</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Injection Duration</span>
                <span className="font-mono font-medium text-ink">14.0 days</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Soak Interval</span>
                <span className="font-mono font-medium text-ink">7.0 days (Complete)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
            <span>Cycle Sequence</span>
            <span className="font-semibold text-ink">CSS Cycle 4 of 6</span>
          </div>
        </div>

        {/* Card 2: Reservoir Thermal State */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
              <Thermometer className="w-4 h-4 text-status-warn" />
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-ink">
                Reservoir In-Situ State
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Reservoir Temperature</span>
                <div className="text-right">
                  <span className="font-mono font-semibold text-ink">214.8 °C</span>
                  <span className="text-[10px] text-status-green ml-1 font-semibold">OBSERVED</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Formation Pressure</span>
                <div className="text-right">
                  <span className="font-mono font-semibold text-ink">42.6 bar</span>
                  <span className="text-[10px] text-status-green ml-1 font-semibold">OBSERVED</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Cooling Decay Rate</span>
                <div className="text-right">
                  <span className="font-mono font-semibold text-status-warn">−0.040 °C/h</span>
                  <span className="text-[10px] text-ink-muted ml-1 font-semibold">ESTIMATED</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Thermal Boundary Enthalpy</span>
                <span className="font-mono font-medium text-ink">2,480 kJ/kg</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Overburden Shale Bleed</span>
                <span className="font-mono font-medium text-status-warn">14.8 %</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
            <span>Thermal Retention</span>
            <span className="font-mono font-semibold text-ink">68.4 % Net Heat</span>
          </div>
        </div>

        {/* Card 3: Bitumen Mobility & Fluid Outputs */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
              <Layers className="w-4 h-4 text-petroleum" />
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-ink">
                Bitumen Mobility & Fluid
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">In-Situ Oil Viscosity</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-status-warn text-sm">84.0 cP</span>
                  <span className="text-[10px] text-petroleum ml-1 font-semibold">PINN MODEL</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Cold Dead-Oil Baseline</span>
                <span className="font-mono text-ink-muted">8,500 cP @ 50°C</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Bitumen Mobility (k/μ)</span>
                <span className="font-mono font-medium text-ink">4.88 mD/cP</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Radial Inflow Potential</span>
                <span className="font-mono font-semibold text-ink">205.0 BOPD</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted">Oil FVF (Bo)</span>
                <span className="font-mono font-medium text-ink">1.12 m³/std m³</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
            <span>Model Confidence</span>
            <span className="font-mono font-semibold text-status-green">96% PINN Fit</span>
          </div>
        </div>
      </div>

      {/* Visual Plume & Thermal Trajectory Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Steam Plume Isotherm Graphic */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-xl p-5 shadow-subtle">
          <SteamPlumeSvg radius={twin.steamChamberRadius} temperature={twin.temperature} />
          <div className="mt-3 p-3 bg-surface-secondary rounded-lg border border-border-subtle text-xs leading-relaxed text-ink-secondary">
            <strong className="text-ink">Thermal Model Insight:</strong> Steam chamber radius is holding at 18.4 m with high matrix swept volume (11,400 m³). Bounding caprock shales at TVD 1,142 m absorb 14.8% of conductive heat flux.
          </div>
        </div>

        {/* Right: In-Situ Viscosity vs Temperature Curve */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <h3 className="font-heading text-sm font-semibold text-ink">
                  Baghewala Crude Viscosity vs. Temperature Relationship
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Andrade exponential curve calibrated from dead-oil PVT laboratory bomb tests
                </p>
              </div>
              <span className="text-[11px] font-mono text-petroleum-deep bg-petroleum-tint px-2 py-0.5 rounded border border-petroleum/30">
                Operating Point: 214.8°C / 84 cP
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockViscosityVsTempCurve} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF0F3" />
                  <XAxis dataKey="temp" unit="°C" tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <YAxis unit=" cP" tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#17212B', borderColor: '#17212B', borderRadius: 8, color: '#FFFFFF', fontSize: 11 }}
                    formatter={(value: any) => [`${value} cP`, 'Viscosity']}
                    labelFormatter={(label: any) => `Temperature: ${label}°C`}
                  />
                  <ReferenceLine x={214.8} stroke="#D95C5C" strokeDasharray="3 3" label={{ value: 'Current: 214.8°C', fill: '#D95C5C', fontSize: 10 }} />
                  <Line type="monotone" dataKey="viscosity" stroke="#C69A45" strokeWidth={2.5} dot={{ r: 4, fill: '#C69A45' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 text-xs text-ink-secondary flex items-center justify-between border-t border-border-subtle pt-2">
            <span>Notice: Viscosity increases exponentially below 180°C. Maintaining BHT above 190°C is critical to avoid severe lift lock.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
