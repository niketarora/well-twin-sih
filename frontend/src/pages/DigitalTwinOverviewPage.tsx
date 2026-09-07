import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Scale, Activity, CheckCircle2, Terminal, RefreshCw, Layers } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CouplingDiagram } from '../components/charts/CouplingDiagram';
import { CauseChain } from '../components/ui/CauseChain';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { digitalTwinService } from '../services';
import { DigitalTwinMeshState, ModelValidationItem } from '../types';

export const DigitalTwinOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [mesh, setMesh] = useState<DigitalTwinMeshState | null>(null);
  const [validation, setValidation] = useState<ModelValidationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [meshData, valData] = await Promise.all([
        digitalTwinService.getMeshState(),
        digitalTwinService.getModelValidation(),
      ]);
      setMesh(meshData);
      setValidation(valData.items);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load digital twin state');
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
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (error || !mesh) {
    return <ErrorState message={error || 'No digital twin mesh available'} onRetry={loadData} />;
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Coupled Digital Twin Architecture"
        subtitle="Full 4-tier physics-informed digital twin cascading from Reservoir Thermal Simulation to Surface Gathering for Well BW-017."
        badge="4 Coupled Models Active"
        badgeType="amber"
        actions={
          <button
            type="button"
            onClick={() => navigate('/model-comparison')}
            className="h-8 px-3 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <Scale className="w-3.5 h-3.5 text-petroleum" />
            <span>Open Validation Matrix</span>
          </button>
        }
      />

      {/* Engineering Cause-and-Effect Propagation Chain */}
      <CauseChain />

      {/* Primary 4-Twin Cascade Visualization */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-petroleum" />
            <h2 className="font-heading text-base font-semibold text-ink">
              Multi-Physics Coupled Workflow & Data Bridges
            </h2>
          </div>
          <span className="text-xs text-ink-muted">
            Click any subsystem card to enter its specialized engineering workbench
          </span>
        </div>

        <CouplingDiagram />
      </section>

      {/* Solver Status & State Vector Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Solver Convergence Metrics */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-petroleum" />
                <h3 className="font-heading text-sm font-semibold text-ink">
                  Continuous Solver Convergence (Newton–Raphson)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-status-green-bg text-status-green text-[10px] font-semibold uppercase border border-status-green/30">
                Converged
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3.5">
              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-ink-muted">
                    PDE Residual (L2)
                  </span>
                  <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
                </div>
                <span className="font-mono text-sm font-bold text-status-green mt-1.5 block">
                  {mesh.pdeConvergenceL2}
                </span>
                <span className="text-[10.5px] text-ink-muted mt-0.5 block">
                  Hydro-thermal solver residual
                </span>
              </div>

              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-ink-muted">
                    PINN vs SCADA Delta
                  </span>
                  <DataProvenanceBadge type="OBSERVED" size="sm" />
                </div>
                <span className="font-mono text-sm font-bold text-status-green mt-1.5 block">
                  {mesh.pinnVsScadaDelta}
                </span>
                <span className="text-[10.5px] text-ink-muted mt-0.5 block">
                  Sensor boundary agreement
                </span>
              </div>

              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-ink-muted">
                    Overburden Heat Bleed
                  </span>
                  <DataProvenanceBadge type="ESTIMATED" size="sm" />
                </div>
                <span className="font-mono text-sm font-bold text-status-warn mt-1.5 block">
                  {mesh.overburdenHeatBleed}
                </span>
                <span className="text-[10.5px] text-ink-muted mt-0.5 block">
                  Shale conductive flux loss
                </span>
              </div>

              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-ink-muted">
                    Discretization Grid
                  </span>
                  <DataProvenanceBadge type="SYNTHETIC" size="sm" />
                </div>
                <span className="font-mono text-sm font-bold text-ink mt-1.5 block">
                  {mesh.meshIteration}
                </span>
                <span className="text-[10.5px] text-ink-muted mt-0.5 block">
                  40 vertical node blocks
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
            <span>Last physics iteration committed: <strong className="font-mono text-ink">14:32:08 UTC</strong></span>
            <span className="text-petroleum font-semibold">100% Deterministic</span>
          </div>
        </section>

        {/* Right: State Vector & Boundary Constraints */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-ink-muted" />
                <h3 className="font-heading text-sm font-semibold text-ink">
                  State Vector Boundary Constraints
                </h3>
              </div>
              <span className="text-xs font-mono text-ink-muted">t = 0.20s cycle</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
              {mesh.boundaryConditions.map((b) => (
                <div key={b.name} className="p-2 bg-surface-secondary rounded border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-ink-muted truncate">{b.name}</span>
                  <span className="font-bold text-ink mt-0.5">{b.value}</span>
                </div>
              ))}
            </div>

            {/* Solver Event Log */}
            <div className="mt-3.5 pt-3 border-t border-border-subtle">
              <span className="text-[10.5px] font-semibold text-ink-secondary uppercase tracking-wider block mb-1.5">
                Recent Solver Event Log
              </span>
              <div className="space-y-1 font-mono text-[11px] text-ink-secondary">
                {mesh.recentSolverLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-ink-muted shrink-0">{log.timestamp}</span>
                    <span className="text-ink leading-tight">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
