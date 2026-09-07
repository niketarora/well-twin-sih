import React from 'react';
import { Menu, Wifi } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { mockWell } from '../../mock';

export const Header: React.FC = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="bg-surface border-b border-border px-4 md:px-7 sticky top-0 z-20 flex items-center justify-between min-h-[58px] shadow-subtle">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 rounded-md hover:bg-surface-secondary text-ink-secondary"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Field & Location */}
        <div className="hidden sm:flex flex-col justify-center pr-5 border-r border-border">
          <span className="font-heading text-xs md:text-sm font-semibold text-ink leading-tight">
            {mockWell.fieldName}
          </span>
          <span className="text-[11px] text-ink-muted leading-tight mt-0.5">
            {mockWell.basin} · {mockWell.formation}
          </span>
        </div>

        {/* Well ID */}
        <div className="flex flex-col justify-center px-1 sm:px-4 sm:border-r border-border">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted leading-none">
            Well
          </span>
          <span className="font-mono text-sm md:text-base font-semibold text-ink mt-0.5">
            {mockWell.code}
          </span>
        </div>

        {/* Phase & Cycle */}
        <div className="hidden md:flex flex-col justify-center px-4 border-r border-border">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted leading-none">
            Operating Phase
          </span>
          <span className="text-xs font-medium text-ink mt-0.5">
            {mockWell.phase} · <span className="font-mono">CSS {mockWell.cycle} · Day {mockWell.dayInCycle} of {mockWell.totalCycleDays}</span>
          </span>
        </div>

        {/* SCADA Status */}
        <div className="hidden lg:flex flex-col justify-center px-4 border-r border-border">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted leading-none">
            Telemetry Feed
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
            <span className="text-xs font-medium text-ink">
              SCADA {mockWell.scadaStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Right-hand side metadata */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted leading-none">
            Last Updated
          </span>
          <span className="font-mono text-xs text-ink-secondary mt-0.5">
            {mockWell.lastUpdated}
          </span>
        </div>

        {/* Synthetic Demo Data Pill */}
        <div className="text-[10px] font-semibold tracking-wider uppercase text-petroleum-deep bg-petroleum-tint border border-petroleum/40 rounded px-2.5 py-1">
          Synthetic Demo Data
        </div>

        {/* Engineer Initials Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-7 h-7 rounded bg-surface-secondary border border-border flex items-center justify-center font-mono text-xs font-semibold text-ink-secondary">
            {mockWell.engineerOnDuty.initials}
          </div>
          <div className="hidden xl:flex flex-col leading-tight text-left">
            <span className="text-xs font-medium text-ink">{mockWell.engineerOnDuty.name}</span>
            <span className="text-[10px] text-ink-muted">{mockWell.engineerOnDuty.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
