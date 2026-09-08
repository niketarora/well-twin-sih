import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import { BaselineWellConfig, ScenarioInputs, SimulationOutputs } from '../../utils/wellSimulation';

interface ScenarioComparisonTableProps {
  baseline: BaselineWellConfig;
  inputs: ScenarioInputs;
  outputs: SimulationOutputs;
}

interface RowData {
  category: 'OPERATING PARAMETERS' | 'PREDICTED PERFORMANCE';
  label: string;
  current: string | number;
  scenario: string | number;
  unit?: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
  note?: string;
}

export const ScenarioComparisonTable: React.FC<ScenarioComparisonTableProps> = ({
  baseline,
  inputs,
  outputs,
}) => {
  // Format rows
  const rows: RowData[] = [
    // Inputs / Controls
    {
      category: 'OPERATING PARAMETERS',
      label: 'Steam Injection Volume',
      current: baseline.steamVolume.toLocaleString(),
      scenario: inputs.steamVolume.toLocaleString(),
      unit: 't',
      delta: `${inputs.steamVolume >= baseline.steamVolume ? '+' : ''}${(((inputs.steamVolume - baseline.steamVolume) / baseline.steamVolume) * 100).toFixed(1)}%`,
      deltaType: inputs.steamVolume === baseline.steamVolume ? 'neutral' : inputs.steamVolume > baseline.steamVolume ? 'neutral' : 'positive',
    },
    {
      category: 'OPERATING PARAMETERS',
      label: 'Soak Time',
      current: baseline.soakTime,
      scenario: inputs.soakTime,
      unit: 'h',
      delta: `${inputs.soakTime >= baseline.soakTime ? '+' : ''}${inputs.soakTime - baseline.soakTime} h`,
      deltaType: 'neutral',
    },
    {
      category: 'OPERATING PARAMETERS',
      label: 'Time Since CSS Cycle',
      current: baseline.cssCycleTime,
      scenario: inputs.cssCycleTime,
      unit: 'days',
      delta: `${inputs.cssCycleTime >= baseline.cssCycleTime ? '+' : ''}${inputs.cssCycleTime - baseline.cssCycleTime} d`,
      deltaType: 'neutral',
    },
    {
      category: 'OPERATING PARAMETERS',
      label: 'Pumping Cadence (SPM)',
      current: baseline.spm.toFixed(1),
      scenario: inputs.spm.toFixed(1),
      unit: 'SPM',
      delta: `${inputs.spm >= baseline.spm ? '+' : ''}${(((inputs.spm - baseline.spm) / baseline.spm) * 100).toFixed(1)}%`,
      deltaType: inputs.spm === baseline.spm ? 'neutral' : inputs.spm < baseline.spm ? 'positive' : 'negative',
    },
    {
      category: 'OPERATING PARAMETERS',
      label: 'Stroke Length',
      current: baseline.strokeLength.toFixed(2),
      scenario: inputs.strokeLength.toFixed(2),
      unit: 'm',
      delta: `${inputs.strokeLength >= baseline.strokeLength ? '+' : ''}${(((inputs.strokeLength - baseline.strokeLength) / baseline.strokeLength) * 100).toFixed(1)}%`,
      deltaType: 'neutral',
    },
    {
      category: 'OPERATING PARAMETERS',
      label: 'VFD Frequency',
      current: baseline.vfdFrequency.toFixed(1),
      scenario: inputs.vfdFrequency.toFixed(1),
      unit: 'Hz',
      delta: `${inputs.vfdFrequency >= baseline.vfdFrequency ? '+' : ''}${(inputs.vfdFrequency - baseline.vfdFrequency).toFixed(1)} Hz`,
      deltaType: 'neutral',
    },

    // Outputs / Predictions
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Net Oil Production',
      current: baseline.oilProduction.toFixed(1),
      scenario: outputs.predictedProduction.toFixed(1),
      unit: baseline.productionUnit,
      delta: `${outputs.productionDeltaPct >= 0 ? '+' : ''}${outputs.productionDeltaPct.toFixed(1)}%`,
      deltaType: outputs.productionDeltaPct >= 0 ? 'positive' : 'negative',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Well Health Score',
      current: '74',
      scenario: `${outputs.wellHealthScore}`,
      unit: '/ 100',
      delta: `${outputs.wellHealthDelta >= 0 ? '+' : ''}${outputs.wellHealthDelta} pts`,
      deltaType: outputs.wellHealthDelta >= 0 ? 'positive' : 'negative',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Pump Barrel Fillage',
      current: `${baseline.pumpFillage.toFixed(1)}%`,
      scenario: `${outputs.simulatedPumpFillage.toFixed(1)}%`,
      delta: `${outputs.simulatedPumpFillage >= baseline.pumpFillage ? '+' : ''}${(outputs.simulatedPumpFillage - baseline.pumpFillage).toFixed(1)}%`,
      deltaType: outputs.simulatedPumpFillage >= baseline.pumpFillage ? 'positive' : 'negative',
      note: outputs.simulatedPumpFillage < 80 ? 'Fluid Pound' : 'Normal',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Pump Volumetric Efficiency',
      current: '76.5%',
      scenario: `${outputs.pumpEfficiency.toFixed(1)}%`,
      delta: `${outputs.pumpEfficiencyDelta >= 0 ? '+' : ''}${outputs.pumpEfficiencyDelta.toFixed(1)}%`,
      deltaType: outputs.pumpEfficiencyDelta >= 0 ? 'positive' : 'negative',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Mechanical Risk Rating',
      current: 'HIGH',
      scenario: outputs.mechanicalRisk,
      delta: outputs.mechanicalRisk === 'LOW' ? 'Reduced' : outputs.mechanicalRisk === 'HIGH' ? 'Unchanged' : 'Elevated',
      deltaType: outputs.mechanicalRisk === 'LOW' ? 'positive' : outputs.mechanicalRisk === 'SEVERE' ? 'negative' : 'neutral',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Steam Efficiency (SOR Index)',
      current: '70.0',
      scenario: outputs.steamEfficiency.toFixed(1),
      unit: '/ 100',
      delta: `${outputs.steamEfficiencyDelta >= 0 ? '+' : ''}${outputs.steamEfficiencyDelta.toFixed(1)}%`,
      deltaType: outputs.steamEfficiencyDelta >= 0 ? 'positive' : 'negative',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Energy Consumption Index',
      current: '100',
      scenario: `${outputs.energyIndex}`,
      unit: 'Index',
      delta: `${outputs.energyIndexDelta >= 0 ? '+' : ''}${outputs.energyIndexDelta}%`,
      // Lower energy index is better!
      deltaType: outputs.energyIndexDelta <= 0 ? 'positive' : 'negative',
    },
    {
      category: 'PREDICTED PERFORMANCE',
      label: 'Reservoir Sandface Temp',
      current: `${baseline.reservoirTemperature.toFixed(1)}°C`,
      scenario: `${outputs.simulatedResTemp.toFixed(1)}°C`,
      delta: `${outputs.resTempDelta >= 0 ? '+' : ''}${outputs.resTempDelta.toFixed(1)}°C`,
      deltaType: 'neutral',
    },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-subtle">
      <div className="p-3.5 sm:p-4 border-b border-border flex items-center justify-between bg-surface-secondary/40">
        <div>
          <h3 className="text-sm font-bold text-ink font-heading">
            Current Physical Field vs Scenario Matrix
          </h3>
          <p className="text-xs text-ink-muted">
            Side-by-side verification of operating controls and predicted response deltas
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Field Baseline
          </span>
          <span className="flex items-center gap-1 text-petroleum font-bold">
            <span className="w-2 h-2 rounded-full bg-petroleum"></span> Digital Scenario
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-canvas/60 text-ink-muted uppercase font-mono text-[10px] tracking-wider">
              <th className="py-2.5 px-4 font-semibold">Parameter / KPI Metric</th>
              <th className="py-2.5 px-3 font-semibold text-right">Physical Current</th>
              <th className="py-2.5 px-3 font-semibold text-right text-petroleum">Simulated Scenario</th>
              <th className="py-2.5 px-4 font-semibold text-right">Impact Variance (Δ)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, idx) => {
              const isCategoryHeader =
                idx === 0 || rows[idx - 1].category !== row.category;

              return (
                <React.Fragment key={`${row.label}-${idx}`}>
                  {isCategoryHeader && (
                    <tr className="bg-surface-secondary/70">
                      <td
                        colSpan={4}
                        className="py-1.5 px-4 text-[10px] font-mono font-bold tracking-wider text-ink-muted uppercase"
                      >
                        {row.category}
                      </td>
                    </tr>
                  )}
                  <tr className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-ink flex items-center gap-2">
                      <span>{row.label}</span>
                      {row.note && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                          {row.note}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-ink-muted">
                      {row.current} {row.unit && <span className="text-[10px] text-ink-muted font-normal">{row.unit}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-petroleum">
                      {row.scenario} {row.unit && <span className="text-[10px] text-petroleum font-normal">{row.unit}</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                          row.deltaType === 'positive'
                            ? 'bg-status-green/15 text-status-green'
                            : row.deltaType === 'negative'
                            ? 'bg-status-crit/15 text-status-crit'
                            : 'bg-surface-secondary text-ink-muted'
                        }`}
                      >
                        {row.deltaType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                        {row.deltaType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
                        {row.deltaType === 'neutral' && <Minus className="w-3 h-3" />}
                        {row.delta}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
