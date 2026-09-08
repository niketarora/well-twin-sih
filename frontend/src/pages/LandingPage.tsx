import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Cpu,
  Flame,
  Activity,
  Zap,
  ArrowRight,
  Sliders,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  BarChart3,
  TrendingDown,
  Clock,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Compass,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'thermal' | 'srp' | 'ai' | 'twin'>('thermal');

  const corePillars = [
    {
      id: 'thermal',
      title: 'Cyclic Steam Optimization (CSS)',
      subtitle: 'Thermal EOR & Reservoir Heating',
      desc: 'Optimizes steam injection volume, soak duration, and production cut-off based on radial steam chamber temperature falloff.',
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-800/40',
      badgeColor: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40',
      features: [
        'Predictive radial steam plume isotherms (R = 18.4m)',
        'Arrhenius crude viscosity falloff calculation',
        'Steam-Oil Ratio (SOR) minimization & energy tracking',
      ],
    },
    {
      id: 'srp',
      title: 'SRP Kinematics & Lift Diagnostics',
      subtitle: 'Downhole Pump & Rod Protection',
      desc: 'Continuous dynamometer load loop decomposition to detect downstroke rod floating, fluid pound, and Goodman fatigue limits.',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800/40',
      badgeColor: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40',
      features: [
        'Automated VFD stroke speed & SPM optimization',
        'Traveling valve compression phase analysis',
        '3-Tier Goodman stress tracking for Norris 97 alloy',
      ],
    },
    {
      id: 'twin',
      title: '4-Tier Coupled Digital Twin',
      subtitle: 'Reservoir to Surface Gathering',
      desc: 'Seamless data bridge linking subsurface reservoir physics, vertical multiphase hydrodynamics, SRP dynamics, and surface production.',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800/40',
      badgeColor: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40',
      features: [
        'Physics-Informed Neural Network (PINN) solver',
        'Newton-Raphson continuous PDE convergence (L2 < 1e-4)',
        'Coriolis skid production rate reconciliation (184.2 BOPD)',
      ],
    },
    {
      id: 'ai',
      title: 'Prescriptive AI & Safety SOS',
      subtitle: 'Explainable AI & Emergency Guardrails',
      desc: 'Actionable operational recommendations backed by physics-informed explainability and deterministic manual emergency SOS triage.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800/40',
      badgeColor: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/40',
      features: [
        'Prescriptive VFD speed recommendations (e.g. 7.8 SPM)',
        'Multi-physics causal chain root-cause attribution',
        'Human-triggered SOS independent of ML model state',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/20">
      {/* 1. Official Indian Government Top Bar (Emerald Green / Clean White) */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-xs px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2.5 bg-gradient-to-b from-orange-500 via-white to-emerald-600 rounded-2xs inline-block shadow-2xs" />
            <span className="font-bold tracking-wide">भारत सरकार | Government of India</span>
          </div>
          <span className="hidden sm:inline text-emerald-400">|</span>
          <span className="hidden sm:inline text-emerald-100 font-medium">
            पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय | Ministry of Petroleum & Natural Gas
          </span>
          <span className="hidden lg:inline text-emerald-400">|</span>
          <span className="hidden lg:inline font-bold text-amber-300">
            ऑयल इंडिया लिमिटेड | Oil India Limited
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-medium">
          <span className="bg-emerald-800/80 dark:bg-emerald-900 px-2.5 py-0.5 rounded-full text-amber-300 font-bold border border-emerald-600/40">
            SIH 2026 · Problem Statement #26120
          </span>
        </div>
      </div>

      {/* 2. Sleek Clean Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-0.5 shadow-md shadow-emerald-600/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-600 dark:text-emerald-400 text-base tracking-tighter">
              OIL
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm md:text-base tracking-tight text-slate-900 dark:text-slate-100 uppercase">
              WELL TWIN <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">PORTAL</span>
            </span>
            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
              Baghewala Heavy Oil Field · Rajasthan
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#overview" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Overview</a>
          <a href="#pillars" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Key Pillars</a>
          <a href="#architecture" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Architecture</a>
          <a href="#field-data" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Baghewala Data</a>
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/overview')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <span>Enter Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* 3. Modern Light Hero Section */}
      <section id="overview" className="relative overflow-hidden py-16 lg:py-20 px-4 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>SIH 2026 · Oil India Limited · Baghewala Heavy Oil Field</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
              AI-Enabled Digital Twin for <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">CSS & SRP Operations</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Integrated multi-physics digital twin combining reservoir thermal heating, downhole crude viscosity modeling, sucker rod pump kinematics, and surface production networks for Baghewala heavy crude (17–19° API).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Field API</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">17–19° API</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Reservoir Temp</span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5 block">46–48 °C</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Digital Twins</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5 block">4 Coupled</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Accuracy</span>
                <span className="text-base font-black text-teal-600 dark:text-teal-400 mt-0.5 block">95.8% MAPE</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/overview')}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2"
              >
                <span>Launch Live Workstation Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">SCADA 2.0s Telemetry</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  BW-017 LIVE
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans font-semibold">Crude Viscosity</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">84.0 cP (+11% drag)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans font-semibold">Bottomhole Temp (BHT)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">214.8 °C (Cooling)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans font-semibold">SRP Barrel Fillage</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">84.6% (Fluid Pound @ 2.80m)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans font-semibold">Net Oil Production</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">184.2 BOPD (Pred 198.0)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-sans space-y-1">
                <span className="font-extrabold block text-emerald-800 dark:text-emerald-300 uppercase text-[10px] tracking-wider">
                  AI Prescriptive Optimization
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11.5px] font-medium">
                  Trim VFD speed from 8.4 to 7.8 SPM to eliminate downstroke fluid pound & extend Goodman rod fatigue life by +24%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Pillars Interactive Section */}
      <section id="pillars" className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-mono font-extrabold tracking-widest uppercase">
            Engineering Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            Four Core Pillars of the Digital Twin Solution
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Addressing CSS steam cycle optimization, sucker rod pump mechanical reliability, and multi-physics AI prediction.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900 max-w-2xl mx-auto">
          {corePillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                <span>{pillar.title.split(' ')[0]} {pillar.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card Display */}
        <AnimatePresence mode="wait">
          {corePillars
            .filter((p) => p.id === activeTab)
            .map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`p-6 sm:p-8 rounded-2xl border ${pillar.bgColor} ${pillar.borderColor} shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center`}
                >
                  <div className="md:col-span-7 space-y-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold inline-block ${pillar.badgeColor}`}>
                      {pillar.subtitle}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      {pillar.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
                      {pillar.desc}
                    </p>

                    <div className="space-y-2 pt-2">
                      {pillar.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </section>

      {/* 5. Indian Government & Partner Logos Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 px-4 lg:px-8 space-y-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Government of India & Industry Partners
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs">Digital India</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs">Make in India</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs">myGov</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs text-emerald-400">Oil India Limited</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs text-amber-400">Smart India Hackathon 2026</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <span>© 2026 Oil India Limited · Ministry of Petroleum & Natural Gas · Govt of India</span>
          <button
            onClick={() => navigate('/overview')}
            className="text-emerald-400 font-bold hover:underline"
          >
            Launch Workstation Command Center →
          </button>
        </div>
      </footer>
    </div>
  );
};
