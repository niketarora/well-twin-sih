import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Download, Cpu, TrendingUp, CheckCircle, BarChart3, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { HealthScore } from '../components/ui/HealthScore';
import { KpiCard } from '../components/ui/KpiCard';
import { Sparkline } from '../components/ui/Sparkline';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { CauseChain } from '../components/ui/CauseChain';
import { ModelHealthDrift } from '../components/ui/ModelHealthDrift';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
import { wellService, telemetryService, alertService, generateOperationalLogPdf } from '../services';
import { Well, WellHealth, KpiCardData, Alert } from '../types';
import { useUIStore } from '../stores/useUIStore';
import { useAiCopilot } from '../features/ai-copilot';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ wellId?: string }>();
  const { selectedWellId, setSelectedWellId } = useUIStore();
  const { openWithPrompt } = useAiCopilot();

  const effectiveWellId = params.wellId || selectedWellId || 'well-bw-017';

  const [well, setWell] = useState<Well | null>(null);
  const [health, setHealth] = useState<WellHealth | null>(null);
  const [kpis, setKpis] = useState<KpiCardData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [topAlert, setTopAlert] = useState<Alert | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDF Export states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotification, setExportNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (params.wellId && params.wellId !== selectedWellId) {
        setSelectedWellId(params.wellId);
      }

      const [wellData, healthData, kpisData, alertsData, chart] = await Promise.all([
        wellService.getWell(effectiveWellId),
        wellService.getWellHealth(effectiveWellId),
        telemetryService.getOverviewKpis(),
        alertService.getAlerts(),
        telemetryService.getOverview14DayChart(),
      ]);
      setWell(wellData);
      setHealth(healthData);
      setKpis(kpisData);
      setAlerts(alertsData);
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
  }, [effectiveWellId]);

  const handleExportOperationalLog = async () => {
    if (!well) return;
    setIsExporting(true);
    setExportNotification(null);

    try {
      await generateOperationalLogPdf({
        well: {
          id: well.id,
          code: well.code,
          name: well.name,
          fieldName: well.fieldName,
          basin: well.basin,
          formation: well.formation,
          location: well.location,
          cycle: well.cycle,
          dayInCycle: well.dayInCycle,
          totalCycleDays: well.totalCycleDays,
          phase: well.phase,
          scadaStatus: well.scadaStatus,
          status: health?.status || 'Active Surveillance',
          isSyntheticDemo: well.isSyntheticDemo,
          engineerOnDuty: well.engineerOnDuty,
        },
        health: health ? {
          score: health.score,
          status: health.status,
          dominantConcern: health.dominantConcern,
          subsystems: health.subsystems.map(s => ({
            id: s.id,
            name: s.name,
            score: s.score,
            dominantFactor: s.dominantFactor,
          })),
        } : undefined,
        kpis: kpis.map(k => ({
          id: k.id,
          label: k.label,
          value: k.value,
          unit: k.unit,
          status: k.status,
          sublabel: k.deltaNote || k.delta || '',
        })),
        alerts: alerts.slice(0, 5).map(a => ({
          id: a.id,
          severity: a.severity === 'critical' ? 'Critical' : a.severity === 'warning' ? 'Warning' : 'Info',
          subsystem: a.subsystem || 'Artificial Lift',
          title: a.title,
          timestamp: a.timestamp,
          status: a.status === 'acknowledged' ? 'Acknowledged' : 'Active',
        })),
      });

      setExportNotification({
        type: 'success',
        message: `Operational Log PDF for ${well.code} generated and downloaded successfully.`,
      });
      setTimeout(() => {
        setExportNotification(null);
      }, 5000);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setExportNotification({
        type: 'error',
        message: 'Unable to generate operational log. Please try again.',
      });
      setTimeout(() => {
        setExportNotification(null);
      }, 6000);
    } finally {
      setIsExporting(false);
    }
  };

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
    <div className="space-y-5">
      {/* Page Title & Workstation Quick Actions */}
      <SectionHeader
        title="Well Twin Command Center"
        subtitle={`Real-time multi-physics surveillance, physical cause chain attribution, and predicted vs actual production reconcile for ${well?.code || 'BW-017'}.`}
        actions={
          <>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportOperationalLog}
              className="h-8 px-3 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-medium flex items-center gap-1.5 transition-colors shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download print-ready A4 operational engineering report"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce text-petroleum dark:text-cyan-400' : ''}`} />
              <span>{isExporting ? 'Generating Operational Log...' : 'Export Operational Log'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="h-8 px-3 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Review {alerts.length || 3} Active Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        }
      />

      {/* Export Feedback Toast / Banner */}
      {exportNotification && (
        <div
          className={`px-4 py-2.5 rounded-lg border flex items-center justify-between text-xs font-medium transition-all ${
            exportNotification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {exportNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{exportNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Engineering Cause-and-Effect Propagation Chain */}
      <CauseChain />

      {/* Well Health & Subsystem Health Strip */}
      <HealthScore health={health} />

      {/* Key Engineering KPIs with Provenance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Model Health & Drift Panel */}
      <ModelHealthDrift />

      {/* Two Columns: Predicted vs Actual Production Chart & Top Alert Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Predicted vs Actual 14-Day Production Chart with Confidence Band */}
        <section className="lg:col-span-7 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-semibold text-ink">
                  Predicted vs Actual Production
                </h2>
                <DataProvenanceBadge type="ACTUAL" size="sm" />
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                BOPD · Last 14 days · Reconciled Coriolis Skid 03 vs Coupled Multi-Physics Simulation
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-auto">
              <span className="px-2 py-0.5 rounded bg-surface-secondary text-ink border border-border">
                Pred: <strong className="text-petroleum">198.0</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-secondary text-ink border border-border">
                Act: <strong className="text-status-warn">184.2</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-status-crit-bg text-status-crit font-bold border border-status-crit/30">
                Δ −7.0%
              </span>
            </div>
          </div>

          {/* SVG Line Chart with Confidence Band */}
          <div className="mt-4 w-full overflow-hidden">
            <svg
              viewBox="0 0 700 240"
              className="w-full h-auto select-none overflow-visible"
              role="img"
              aria-label="Predicted vs Actual Net Oil Production 14-day line chart"
            >
              {/* Confidence Band (Predicted ±5%) */}
              <polygon
                points={`
                  52,65 150,66 250,67 350,68 450,68 550,69 684,70
                  684,102 550,101 450,100 350,100 250,99 150,98 52,97
                `}
                fill="var(--petroleum-tint)"
              />

              {/* Grid Lines */}
              <line x1="52" y1="20" x2="684" y2="20" className="stroke-border-subtle" strokeWidth="1" />
              <line x1="52" y1="84" x2="684" y2="84" className="stroke-border-subtle" strokeWidth="1" />
              <line x1="52" y1="148" x2="684" y2="148" className="stroke-border-subtle" strokeWidth="1" />
              <line x1="52" y1="180" x2="684" y2="180" className="stroke-border" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="46" y="24" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">220</text>
              <text x="46" y="88" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">198</text>
              <text x="46" y="152" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">170</text>

              {/* Predicted Twin Model Line (Dashed) */}
              <line
                x1="52"
                y1="84"
                x2="684"
                y2="86"
                stroke="var(--petroleum)"
                strokeWidth="2"
                strokeDasharray="5 4"
              />

              {/* Actual Telemetry Polyline */}
              <polyline
                points={chartData
                  .map((d, i) => {
                    const x = 52 + (i / (chartData.length - 1)) * 632;
                    const y = 180 - ((d.rate - 150) / (220 - 150)) * 160;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="var(--status-warn)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Deviation Callout on Day 38 */}
              {chartData.length > 0 && (
                <g>
                  {/* Predicted Anchor */}
                  <circle cx="684" cy="86" r="4" fill="var(--petroleum)" />
                  <text x="684" y="74" textAnchor="end" className="font-mono text-[11px] font-bold fill-petroleum">
                    Pred: 198.0 BOPD
                  </text>

                  {/* Actual Anchor */}
                  <circle cx="684" cy="102" r="5" fill="var(--status-warn)" stroke="var(--surface)" strokeWidth="2" />
                  <text x="684" y="122" textAnchor="end" className="font-mono text-[11px] font-bold fill-status-warn">
                    Actual: 184.2 BOPD (−7.0%)
                  </text>
                </g>
              )}

              {/* X-axis labels */}
              <text x="52" y="200" className="font-mono text-[10px] fill-ink-muted">Day 25</text>
              <text x="368" y="200" textAnchor="middle" className="font-mono text-[10px] fill-ink-muted">Day 31</text>
              <text x="684" y="200" textAnchor="end" className="font-mono text-[10px] fill-ink-muted">Day 38 (Today)</text>

              {/* Legend Strip */}
              <g transform="translate(52, 222)">
                <line x1="0" y1="0" x2="18" y2="0" stroke="var(--petroleum)" strokeWidth="2" strokeDasharray="4 3" />
                <text x="24" y="3" className="font-sans text-[10.5px] fill-ink-secondary">Digital Twin Model Prediction</text>

                <line x1="210" y1="0" x2="228" y2="0" stroke="var(--status-warn)" strokeWidth="2.5" />
                <text x="234" y="3" className="font-sans text-[10.5px] fill-ink-secondary">Actual Measured Oil Rate</text>

                <rect x="400" y="-6" width="14" height="12" fill="var(--petroleum-tint)" />
                <text x="420" y="3" className="font-sans text-[10.5px] fill-ink-muted">±5% Confidence Envelope</text>
              </g>
            </svg>
          </div>
        </section>

        {/* Right: Top Alert Attention Triage Card */}
        {topAlert && (
          <section className="lg:col-span-5 bg-surface border border-border border-l-4 border-l-status-crit rounded-xl p-5 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-status-crit flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-status-crit" />
                  Engineering Priority Triage · 1 of {alerts.length || 3} Active
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

              <dl className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-[72px_1fr] gap-x-2 gap-y-2 text-xs">
                <dt className="font-semibold text-ink-muted text-[10.5px] uppercase tracking-wider">Physics Cause</dt>
                <dd className="text-ink leading-snug">{topAlert.why}</dd>

                <dt className="font-semibold text-ink-muted text-[10.5px] uppercase tracking-wider">Mitigation</dt>
                <dd className="text-ink leading-snug">{topAlert.action}</dd>
              </dl>
            </div>

            <div className="mt-5 pt-3 border-t border-border-subtle flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  openWithPrompt(
                    `Investigate alert ${topAlert.id} (${topAlert.title}): ${topAlert.what}. What is the root cause across the 4 twins and what immediate mitigation is recommended?`
                  )
                }
                className="w-full h-8 rounded-lg bg-petroleum/10 hover:bg-petroleum/20 text-petroleum dark:text-cyan-300 border border-petroleum/30 text-xs font-semibold flex items-center justify-between px-3 transition-colors shadow-subtle"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-petroleum dark:text-cyan-400" />
                  <span>Investigate with AI Copilot</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/alerts')}
                className="w-full h-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold flex items-center justify-between px-3 transition-colors"
              >
                <span>Acknowledge & Open Alert Triage</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Real-Time Telemetry Trend Previews */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-petroleum" />
            <h2 className="font-heading text-sm font-semibold text-ink">
              Multi-Physics Parameter Telemetry Previews
            </h2>
          </div>
          <span className="text-[11px] text-ink-muted">
            Continuous 6h trend · Full analytics in Trends & Well State
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-ink-secondary">Bottomhole Temperature</span>
              <DataProvenanceBadge type="OBSERVED" size="sm" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-bold text-ink">
                214.8 <span className="text-[10px] text-ink-muted">°C</span>
              </span>
              <Sparkline data={[215.8, 215.6, 215.5, 215.3, 215.2, 215.0, 214.9, 214.8]} color="var(--status-warn)" />
            </div>
            <span className="text-[10.5px] text-ink-muted mt-1">−1.0 °C over 48 h (cooling)</span>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-ink-secondary">In-Situ Viscosity</span>
              <DataProvenanceBadge type="ESTIMATED" size="sm" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-bold text-ink">
                84.0 <span className="text-[10px] text-ink-muted">cP</span>
              </span>
              <Sparkline data={[80.5, 81.2, 81.8, 82.4, 82.9, 83.4, 83.8, 84.0]} color="var(--status-warn)" />
            </div>
            <span className="text-[10.5px] text-ink-muted mt-1">+3.5 cP over 48 h</span>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-ink-secondary">Gross Liquid Rate</span>
              <DataProvenanceBadge type="OBSERVED" size="sm" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-bold text-ink">
                320.0 <span className="text-[10px] text-ink-muted">BFPD</span>
              </span>
              <Sparkline data={[321.4, 320.8, 321.0, 320.6, 320.2, 320.4, 320.1, 320.0]} color="var(--status-info)" />
            </div>
            <span className="text-[10.5px] text-ink-muted mt-1">Stable within 0.5%</span>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col justify-between border-l-2 border-l-status-crit">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-ink-secondary">Pump Fillage</span>
              <DataProvenanceBadge type="ACTUAL" size="sm" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-base font-bold text-status-crit">
                84.6 <span className="text-[10px] text-ink-muted">%</span>
              </span>
              <Sparkline data={[88.2, 87.4, 87.0, 86.1, 85.6, 85.0, 84.8, 84.6]} color="var(--status-crit)" />
            </div>
            <span className="text-[10.5px] text-status-crit mt-1">Declining (Fluid Pound @ 2.80m)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
