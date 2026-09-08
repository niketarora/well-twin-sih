/**
 * Well Twin — What-If Simulator Mathematical Engine
 *
 * NOTE: These are prototype simulation coefficients and deterministic heuristic models
 * designed for interactive digital twin UI demonstration.
 * They are completely decoupled from UI components so that this module can be swapped
 * with a real ML model or numerical reservoir/lift simulator API call in the future:
 *   simulateWellScenario(inputs, baseline) -> Promise<SimulationOutputs>
 *
 * All formulas are strictly deterministic: identical inputs ALWAYS produce identical outputs.
 * No Math.random() is used.
 */

export interface BaselineWellConfig {
  wellId: string;
  wellName: string;
  // CSS Operating Baseline
  steamVolume: number; // tonnes (e.g. 12400)
  soakTime: number; // hours (e.g. 168)
  cssCycleTime: number; // days since stimulation (e.g. 38)
  // SRP Operating Baseline
  spm: number; // strokes per minute (e.g. 8.4)
  strokeLength: number; // meters (e.g. 3.65)
  vfdFrequency: number; // Hz (e.g. 48.0)
  // Current Reservoir & Wellbore State (Read-only context)
  reservoirTemperature: number; // °C (e.g. 214.8)
  reservoirPressure: number; // bar (e.g. 42.6)
  pumpFillage: number; // % (e.g. 84.6)
  oilProduction: number; // BOPD (e.g. 184.2)
  // Production unit
  productionUnit: string;
}

export interface ScenarioInputs {
  steamVolume: number;
  soakTime: number;
  cssCycleTime: number;
  spm: number;
  strokeLength: number;
  vfdFrequency: number;
}

export type HealthStatus = 'HEALTHY' | 'MODERATE' | 'STRESSED' | 'CRITICAL';
export type MechanicalRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
export type FluidMobility = 'LOW' | 'MODERATE' | 'GOOD';
export type ViscosityTrend = 'INCREASING' | 'STABLE' | 'DECREASING';
export type ScenarioCategory = 'BETTER OPERATING REGION' | 'BALANCED SCENARIO' | 'INEFFICIENT SCENARIO' | 'HIGH-RISK SCENARIO';

export interface SimulationOutputs {
  predictedProduction: number; // BOPD
  productionDeltaPct: number; // %
  wellHealthScore: number; // 0 - 100
  wellHealthDelta: number; // points
  wellHealthStatus: HealthStatus;
  mechanicalRisk: MechanicalRisk;
  pumpEfficiency: number; // %
  pumpEfficiencyDelta: number; // %
  simulatedPumpFillage: number; // %
  steamEfficiency: number; // 0 - 100 index (prototype SOR indicator)
  steamEfficiencyDelta: number; // %
  energyIndex: number; // 100 = baseline
  energyIndexDelta: number; // %
  simulatedResTemp: number; // °C
  resTempDelta: number; // °C
  fluidMobility: FluidMobility;
  viscosityTrend: ViscosityTrend;
  currentScore: number; // 0 - 100
  scenarioScore: number; // 0 - 100
  scoreDelta: number; // points
  scenarioBadge: ScenarioCategory;
  insight: string;
}

export interface ParameterConfig {
  id: keyof ScenarioInputs;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
  category: 'CSS' | 'SRP';
}

/**
 * Centralized Demo Baseline for Well BW-017.
 * Edit these values here to adjust the baseline across the entire simulator.
 */
export const DEFAULT_BASELINE_WELL: BaselineWellConfig = {
  wellId: 'BW-017',
  wellName: 'Baghewala BW-017 (Cycle 4)',
  steamVolume: 12400, // Tonnes
  soakTime: 168, // Hours (7 days)
  cssCycleTime: 38, // Days into Cycle 4
  spm: 8.4, // SPM
  strokeLength: 3.65, // Meters (144 in)
  vfdFrequency: 48.0, // Hz
  reservoirTemperature: 214.8, // °C
  reservoirPressure: 42.6, // bar
  pumpFillage: 84.6, // %
  oilProduction: 184.2, // BOPD
  productionUnit: 'BOPD',
};

