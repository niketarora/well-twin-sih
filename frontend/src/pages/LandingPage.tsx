import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Cpu,
  Flame,
  Activity,
  ArrowRight,
  Sliders,
  AlertTriangle,
  Award,
  Sparkles,
  BarChart3,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import local government emblem, Oil India Limited logo & partner marquee logos
import ministryEmblem from '../WhatsApp Image 2026-09-08 at 10.19.44 AM.jpeg';
import oilIndiaLogo from '../oilinidailogo.jpeg';
import m1 from '../m1.jpeg';
import m2 from '../m2.jpeg';
import m7 from '../m7.jpeg';
import m8 from '../m8.jpeg';
import m9 from '../m9.jpeg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'thermal' | 'srp' | 'twin' | 'ai'>('thermal');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    // Ensure clean light theme is active for the landing page
    document.documentElement.classList.remove('dark');
  }, []);

  const marqueeLogos = [
    { src: m1, alt: 'myGov' },
    { src: m2, alt: 'india.gov.in' },
    { src: m7, alt: 'Make in India' },
    { src: m8, alt: 'Indian Railways' },
    { src: m9, alt: 'Digital India' },
  ];

  const solutionPillars = [
    {
      id: 'thermal',
      title: 'Cyclic Steam Optimization (CSS)',
      subtitle: 'Thermal EOR & Reservoir Heating',
      desc: 'Optimizes steam injection volume, soak time, and production cut-off based on radial steam plume temperature falloff predictions.',
      icon: Flame,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-300',
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-300',
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
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-300',
      badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300',
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
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-300',
      badgeColor: 'text-cyan-800 bg-cyan-100 border-cyan-300',
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
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-300',
      badgeColor: 'text-purple-800 bg-purple-100 border-purple-300',
      highlights: [
        'Prescriptive VFD speed recommendations (e.g. 7.8 SPM)',
        'Multi-physics causal chain root-cause attribution',
        'Human-triggered SOS independent of ML model state',
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-[#F4F6F8] text-[#17212B] font-sans selection:bg-amber-500/20 ${
      fontSize === 'large' ? 'text-base' : 'text-sm'
    }`}>
      {/* 0. Indian Flag Tricolor Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 1. Official Indian Government Top Bar (Rich Emerald Header) */}
      <div className="bg-[#047857] text-white text-xs px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/95 p-1 rounded shadow-2xs">
            <img
              src={ministryEmblem}
              alt="Ministry Emblem"
              className="h-8 w-auto object-contain"
            />
            <div className="w-px h-6 bg-slate-300" />
            <img
              src={oilIndiaLogo}
              alt="Oil India Limited Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-xs tracking-wide text-white">
              भारत सरकार | Government of India
            </span>
            <span className="text-[11px] font-semibold text-emerald-100">
              ऑयल इंडिया लिमिटेड · पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय | Oil India Limited
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-emerald-100">
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-900/50'}`}
              title="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-900/50'}`}
              title="Large text size"
            >
              A+
            </button>
          </div>
          <span className="text-emerald-400">|</span>
          <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold shadow-2xs">
            SIH 2026 · Problem Statement #26120
          </span>
        </div>
      </div>

      {/* 2. Pure White Surface Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E6EA] px-4 lg:px-8 py-3 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <img
            src={oilIndiaLogo}
            alt="Oil India Limited Logo"
            className="h-10 w-auto object-contain rounded-xl border border-[#E2E6EA] p-1 bg-white shadow-2xs"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm md:text-base tracking-tight text-[#17212B] uppercase">
              WELL TWIN <span className="text-[#C69A45] font-extrabold text-xs">PORTAL</span>
            </span>
            <span className="text-[10.5px] font-bold text-[#66717C] tracking-wide uppercase">
              Baghewala Heavy Oil Field · Oil India Limited
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-[#66717C]">
          <a href="#overview" className="hover:text-[#C69A45] transition-colors">Overview</a>
          <a href="#marquee" className="hover:text-[#C69A45] transition-colors">Govt Initiatives</a>
          <a href="#pillars" className="hover:text-[#C69A45] transition-colors">Solution Pillars</a>
          <a href="#problem-context" className="hover:text-[#C69A45] transition-colors">Field Specifications</a>
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/overview')}
            className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#C69A45] to-[#8A6A22] hover:from-[#B58B3A] hover:to-[#8A6A22] text-white font-extrabold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all"
          >
            <span>Enter Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* 3. Light Hero Section */}
      <section id="overview" className="relative overflow-hidden py-14 lg:py-18 px-4 lg:px-8 border-b border-[#E2E6EA] bg-gradient-to-b from-[#F4F6F8] via-white to-[#F4F6F8]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-2xs">
              <Award className="w-4 h-4 text-[#C69A45]" />
              <span>Smart India Hackathon 2026 · Software Category · SIH26120</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17212B] tracking-tight leading-[1.15]">
              AI-Enabled Digital Twin for <span className="bg-gradient-to-r from-[#C69A45] via-amber-600 to-emerald-600 bg-clip-text text-transparent">CSS & SRP Operations</span>
            </h1>

            <p className="text-[#66717C] text-sm sm:text-base leading-relaxed font-medium">
              Engineered for <strong>Oil India Limited</strong> to optimize heavy crude (17–19° API) recovery in Rajasthan’s Baghewala Field. Integrates reservoir thermal dynamics, downhole viscosity modeling, SRP rod kinematics, and surface production networks.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E6EA] shadow-xs">
                <span className="text-[10px] text-[#8B949E] font-bold uppercase block">Field API</span>
                <span className="text-base font-black text-[#C69A45] mt-0.5 block">17–19° API</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E6EA] shadow-xs">
                <span className="text-[10px] text-[#8B949E] font-bold uppercase block">Reservoir Temp</span>
                <span className="text-base font-black text-emerald-600 mt-0.5 block">46–48 °C</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E6EA] shadow-xs">
                <span className="text-[10px] text-[#8B949E] font-bold uppercase block">Coupled Twins</span>
                <span className="text-base font-black text-blue-600 mt-0.5 block">4 Models</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E6EA] shadow-xs">
                <span className="text-[10px] text-[#8B949E] font-bold uppercase block">Accuracy</span>
                <span className="text-base font-black text-amber-600 mt-0.5 block">95.8% MAPE</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/overview')}
                className="px-6 py-3.5 rounded-xl bg-[#C69A45] hover:bg-[#B58B3A] text-white font-black text-xs sm:text-sm shadow-lg shadow-amber-600/20 flex items-center gap-2"
              >
                <span>Launch Workstation Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <a
                href="#pillars"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#17212B] font-bold text-xs sm:text-sm border border-[#E2E6EA] transition-colors shadow-2xs"
              >
                Explore Solution Pillars
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white border border-[#E2E6EA] p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E6EA] pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#17212B]">SCADA TELEMETRY 2.0s OK</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#C69A45] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  BW-017 LIVE
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E6EA] flex items-center justify-between">
                  <span className="text-[#66717C] font-sans font-semibold">Crude Viscosity</span>
                  <span className="text-amber-600 font-bold">84.0 cP (+11% drag)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E6EA] flex items-center justify-between">
                  <span className="text-[#66717C] font-sans font-semibold">Bottomhole Temp (BHT)</span>
                  <span className="text-emerald-600 font-bold">214.8 °C (Cooling)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E6EA] flex items-center justify-between">
                  <span className="text-[#66717C] font-sans font-semibold">SRP Barrel Fillage</span>
                  <span className="text-rose-600 font-bold">84.6% (Fluid Pound @ 2.80m)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E6EA] flex items-center justify-between">
                  <span className="text-[#66717C] font-sans font-semibold">Net Oil Production</span>
                  <span className="text-blue-600 font-bold">184.2 BOPD (Pred 198.0)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-sans space-y-1">
                <span className="font-bold block text-amber-800 uppercase text-[10px] tracking-wider">
                  AI Prescriptive Optimization
                </span>
                <p className="text-[#17212B] leading-snug text-[11.5px] font-medium">
                  Trim VFD speed from 8.4 to 7.8 SPM to eliminate downstroke fluid pound & extend Goodman rod fatigue life by +24%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action Banner (Light Scheme Matching Workstation) */}
      <section className="py-14 px-4 lg:px-8 bg-white border-y border-[#E2E6EA] text-center space-y-5">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 border border-amber-200 text-[#C69A45] inline-block">
            Production & Technical Workstation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#17212B] tracking-tight">
            Ready to Explore the Baghewala Well Twin Workstation?
          </h2>
          <p className="text-[#66717C] font-medium text-xs sm:text-sm max-w-xl mx-auto">
            Access live 7-well surveillance maps, interactive dynamometer cards, steam injection cycle trackers, and AI prescriptive recommendations.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/overview')}
          className="px-8 py-3.5 rounded-xl bg-[#C69A45] hover:bg-[#B58B3A] text-white font-extrabold text-sm shadow-lg shadow-amber-600/20 inline-flex items-center gap-2 transition-all"
        >
          <span>Launch Workstation Now</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.button>
      </section>

      {/* 8. INFINITE MARQUEE LOGO BANNER (Placed at the very bottom before footer) */}
      <section id="marquee" className="py-7 bg-white border-b border-[#E2E6EA] overflow-hidden select-none">
        <div className="max-w-6xl mx-auto px-4 mb-3 text-center">
          <span className="text-[11px] font-black text-[#8B949E] uppercase tracking-widest block">
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
                className="h-16 px-6 py-2 rounded-xl bg-[#F8F9FA] flex items-center justify-center border border-[#E2E6EA] shadow-2xs shrink-0"
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

      {/* 9. Official Government Footer */}
      <footer className="bg-white border-t border-[#E2E6EA] py-8 px-4 lg:px-8 space-y-4 text-xs text-[#66717C]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={ministryEmblem} alt="Ministry Emblem" className="h-8 w-auto object-contain rounded border border-[#E2E6EA] p-0.5" />
            <span className="font-semibold">© 2026 Oil India Limited · Ministry of Petroleum & Natural Gas · Govt of India</span>
          </div>
          <button
            onClick={() => navigate('/overview')}
            className="text-[#C69A45] font-black hover:underline"
          >
            Launch Live Workstation →
          </button>
        </div>
      </footer>
    </div>
  );
};
