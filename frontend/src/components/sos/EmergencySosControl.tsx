import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Siren,
  Flame,
  Wind,
  Droplet,
  Droplets,
  HeartPulse,
  Wrench,
  ShieldAlert,
  CircleAlert,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCw,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useUIStore } from '../../stores/useUIStore';
import { mockFieldWells } from '../../mock';
import { sosService } from '../../services/sosService';
import { ApiError } from '../../services/apiClient';
import { SOS_CATEGORY_OPTIONS, type SosCategory, type SosResponse } from '../../types/sos';

const CATEGORY_ICONS: Record<SosCategory, React.ComponentType<{ className?: string }>> = {
  FIRE_SMOKE: Flame,
  UNUSUAL_SMELL: Wind,
  SUSPECTED_LEAK: Droplet,
  FLUID_LEAK: Droplets,
  MEDICAL_EMERGENCY: HeartPulse,
  EQUIPMENT_HAZARD: Wrench,
  PERSONNEL_DANGER: ShieldAlert,
  OTHER: CircleAlert,
};

type ViewState = 'form' | 'submitting' | 'success' | 'error';

export const EmergencySosControl: React.FC = () => {
  const { selectedWellId } = useUIStore();

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>('form');
  const [category, setCategory] = useState<SosCategory | null>(null);
  const [locationDescription, setLocationDescription] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<SosResponse | null>(null);

  const activeWell = useMemo(
    () => mockFieldWells.find((w) => w.id === selectedWellId || w.code.toLowerCase() === selectedWellId.toLowerCase()),
    [selectedWellId]
  );
  const hasKnownWell = Boolean(activeWell?.id);

  const resetForm = () => {
    setView('form');
    setCategory(null);
    setLocationDescription('');
    setDescription('');
    setErrorMessage('');
    setResult(null);
  };

  const handleOpen = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleClose = () => {
    if (view === 'submitting') return; // prevent closing mid-request
    setIsOpen(false);
    resetForm();
  };

  const canSubmit =
    category !== null && (hasKnownWell || locationDescription.trim().length > 0) && view !== 'submitting';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || view === 'submitting') return;
    if (!hasKnownWell && !locationDescription.trim()) return;

    setView('submitting');
    setErrorMessage('');

    try {
      const response = await sosService.sendSos({
        category,
        well_id: hasKnownWell ? activeWell?.id : undefined,
        location_description: locationDescription.trim() || undefined,
        description: description.trim() || undefined,
      });
      setResult(response);
      setView('success');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not reach the backend. Check your connection and try again.';
      setErrorMessage(message);
      setView('error');
    }
  };

  return (
    <>
      {/* Always-visible emergency trigger - accessible from every page via the Header */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        type="button"
        onClick={handleOpen}
        className="relative group flex items-center gap-1.5 h-8 px-3 rounded-lg bg-status-crit hover:bg-status-crit-deep text-white text-xs font-bold tracking-wide shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-status-crit/50"
        title="Report an emergency (Manual SOS)"
        aria-label="Report an emergency"
      >
        <span className="absolute inset-0 rounded-lg bg-status-crit/20 animate-pulse pointer-events-none" />
        <Siren className="w-4 h-4 shrink-0 relative z-10 animate-bounce-slow" />
        <span className="hidden sm:inline relative z-10">SOS</span>
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Emergency SOS"
        subtitle="Human-observed emergency report - independent of Digital Twin monitoring"
        maxWidth="md"
      >
        {(view === 'form' || view === 'submitting') && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-ink font-semibold mb-2">What did you observe?</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {SOS_CATEGORY_OPTIONS.map((opt) => {
                  const Icon = CATEGORY_ICONS[opt.value];
                  const isSelected = category === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      disabled={view === 'submitting'}
                      className={`flex items-center gap-2 h-10 px-2.5 rounded-lg border text-left text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                        isSelected
                          ? 'border-status-crit bg-status-crit-bg text-status-crit-deep'
                          : 'border-border bg-surface hover:bg-surface-secondary text-ink'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-status-crit' : 'text-ink-muted'}`} />
                      <span className="leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">Well / Location</label>
              {hasKnownWell ? (
                <div className="flex items-center justify-between h-9 px-3 rounded-lg border border-border bg-surface-secondary/50">
                  <span className="font-mono text-ink font-semibold">{activeWell?.code}</span>
                  <span className="text-ink-muted text-[10.5px]">Auto-detected from current well context</span>
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={locationDescription}
                  onChange={(e) => setLocationDescription(e.target.value)}
                  placeholder="e.g. Tank farm, north perimeter fence"
                  disabled={view === 'submitting'}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs focus:border-status-crit focus:ring-1 focus:ring-status-crit disabled:opacity-60"
                />
              )}
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">Additional details (optional)</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Anything else that would help responders..."
                disabled={view === 'submitting'}
                className="w-full p-3 rounded-lg border border-border bg-surface text-ink text-xs focus:border-status-crit focus:ring-1 focus:ring-status-crit leading-relaxed disabled:opacity-60"
              />
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-ink-secondary mb-3">Send emergency SOS to configured response teams?</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={view === 'submitting'}
                  className="h-9 px-4 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-status-crit hover:bg-status-crit-deep text-white text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {view === 'submitting' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending SOS...</span>
                    </>
                  ) : (
                    <>
                      <Siren className="w-3.5 h-3.5" />
                      <span>Send SOS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {view === 'success' && result && (
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-status-green-bg border border-status-green/30">
              <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-semibold text-sm text-ink">SOS Sent</p>
                <p className="text-ink-secondary mt-0.5">Emergency notification workflow triggered.</p>
              </div>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-muted">Incident ID</span>
                <span className="font-mono text-ink font-semibold">{result.incident.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Category</span>
                <span className="text-ink font-medium">
                  {SOS_CATEGORY_OPTIONS.find((o) => o.value === result.incident.category)?.label ?? result.incident.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Status</span>
                <span className="text-ink font-medium">{result.incident.status}</span>
              </div>
              {result.incident.possible_duplicate_of && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">Possible duplicate of</span>
                  <span className="font-mono text-ink-secondary text-[10.5px]">{result.incident.possible_duplicate_of}</span>
                </div>
              )}
            </div>

            {result.notifications.length > 0 ? (
              <div>
                <p className="text-ink font-semibold mb-1.5">
                  Mock notification workflow triggered for{' '}
                  {Array.from(new Set(result.notifications.map((n) => n.contact_role).filter(Boolean))).join(', ')}.
                </p>
                <div className="rounded-lg border border-border divide-y divide-border-subtle overflow-hidden">
                  {result.notifications.map((n, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-surface">
                      <span className="text-ink-secondary">
                        {n.contact_role} · {n.channel}
                      </span>
                      <span className="font-mono text-[10.5px] text-ink-muted">{n.status} ({n.provider})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-ink-secondary">No active recipients were configured for this category.</p>
            )}

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="h-9 px-4 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {view === 'error' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-status-crit-bg border border-status-crit/30">
              <XCircle className="w-5 h-5 text-status-crit shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-semibold text-sm text-ink">SOS could not be sent.</p>
                <p className="text-ink-secondary mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="h-9 px-4 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setView('form')}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-status-crit hover:bg-status-crit-deep text-white text-xs font-bold shadow-sm"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
