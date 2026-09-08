import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AiCopilotDrawer, AiCopilotTrigger } from '../../features/ai-copilot';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-canvas text-ink text-sm selection:bg-petroleum/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-7 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Engineering Copilot Trigger & Drawer */}
      <AiCopilotTrigger />
      <AiCopilotDrawer />
    </div>
  );
};

