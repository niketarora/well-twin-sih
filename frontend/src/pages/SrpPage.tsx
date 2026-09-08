import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DynamometerChart } from '../components/charts/DynamometerChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { digitalTwinService } from '../services';
import { SrpTwinState } from '../types';
import { mockRodTaperAnalysis, mockDynoLoops } from '../mock/digitalTwin/srp';
import { SrpMlConditionCard } from '../components/srp/SrpMlConditionCard';

export const SrpPage: React.FC = () => {
  const [twin, setTwin] = useState<SrpTwinState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLoopKey, setSelectedLoopKey] = useState<'current' | 'previous' | 'baseline'>('current');

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

  const activeLoop = mockDynoLoops[selectedLoopKey];
  const activeTwin: SrpTwinState = {
    ...twin,
    barrelFillage:
      selectedLoopKey === 'baseline' ? 98.2 : selectedLoopKey === 'previous' ? 87.2 : twin.barrelFillage,
    peakPolishedRodLoad:
      selectedLoopKey === 'baseline' ? 89.2 : selectedLoopKey === 'previous' ? 88.2 : twin.peakPolishedRodLoad,
    minPolishedRodLoad:
      selectedLoopKey === 'baseline' ? 26.6 : selectedLoopKey === 'previous' ? 24.6 : 21.2,
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Twin 3: Sucker Rod Pump (SRP) & Artificial Lift Diagnostics"
        subtitle="Downhole traveling valve kinematics, real-time dynamometer load loop decomposition, and 3-tier rod string Goodman fatigue stress tracking."
        badge="Attention: Fluid Pound @ 2.80m"
        badgeType="red"
      />

      {/* Real-time SRP Autoencoder Anomaly Detection & Canonical 6-Feature Telemetry Inputs */}
      <SrpMlConditionCard
        twin={activeTwin}
        dynoSurfacePoints={activeLoop.surface}
        selectedCycleLabel={activeLoop.label}
      />

      {/* Interactive Full-Cycle Dynamometer Card */}
      <DynamometerChart
        selectedLoopKey={selectedLoopKey}
        onSelectLoopKey={setSelectedLoopKey}
      />

      {/* Rod String Fatigue & Tapered Section Stress Table */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
          <div>
            <h3 className="font-heading text-base font-semibold text-ink">
              Tapered Rod String Goodman Stress Analysis
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Calculated cyclic fatigue loading, Goodman stress margins, and buoyancy corrections across Norris 97 special alloy
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-secondary px-3 py-1.5 rounded-lg border border-border self-start sm:self-auto text-xs">
            <span className="font-medium text-ink">Total String Yield Margin:</span>
            <span className="font-mono font-bold text-status-green">+48.0 MPa</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-secondary text-ink-secondary font-semibold text-[10.5px] uppercase tracking-wider border-b border-border">
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
                  className={`hover:bg-canvas-subtle transition-colors ${
                    rod.stressRatio > 80 ? 'bg-status-warn-bg/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-semibold text-ink">{rod.section}</td>
                  <td className="py-2.5 px-4 text-ink-secondary">{rod.material}</td>
                  <td className="py-2.5 px-3 font-mono text-ink">{rod.diameter}</td>
                  <td className="py-2.5 px-4 font-mono text-ink-muted">{rod.interval}</td>
                  <td className="py-2.5 px-4 font-mono text-right font-semibold text-ink">
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
                      <span className="font-mono text-xs font-semibold" style={{ color: rod.statusColor }}>
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
      </section>
    </div>
  );
};
