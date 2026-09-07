import { AiContext, AiUiContext } from '../types/ai';
import { getAiDataProvider } from '../data/createAiDataProvider';

export async function buildAiContext(uiContext: AiUiContext): Promise<AiContext> {
  const provider = getAiDataProvider();
  const wellId = uiContext.currentWellId || 'well-bw-017';

  try {
    const [well, health, kpis, alerts, fieldSummary] = await Promise.all([
      provider.getWell(wellId),
      provider.getHealth(wellId),
      provider.getTelemetryKpis(),
      provider.getAlerts(wellId),
      provider.getFieldSummary(),
    ]);

    // Map telemetry metrics
    const oilKpi = kpis.find(k => k.id === 'rate');
    const bhtKpi = kpis.find(k => k.id === 'bht');
    const fillageKpi = kpis.find(k => k.id === 'fillage');
    const viscKpi = kpis.find(k => k.id === 'visc');

    return {
      ui: uiContext,
      well: well
        ? {
            id: well.id,
            code: well.code,
            name: well.name,
            pad: well.pad,
            sector: well.sector,
            status: well.status,
            healthScore: well.healthScore,
            cycle: well.cycle,
            dayInCycle: well.dayInCycle,
            phase: well.phase,
          }
        : undefined,
      telemetry: {
        oilRate: typeof oilKpi?.value === 'number' ? oilKpi.value : well?.oilRateBopd ?? 84,
        waterCut: well?.waterCutPct ?? 78.2,
        bht: typeof bhtKpi?.value === 'number' ? bhtKpi.value : well?.bottomHoleTempC ?? 182,
        bhp: well?.bottomHolePressMpa ?? 3.8,
        viscosity: typeof viscKpi?.value === 'number' ? viscKpi.value : well?.fluidViscosityCp ?? 420,
        fillage: typeof fillageKpi?.value === 'number' ? fillageKpi.value : well?.srpFillagePct ?? 61.4,
        spm: well?.spm ?? 4.8,
        rodLoad: well?.rodStressPct ?? 78.4,
      },
      health: health
        ? {
            score: health.score,
            status: health.status,
            dominantConcern: health.dominantConcern,
            subsystems: health.subsystems.map(s => ({
              id: s.id,
              name: s.name,
              score: s.score,
              dominantFactor: s.dominantFactor,
            })),
          }
        : undefined,
      alerts: alerts.slice(0, 5).map(a => ({
        id: a.id,
        title: a.title,
        severity: a.severity,
        subsystem: a.subsystem,
        timestamp: a.timestamp,
      })),
      fieldSummary: fieldSummary
        ? {
            totalWells: fieldSummary.totalWells,
            producingWells: fieldSummary.producingWells,
            attentionWells: fieldSummary.attentionWells,
            criticalWells: fieldSummary.criticalWells,
            totalBopd: fieldSummary.totalProductionBopd,
          }
        : undefined,
    };
  } catch (err) {
    console.error('Failed to build full AI context, returning minimal context:', err);
    return {
      ui: uiContext,
    };
  }
}