/**
 * Parameter constraints and step sizes for interactive sliders & stepper buttons
 */
export const PARAMETER_CONFIGS: Record<keyof ScenarioInputs, ParameterConfig> = {
  steamVolume: {
    id: 'steamVolume',
    label: 'Steam Volume',
    unit: 't',
    min: 6000,
    max: 20000,
    step: 200,
    description: 'Cumulative steam slug injected for thermal viscosity reduction',
    category: 'CSS',
  },
  soakTime: {
    id: 'soakTime',
    label: 'Soak Duration',
    unit: 'h',
    min: 24,
    max: 360,
    step: 6,
    description: 'Shut-in period for conductive heat diffusion into reservoir matrix',
    category: 'CSS',
  },
  cssCycleTime: {
    id: 'cssCycleTime',
    label: 'Time Since CSS',
    unit: 'days',
    min: 1,
    max: 90,
    step: 1,
    description: 'Elapsed production days since steam stimulation / thermal depletion',
    category: 'CSS',
  },
  spm: {
    id: 'spm',
    label: 'Strokes Per Minute (SPM)',
    unit: 'SPM',
    min: 3.0,
    max: 13.0,
    step: 0.1,
    description: 'Surface pumping cadence driving downhole fluid displacement',
    category: 'SRP',
  },
  strokeLength: {
    id: 'strokeLength',
    label: 'Stroke Length',
    unit: 'm',
    min: 1.8,
    max: 4.8,
    step: 0.05,
    description: 'Polished rod travel distance per stroke cycle',
    category: 'SRP',
  },
  vfdFrequency: {
    id: 'vfdFrequency',
    label: 'VFD Frequency',
    unit: 'Hz',
    min: 30.0,
    max: 65.0,
    step: 0.5,
    description: 'Motor inverter frequency modulating pumping velocity profile',
    category: 'SRP',
  },
};

/**
 * Preset Scenarios for Rapid Demonstrations
 */
export const PRESET_SCENARIOS: Record<string, { label: string; description: string; inputs: ScenarioInputs }> = {
  baseline: {
    label: 'Reset to Current',
    description: 'Current field operating configuration of Well BW-017',
    inputs: {
      steamVolume: 12400,
      soakTime: 168,
      cssCycleTime: 38,
      spm: 8.4,
      strokeLength: 3.65,
      vfdFrequency: 48.0,
    },
  },
  productionFocus: {
    label: 'Production Focus',
    description: 'Enhanced steam support with optimized lift speed for maximum output',
    inputs: {
      steamVolume: 14800,
      soakTime: 180,
      cssCycleTime: 30,
      spm: 9.2,
      strokeLength: 3.85,
      vfdFrequency: 52.0,
    },
  },
  efficiencyFocus: {
    label: 'Efficiency Focus',
    description: 'Reduced steam & electrical load with balanced inflow recovery',
    inputs: {
      steamVolume: 10800,
      soakTime: 168,
      cssCycleTime: 38,
      spm: 7.2,
      strokeLength: 3.65,
      vfdFrequency: 42.0,
    },
  },
  equipmentProtection: {
    label: 'Equipment Protection',
    description: 'Eliminate fluid pound, reduce rod stress, and maximize pump fillage',
    inputs: {
      steamVolume: 12400,
      soakTime: 168,
      cssCycleTime: 38,
      spm: 6.8,
      strokeLength: 3.40,
      vfdFrequency: 40.0,
    },
  },
};

