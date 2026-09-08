import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DynamometerChart } from '../components/charts/DynamometerChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { SrpTwinState } from '../types';
import { mockRodTaperAnalysis } from '../mock/digitalTwin/srp';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const SrpPage: React.FC = () => {
  const [twin, setTwin] = useState<SrpTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    digitalTwinService.getSrpTwin().then((data) => {
      setTwin(data);
      setLoading(false);
    });
  }, []);

  if (loading || !twin) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      <motion.div variants={itemVariants}>
        <SectionHeader
          title="Twin 3: Sucker Rod Pump (SRP) & Artificial Lift Diagnostics"
          subtitle="Downhole traveling valve kinematics, real-time dynamometer load loop decomposition, and 3-tier rod string Goodman fatigue stress tracking."
          badge="Attention: Fluid Pound @ 2.80m"
          badgeType="red"
        />
      </motion.div>

      {/* Causal Relationship Banner (Viscosity -> Load -> Fillage -> Efficiency -> Energy) */}
      <motion.div variants={itemVariants} className="glass-panel border-l-4 border-l-status-crit rounded-xl p-4 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-border mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-crit shrink-0 animate-pulse" />
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-ink">
              Artificial Lift Physical Causal Propagation
            </span>
          </div>
          <span className="text-[10.5px] font-mono text-status-crit font-bold bg-status-crit-bg px-2 py-0.5 rounded border border-status-crit/30 self-start md:self-auto">
            Recommended Action: Trim VFD from 8.4 to 7.8 SPM
          </span>
        </div>

        {/* 5-Step Causal Cascade */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted font-sans font-bold uppercase">1. Viscosity Rise</span>
            <span className="font-bold text-status-warn mt-1">+11% (84 cP)</span>
            <span className="text-[10px] text-ink-muted">Reservoir cooling</span>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted font-sans font-bold uppercase">2. Higher Load</span>
            <span className="font-bold text-status-crit mt-1">+6.2% Drag</span>
            <span className="text-[10px] text-ink-muted">Downstroke drag</span>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-subtle flex flex-col items-center border-l-2 border-l-status-crit">
            <span className="text-[9.5px] text-ink-muted font-sans font-bold uppercase">3. Lower Fillage</span>
            <span className="font-bold text-status-crit mt-1">84.6% (−3.6%)</span>
            <span className="text-[10px] text-status-crit font-bold">Fluid pound @ 2.80m</span>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted font-sans font-bold uppercase">4. Lower Efficiency</span>
            <span className="font-bold text-status-warn mt-1">86.2% (−4.1%)</span>
            <span className="text-[10px] text-ink-muted">Chamber deficit</span>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-subtle flex flex-col items-center">
            <span className="text-[9.5px] text-ink-muted font-sans font-bold uppercase">5. Higher Energy</span>
            <span className="font-bold text-status-crit mt-1">+12.4% kWh/m³</span>
            <span className="text-[10px] text-ink-muted">34.8 kWh/m³</span>
          </motion.div>
        </div>
      </motion.div>

      {/* 8 Primary SRP Mechanical Diagnostics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Pump Fillage */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3 border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Fillage</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-status-crit mt-1.5">
            {twin.barrelFillage}%
          </div>
          <span className="text-[10px] text-status-crit font-bold mt-0.5 block truncate">Target &gt;90%</span>
        </motion.div>

        {/* 2. Pump Efficiency */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Efficiency</span>
            <DataProvenanceBadge type="ESTIMATED" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-ink mt-1.5">
            86.2%
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5 block truncate font-medium">Volumetric</span>
        </motion.div>

        {/* 3. Rod Load */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3 border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">PPRL Load</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-status-crit mt-1.5">
            {twin.peakPolishedRodLoad} <span className="text-[10px] text-ink-muted">kN</span>
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5 block truncate font-medium">Yield 90.0 kN</span>
        </motion.div>

        {/* 4. Production Capacity */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Capacity</span>
            <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-petroleum mt-1.5">
            205 <span className="text-[10px] text-ink-muted">BOPD</span>
          </div>
          <span className="text-[10px] text-ink-muted mt-0.5 block truncate font-medium">At 100% fill</span>
        </motion.div>

        {/* 5. Energy Consumption */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Energy</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-status-warn mt-1.5">
            34.8 <span className="text-[10px] text-ink-muted">kWh/m³</span>
          </div>
          <span className="text-[10px] text-status-warn font-bold mt-0.5 block truncate">+12% vs base</span>
        </motion.div>

        {/* 6. Floating Risk */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Floating</span>
            <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-status-green mt-1.5">
            Normal
          </div>
          <span className="text-[10px] text-status-green font-bold mt-0.5 block truncate">+24.6 kN margin</span>
        </motion.div>

        {/* 7. Unsetting Risk */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Unsetting</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <div className="font-mono text-xl font-black text-status-green mt-1.5">
            None
          </div>
          <span className="text-[10px] text-status-green font-bold mt-0.5 block truncate">Anchor holding</span>
        </motion.div>

        {/* 8. Abnormal Loading */}
        <motion.div whileHover={{ y: -2 }} className="glass-card rounded-xl p-3 border-l-[3px] border-l-status-crit">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-ink-muted truncate">Loading</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <div className="font-mono text-sm font-black text-status-crit mt-2 leading-tight">
            Fluid Pound
          </div>
          <span className="text-[10px] text-status-crit font-bold mt-0.5 block truncate">@ 2.80 m stroke</span>
        </motion.div>
      </motion.div>

      {/* Interactive Full-Cycle Dynamometer Card */}
      <motion.div variants={itemVariants}>
        <DynamometerChart />
      </motion.div>

      {/* Rod String Fatigue & Tapered Section Stress Table */}
      <motion.section variants={itemVariants} className="glass-panel rounded-xl p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
          <div>
            <h3 className="font-heading text-base font-bold text-ink">
              Tapered Rod String Goodman Stress Analysis
            </h3>
            <p className="text-xs text-ink-muted mt-0.5 font-medium">
              Calculated cyclic fatigue loading, Goodman stress margins, and buoyancy corrections across Norris 97 special alloy
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-secondary/80 px-3 py-1.5 rounded-lg border border-border self-start sm:self-auto text-xs">
            <span className="font-bold text-ink">Total String Yield Margin:</span>
            <span className="font-mono font-extrabold text-status-green">+48.0 MPa</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-secondary/80 text-ink-secondary font-bold text-[10px] uppercase tracking-wider border-b border-border">
                <th className="py-2.5 px-4">Rod Section</th>
                <th className="py-2.5 px-4">Material Specification</th>
                <th className="py-2.5 px-3">Diameter</th>
                <th className="py-2.5 px-4">Depth Interval</th>
                <th className="py-2.5 px-4 text-right">Peak Stress</th>
                <th className="py-2.5 px-4 text-right">Yield Limit</th>
                <th className="py-2.5 px-4">Stress Ratio (%)</th>
                <th className="py-2.5 px-4">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {mockRodTaperAnalysis.map((rod, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-surface-secondary/50 transition-colors ${
                    rod.stressRatio > 80 ? 'bg-status-warn-bg/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-bold text-ink">{rod.section}</td>
                  <td className="py-2.5 px-4 text-ink-secondary font-medium">{rod.material}</td>
                  <td className="py-2.5 px-3 font-mono text-ink font-semibold">{rod.diameter}</td>
                  <td className="py-2.5 px-4 font-mono text-ink-muted">{rod.interval}</td>
                  <td className="py-2.5 px-4 font-mono text-right font-bold text-ink">
                    {rod.peakStress} MPa
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-ink-muted">
                    {rod.yieldLimit} MPa
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-canvas rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${rod.stressRatio}%`,
                            backgroundColor: rod.statusColor,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold" style={{ color: rod.statusColor }}>
                        {rod.stressRatio} %
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={rod.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  );
};

