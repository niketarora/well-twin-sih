import React, { useEffect, useState } from 'react';
import { Activity, TrendingDown, Scale, CheckCircle2, AlertTriangle, ArrowDown, Droplets, Zap, Gauge } from 'lucide-react';
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
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
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
    <div className="space-y-5">
      <SectionHeader
        title="Twin 4: Surface Gathering & Reconciled Production"
        subtitle="Digital twin model production validation comparing physics-based reservoir inflow projections against test separator coriolis delivery."
        badge="Deviation: −7.0% Deficit"
        badgeType="amber"
      />

      {/* Production Scorecard Bento (Oil rate, Water rate, Predicted, Gap, CSOR, Energy, Decline) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Actual Oil Rate */}
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle border-l-[3px] border-l-status-warn">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-semibold text-ink-muted">Actual Net Oil</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-warn">{twin.netOilRateActual}</span>
            <span className="font-mono text-xs text-ink-muted">BOPD</span>
          </div>
          <span className="text-[10.5px] text-ink-muted mt-0.5 block">Separator Skid 03</span>
        </div>

        {/* 2. Predicted Oil Rate */}
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-semibold text-ink-muted">Model Predicted</span>
            <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-petroleum">{twin.netOilRatePredicted}</span>
            <span className="font-mono text-xs text-ink-muted">BOPD</span>
          </div>
          <span className="text-[10.5px] text-ink-muted mt-0.5 block">PINN Simulation</span>
        </div>

        {/* 3. Production Gap */}
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-semibold text-ink-muted">Production Gap</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-crit">−{twin.productionGap}</span>
            <span className="font-mono text-xs text-ink-muted">BOPD</span>
          </div>
          <span className="text-[10.5px] text-status-crit font-medium mt-0.5 block">Δ −7.0% Deficit</span>
        </div>

        {/* 4. Water Rate & Cut */}
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-semibold text-ink-muted">Water Rate</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">529.8</span>
            <span className="font-mono text-xs text-ink-muted">BWPD</span>
          </div>
          <span className="text-[10.5px] text-ink-muted mt-0.5 block">Water Cut: 74.2%</span>
        </div>

        {/* 5. Steam-Oil Ratio (SOR) */}
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-semibold text-ink-muted">Cum. CSOR</span>
            <DataProvenanceBadge type="ESTIMATED" size="sm" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-status-green">3.18</span>
            <span className="font-mono text-xs text-ink-muted">t/t</span>
          </div>
          <span className="text-[10.5px] text-status-green font-medium mt-0.5 block">Target &lt; 3.50</span>
        </div>

        {/* 6. Lift Energy & Decline */}
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-semibold text-ink-muted">Lift Energy</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-mono text-2xl font-bold text-ink">34.8</span>
            <span className="font-mono text-xs text-ink-muted">kWh/m³</span>
          </div>
          <span className="text-[10.5px] text-status-warn mt-0.5 block">Decline: −0.48 BOPD/d</span>
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
            <div className="flex items-center gap-3 font-mono text-xs self-start sm:self-auto">
              <span className="text-status-warn font-semibold flex items-center gap-1">
                ● Actual Rate (BOPD)
              </span>
              <span className="text-petroleum font-semibold flex items-center gap-1">
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--ink-muted)' }} stroke="var(--border)" />
                <YAxis domain={[170, 220]} unit=" BOPD" tick={{ fontSize: 10, fill: 'var(--ink-muted)' }} stroke="var(--border)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 8,
                    color: 'var(--ink)',
                    fontSize: 11,
                    boxShadow: 'var(--shadow-card)',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} BOPD`,
                    name === 'actual' ? 'Actual Observed' : name === 'predicted' ? 'Model Predicted' : name,
                  ]}
                />
                <ReferenceLine
                  x="Day 38 (Today)"
                  stroke="var(--status-crit)"
                  strokeDasharray="4 4"
                  label={{ value: 'Current: -13.8 BOPD Gap', fill: 'var(--status-crit)', fontSize: 10 }}
                />
                {/* Confidence Envelope */}
                <Area type="monotone" dataKey="p10" stroke="none" fill="var(--petroleum-tint)" name="Upper P10" />
                <Area type="monotone" dataKey="p90" stroke="none" fill="var(--surface)" name="Lower P90" />
                {/* Model Line */}
                <Line type="monotone" dataKey="predicted" stroke="var(--petroleum)" strokeWidth={2} strokeDasharray="5 4" dot={false} name="predicted" />
                {/* Actual Measured Line */}
                <Line type="monotone" dataKey="actual" stroke="var(--status-warn)" strokeWidth={3} dot={{ r: 4, fill: 'var(--status-warn)', stroke: 'var(--surface)', strokeWidth: 2 }} name="actual" />
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
                  ? 'bg-petroleum-tint border-petroleum/30 font-semibold text-petroleum'
                  : item.type === 'final'
                  ? 'bg-status-green-bg border-status-green font-bold text-status-green text-sm'
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