// Helper: clamp numbers to bounds
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// Helper: round to precision
function round(val: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Baseline Score calculation helper
 */
function computeScore(
  prodNorm: number, // 0 - 100
  health: number, // 0 - 100
  pumpEff: number, // 0 - 100
  steamEff: number, // 0 - 100
  energyEff: number // 0 - 100 (higher is better energy efficiency)
): number {
  // Balanced weights prioritizing equipment preservation and efficiency over raw extraction
  const score =
    0.25 * prodNorm +
    0.25 * health +
    0.20 * pumpEff +
    0.15 * steamEff +
    0.15 * energyEff;
  return clamp(round(score, 1), 0, 100);
}

/**
 * Primary What-If Simulation Function
 *
 * Strictly deterministic mapping: inputs -> outputs.
 * Replaceable by backend API: `const res = await api.post('/simulate', inputs)`
 */
export function simulateWellScenario(
  inputs: ScenarioInputs,
  baseline: BaselineWellConfig = DEFAULT_BASELINE_WELL
): SimulationOutputs {
  const { steamVolume, soakTime, cssCycleTime, spm, strokeLength, vfdFrequency } = inputs;

  // -------------------------------------------------------------------------
  // 1. THERMAL & RESERVOIR RESPONSE
  // -------------------------------------------------------------------------
  // Steam volume ratio relative to baseline
  const steamRatio = steamVolume / baseline.steamVolume;
  // Soak time optimal window around 168 hours (7 days)
  const soakDeltaHours = soakTime - baseline.soakTime;
  const soakFactor = 1.0 - Math.pow(soakDeltaHours / 250, 2) * 0.12;

  // Cycle time thermal depletion: ~0.65 °C per day of production
  const cycleTimeDeltaDays = cssCycleTime - baseline.cssCycleTime;
  const thermalDepletion = cycleTimeDeltaDays * 0.65;

  // Steam volume heating effect: diminishing returns via logarithmic curve
  const steamThermalGain = Math.log(Math.max(0.2, steamRatio)) * 18.0;

  // Simulated Reservoir Temperature
  const simulatedResTemp = clamp(
    round(baseline.reservoirTemperature + steamThermalGain - thermalDepletion, 1),
    120.0,
    285.0
  );
  const resTempDelta = round(simulatedResTemp - baseline.reservoirTemperature, 1);

  // Viscosity Trend & Fluid Mobility
  let viscosityTrend: ViscosityTrend = 'STABLE';
  if (simulatedResTemp > baseline.reservoirTemperature + 3.0) {
    viscosityTrend = 'DECREASING';
  } else if (simulatedResTemp < baseline.reservoirTemperature - 3.0) {
    viscosityTrend = 'INCREASING';
  }

  let fluidMobility: FluidMobility = 'MODERATE';
  if (simulatedResTemp >= 210.0) {
    fluidMobility = 'GOOD';
  } else if (simulatedResTemp < 175.0) {
    fluidMobility = 'LOW';
  }

  // -------------------------------------------------------------------------
  // 2. SRP DYNAMICS, FILLAGE & MECHANICAL STRESS
  // -------------------------------------------------------------------------
  // Pumping intensity ratios
  const spmRatio = spm / baseline.spm;
  const strokeRatio = strokeLength / baseline.strokeLength;
  const vfdRatio = vfdFrequency / baseline.vfdFrequency;

  // Combined mechanical speed index
  const speedIndex = (spmRatio * 0.65 + vfdRatio * 0.35);

  // Reservoir inflow vs surface drawdown:
  // Inflow capability improves with reservoir temperature (lower crude viscosity)
  const inflowCapability = 1.0 + (simulatedResTemp - baseline.reservoirTemperature) * 0.0035;

  // Displacement demand
  const displacementDemand = speedIndex * strokeRatio;

  // Pump barrel fillage calculation:
  // If pumping faster than inflow, pump fillage drops below 80% causing severe fluid pound!
  // If pumping slightly slower, pump barrel fills completely (95-98%).
  const fillageShift = (inflowCapability / displacementDemand - 1.0) * 45.0;
  const simulatedPumpFillage = clamp(
    round(baseline.pumpFillage + fillageShift, 1),
    35.0,
    98.5
  );

  // -------------------------------------------------------------------------
  // 3. PRODUCTION RATE
  // -------------------------------------------------------------------------
  // Theoretical displacement = SPM * Stroke Length
  // Actual delivery = Displacement * Pump Fillage * Fluid Mobility factor
  const mobilityMultiplier = fluidMobility === 'GOOD' ? 1.02 : fluidMobility === 'MODERATE' ? 0.96 : 0.88;
  const productionScaling = (displacementDemand * (simulatedPumpFillage / baseline.pumpFillage)) * mobilityMultiplier * soakFactor;

  // Diminishing returns ceiling on excessive speed
  const predictedProduction = clamp(
    round(baseline.oilProduction * productionScaling, 1),
    15.0,
    380.0
  );
  const productionDeltaPct = round(
    ((predictedProduction - baseline.oilProduction) / baseline.oilProduction) * 100,
    1
  );

  // -------------------------------------------------------------------------
  // 4. PUMP EFFICIENCY
  // -------------------------------------------------------------------------
  // Optimum operation is when fillage is high (>90%) and SPM is within 6.5 - 8.2 range
  const baselinePumpEff = 76.5; // %
  const fillageEffect = (simulatedPumpFillage - baseline.pumpFillage) * 0.45;
  const excessiveSpeedPenalty = spm > 9.0 ? Math.pow(spm - 9.0, 1.6) * 3.5 : 0;
  const lowSpeedPenalty = spm < 5.0 ? (5.0 - spm) * 2.0 : 0;

  const pumpEfficiency = clamp(
    round(baselinePumpEff + fillageEffect - excessiveSpeedPenalty - lowSpeedPenalty, 1),
    20.0,
    98.0
  );
  const pumpEfficiencyDelta = round(pumpEfficiency - baselinePumpEff, 1);

  // -------------------------------------------------------------------------
  // 5. MECHANICAL RISK & HEALTH SCORE
  // -------------------------------------------------------------------------
  // Mechanical stress index driven by: SPM, Stroke length, VFD, and Fluid Pound (fillage < 80%)
  const fluidPoundPenalty = simulatedPumpFillage < 80.0 ? Math.pow((80.0 - simulatedPumpFillage) / 5.0, 2) * 4.0 : 0;
  const mechanicalStressIndex =
    Math.pow(spmRatio, 1.8) * 35.0 +
    Math.pow(strokeRatio, 1.5) * 25.0 +
    Math.pow(vfdRatio, 1.4) * 20.0 +
    fluidPoundPenalty;

  let mechanicalRisk: MechanicalRisk = 'MODERATE';
  if (mechanicalStressIndex > 115.0) {
    mechanicalRisk = 'SEVERE';
  } else if (mechanicalStressIndex > 95.0) {
    mechanicalRisk = 'HIGH';
  } else if (mechanicalStressIndex < 72.0) {
    mechanicalRisk = 'LOW';
  }

  // Baseline health: 74
  const baselineHealth = 74.0;
  const healthDelta =
    (simulatedPumpFillage - baseline.pumpFillage) * 0.35 -
    (mechanicalStressIndex - 80.0) * 0.45 +
    (pumpEfficiency - baselinePumpEff) * 0.25;

  const wellHealthScore = clamp(
    Math.round(baselineHealth + healthDelta),
    10,
    98
  );
  const wellHealthDelta = wellHealthScore - Math.round(baselineHealth);

  let wellHealthStatus: HealthStatus = 'HEALTHY';
  if (wellHealthScore < 50) {
    wellHealthStatus = 'CRITICAL';
  } else if (wellHealthScore < 65) {
    wellHealthStatus = 'STRESSED';
  } else if (wellHealthScore < 80) {
    wellHealthStatus = 'MODERATE';
  } else {
    wellHealthStatus = 'HEALTHY';
  }

  // -------------------------------------------------------------------------
  // 6. STEAM EFFICIENCY & ENERGY IMPACT
  // -------------------------------------------------------------------------
  // Steam efficiency: higher steam without proportional production drop degrades efficiency
  // Baseline steam efficiency index = 70.0
  const baselineSteamEff = 70.0;
  const oilPerSteamRatio = (predictedProduction / baseline.oilProduction) / steamRatio;
  const steamEfficiency = clamp(
    round(baselineSteamEff * oilPerSteamRatio, 1),
    15.0,
    98.0
  );
  const steamEfficiencyDelta = round(steamEfficiency - baselineSteamEff, 1);

  // Energy Index: 100 = Baseline
  // Scales with motor draw (VFD, SPM, Stroke) + steam generation fuel load
  const motorEnergy = Math.pow(vfdRatio, 1.7) * Math.pow(spmRatio, 1.3) * strokeRatio * 80.0;
  const thermalEnergy = steamRatio * 20.0;
  const energyIndex = clamp(
    Math.round(motorEnergy + thermalEnergy),
    40,
    220
  );
  const energyIndexDelta = energyIndex - 100;

  // -------------------------------------------------------------------------
  // 7. COMPOSITE SCENARIO SCORE (0 - 100)
  // -------------------------------------------------------------------------
  // Current baseline score
  const currentScore = computeScore(
    70.0, // baseline production normalized
    baselineHealth,
    baselinePumpEff,
    baselineSteamEff,
    70.0
  );

  // Scenario normalized scores
  const prodNormalized = clamp(70.0 + productionDeltaPct * 1.2, 10, 100);
  const energyNormalized = clamp(100.0 - (energyIndex - 100) * 0.8, 10, 100);

  const scenarioScore = computeScore(
    prodNormalized,
    wellHealthScore,
    pumpEfficiency,
    steamEfficiency,
    energyNormalized
  );
  const scoreDelta = round(scenarioScore - currentScore, 1);

  // Categorize Badge
  let scenarioBadge: ScenarioCategory = 'BALANCED SCENARIO';
  if (mechanicalRisk === 'SEVERE' || wellHealthScore < 50) {
    scenarioBadge = 'HIGH-RISK SCENARIO';
  } else if (scoreDelta >= 7.0) {
    scenarioBadge = 'BETTER OPERATING REGION';
  } else if (scoreDelta >= 0.0) {
    scenarioBadge = 'BALANCED SCENARIO';
  } else {
    scenarioBadge = 'INEFFICIENT SCENARIO';
  }

  // -------------------------------------------------------------------------
  // 8. NATURAL LANGUAGE TWIN INSIGHT
  // -------------------------------------------------------------------------
  const insight = generateTwinInsight(
    inputs,
    {
      predictedProduction,
      productionDeltaPct,
      wellHealthScore,
      wellHealthDelta,
      wellHealthStatus,
      mechanicalRisk,
      pumpEfficiency,
      pumpEfficiencyDelta,
      simulatedPumpFillage,
      steamEfficiency,
      steamEfficiencyDelta,
      energyIndex,
      energyIndexDelta,
      simulatedResTemp,
      resTempDelta,
      fluidMobility,
      viscosityTrend,
      currentScore,
      scenarioScore,
      scoreDelta,
      scenarioBadge,
      insight: '',
    },
    baseline
  );

  return {
    predictedProduction,
    productionDeltaPct,
    wellHealthScore,
    wellHealthDelta,
    wellHealthStatus,
    mechanicalRisk,
    pumpEfficiency,
    pumpEfficiencyDelta,
    simulatedPumpFillage,
    steamEfficiency,
    steamEfficiencyDelta,
    energyIndex,
    energyIndexDelta,
    simulatedResTemp,
    resTempDelta,
    fluidMobility,
    viscosityTrend,
    currentScore,
    scenarioScore,
    scoreDelta,
    scenarioBadge,
    insight,
  };
}

/**
 * Deterministic Natural Language Digital Twin Insight Generator
 */
export function generateTwinInsight(
  inputs: ScenarioInputs,
  results: SimulationOutputs,
  baseline: BaselineWellConfig
): string {
  const { spm, steamVolume, cssCycleTime } = inputs;
  const {
    wellHealthScore,
    mechanicalRisk,
    simulatedPumpFillage,
    productionDeltaPct,
    energyIndexDelta,
    scoreDelta,
  } = results;

  // 1. Heavy Fluid Pound & Critical Over-speed
  if (spm > 9.0 && simulatedPumpFillage < 80.0) {
    return `Critical Fluid Pound Alert: Increasing SPM to ${spm} SPM exceeds reservoir inflow capacity at ${results.simulatedResTemp.toFixed(1)}°C, causing downhole pump fillage to drop to ${simulatedPumpFillage.toFixed(1)}%. This induces repetitive mechanical impact loads on the rod string and increases the energy index by +${energyIndexDelta}%. This scenario is not recommended.`;
  }

  // 2. Balanced Speed Reduction & Fluid Pound Resolution
  if (spm < baseline.spm && simulatedPumpFillage >= 90.0 && wellHealthScore >= 80) {
    const prodText =
      productionDeltaPct >= -2.0
        ? `while sustaining production within ${Math.abs(productionDeltaPct)}% of baseline`
        : `with only a minor ${Math.abs(productionDeltaPct)}% reduction in net rate`;
    return `Optimal Operating Balance: Reducing SPM from ${baseline.spm} to ${spm} SPM allows the pump barrel to recharge to ${simulatedPumpFillage.toFixed(1)}% fillage, resolving fluid pound. Mechanical risk falls to ${mechanicalRisk}, well health elevates to ${wellHealthScore}/100, and energy consumption contracts by ${Math.abs(energyIndexDelta)}% ${prodText}.`;
  }

  // 3. High Steam Inefficiency / Diminishing Returns
  if (steamVolume > 14000 && results.steamEfficiencyDelta < -10.0) {
    return `Thermal Diminishing Returns: Injecting ${steamVolume.toLocaleString()} tonnes of steam elevates near-wellbore temperature to ${results.simulatedResTemp.toFixed(1)}°C, but production only increases by +${productionDeltaPct}%. Steam efficiency deteriorates by ${results.steamEfficiencyDelta}%, yielding poor thermal-to-oil energy conversion.`;
  }

  // 4. Advanced Cycle Thermal Decay
  if (cssCycleTime > 50) {
    return `Cooling Phase Detected: At Day ${cssCycleTime} post-stimulation, formation temperature has declined to ${results.simulatedResTemp.toFixed(1)}°C, driving crude viscosity upward and reducing fluid mobility to ${results.fluidMobility}. Consider scheduling the next CSS steam injection cycle or adjusting SRP lift speed to avoid under-fillage.`;
  }

  // 5. Aggressive Production Scenario
  if (productionDeltaPct > 5.0 && (mechanicalRisk === 'HIGH' || mechanicalRisk === 'SEVERE')) {
    return `Production vs Fatigue Trade-off: Although this scenario boosts predicted production by +${productionDeltaPct}%, the elevated pumping intensity (${spm} SPM, ${inputs.vfdFrequency} Hz) increases mechanical stress into the ${mechanicalRisk} zone and elevates energy demand by +${energyIndexDelta}%. Frequent rod inspection is advised if running this profile.`;
  }

  // 6. General Balanced / Favorable
  if (scoreDelta > 3.0) {
    return `Favorable Scenario: Operating parameters achieve a solid compromise between fluid extraction (+${productionDeltaPct}%), equipment health (${wellHealthScore}/100), and electrical consumption (${energyIndexDelta > 0 ? '+' : ''}${energyIndexDelta}%). The overall scenario score improves by +${scoreDelta} points over the physical baseline.`;
  }

  // 7. General Stable / Neutral
  return `Stable Operating Regime: Scenario configuration tracks close to physical well baseline conditions. Reservoir temperature is maintained at ${results.simulatedResTemp.toFixed(1)}°C with ${results.fluidMobility.toLowerCase()} fluid mobility and ${mechanicalRisk.toLowerCase()} mechanical risk on the Sucker Rod Pump string.`;
}
