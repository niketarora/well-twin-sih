import React from 'react';
import { Menu, Sun, Moon, Wifi, Activity } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { mockWell } from '../../mock';

export const Header: React.FC = () => {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();

  return (
    <header className="bg-surface border-b border-border px-3 sm:px-6 sticky top-0 z-20 flex items-center justify-between min-h-[58px] shadow-subtle select-none">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
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
        <div className="hidden sm:flex flex-col justify-center pr-4 border-r border-border shrink-0">
          <span className="font-heading text-xs md:text-sm font-semibold text-ink leading-tight">
            {mockWell.fieldName}
          </span>
          <span className="text-[11px] text-ink-muted leading-tight mt-0.5">
            {mockWell.basin} · {mockWell.formation}
          </span>
        </div>

        {/* Well ID Badge */}
        <div className="flex flex-col justify-center px-1 sm:px-3 sm:border-r border-border shrink-0">
          <span className="text-[9.5px] uppercase font-semibold tracking-wider text-ink-muted leading-none">
            Well
          </span>
          <span className="font-mono text-sm md:text-base font-bold text-ink mt-0.5">
            {mockWell.code}
          </span>
        </div>

        {/* Persistent Well Operational Context Strip (Engineering Workstation) */}
        <div className="hidden lg:flex items-center gap-4 px-3 border-r border-border shrink-0">
          <div className="flex flex-col leading-tight">
            <span className="text-[9.5px] uppercase font-semibold tracking-wider text-ink-muted">
              Operating State
            </span>
            <span className="text-xs font-medium text-ink mt-0.5">
              Production · <span className="font-mono text-petroleum font-semibold">CSS {mockWell.cycle}</span> · Day {mockWell.dayInCycle}/90
            </span>
          </div>

          <div className="h-6 w-px bg-border-subtle" />

          {/* Real-time Subsurface / Surface Key Telemetry Context */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div title="Bottomhole Flowing Pressure (Estimated/Observed)">
              <span className="text-[9.5px] text-ink-muted font-sans uppercase block leading-none">BHP</span>
              <span className="font-bold text-ink leading-tight">38.7 <span className="text-[10px] text-ink-muted font-normal">bar</span></span>
            </div>
            <div title="Bottomhole Temperature (Observed Downhole Sensor)">
              <span className="text-[9.5px] text-ink-muted font-sans uppercase block leading-none">BHT</span>
              <span className="font-bold text-status-warn leading-tight">214.8 <span className="text-[10px] text-ink-muted font-normal">°C</span></span>
            </div>
            <div title="Current Net Oil Production Rate (Actual Coriolis)">
              <span className="text-[9.5px] text-ink-muted font-sans uppercase block leading-none">Oil Rate</span>
              <span className="font-bold text-ink leading-tight">184.2 <span className="text-[10px] text-ink-muted font-normal">BOPD</span></span>
            </div>
          </div>
        </div>

        {/* SCADA Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 border-r border-border shrink-0">
          <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9.5px] uppercase font-semibold tracking-wider text-ink-muted">
              Telemetry
            </span>
            <span className="font-mono text-[11px] font-medium text-ink">
              SCADA 2.0s OK
            </span>
          </div>
        </div>
      </div>

      {/* Right-hand side controls & Theme toggle */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Theme Toggle Button (Light ☀ / Dark ☾) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-petroleum"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
          aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-ink-secondary hover:text-ink" />
          ) : (
            <Sun className="w-4 h-4 text-status-warn hover:text-amber-300" />
          )}
        </button>

        {/* Engineer Initials Avatar */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border">
          <div className="w-7 h-7 rounded bg-surface-secondary border border-border flex items-center justify-center font-mono text-xs font-semibold text-ink-secondary">
            {mockWell.engineerOnDuty.initials}
          </div>
          <div className="hidden 2xl:flex flex-col leading-tight text-left">
            <span className="text-xs font-medium text-ink">{mockWell.engineerOnDuty.name}</span>
            <span className="text-[10px] text-ink-muted">{mockWell.engineerOnDuty.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
