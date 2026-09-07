import React, { useEffect, useState } from 'react';
import { Wrench, ShieldAlert, CheckCircle2, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { equipmentService } from '../services';
import { EquipmentSection } from '../types';

export const EquipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState<EquipmentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    equipmentService.getEquipment().then((data) => {
      setEquipmentList(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Equipment Health & Subsystem Integrity"
        subtitle="Operational runtime, mechanical stress margins, and scheduled maintenance intervals across Well BW-017 surface and downhole assemblies."
        badge="5 Subsystems Tracked"
        badgeType="default"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipmentList.map((eq) => (
          <div
            key={eq.id}
            className={`bg-surface border rounded-xl p-5 shadow-subtle flex flex-col justify-between transition-all ${
              eq.status === 'Attention'
                ? 'border-status-crit/40 border-l-[3px] border-l-status-crit'
                : 'border-border'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
                <span className="text-[10px] uppercase font-semibold text-ink-muted">
                  {eq.category} Subsystem
                </span>
                <StatusBadge status={eq.status} />
              </div>

              <h3 className="font-heading font-semibold text-sm text-ink mt-2.5">
                {eq.name}
              </h3>
              <span className="text-[11px] text-ink-muted block mt-0.5 font-mono">
                {eq.model}
              </span>

              {/* Health Score & Runtime */}
              <div className="grid grid-cols-2 gap-3 my-3 p-2.5 bg-surface-secondary rounded-lg border border-border-subtle font-mono text-xs">
                <div>
                  <span className="text-[10px] text-ink-muted font-sans uppercase block">Health Score</span>
                  <span
                    className={`text-base font-bold ${
                      eq.healthScore > 80
                        ? 'text-status-green'
                        : eq.healthScore > 70
                        ? 'text-status-warn'
                        : 'text-status-crit'
                    }`}
                  >
                    {eq.healthScore} / 100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted font-sans uppercase block">Operating Runtime</span>
                  <span className="text-base font-bold text-ink">
                    {eq.operatingHours.toLocaleString()} <span className="text-[10px] font-normal text-ink-muted">hrs</span>
                  </span>
                </div>
              </div>

              {/* Verified Sensor Parameters */}
              <div className="space-y-1.5 font-mono text-xs">
                {eq.parameters.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-1.5 rounded hover:bg-canvas/70 transition-colors"
                  >
                    <span className="font-sans text-xs text-ink-secondary">{p.label}</span>
                    <span
                      className={`font-semibold ${
                        p.status === 'Critical'
                          ? 'text-status-crit'
                          : p.status === 'Watch'
                          ? 'text-status-warn'
                          : 'text-ink'
                      }`}
                    >
                      {p.value} {p.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
              <span>Next Inspection: in {eq.nextInspectionDays} days</span>
              {eq.activeAlertsCount > 0 ? (
                <button
                  type="button"
                  onClick={() => navigate('/alerts')}
                  className="text-status-crit font-semibold flex items-center gap-1 hover:underline"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{eq.activeAlertsCount} Active Alarm</span>
                </button>
              ) : (
                <span className="text-status-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Optimal</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
