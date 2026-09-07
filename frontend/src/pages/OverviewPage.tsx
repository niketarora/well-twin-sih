import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Download, Cpu, TrendingUp } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { HealthScore } from '../components/ui/HealthScore';
import { KpiCard } from '../components/ui/KpiCard';
import { Sparkline } from '../components/ui/Sparkline';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { wellService, telemetryService, alertService } from '../services';
import { WellHealth, KpiCardData, Alert } from '../types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<WellHealth | null>(null);
  const [kpis, setKpis] = useState<KpiCardData[]>([]);
  const [topAlert, setTopAlert] = useState<Alert | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthData, kpisData, alertsData, chart] = await Promise.all([
        wellService.getWellHealth('well-bw-017'),
        telemetryService.getOverviewKpis(),
        alertService.getAlerts(),
        telemetryService.getOverview14DayChart(),
      ]);
      setHealth(healthData);
      setKpis(kpisData);
      setTopAlert(alertsData.find((a) => a.id === 'ALM-4412') || alertsData[0]);
      setChartData(chart);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch overview telemetry');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="kpis" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  if (error || !health) {
    return <ErrorState message={error || 'No health data available'} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <SectionHeader
        title="Well Overview"
        subtitle="How BW-017 is performing right now, and the one primary issue requiring engineering attention."
        actions={
          <>
            <button
              type="button"
              onClick={() => alert('Exporting 24h operational sheet (.csv)...')}
              className="h-9 px-3.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="h-9 px-3.5 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Review Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        }
      />

      {/* Well Health Section */}
      <HealthScore health={health} />

      {/* 5 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Two Columns: Production 14-Day Chart & Active Attention Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 14-Day Net Oil Production */}
        <section className="lg:col-span-7 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="font-heading text-base font-semibold text-ink">
                Net Oil Production
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                BOPD · Last 14 days · Coriolis calibrated, Test Separator Skid 03
              </p>
            </div>
            <div className="text-[11px] font-mono text-ink-muted bg-surface-secondary px-2 py-0.5 rounded border border-border">
              Normal band: 150–220 BOPD
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="mt-4 w-full overflow-hidden">
            <svg
              viewBox="0 0 700 230"
              className="w-full h-auto select-none overflow-visible"
              role="img"
              aria-label="Net oil production 14-day line chart"
            >
              {/* Normal Operating Band */}
              <rect x="52" y="14" width="632" height="150" fill="rgba(63, 166, 107, 0.05)" />
              <line x1="52" y1="14" x2="684" y2="14" stroke="#EDF0F3" strokeWidth="1" />
              <line x1="52" y1="89" x2="684" y2="89" stroke="#EDF0F3" strokeWidth="1" />
              <line x1="52" y1="164" x2="684" y2="164" stroke="#E2E6EA" strokeWidth="1" />

              <text x="46" y="18" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">220</text>
              <text x="46" y="93" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">185</text>
              <text x="46" y="168" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">150</text>

              {/* Data polyline */}
              <polyline
                points={chartData
                  .map((d, i) => {
                    const x = 52 + (i / (chartData.length - 1)) * 632;
                    const y = 164 - ((d.rate - 150) / (220 - 150)) * 150;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#C69A45"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Last Point Circle & Callout */}
              {chartData.length > 0 && (
                <g>
                  <circle cx="684" cy="94" r="5" fill="#C69A45" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="684" y="80" textAnchor="end" className="font-mono text-[12px] font-bold fill-ink">
                    184.2 BOPD
                  </text>
                </g>
              )}

              {/* X-axis labels */}
              <text x="52" y="188" className="font-mono text-[10px] fill-ink-muted">Day 25</text>
              <text x="368" y="188" textAnchor="middle" className="font-mono text-[10px] fill-ink-muted">Day 31</text>
              <text x="684" y="188" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">Day 38 (Today)</text>
              <text x="52" y="214" className="font-sans text-[11px] fill-ink-secondary">
                Production rate holds within normal envelope while bottomhole temperature cools steadily.
              </text>
            </svg>
          </div>
        </section>

        {/* Right: Top Alert Attention Triage Card */}
        {topAlert && (
          <section className="lg:col-span-5 bg-surface border border-border border-l-4 border-l-status-crit rounded-xl p-5 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-status-crit-deep flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-status-crit" />
                  Needs Attention · 1 of 3 Active
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  {topAlert.timestamp}
                </span>
              </div>

              <h2 className="font-heading text-base font-semibold text-ink mt-3">
                {topAlert.title}
              </h2>
              <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                {topAlert.what}
              </p>

              <dl className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-[68px_1fr] gap-x-2 gap-y-2 text-xs">
                <dt className="font-semibold text-ink-muted text-[10.5px] uppercase tracking-wider">Impact</dt>
                <dd className="text-ink leading-snug">{topAlert.why}</dd>

                <dt className="font-semibold text-ink-muted text-[10.5px] uppercase tracking-wider">Action</dt>
                <dd className="text-ink leading-snug">{topAlert.action}</dd>
              </dl>
            </div>

            <div className="mt-5 pt-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => navigate('/alerts')}
                className="w-full h-9 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold flex items-center justify-between px-3 transition-colors"
              >
                <span>Open Diagnostic Triage in Alerts</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Trend Previews Section */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-petroleum" />
            <h2 className="font-heading text-sm font-semibold text-ink">
              Real-Time Trend Previews
            </h2>
          </div>
          <span className="text-[11px] text-ink-muted">
            6h resolution · Full detail in Trends & Well State
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
            <span className="text-[11px] font-medium text-ink-secondary">Bottomhole Temperature</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-semibold text-ink">
                214.8 <span className="text-[10px] text-ink-muted">°C</span>
              </span>
              <Sparkline data={[215.8, 215.6, 215.5, 215.3, 215.2, 215.0, 214.9, 214.8]} color="#A5741F" />
            </div>
            <span className="text-[10.5px] text-ink-muted mt-1">−1.0 °C over 48 h</span>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
            <span className="text-[11px] font-medium text-ink-secondary">In-Situ Viscosity</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-semibold text-ink">
                84.0 <span className="text-[10px] text-ink-muted">cP</span>
              </span>
              <Sparkline data={[80.5, 81.2, 81.8, 82.4, 82.9, 83.4, 83.8, 84.0]} color="#A5741F" />
            </div>
            <span className="text-[10.5px] text-ink-muted mt-1">+3.5 cP over 48 h (cooling)</span>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
            <span className="text-[11px] font-medium text-ink-secondary">Gross Liquid Rate</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-semibold text-ink">
                320.0 <span className="text-[10px] text-ink-muted">BFPD</span>
              </span>
              <Sparkline data={[321.4, 320.8, 321.0, 320.6, 320.2, 320.4, 320.1, 320.0]} color="#4F8FC4" />
            </div>
            <span className="text-[10.5px] text-ink-muted mt-1">Flat within 0.5 %</span>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between border-l-2 border-l-status-crit">
            <span className="text-[11px] font-medium text-ink-secondary">Pump Fillage</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-semibold text-status-crit">
                84.6 <span className="text-[10px] text-ink-muted">%</span>
              </span>
              <Sparkline data={[88.2, 87.4, 87.0, 86.1, 85.6, 85.0, 84.8, 84.6]} color="#D95C5C" />
            </div>
            <span className="text-[10.5px] text-status-crit mt-1">Declining steadily (Fluid Pound)</span>
          </div>
        </div>
      </section>

      {/* Digital Twin Status Summary Bar */}
      <section className="bg-surface border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-petroleum-tint border border-petroleum/30 flex items-center justify-center text-petroleum-deep shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-semibold text-xs text-ink">
                Coupled Digital Twin Status:
              </span>
              <span className="text-xs text-ink-secondary">
                Reservoir <span className="font-mono font-semibold text-ink">96%</span> (Stable) · Wellbore <span className="font-mono font-semibold text-ink">94%</span> (Stable) · SRP <span className="font-mono font-semibold text-status-crit">89%</span> (Attention) · Surface <span className="font-mono font-semibold text-ink">91%</span> (Stable)
              </span>
            </div>
            <div className="text-[11px] text-ink-muted mt-0.5">
              Model Agreement: <strong className="text-ink">93%</strong> | Predicted: <strong className="text-ink">198.0 BOPD</strong> | Actual: <strong className="text-petroleum-deep">184.2 BOPD</strong> | Deviation: <strong className="text-status-crit">−7.0%</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/digital-twin')}
          className="h-8 px-3 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Open Twin View</span>
          <ArrowRight className="w-3 h-3 text-ink-muted" />
        </button>
      </section>
    </div>
  );
};
