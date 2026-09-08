import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { SimulationOutputs, BaselineWellConfig } from '../../utils/wellSimulation';

interface SimulationRadarChartProps {
  baseline: BaselineWellConfig;
  outputs: SimulationOutputs;
}

export const SimulationRadarChart: React.FC<SimulationRadarChartProps> = ({
  baseline,
  outputs,
}) => {
  // Normalize metrics to 0-100 scale for intuitive multi-axis radar geometry
  // 1. Production: 70 is baseline (184.2 BOPD)
  const currentProdNorm = 70;
  const scenarioProdNorm = Math.min(100, Math.max(10, 70 + outputs.productionDeltaPct * 1.2));

  // 2. Well Health: 0-100
  const currentHealth = 74;
  const scenarioHealth = outputs.wellHealthScore;

  // 3. Pump Efficiency: %
  const currentPumpEff = 76.5;
  const scenarioPumpEff = outputs.pumpEfficiency;

  // 4. Steam Efficiency: 0-100
  const currentSteamEff = 70.0;
  const scenarioSteamEff = outputs.steamEfficiency;

  // 5. Energy Efficiency: baseline is 70 (energy index 100). Lower energy index = higher efficiency.
  const currentEnergyEff = 70.0;
  const scenarioEnergyEff = Math.min(100, Math.max(10, 70 - outputs.energyIndexDelta * 0.7));

  const data = [
    {
      subject: 'Production',
      Current: currentProdNorm,
      Scenario: scenarioProdNorm,
      fullMark: 100,
    },
    {
      subject: 'Well Health',
      Current: currentHealth,
      Scenario: scenarioHealth,
      fullMark: 100,
    },
    {
      subject: 'Pump Eff.',
      Current: currentPumpEff,
      Scenario: scenarioPumpEff,
      fullMark: 100,
    },
    {
      subject: 'Steam Eff.',
      Current: currentSteamEff,
      Scenario: scenarioSteamEff,
      fullMark: 100,
    },
    {
      subject: 'Energy Eff.',
      Current: currentEnergyEff,
      Scenario: scenarioEnergyEff,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--ink-secondary)', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Current Field"
            dataKey="Current"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.2}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Radar
            name="Scenario Target"
            dataKey="Scenario"
            stroke="var(--petroleum)"
            fill="var(--petroleum)"
            fillOpacity={0.45}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--ink)',
              boxShadow: 'var(--shadow-card)',
            }}
            formatter={(value: any) => [`${Math.round(Number(value))} / 100`, '']}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
