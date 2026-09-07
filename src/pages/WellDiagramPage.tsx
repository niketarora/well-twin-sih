import React, { useState } from 'react';
import { GitCommit, Layers, ArrowDown, Info, ShieldCheck, Thermometer, Gauge } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';

export const WellDiagramPage: React.FC = () => {
  const [selectedDepthNode, setSelectedDepthNode] = useState<string>('intake');

  const depthNodes = [
    {
      id: 'surface',
      depth: '0 m TVD',
      title: 'Surface Wellhead & Christmas Tree',
      pressure: '18.4 bar',
      temperature: '82.4 °C',
      spec: 'Cameron Class 3000 Flanged · Wing Valve Junction · RTD Sensor',
      details: 'Connects to test separator skid 03 flowline. Choke set at 24/64" fixed bean orifice.',
    },
    {
      id: 'upper-casing',
      depth: '150 m TVD',
      title: '7" Production Casing String',
      pressure: '22.1 bar',
      temperature: '104.2 °C',
      spec: '7" OD 26 lb/ft L-80 Carbon Steel · Annulus Vent active @ 4.2 bar',
      details: 'Contains annular casing gas buffer. Pressure vented automatically when crossing 5.0 bar limit.',
    },
    {
      id: 'tubing',
      depth: '300 m TVD',
      title: 'Production Tubing & Sucker Rod String',
      pressure: '28.5 bar',
      temperature: '138.6 °C',
      spec: '3.5" EUE J-55 Tubing + Norris 97 Tapered Sucker Rods (1.000" top, 0.875" middle)',
      details: 'Gibbs wave equation dynamic tension calibrated. Middle taper section currently operating at 81.5% yield.',
    },
    {
      id: 'intake',
      depth: '428.5 m TVD',
      title: 'SRP Downhole Pump Seating & Gas Anchor',
      pressure: '38.2 bar (PIP)',
      temperature: '184.2 °C (PIT)',
      spec: 'API RHAM 25-225 Insert Heavy-Oil Pump · Modified Natural Gas Anchor',
      details: 'Pump intake conditions: 38.2 bar pressure, 184.2°C temperature, 92.0 cP fluid viscosity. Fluid pound occurs at 2.80 m downstroke.',
    },
    {
      id: 'mud-anchor',
      depth: '650 m TVD',
      title: 'Mud Anchor & Tailpipe Assembly',
      pressure: '40.1 bar',
      temperature: '196.4 °C',
      spec: 'Bull plug with perforated cleanout collar',
      details: 'Collects settled particulate matter and sand grains passing slotted control screen.',
    },
    {
      id: 'screen',
      depth: '950 – 1,142 m TVD',
      title: 'Slotted Sand Control Screen Liner',
      pressure: '41.8 bar',
      temperature: '208.5 °C',
      spec: '0.012" Keystone Slotted Liner · Thermal Grade 13Cr',
      details: 'Prevents fine sand ingress during heavy bitumen inflow. Sand cut steady at 0.08% (limit 0.25%).',
    },
    {
      id: 'reservoir',
      depth: '1,280 m TVD',
      title: 'Perforation Midpoint · Mandhali Sand',
      pressure: '42.6 bar (P_res)',
      temperature: '214.8 °C (BHT)',
      spec: 'Eocene Mandhali Heavy Sand · Cyclic Steam Injection Swept Zone',
      details: 'Formation pressure 42.6 bar, BHT 214.8°C, in-situ viscosity 84.0 cP. Steam chamber radius R = 18.4 m.',
    },
  ];

  const activeNode = depthNodes.find((d) => d.id === selectedDepthNode) || depthNodes[3];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Interactive Subsurface Wellbore Schematic Diagram"
        subtitle="Full-depth structural completions schematic from surface Christmas tree to deep reservoir perforations (1,280 m TVD)."
        badge="TVD 1,280 m Interval"
        badgeType="amber"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Depth Schematic Strip */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-border mb-3 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-ink">
                Vertical Completion Profile
              </h3>
              <span className="text-xs text-ink-muted">Click any depth zone to inspect telemetry</span>
            </div>

            <div className="space-y-2.5">
              {depthNodes.map((node) => {
                const isSelected = selectedDepthNode === node.id;
                const isCritical = node.id === 'intake';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedDepthNode(node.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-petroleum-tint border-petroleum ring-1 ring-petroleum shadow-sm'
                        : 'bg-surface-secondary hover:bg-surface border-border-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          isCritical
                            ? 'bg-status-crit animate-pulse'
                            : isSelected
                            ? 'bg-petroleum'
                            : 'bg-ink-muted'
                        }`}
                      />
                      <div>
                        <span className="font-heading font-semibold text-xs text-ink block">
                          {node.title}
                        </span>
                        <span className="font-mono text-[11px] text-ink-muted">
                          {node.spec}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs">
                      <span className="font-bold text-ink block">{node.depth}</span>
                      <span className="text-[11px] text-petroleum-deep">{node.pressure}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: Selected Depth Node Inspector */}
        <section className="lg:col-span-6 bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-petroleum-deep uppercase tracking-wider">
                  Zone TVD: {activeNode.depth}
                </span>
                <h2 className="font-heading text-lg font-semibold text-ink mt-0.5">
                  {activeNode.title}
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-secondary text-ink font-mono text-xs border border-border">
                {activeNode.id.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-xs">
              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle flex items-center gap-3">
                <Gauge className="w-5 h-5 text-petroleum" />
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block font-sans">Pressure</span>
                  <span className="text-base font-bold text-ink">{activeNode.pressure}</span>
                </div>
              </div>

              <div className="p-3 bg-surface-secondary rounded-lg border border-border-subtle flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-status-warn" />
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block font-sans">Temperature</span>
                  <span className="text-base font-bold text-ink">{activeNode.temperature}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                  Equipment Specification
                </span>
                <p className="font-mono text-ink bg-surface-secondary p-2.5 rounded-lg border border-border-subtle leading-relaxed">
                  {activeNode.spec}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                  Downhole Mechanics & Fluid Dynamics
                </span>
                <p className="text-ink-secondary leading-relaxed bg-canvas p-3 rounded-lg border border-border-subtle">
                  {activeNode.details}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
            <span>Well BW-017 Perforations: 1,280 m TVD</span>
            <span className="text-status-green font-semibold">Sensor Calibrated</span>
          </div>
        </section>
      </div>
    </div>
  );
};
