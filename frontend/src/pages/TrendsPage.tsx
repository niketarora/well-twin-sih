import React, { useState } from 'react';
import { LineChart as LucideLineChart, Filter, Calendar, Info, ArrowDown, ArrowUp } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { SectionHeader } from '../components/ui/SectionHeader';
import { mockTimeseries } from '../mock/telemetry';

export const TrendsPage: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'netOil' | 'liquid' | 'water' | 'viscosity' | 'fillage'>('netOil');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'cycle'>('cycle');

  // Format data according to selected time range
  const cutCount = timeRange === '7d' ? 5 : timeRange === '30d' ? 14 : mockTimeseries.days.length;
  const days = mockTimeseries.days.slice(-cutCount);
  const netOil = mockTimeseries.netOil.slice(-cutCount);
  const liquid = mockTimeseries.liquid.slice(-cutCount);
  const water = mockTimeseries.water.slice(-cutCount);
  const bht = mockTimeseries.bht.slice(-cutCount);
  const viscosity = mockTimeseries.viscosity.slice(-cutCount);
  const fillage = mockTimeseries.fillage.slice(-cutCount);

  const chartData = days.map((d, i) => ({
    day: `Day ${d}`,
    dayNum: d,
    netOil: netOil[i],
    liquid: liquid[i],
    water: water[i],
    bht: bht[i],
    viscosity: viscosity[i],
    fillage: fillage[i],
  }));

  const metricMeta = {
    netOil: { label: 'Net Oil Production', unit: 'BOPD', color: '#C69A45', domain: [60, 340] },
    liquid: { label: 'Gross Liquid Rate', unit: 'BFPD', color: '#4F8FC4', domain: [150, 420] },
    water: { label: 'Water Cut', unit: '%', color: '#66717C', domain: [15, 50] },
    viscosity: { label: 'In-Situ Viscosity', unit: 'cP', color: '#D49A3A', domain: [20, 100] },
    fillage: { label: 'Pump Fillage', unit: '%', color: '#D95C5C', domain: [75, 100] },
  };

  const currentMeta = metricMeta[selectedMetric];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Telemetry Trends & Subsurface Analytics"
        subtitle="Multi-parameter correlation over time. Compare production, thermal cooling gradient, and artificial-lift kinematics across operational horizons."
      />

      {/* Controls Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Metric Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted uppercase mr-1">Metric:</span>
          {(['netOil', 'liquid', 'water', 'viscosity', 'fillage'] as const).map((key) => {
            const meta = metricMeta[key];
            const isSelected = selectedMetric === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-surface text-ink border-petroleum shadow-sm'
                    : 'bg-surface-secondary text-ink-secondary border-border hover:text-ink'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Time Range Switcher */}
        <div className="inline-flex rounded-lg border border-border bg-surface-secondary p-0.5 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              timeRange === '7d' ? 'bg-surface text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              timeRange === '30d' ? 'bg-surface text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('cycle')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              timeRange === 'cycle' ? 'bg-surface text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Full Cycle 4
          </button>
        </div>
      </div>

      {/* Primary Trend Chart with Dual Axis (Selected Metric vs. BHT °C) */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-3 gap-2">
            <div>
              <h2 className="font-heading text-base font-semibold text-ink flex items-center gap-2">
                <span>{currentMeta.label} ({currentMeta.unit}) vs. Bottomhole Temperature (BHT °C)</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Observed post-soak flush drawdown, thermal dissipation slope, and choke events
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="flex items-center gap-1 font-semibold" style={{ color: currentMeta.color }}>
                ● {currentMeta.label} ({currentMeta.unit})
              </span>
              <span className="text-status-info flex items-center gap-1 font-semibold">
                -- Bottomhole Temp (°C)
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF0F3" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8B949E' }} />
                {/* Left Y Axis: Selected Metric */}
                <YAxis
                  yAxisId="left"
                  domain={currentMeta.domain}
                  unit={` ${currentMeta.unit}`}
                  tick={{ fontSize: 10, fill: '#8B949E' }}
                />
                {/* Right Y Axis: BHT */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[200, 260]}
                  unit=" °C"
                  tick={{ fontSize: 10, fill: '#4F8FC4' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#17212B', borderColor: '#17212B', borderRadius: 8, color: '#FFFFFF', fontSize: 11 }}
                  formatter={(val: any, name: any) => [
                    `${val} ${name === 'bht' ? '°C' : currentMeta.unit}`,
                    name === 'bht' ? 'Bottomhole Temp' : currentMeta.label,
                  ]}
                />
                {/* Event Markers */}
                {timeRange === 'cycle' && (
                  <>
                    <ReferenceLine yAxisId="left" x="Day 9" stroke="#B6BDC5" strokeDasharray="3 3" label={{ value: 'Peak Flush (310 BOPD)', fill: '#66717C', fontSize: 10, position: 'top' }} />
                    <ReferenceLine yAxisId="left" x="Day 21" stroke="#B6BDC5" strokeDasharray="3 3" label={{ value: 'Choke set 24/64"', fill: '#66717C', fontSize: 10, position: 'top' }} />
                  </>
                )}
                {/* BHT Line on Right Axis */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bht"
                  stroke="#4F8FC4"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                  name="bht"
                />
                {/* Selected Metric Line on Left Axis */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={currentMeta.color}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: currentMeta.color }}
                  name={selectedMetric}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-secondary gap-2">
          <span>Correlation: As BHT cooling proceeds at -0.04 °C/h, in-situ viscosity rises from 32 cP to 84 cP, creating hydraulic drawdown resistance.</span>
          <span className="font-mono text-petroleum-deep font-semibold">Pearson r = −0.94</span>
        </div>
      </section>

      {/* Cycle 4 Changes Attribution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider">Net Oil Rate</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-mono text-lg font-bold text-ink">310 → 184.2</span>
            <span className="font-mono text-xs font-semibold text-status-warn">−40.6 %</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 leading-snug">Natural post-flush decline, tracks model curve.</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider">Bottomhole Temp</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-mono text-lg font-bold text-ink">248.5 → 214.8</span>
            <span className="font-mono text-xs font-semibold text-status-warn">−33.7 °C</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 leading-snug">Conductive loss to bounding shale, −0.04 °C/h.</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider">Water Cut</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-mono text-lg font-bold text-ink">22.0 → 42.4</span>
            <span className="font-mono text-xs font-semibold text-status-info">+20.4 pt</span>
          </div>
          <span className="text-[11px] text-ink-muted mt-1 leading-snug">Steam condensate return, expected for Day 38.</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col justify-between border-l-4 border-l-status-crit">
          <span className="text-[11px] font-semibold text-status-crit uppercase tracking-wider">Pump Fillage</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-mono text-lg font-bold text-status-crit">88.2 → 84.6</span>
            <span className="font-mono text-xs font-semibold text-status-crit">−3.6 pt</span>
          </div>
          <span className="text-[11px] text-status-crit font-medium mt-1 leading-snug">Off-curve anomaly: fluid pound onset.</span>
        </div>
      </div>
    </div>
  );
};
