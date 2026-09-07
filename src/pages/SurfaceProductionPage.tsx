import React, { useEffect, useState } from 'react';
import { Activity, TrendingDown, Scale, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { SurfaceProductionTwinState } from '../types';
import { mockPredictedVsActualHistory, mockProductionWaterfall } from '../mock/digitalTwin/surfaceProduction';

export const SurfaceProductionPage: React.FC = () => {
  const [twin, setTwin] = useState<SurfaceProductionTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    digitalTwinService.getSurfaceProductionTwin().then((data) => {
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
        title="Twin 4: Surface Production Reconciled & Predicted vs. Actual"
        subtitle="Digital twin model production validation comparing physics-based reservoir inflow projections against test separator coriolis delivery."
        badge="Deviation: −7.0% Deficit"
        badgeType="amber"
      />

      {/* Production Scorecard Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Digital Twin Model Expected
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">{twin.netOilRatePredicted}</span>
            <span className="font-mono text-xs text-ink-muted">BOPD</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">
            P10–P90 Band: 191.5 – 204.5 BOPD
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle border-l-[3px] border-l-petroleum">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Actual Reconciled Net Oil
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-petroleum-deep">{twin.netOilRateActual}</span>
            <span className="font-mono text-xs text-ink-muted">BOPD</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 block">
            Separator Skid 03 (9.1° API)
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle border-l-[3px] border-l-status-crit">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Production Deficit Gap
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-crit">−{twin.productionGap}</span>
            <span className="font-mono text-xs text-ink-muted">BOPD</span>
          </div>
          <span className="text-[11px] text-status-crit font-medium mt-1 block">
            Deviation: {twin.deviationPct} % Off-Model
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-ink-muted block">
            Instantaneous OSR
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-green">{twin.instantaneousOSR}</span>
            <span className="font-mono text-xs text-ink-muted">m³/t</span>
          </div>
          <span className="text-[11px] text-status-green font-medium mt-1 block">
            Economic Floor 0.18 m³/t (~52d)
          </span>
        </div>
      </div>

      {/* MAJOR PRODUCTION CHART: Predicted vs Actual with Confidence Band */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-3 gap-2">
            <div>
              <h2 className="font-heading text-base font-semibold text-ink">
                Predicted vs. Actual Net Oil Production & Confidence Envelope
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Observed test separator delivery vs. coupled digital twin forecast with P10/P90 uncertainty band
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-petroleum-deep font-semibold flex items-center gap-1">
                ● Actual Rate (BOPD)
              </span>
              <span className="text-ink font-semibold flex items-center gap-1">
                -- Model Predicted
              </span>
              <span className="text-ink-muted flex items-center gap-1">
                ░ P10–P90 Band
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockPredictedVsActualHistory} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF0F3" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8B949E' }} />
                <YAxis domain={[170, 220]} unit=" BOPD" tick={{ fontSize: 10, fill: '#8B949E' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#17212B', borderColor: '#17212B', borderRadius: 8, color: '#FFFFFF', fontSize: 11 }}
                  formatter={(val: any, name: any) => [
                    `${val} BOPD`,
                    name === 'actual' ? 'Actual Observed' : name === 'predicted' ? 'Model Predicted' : name,
                  ]}
                />
                <ReferenceLine x="Day 38 (Today)" stroke="#D95C5C" strokeDasharray="4 4" label={{ value: 'Current: -13.8 BOPD Gap', fill: '#D95C5C', fontSize: 10 }} />
                {/* Confidence Envelope */}
                <Area type="monotone" dataKey="p10" stroke="none" fill="rgba(198, 154, 69, 0.08)" name="Upper P10" />
                <Area type="monotone" dataKey="p90" stroke="none" fill="rgba(255, 255, 255, 0.9)" name="Lower P90" />
                {/* Model Line */}
                <Line type="monotone" dataKey="predicted" stroke="#17212B" strokeWidth={2} strokeDasharray="5 4" dot={false} name="predicted" />
                {/* Actual Measured Line */}
                <Line type="monotone" dataKey="actual" stroke="#C69A45" strokeWidth={3} dot={{ r: 4, fill: '#C69A45', stroke: '#FFFFFF', strokeWidth: 2 }} name="actual" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-2 pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-secondary gap-2">
          <span>Production was in exact model agreement until Day 29, where fluid pound divergence triggered the widening -13.8 BOPD gap.</span>
          <span className="font-mono text-status-warn font-semibold">Model Drift Detection: Watch Status</span>
        </div>
      </section>

      {/* Production Gap Decomposition Waterfall Table */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="pb-3 border-b border-border mb-4">
          <h3 className="font-heading text-base font-semibold text-ink">
            Production Deficit Attribution Waterfall
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Physics-based bridge reconciling 205 BOPD reservoir inflow capacity to 184.2 BOPD surface tank delivery
          </p>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {mockProductionWaterfall.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                item.type === 'base'
                  ? 'bg-surface-secondary border-border font-semibold text-ink'
                  : item.type === 'subtotal'
                  ? 'bg-petroleum-tint border-petroleum/30 font-semibold text-petroleum-deep'
                  : item.type === 'final'
                  ? 'bg-status-green-bg border-status-green font-bold text-status-green-deep text-sm'
                  : 'bg-surface border-border-subtle text-status-crit'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-ink-muted font-sans font-normal">{idx + 1}.</span>
                <span className="font-sans font-medium text-ink">{item.step}</span>
              </div>
              <span className="font-semibold text-sm">
                {item.value > 0 && item.type === 'loss' ? `-${item.value}` : item.value} BOPD
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
