import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Sliders,
  Flame,
  Activity,
  Zap,
  HeartPulse,
  Gauge,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  DEFAULT_BASELINE_WELL,
  PARAMETER_CONFIGS,
  PRESET_SCENARIOS,
  ScenarioInputs,
  simulateWellScenario,
  SimulationOutputs,
} from '../utils/wellSimulation';
import { ParameterSlider } from '../components/simulation/ParameterSlider';
import { SimulationRadarChart } from '../components/simulation/SimulationRadarChart';
import { SimulatedWellVisual } from '../components/simulation/SimulatedWellVisual';
import { ScenarioComparisonTable } from '../components/simulation/ScenarioComparisonTable';
import { TwinInsightCard } from '../components/simulation/TwinInsightCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const WhatIfSimulatorPage: React.FC = () => {
  const baseline = DEFAULT_BASELINE_WELL;

  // Active scenario input parameters
  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInputs>({
    steamVolume: baseline.steamVolume,
    soakTime: baseline.soakTime,
    cssCycleTime: baseline.cssCycleTime,
    spm: baseline.spm,
    strokeLength: baseline.strokeLength,
    vfdFrequency: baseline.vfdFrequency,
  });

  // Active preset tracker
  const [activePreset, setActivePreset] = useState<string>('baseline');

  // Simulation run animation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastSimulatedTimestamp, setLastSimulatedTimestamp] = useState<Date>(new Date());

  // Deterministic simulation calculation
  const simulationOutputs: SimulationOutputs = useMemo(() => {
    return simulateWellScenario(scenarioInputs, baseline);
  }, [scenarioInputs, baseline]);

  // Handle parameter changes
  const handleParamChange = (key: keyof ScenarioInputs, value: number) => {
    setScenarioInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
    setActivePreset('custom');
  };

  // Apply a preset
  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESET_SCENARIOS[presetKey];
    if (preset) {
      setScenarioInputs({ ...preset.inputs });
      setActivePreset(presetKey);
    }
  };

  // Primary Run Simulation button handler
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setLastSimulatedTimestamp(new Date());
    }, 450);
  };

  // Reset to Baseline
  const handleReset = () => {
    handleApplyPreset('baseline');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 pb-12"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HERO BANNER                                               */}
      {/* ========================================================================= */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-subtle">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-petroleum text-white shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink font-heading tracking-tight">
                What-If Digital Twin Scenario Simulator
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-status-info/15 text-status-info border border-status-info/30">
                PROTOTYPE TWIN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-3xl italic">
              “Before changing the physical well, test the operating scenario on its digital counterpart.”
            </p>
          </div>

          {/* Action Bar: Presets + Run Simulation */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              type="button"
              onClick={handleReset}
              className="h-9 px-3 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold flex items-center gap-1.5 transition-all shadow-subtle active:scale-95"
              title="Reset all sliders to current physical field baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
              <span>Reset to Current</span>
            </button>

            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="h-9 px-4 rounded-xl bg-petroleum hover:bg-petroleum-hover text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-petroleum/20 active:scale-95 disabled:opacity-75"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : 'fill-current'}`} />
              <span>{isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Presets Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted shrink-0 font-mono">
            Demo Presets:
          </span>
          {Object.entries(PRESET_SCENARIOS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleApplyPreset(key)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activePreset === key
                  ? 'bg-petroleum/10 border-petroleum text-petroleum font-bold shadow-sm'
                  : 'bg-surface border-border text-ink-secondary hover:bg-surface-secondary'
              }`}
            >
              {key === 'productionFocus' && <TrendingUp className="w-3.5 h-3.5 text-amber-500" />}
              {key === 'efficiencyFocus' && <Zap className="w-3.5 h-3.5 text-emerald-500" />}
              {key === 'equipmentProtection' && <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />}
              {key === 'baseline' && <RotateCcw className="w-3 h-3 text-slate-400" />}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. THREE-COLUMN DASHBOARD GRID                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ----------------------------------------------------------------------- */}
        {/* COLUMN 1: CURRENT OPERATING STATE & SUBSURFACE VISUAL (col-span-3)       */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-5">
          {/* Current Operating State Context Box */}
          <motion.div variants={itemVariants} className="bg-surface rounded-xl border border-border p-4 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono">
                  Current Operating State
                </h3>
                <div className="text-sm font-bold text-ink font-heading">
                  {baseline.wellName}
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-status-green animate-pulse" title="Field Hardware Online" />
            </div>

            {/* 4 Read-only Physical Well Context Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-canvas/60 rounded-lg p-2.5 border border-border-subtle">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink-muted">
                  <Thermometer className="w-3 h-3 text-red-500" />
                  <span>Res. Temp</span>
                </div>
                <div className="text-base font-mono font-bold text-ink mt-0.5">
                  {baseline.reservoirTemperature.toFixed(1)} <span className="text-xs font-normal text-ink-muted">°C</span>
                </div>
              </div>

              <div className="bg-canvas/60 rounded-lg p-2.5 border border-border-subtle">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink-muted">
                  <Gauge className="w-3 h-3 text-cyan-500" />
                  <span>Res. Pressure</span>
                </div>
                <div className="text-base font-mono font-bold text-ink mt-0.5">
                  {baseline.reservoirPressure.toFixed(1)} <span className="text-xs font-normal text-ink-muted">bar</span>
                </div>
              </div>

              <div className="bg-canvas/60 rounded-lg p-2.5 border border-border-subtle">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink-muted">
                  <Activity className="w-3 h-3 text-amber-500" />
                  <span>Pump Fillage</span>
                </div>
                <div className="text-base font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {baseline.pumpFillage.toFixed(1)} <span className="text-xs font-normal text-ink-muted">%</span>
                </div>
                <div className="text-[9px] text-ink-muted mt-0.5">Fluid pound threshold</div>
              </div>

              <div className="bg-canvas/60 rounded-lg p-2.5 border border-border-subtle">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink-muted">
                  <Layers className="w-3 h-3 text-emerald-500" />
                  <span>Current Rate</span>
                </div>
                <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {baseline.oilProduction.toFixed(1)} <span className="text-xs font-normal text-ink-muted">{baseline.productionUnit}</span>
                </div>
                <div className="text-[9px] text-ink-muted mt-0.5">Physical telemetry baseline</div>
              </div>
            </div>
          </motion.div>

          {/* Subsurface Dynamic Digital Twin SVG */}
          <motion.div variants={itemVariants}>
            <SimulatedWellVisual
              baseline={baseline}
              inputs={scenarioInputs}
              outputs={simulationOutputs}
            />
          </motion.div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* COLUMN 2: SCENARIO PARAMETER CONTROLS (col-span-4)                      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-4">
          <motion.div variants={itemVariants} className="space-y-4">
            {/* SRP Lift Controls Group */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-petroleum" />
                  <span>SRP Lift Controls</span>
                </h3>
                <span className="text-[10px] text-ink-muted">Mechanical Drive</span>
              </div>

              {/* 1. SPM (Hero Control) */}
              <ParameterSlider
                config={PARAMETER_CONFIGS.spm}
                currentValue={baseline.spm}
                scenarioValue={scenarioInputs.spm}
                onChange={(val) => handleParamChange('spm', val)}
                isHero={true}
              />

              {/* 2. Stroke Length */}
              <ParameterSlider
                config={PARAMETER_CONFIGS.strokeLength}
                currentValue={baseline.strokeLength}
                scenarioValue={scenarioInputs.strokeLength}
                onChange={(val) => handleParamChange('strokeLength', val)}
              />

              {/* 3. VFD Frequency */}
              <ParameterSlider
                config={PARAMETER_CONFIGS.vfdFrequency}
                currentValue={baseline.vfdFrequency}
                scenarioValue={scenarioInputs.vfdFrequency}
                onChange={(val) => handleParamChange('vfdFrequency', val)}
              />
            </div>

            {/* CSS Parameters Group */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>CSS Thermal Controls</span>
                </h3>
                <span className="text-[10px] text-ink-muted">Reservoir Stimulation</span>
              </div>

              {/* 4. Steam Volume */}
              <ParameterSlider
                config={PARAMETER_CONFIGS.steamVolume}
                currentValue={baseline.steamVolume}
                scenarioValue={scenarioInputs.steamVolume}
                onChange={(val) => handleParamChange('steamVolume', val)}
              />

              {/* 5. Soak Time */}
              <ParameterSlider
                config={PARAMETER_CONFIGS.soakTime}
                currentValue={baseline.soakTime}
                scenarioValue={scenarioInputs.soakTime}
                onChange={(val) => handleParamChange('soakTime', val)}
              />

              {/* 6. CSS Cycle / Time Since Stimulation */}
              <ParameterSlider
                config={PARAMETER_CONFIGS.cssCycleTime}
                currentValue={baseline.cssCycleTime}
                scenarioValue={scenarioInputs.cssCycleTime}
                onChange={(val) => handleParamChange('cssCycleTime', val)}
              />
            </div>
          </motion.div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* COLUMN 3: PREDICTED IMPACT & RADAR (col-span-4)                         */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-4">
          {/* Primary Output KPI Highlights */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            {/* 1. Predicted Production */}
            <div className="bg-surface rounded-xl border border-border p-3.5 shadow-subtle">
              <div className="text-[10px] font-mono uppercase font-bold text-ink-muted">
                Predicted Oil Rate
              </div>
              <div className="text-2xl font-mono font-extrabold text-ink mt-1">
                {simulationOutputs.predictedProduction.toFixed(1)}{' '}
                <span className="text-xs font-normal text-ink-muted">{baseline.productionUnit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-mono font-semibold">
                <span className="text-ink-muted">Current: {baseline.oilProduction.toFixed(1)}</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold ${
                    simulationOutputs.productionDeltaPct >= 0
                      ? 'bg-status-green/15 text-status-green'
                      : 'bg-status-crit/15 text-status-crit'
                  }`}
                >
                  {simulationOutputs.productionDeltaPct >= 0 ? '+' : ''}
                  {simulationOutputs.productionDeltaPct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 2. Well Health Composite Score */}
            <div className="bg-surface rounded-xl border border-border p-3.5 shadow-subtle">
              <div className="text-[10px] font-mono uppercase font-bold text-ink-muted">
                Well Health Score
              </div>
              <div className="text-2xl font-mono font-extrabold text-ink mt-1">
                {simulationOutputs.wellHealthScore}{' '}
                <span className="text-xs font-normal text-ink-muted">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    simulationOutputs.wellHealthStatus === 'HEALTHY'
                      ? 'bg-status-green/15 text-status-green'
                      : simulationOutputs.wellHealthStatus === 'MODERATE'
                      ? 'bg-status-info/15 text-status-info'
                      : simulationOutputs.wellHealthStatus === 'STRESSED'
                      ? 'bg-status-warn/15 text-status-warn'
                      : 'bg-status-crit/15 text-status-crit'
                  }`}
                >
                  {simulationOutputs.wellHealthStatus}
                </span>
                <span className="text-[11px] font-mono text-ink-muted">
                  {simulationOutputs.wellHealthDelta >= 0 ? `+${simulationOutputs.wellHealthDelta}` : simulationOutputs.wellHealthDelta} pts
                </span>
              </div>
            </div>

            {/* 3. Mechanical Risk */}
            <div className="bg-surface rounded-xl border border-border p-3.5 shadow-subtle">
              <div className="text-[10px] font-mono uppercase font-bold text-ink-muted">
                Mechanical Risk
              </div>
              <div className="text-lg font-mono font-bold text-ink mt-1">
                {simulationOutputs.mechanicalRisk}
              </div>
              <div className="text-[10px] text-ink-muted mt-1">
                SRP cyclic fatigue & fluid pound
              </div>
            </div>

            {/* 4. Pump Efficiency */}
            <div className="bg-surface rounded-xl border border-border p-3.5 shadow-subtle">
              <div className="text-[10px] font-mono uppercase font-bold text-ink-muted">
                Pump Efficiency
              </div>
              <div className="text-lg font-mono font-bold text-ink mt-1">
                {simulationOutputs.pumpEfficiency.toFixed(1)}%
              </div>
              <div className="text-[10px] font-mono text-ink-muted mt-1">
                Volumetric fillage index
              </div>
            </div>

            {/* 5. Steam Efficiency */}
            <div className="bg-surface rounded-xl border border-border p-3.5 shadow-subtle">
              <div className="text-[10px] font-mono uppercase font-bold text-ink-muted">
                Steam Efficiency (SOR)
              </div>
              <div className="text-lg font-mono font-bold text-ink mt-1">
                {simulationOutputs.steamEfficiency.toFixed(1)}{' '}
                <span className="text-xs font-normal text-ink-muted">/ 100</span>
              </div>
              <div className="text-[10px] text-ink-muted mt-1">
                Thermal conversion index
              </div>
            </div>

            {/* 6. Energy Consumption Index */}
            <div className="bg-surface rounded-xl border border-border p-3.5 shadow-subtle">
              <div className="text-[10px] font-mono uppercase font-bold text-ink-muted">
                Energy Index
              </div>
              <div className="text-lg font-mono font-bold text-ink mt-1 flex items-center gap-1.5">
                <span>{simulationOutputs.energyIndex}</span>
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                    simulationOutputs.energyIndexDelta <= 0
                      ? 'bg-status-green/15 text-status-green'
                      : 'bg-status-crit/15 text-status-crit'
                  }`}
                >
                  {simulationOutputs.energyIndexDelta > 0 ? '+' : ''}
                  {simulationOutputs.energyIndexDelta}%
                </span>
              </div>
              <div className="text-[10px] text-ink-muted mt-1">
                100 = Baseline power load
              </div>
            </div>
          </motion.div>

          {/* 5-Axis Radar Comparison Chart */}
          <motion.div variants={itemVariants} className="bg-surface rounded-xl border border-border p-4 shadow-subtle">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono">
                Multi-Domain Comparison
              </h4>
              <span className="text-[10px] text-ink-muted">Normalized 0–100 Scale</span>
            </div>
            <SimulationRadarChart baseline={baseline} outputs={simulationOutputs} />
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWIN INSIGHT & COMPREHENSIVE COMPARISON TABLE                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Twin Insight Card (col-span-5) */}
        <motion.div variants={itemVariants} className="lg:col-span-5">
          <TwinInsightCard outputs={simulationOutputs} />
        </motion.div>

        {/* Current vs Scenario Comparison Matrix (col-span-7) */}
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <ScenarioComparisonTable
            baseline={baseline}
            inputs={scenarioInputs}
            outputs={simulationOutputs}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
