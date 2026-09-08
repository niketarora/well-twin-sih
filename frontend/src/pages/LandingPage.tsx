import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Cpu,
  Flame,
  Activity,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sliders,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  Layers,
  Sparkles,
  BarChart3,
  TrendingDown,
  Clock,
  Gauge,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const sihFeatures = [
    { id: 1, title: 'Well-to-Surface Digital Twin', desc: 'Coupled virtual representation of reservoir thermal chamber, wellbore hydrodynamics, SRP dynamics, and surface gathering line.', icon: Cpu, category: 'Twin Core' },
    { id: 2, title: 'Real-Time Well Health Monitoring', desc: 'Continuous 2.0s telemetry evaluation of bottomhole pressure, temperature, crude viscosity, and volumetric pump fillage.', icon: Activity, category: 'Surveillance' },
    { id: 3, title: 'CSS Cycle Optimization', desc: 'Physics-driven tuning of steam injection volume, injection pressure, soak duration, and production cut-off criteria.', icon: Flame, category: 'Thermal EOR' },
    { id: 4, title: 'Reservoir Temperature Prediction', desc: 'Predictive thermal falloff isotherms and radial steam plume propagation modeling post-injection.', icon: ThermometerIcon, category: 'Subsurface' },
    { id: 5, title: 'Oil Viscosity Estimation', desc: 'Dynamic Arrhenius viscosity shift calculation based on in-situ temperature, pressure, and dissolved gas ratio.', icon: Sliders, category: 'Fluid Mechanics' },
    { id: 6, title: 'Production Forecasting', desc: '14-day & 90-day predictive net oil production curves reconciled against actual Coriolis skid meters.', icon: BarChart3, category: 'Analytics' },
    { id: 7, title: 'SRP Kinematic Optimization', desc: 'Real-time VFD stroke speed and SPM adjustment tailored to downhole fluid viscosity and rod load.', icon: Gauge, category: 'Artificial Lift' },
    { id: 8, title: 'Rod Failure Prediction', desc: 'Goodman fatigue diagram stress tracking to prevent rod string parting and mechanical overstress.', icon: AlertTriangle, category: 'Reliability' },
    { id: 9, title: 'Pump Unsetting Prevention', desc: 'Buoyancy and axial compression risk monitoring to maintain downhole tubing anchor setting integrity.', icon: Shield, category: 'Reliability' },
    { id: 10, title: 'Rod Floating & Impact Detection', desc: 'Traveling valve compression phase analysis to detect rod floating during heavy oil downstrokes.', icon: Zap, category: 'Diagnostics' },
    { id: 11, title: 'Steam-Oil Ratio (SOR) Reduction', desc: 'Minimizes steam energy consumption per barrel of heavy oil produced to optimize economic cut-off.', icon: TrendingDown, category: 'Optimization' },
    { id: 12, title: 'Energy Consumption Optimization', desc: 'VFD power draw minimization per m³ liquid lifted to cut operational kilowatt-hour expenditure.', icon: Zap, category: 'Optimization' },
    { id: 13, title: 'Predictive Maintenance Engine', desc: 'Early warning diagnosis of pump valve leakage, plunger wear, and tubing friction before failure.', icon: Clock, category: 'Maintenance' },
    { id: 14, title: 'Multi-Physics Anomaly Attribution', desc: 'Root cause causal chain linking thermal decay -> viscosity spike -> rod drag -> pump fillage loss.', icon: Layers, category: 'Diagnostics' },
    { id: 15, title: 'What-If Operational Simulator', desc: 'Interactive simulation workbench to test steam volume and VFD speed changes before field execution.', icon: Sliders, category: 'Simulation' },
    { id: 16, title: 'AI Recommendation Engine', desc: 'Actionable operational guidance (e.g. "Trim VFD from 8.4 to 7.8 SPM") backed by physics validation.', icon: Sparkles, category: 'AI Intelligence' },
    { id: 17, title: 'Explainable AI (XAI)', desc: 'Transparent engineering attribution explaining exact physical laws behind every AI recommendation.', icon: CheckCircle2, category: 'AI Intelligence' },
    { id: 18, title: 'Deterministic Safety & SOS Alerts', desc: 'Human-triggered Manual SOS and threshold alerts with automated response team escalation.', icon: Shield, category: 'Safety' },
    { id: 19, title: 'Historical CSS Cycle Reconcile', desc: 'Comparative benchmark of current cycle thermal response against previous steam injection cycles.', icon: FileSpreadsheet, category: 'Analytics' },
    { id: 20, title: 'Multi-Well Intervention Ranking', desc: 'Field-wide well priority matrix ranking slots by health score, failure risk, and production upside.', icon: Award, category: 'Field Operations' },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 ${
      fontSize === 'large' ? 'text-base' : fontSize === 'xlarge' ? 'text-lg' : 'text-sm'
    }`}>
      {/* 1. Indian Government Top Tricolor Accessibility Header Bar */}
      <div className="bg-emerald-950 border-b border-emerald-800/60 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2.5 bg-gradient-to-b from-amber-500 via-white to-emerald-600 rounded-2xs inline-block shadow-2xs" />
            <span className="font-bold tracking-wide">भारत सरकार | Government of India</span>
          </div>
          <span className="hidden md:inline text-emerald-600">|</span>
          <span className="hidden md:inline font-semibold text-emerald-200">
            पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय | Ministry of Petroleum & Natural Gas
          </span>
          <span className="hidden xl:inline text-emerald-600">|</span>
          <span className="hidden xl:inline font-bold text-amber-300">
            ऑयल इंडिया लिमिटेड | Oil India Limited
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-900/50'}`}
              title="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'large' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-900/50'}`}
              title="Large text size"
            >
              A+
            </button>
          </div>
          <span className="text-emerald-700">|</span>
          <span className="font-semibold text-emerald-300">SIH 2026 · Problem Statement #26120</span>
        </div>
      </div>

      {/* 2. Primary Portal Header Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
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
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#overview" className="hover:text-amber-400 transition-colors">Overview</a>
          <a href="#problem-statement" className="hover:text-amber-400 transition-colors">Problem Statement</a>
          <a href="#features" className="hover:text-amber-400 transition-colors">20 Key Features</a>
          <a href="#architecture" className="hover:text-amber-400 transition-colors">4-Twin Architecture</a>
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/overview')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all"
          >
            <span>Launch Digital Twin Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* 3. Hero Banner Section */}
      <section id="overview" className="relative overflow-hidden py-16 lg:py-24 px-4 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon 2026 · Software Category · SIH26120</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-[1.15]">
              Digital Twin for Well-to-Surface Optimization of <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">CSS & SRP Operations</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              An AI-enabled physics-informed Digital Twin engineered for <strong>Oil India Limited</strong> to optimize heavy crude (17–19° API) recovery in the Baghewala Field, Rajasthan. Seamlessly integrates reservoir thermal heating, wellbore hydrodynamics, SRP rod kinematics, and surface production networks.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Field API</span>
                <span className="text-lg font-bold text-amber-400 mt-0.5 block">17–19° API</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Reservoir Temp</span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5 block">46–48 °C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Active Twin</span>
                <span className="text-lg font-bold text-cyan-400 mt-0.5 block">4 Coupled</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Model Accuracy</span>
                <span className="text-lg font-bold text-amber-300 mt-0.5 block">95.8% MAPE</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/overview')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <span>Enter Workstation Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <a
                href="#features"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
              >
                Explore 20 Solution Features
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-slate-200">SCADA TELEMETRY 2.0s OK</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  BW-017 LIVE
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Crude Viscosity</span>
                  <span className="text-amber-400 font-bold">84.0 cP (+11% drag)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Bottomhole Temp (BHT)</span>
                  <span className="text-emerald-400 font-bold">214.8 °C (Cooling)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">SRP Barrel Fillage</span>
                  <span className="text-rose-400 font-bold">84.6% (Fluid Pound @ 2.80m)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Net Oil Production</span>
                  <span className="text-cyan-400 font-bold">184.2 BOPD (Predicted 198.0)</span>
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

      {/* 4. Official Problem Statement Details Section */}
      <section id="problem-statement" className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            SIH 2026 Problem Specification
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            Baghewala Field Heavy Oil Operational Challenges
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Heavy oil produced from Jodhpur Sandstone exhibits severe mobility resistance. As reservoir temperature drops post steam injection, viscosity surges—causing rod floating, valve damage, and high Steam-Oil Ratio (SOR).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-slate-100">Uncoupled CSS Practices</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Steam injection volume, pressure, soak time, and production cut-offs are currently set based on historical trial-and-error rather than coupled reservoir thermal models.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-slate-100">Rod Floating & Mechanical Stress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Surging crude viscosity causes severe downstroke rod drag, rod floating, impact loading on traveling valves, and pump unsetting—causing frequent workovers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-slate-100">High Steam-Oil Ratio (SOR)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lack of continuous physics-based prediction leads to excessive steam consumption per barrel, driving up energy costs and lowering overall recovery factor.
            </p>
          </div>
        </div>
      </section>

      {/* 5. The 20 Solution Features Grid (As Requested) */}
      <section id="features" className="py-16 px-4 lg:px-8 bg-slate-900/60 border-t border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              Full Functional Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              20 Essential Key Features Implemented in the Digital Twin
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Addressing every single requirement outlined in the SIH 2026 Oil India Limited problem specification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sihFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.id}
                  whileHover={{ y: -3 }}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        #{feat.id}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-200 leading-snug">
                      {feat.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>

                  <span className="text-[9.5px] font-bold font-mono text-emerald-400 mt-3 block uppercase">
                    {feat.category}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. 4-Twin Coupled Architecture Section */}
      <section id="architecture" className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
            Multi-Physics Cascade
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            4-Tier Coupled Digital Twin Hierarchy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Twin 1</span>
            <h4 className="font-bold text-sm text-slate-100">Reservoir & Thermal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Radial steam plume isotherms (R = 18.4m), thermal falloff rates (-0.04°C/h), and steam chamber growth.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Twin 2</span>
            <h4 className="font-bold text-sm text-slate-100">Wellbore Hydrodynamics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multiphase pressure drop, fluid density profiles, and downhole crude viscosity shifts (84.0 cP).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Twin 3</span>
            <h4 className="font-bold text-sm text-slate-100">SRP Lift Dynamics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Surface/downhole dynamometer cards, pump fillage calculation (84.6%), and fluid pound detection (2.80m).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Twin 4</span>
            <h4 className="font-bold text-sm text-slate-100">Surface Gathering</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Net oil rate reconciliation (184.2 BOPD), water cut monitoring (74.2%), and line backpressure optimization.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Footer Banner */}
      <section className="py-12 px-4 lg:px-8 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-slate-950 text-center space-y-5">
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

      {/* 8. Indian Government & Partner Logos Footer Strip (Reference input_file_3.png) */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 lg:px-8 space-y-6">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest block">
            Government of India & Industry Partners
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4 opacity-85 text-xs text-slate-300 font-semibold">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs">Digital India</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs">Make in India</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs">myGov</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs">india.gov.in</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs text-amber-400 font-bold">Oil India Limited</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs text-emerald-400 font-bold">SIH 2026</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <span>© 2026 Oil India Limited · Ministry of Petroleum & Natural Gas · Govt of India</span>
          <div className="flex items-center gap-4">
            <a href="#overview" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#overview" className="hover:text-slate-300">Terms of Use</a>
            <a href="#overview" className="hover:text-slate-300">Helpdesk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function ThermometerIcon(props: { className?: string }) {
  return (
    <svg className={props.className || 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a3 3 0 016 0v6a3 3 0 11-6 0z" />
    </svg>
  );
}
