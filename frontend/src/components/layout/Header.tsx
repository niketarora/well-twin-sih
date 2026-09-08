import React, { useMemo } from 'react';
import { Menu, Sun, Moon, Bot } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { mockWell, mockFieldWells } from '../../mock';
import { EmergencySosControl } from '../sos/EmergencySosControl';
import { useAiCopilot } from '../../features/ai-copilot';

export const Header: React.FC = () => {
  const { toggleSidebar, theme, toggleTheme, selectedWellId } = useUIStore();
  const { toggleOpen: toggleAi } = useAiCopilot();

  const activeWell = useMemo(() => {
    const found = mockFieldWells.find(w => w.id === selectedWellId || w.code.toLowerCase() === selectedWellId.toLowerCase());
    if (found) {
      return {
        ...mockWell,
        id: found.id,
        code: found.code,
        name: found.name,
        cycle: found.cycle,
        dayInCycle: found.dayInCycle,
        oilRateBopd: found.oilRateBopd,
        bht: found.bottomHoleTempC,
        bhp: (found.bottomHolePressMpa * 10).toFixed(1), // MPa to bar
        phase: found.phase,
        status: found.status,
      };
    }
    return {
      ...mockWell,
      oilRateBopd: 84.2,
      bht: 214.8,
      bhp: '38.7',
      status: 'Attention Required',
    };
  }, [selectedWellId]);

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
            {activeWell.fieldName}
          </span>
          <span className="text-[11px] text-ink-muted leading-tight mt-0.5">
            {activeWell.basin} · {activeWell.formation}
          </span>
        </div>

        {/* Well ID Badge */}
        <div className="flex flex-col justify-center px-1 sm:px-3 sm:border-r border-border shrink-0">
          <span className="text-[9.5px] uppercase font-semibold tracking-wider text-ink-muted leading-none">
            Active Well
          </span>
          <span className="font-mono text-sm md:text-base font-bold text-ink mt-0.5">
            {activeWell.code}
          </span>
        </div>

        {/* Persistent Well Operational Context Strip (Engineering Workstation) */}
        <div className="hidden md:flex items-center px-3 border-r border-border shrink-0">
          <div className="flex flex-col leading-tight">
            <span className="text-[9.5px] uppercase font-semibold tracking-wider text-ink-muted">
              Operating State
            </span>
            <span className="text-xs font-medium text-ink mt-0.5">
              {activeWell.phase} · <span className="font-mono text-petroleum font-semibold">CSS {activeWell.cycle}</span> · Day {activeWell.dayInCycle}/90
            </span>
          </div>
        </div>
      </div>

      {/* Right-hand side controls & Theme toggle */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Emergency Manual SOS - accessible from every page, independent of Digital Twin */}
        <EmergencySosControl />

        {/* AI Copilot Launch Button */}
        <button
          type="button"
          onClick={toggleAi}
          className="h-8 px-2.5 rounded-lg border border-petroleum/30 bg-petroleum/10 hover:bg-petroleum/20 text-petroleum dark:text-cyan-400 flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-petroleum font-semibold text-xs shadow-2xs"
          title="Open Well Twin AI Copilot"
          aria-label="Open Well Twin AI Copilot"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">AI Copilot</span>
        </button>

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

        {/* User initials / Engineer on duty */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-3 sm:border-l border-border">
          <div className="w-8 h-8 rounded-full bg-petroleum/10 border border-petroleum/25 flex items-center justify-center text-xs font-bold text-petroleum font-mono">
            {mockWell.engineerOnDuty.initials}
          </div>
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-xs font-semibold text-ink">
              {mockWell.engineerOnDuty.name}
            </span>
            <span className="text-[10.5px] text-ink-muted mt-0.5">
              {mockWell.engineerOnDuty.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
