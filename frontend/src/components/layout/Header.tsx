import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Bot, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../stores/useUIStore';
import { mockWell, mockFieldWells } from '../../mock';
import { EmergencySosControl } from '../sos/EmergencySosControl';
import { useAiCopilot } from '../../features/ai-copilot';
import oilIndiaLogo from '../../oilinidailogo.jpeg';

export const Header: React.FC = () => {
  const navigate = useNavigate();
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
    <header className="bg-surface/95 backdrop-blur-md border-b border-border px-3 sm:px-5 sticky top-0 z-30 flex items-center justify-between h-[60px] shadow-subtle select-none">
      {/* Left side: Navigation toggle, Field identity, Well ID, Operating state */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 overflow-hidden">
        {/* Mobile menu toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-secondary text-ink-secondary shrink-0"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Field & Location */}
        <div className="hidden sm:flex flex-col justify-center pr-3 border-r border-border shrink-0">
          <span className="font-heading text-xs md:text-sm font-bold text-ink leading-tight">
            {activeWell.fieldName}
          </span>
          <span className="text-[10px] font-semibold text-ink-muted leading-tight mt-0.5">
            {activeWell.basin} · {activeWell.formation}
          </span>
        </div>

        {/* Active Well Badge */}
        <div className="flex flex-col justify-center px-1 sm:px-2.5 sm:border-r border-border shrink-0">
          <span className="text-[8.5px] uppercase font-black tracking-wider text-ink-muted leading-none">
            Active Well
          </span>
          <span className="font-mono text-sm md:text-base font-black text-ink mt-0.5 tracking-tight">
            {activeWell.code}
          </span>
        </div>

        {/* Persistent Operating State */}
        <div className="hidden xl:flex items-center gap-3 px-2 border-r border-border shrink-0 max-w-[210px] overflow-hidden">
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="text-[8.5px] uppercase font-black tracking-wider text-ink-muted">
              Operating State
            </span>
            <span className="text-xs font-semibold text-ink mt-0.5 truncate">
              {activeWell.phase} · <span className="font-mono text-petroleum font-bold">CSS {activeWell.cycle}</span> · Day {activeWell.dayInCycle}/90
            </span>
          </div>
        </div>
      </div>

      {/* Right side controls: SOS, Govt Portal, AI Copilot, Theme toggle, User profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 pl-2">
        {/* Emergency Manual SOS */}
        <div className="shrink-0 relative">
          <EmergencySosControl />
        </div>

        {/* Return to Landing Page Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => navigate('/landing')}
          className="h-8 px-2.5 rounded-lg border border-emerald-600/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 transition-all font-bold text-xs shadow-2xs shrink-0"
          title="Return to Official Oil India Government Portal Landing Page"
        >
          <img src={oilIndiaLogo} alt="OIL Logo" className="w-4 h-4 object-contain" />
          <span className="hidden md:inline text-[11px]">Gov Portal</span>
        </motion.button>

        {/* AI Copilot Launch Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={toggleAi}
          className="h-8 px-2.5 rounded-lg border border-petroleum/40 bg-petroleum/10 hover:bg-petroleum/20 text-petroleum dark:text-cyan-400 flex items-center gap-1.5 transition-all font-bold text-xs shadow-2xs shrink-0"
          title="Open Well Twin AI Copilot"
        >
          <Bot className="w-3.5 h-3.5 animate-bounce-slow" />
          <span className="hidden sm:inline text-[11px]">AI Copilot</span>
        </motion.button>

        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.92, rotate: -15 }}
          type="button"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink flex items-center justify-center transition-colors shadow-2xs shrink-0"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-ink-secondary hover:text-ink" />
          ) : (
            <Sun className="w-4 h-4 text-status-warn hover:text-amber-300" />
          )}
        </motion.button>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2.5 sm:border-l border-border shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-petroleum/10 border border-petroleum/30 flex items-center justify-center text-xs font-bold text-petroleum font-mono shadow-2xs">
            {mockWell.engineerOnDuty.initials}
          </div>
          <div className="hidden lg:flex flex-col leading-none">
            <span className="text-xs font-bold text-ink">
              {mockWell.engineerOnDuty.name}
            </span>
            <span className="text-[9.5px] font-medium text-ink-muted mt-0.5">
              {mockWell.engineerOnDuty.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};


