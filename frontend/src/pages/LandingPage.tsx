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
  Sparkles,
  BarChart3,
  TrendingDown,
  Clock,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Check,
  Landmark,
  Database,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import local government emblems and marquee logos provided
import ministryEmblem from '../WhatsApp Image 2026-09-08 at 10.19.44 AM.jpeg';
import m1 from '../m1.jpeg';
import m2 from '../m2.jpeg';
import m7 from '../m7.jpeg';
import m8 from '../m8.jpeg';
import m9 from '../m9.jpeg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'thermal' | 'srp' | 'twin' | 'ai'>('thermal');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const marqueeLogos = [
    { src: m1, alt: 'myGov' },
    { src: m2, alt: 'india.gov.in' },
    { src: m7, alt: 'Make in India' },
    { src: m8, alt: 'Indian Government Portal' },
    { src: m9, alt: 'Digital India' },
  ];

  const solutionPillars = [
    {
      id: 'thermal',
      title: 'Cyclic Steam Optimization (CSS)',
      subtitle: 'Thermal EOR & Steam Chamber Growth',
      desc: 'Optimizes steam injection volume, soak time, and production cut-off based on radial thermal falloff predictions.',
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      highlights: [
        'Predictive radial steam plume isotherms (R = 18.4m)',
        'Arrhenius crude viscosity falloff calculation',
        'Steam-Oil Ratio (SOR) minimization & energy tracking',
      ],
    },
    {
      id: 'srp',
      title: 'SRP Lift Kinematics & Rod Safety',
      subtitle: 'Downhole Pump & Rod Protection',
      desc: 'Continuous dynamometer load loop decomposition to detect downstroke rod floating, fluid pound, and Goodman fatigue limits.',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      highlights: [
        'Automated VFD stroke speed & SPM optimization',
        'Traveling valve compression phase analysis',
        '3-Tier Goodman stress tracking for Norris 97 alloy',
      ],
    },
    {
      id: 'twin',
      title: '4-Tier Coupled Digital Twin',
      subtitle: 'Subsurface Reservoir to Surface Gathering',
      desc: 'Seamless data bridge linking subsurface reservoir physics, vertical multiphase hydrodynamics, SRP dynamics, and surface production.',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      highlights: [
        'Physics-Informed Neural Network (PINN) solver',
        'Newton-Raphson continuous PDE convergence (L2 < 1e-4)',
        'Coriolis skid production rate reconciliation (184.2 BOPD)',
      ],
    },
    {
      id: 'ai',
      title: 'Prescriptive AI & Safety Guardrails',
      subtitle: 'Explainable AI & Emergency SOS',
      desc: 'Actionable operational guidance backed by physics-informed explainability and deterministic manual emergency SOS triage.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      highlights: [
        'Prescriptive VFD speed recommendations (e.g. 7.8 SPM)',
        'Multi-physics causal chain root-cause attribution',
        'Human-triggered SOS independent of ML model state',
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 ${
      fontSize === 'large' ? 'text-base' : 'text-sm'
    }`}>
      {/* 1. Official Indian Government Top Bar with Ministry Emblem Image */}
      <div className="bg-emerald-950 border-b border-emerald-800/60 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={ministryEmblem}
            alt="Ministry of Petroleum and Natural Gas Emblem"
            className="h-10 w-auto object-contain rounded bg-white p-0.5 shadow-2xs"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-xs tracking-wide text-white">
              भारत सरकार | Government of India
            </span>
            <span className="text-[11px] font-semibold text-emerald-300">
              पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय | Ministry of Petroleum & Natural Gas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-emerald-200">
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-900/50'}`}
              title="Normal font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-900/50'}`}
              title="Large font size"
            >
              A+
            </button>
          </div>
          <span className="text-emerald-700">|</span>
          <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-[11px] font-bold">
            SIH 2026 · Problem Statement #26120
          </span>
        </div>
      </div>

      {/* 2. Main Portal Navbar Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg tracking-tighter">
              OIL
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm md:text-base tracking-wider text-slate-100 uppercase">
              WELL TWIN <span className="text-amber-400 font-extrabold text-xs">DIGITAL PORTAL</span>
            </span>
            <span className="text-[10.5px] font-bold text-slate-400 tracking-wide uppercase">
              Baghewala Heavy Oil Field · Oil India Limited
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
          <a href="#overview" className="hover:text-amber-400 transition-colors">Overview</a>
          <a href="#pillars" className="hover:text-amber-400 transition-colors">Solution Pillars</a>
          <a href="#problem-spec" className="hover:text-amber-400 transition-colors">Problem Context</a>
          <a href="#marquee-section" className="hover:text-amber-400 transition-colors">Govt Partners</a>
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/overview')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all"
          >
            <span>Launch Digital Twin Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section id="overview" className="relative overflow-hidden py-16 lg:py-20 px-4 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon 2026 · Software Category · SIH26120</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-[1.15]">
              AI-Powered Well-to-Surface <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">Digital Twin Platform</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Engineered for <strong>Oil India Limited</strong> to optimize heavy crude (17–19° API) recovery in Rajasthan’s Baghewala Field. Integrates reservoir thermal dynamics, crude viscosity modeling, SRP rod kinematics, and surface gathering lines.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Field API</span>
                <span className="text-base font-bold text-amber-400 mt-0.5 block">17–19° API</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Reservoir Temp</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">46–48 °C</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Coupled Twins</span>
                <span className="text-base font-bold text-cyan-400 mt-0.5 block">4 Models</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Model Accuracy</span>
                <span className="text-base font-bold text-amber-300 mt-0.5 block">95.8% MAPE</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/overview')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <span>Enter Workstation Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <a
                href="#pillars"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
              >
                Explore Solution Pillars
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-slate-200">SCADA TELEMETRY 2.0s OK</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  BW-017 LIVE
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Crude Viscosity</span>
                  <span className="text-amber-400 font-bold">84.0 cP (+11% drag)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Bottomhole Temp (BHT)</span>
                  <span className="text-emerald-400 font-bold">214.8 °C (Cooling)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">SRP Barrel Fillage</span>
                  <span className="text-rose-400 font-bold">84.6% (Fluid Pound @ 2.80m)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Net Oil Production</span>
                  <span className="text-cyan-400 font-bold">184.2 BOPD (Pred 198.0)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-sans space-y-1">
                <span className="font-bold block text-amber-400 uppercase text-[10px] tracking-wider">
                  AI Prescriptive Optimization
                </span>
                <p className="text-slate-200 leading-snug text-[11px]">
                  Trim VFD speed from 8.4 to 7.8 SPM to eliminate downstroke fluid pound & extend Goodman rod fatigue life by +24%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INFINITE MARQUEE LOGO BANNER (Using m1, m2, m7, m8, m9 provided by user) */}
      <section id="marquee-section" className="py-8 bg-slate-900 border-b border-slate-800 overflow-hidden select-none">
        <div className="max-w-6xl mx-auto px-4 mb-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            Government of India Portals & Digital Initiatives
          </span>
        </div>

        {/* Infinite CSS Marquee Wrapper */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-8 py-2">
            {[...marqueeLogos, ...marqueeLogos, ...marqueeLogos].map((logo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="h-16 px-6 py-2 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0 border border-slate-200/80"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 w-auto object-contain max-w-[140px]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Solution Pillars Interactive Section */}
      <section id="pillars" className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            Multi-Physics Engineering Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            Four Core Pillars of the Digital Twin Solution
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Addressing CSS steam cycle optimization, sucker rod pump mechanical reliability, and multi-physics AI prediction.
          </p>
        </div>

        {/* Pillar Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-2xl mx-auto">
          {solutionPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{pillar.title.split(' ')[0]} {pillar.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Content Card */}
        <AnimatePresence mode="wait">
          {solutionPillars
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
                  className={`p-6 sm:p-8 rounded-2xl border ${pillar.bgColor} ${pillar.borderColor} shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center`}
                >
                  <div className="md:col-span-8 space-y-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border inline-block ${pillar.badgeColor}`}>
                      {pillar.subtitle}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                      {pillar.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      {pillar.desc}
                    </p>

                    <div className="space-y-2 pt-2">
                      {pillar.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-200">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 flex justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center text-amber-400">
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </section>

      {/* 6. SIH Problem Statement Details */}
      <section id="problem-spec" className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-8 border-t border-slate-800">
        <div className="text-center space-y-3">
          <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            SIH26120 Specifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            Baghewala Field Operational Context & Objectives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-slate-100">Heavy Oil Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jodhpur Sandstone produces heavy crude (17–19° API) under low reservoir temperature (46–48°C), requiring Cyclic Steam Stimulation (CSS) to mobilize fluids.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-slate-100">Rod Floating Prevention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              As steam chamber cools, crude viscosity surges—causing downstroke rod drag, rod floating, Traveling Valve impact, and frequent mechanical failures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-slate-100">Predictive SOR Optimization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous multi-physics coupling minimizes Steam-Oil Ratio (SOR) and VFD energy consumption while maximizing total cumulative oil output.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Call to Action Banner */}
      <section className="py-12 px-4 lg:px-8 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-slate-950 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Ready to Explore the Baghewala Well Twin Workstation?
        </h2>
        <p className="text-slate-950 font-semibold text-xs sm:text-sm max-w-xl mx-auto">
          Access live 7-well surveillance maps, interactive dynamometer cards, steam injection cycle trackers, and AI prescriptive recommendations.
        </p>
        <button
          onClick={() => navigate('/overview')}
          className="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-sm shadow-2xl inline-flex items-center gap-2 transition-all"
        >
          <span>Launch Workstation Now</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </section>

      {/* 8. Official Government Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 lg:px-8 space-y-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={ministryEmblem} alt="Ministry Emblem" className="h-8 w-auto object-contain rounded bg-white p-0.5" />
            <span>© 2026 Oil India Limited · Ministry of Petroleum & Natural Gas · Govt of India</span>
          </div>
          <button
            onClick={() => navigate('/overview')}
            className="text-amber-400 font-bold hover:underline"
          >
            Launch Live Workstation →
          </button>
        </div>
      </footer>
    </div>
  );
};
