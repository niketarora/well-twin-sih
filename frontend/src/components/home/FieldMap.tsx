import React, { useState, useRef, useMemo } from 'react';
import { Plus, Minus, RotateCcw, Compass } from 'lucide-react';
import { FieldWell, MapLayerType } from '../../types/field';
import { WellPopup } from './WellPopup';
import { FieldMapLegend } from './FieldMapLegend';
import { useUIStore } from '../../stores/useUIStore';

interface FieldMapProps {
  wells: FieldWell[];
  selectedWellId: string | null;
  onSelectWell: (wellId: string) => void;
  onOpenWell: (well: FieldWell) => void;
  activeLayer: MapLayerType;
}

export const FieldMap: React.FC<FieldMapProps> = ({
  wells,
  selectedWellId,
  onSelectWell,
  onOpenWell,
  activeLayer,
}) => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  // Pan and Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Active popup well
  const popupWell = useMemo(() => {
    return wells.find(w => w.id === selectedWellId) || null;
  }, [wells, selectedWellId]);

  // Coordinate projection mapping
  // Baghewala Field bounding box:
  // Lat: 27.5230 to 27.5440
  // Lng: 72.1320 to 72.1620
  const minLat = 27.5230;
  const maxLat = 27.5440;
  const minLng = 72.1320;
  const maxLng = 72.1620;

  const projectCoord = (lat: number, lng: number) => {
    const svgWidth = 900;
    const svgHeight = 560;
    const paddingX = 80;
    const paddingY = 60;

    const normX = (lng - minLng) / (maxLng - minLng);
    const normY = 1 - (lat - minLat) / (maxLat - minLat);

    const x = paddingX + normX * (svgWidth - paddingX * 2);
    const y = paddingY + normY * (svgHeight - paddingY * 2);
    return { x, y };
  };

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('.map-control-btn') ||
      (e.target as HTMLElement).closest('.map-popup-overlay')
    ) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.75, z - 0.25));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Get marker visual color based on active map layer
  const getMarkerColor = (well: FieldWell) => {
    if (activeLayer === 'health') {
      if (well.healthScore > 80) return '#10b981'; // emerald
      if (well.healthScore > 55) return '#f59e0b'; // amber
      return '#ef4444'; // red
    }
    if (activeLayer === 'production') {
      if (well.oilRateBopd > 100) return '#059669'; // dark emerald
      if (well.oilRateBopd > 50) return '#10b981';
      if (well.oilRateBopd > 0) return '#f59e0b';
      return '#94a3b8'; // slate
    }
    if (activeLayer === 'temperature') {
      if (well.bottomHoleTempC > 250) return '#ef4444'; // steam hot
      if (well.bottomHoleTempC > 180) return '#f97316'; // orange
      if (well.bottomHoleTempC > 140) return '#eab308'; // warm
      return '#64748b'; // cold
    }
    if (activeLayer === 'fillage') {
      if (well.srpFillagePct > 80) return '#10b981';
      if (well.srpFillagePct > 50) return '#f59e0b';
      if (well.srpFillagePct > 0) return '#ef4444';
      return '#94a3b8';
    }
    // cssCycle
    if (well.phase === 'Injection') return '#0284c7';
    if (well.phase === 'Soak') return '#8b5cf6';
    return '#10b981';
  };

  return (
    <div
      ref={mapContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[540px] rounded-xl border border-border overflow-hidden select-none cursor-grab active:cursor-grabbing bg-white dark:bg-slate-900 shadow-subtle ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
    >
      {/* Background GIS Grid Pattern & Geological Formations */}
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 900 560"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          <pattern id="gisGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15, 23, 42, 0.05)'}
              strokeWidth="0.75"
            />
            <circle
              cx="50"
              cy="0"
              r="1.2"
              fill={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.12)'}
            />
          </pattern>
          <radialGradient id="steamPlume" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={isDark ? '0.25' : '0.2'} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="thermalReservoir" cx="48%" cy="52%" r="48%">
            <stop offset="0%" stopColor="#0f766e" stopOpacity={isDark ? '0.18' : '0.08'} />
            <stop offset="70%" stopColor="#0f766e" stopOpacity={isDark ? '0.06' : '0.02'} />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Clean Map Canvas Background (White in light theme, deep dark in dark theme) */}
        <rect width="900" height="560" fill={isDark ? '#0b1320' : '#ffffff'} />
        <rect width="900" height="560" fill="url(#gisGrid)" />

        {/* Geological Mandhali Sand Reservoir Boundary Polygon */}
        <path
          d="M 120 100 C 260 60, 480 70, 680 110 C 820 140, 860 320, 810 440 C 760 510, 520 530, 320 510 C 140 480, 80 340, 90 220 Z"
          fill="url(#thermalReservoir)"
          stroke="#0d9488"
          strokeWidth="1.2"
          strokeDasharray="6 4"
          strokeOpacity={isDark ? '0.4' : '0.45'}
        />

        {/* Sector Boundary Dividing Lines */}
        <g
          stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15, 23, 42, 0.12)'}
          strokeWidth="0.8"
          strokeDasharray="4 4"
        >
          <line x1="100" y1="280" x2="820" y2="280" />
          <line x1="460" y1="80" x2="460" y2="520" />
        </g>

        {/* Refined Small Sector Labels */}
        <g fill={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(100, 116, 139, 0.65)'} fontSize="7.5" fontWeight="600" letterSpacing="1.2">
          <text x="130" y="105">SECTOR 1 (WEST INJECTION)</text>
          <text x="560" y="105">SECTOR 4 (NORTH PRODUCERS)</text>
          <text x="130" y="495">SECTOR 2 (EAST CORE)</text>
          <text x="560" y="495">SECTOR 5 (SOUTH MARGIN)</text>
        </g>

        {/* Central Steam Distribution Manifold & High-Pressure Pipelines */}
        <g stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="1.2" strokeOpacity={isDark ? '0.35' : '0.45'} fill="none">
          <path d="M 280 220 L 460 270 L 620 250 L 710 390" />
          <path d="M 460 270 L 290 380" />
        </g>

        {/* Pad Cluster Footprints with refined subtle labels */}
        {/* Pad 01 */}
        <rect
          x="250"
          y="350"
          width="80"
          height="60"
          rx="5"
          fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(241, 245, 249, 0.7)'}
          stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(203, 213, 225, 0.9)'}
          strokeWidth="0.8"
        />
        <text x="256" y="362" fill={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'} fontSize="7" fontWeight="600" letterSpacing="0.5">
          PAD 01
        </text>

        {/* Pad 02 */}
        <rect
          x="220"
          y="180"
          width="80"
          height="60"
          rx="5"
          fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(241, 245, 249, 0.7)'}
          stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(203, 213, 225, 0.9)'}
          strokeWidth="0.8"
        />
        <text x="226" y="192" fill={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'} fontSize="7" fontWeight="600" letterSpacing="0.5">
          PAD 02
        </text>

        {/* Pad 03 */}
        <rect
          x="420"
          y="230"
          width="90"
          height="70"
          rx="5"
          fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(241, 245, 249, 0.7)'}
          stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(203, 213, 225, 0.9)'}
          strokeWidth="0.8"
        />
        <text x="426" y="242" fill={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'} fontSize="7" fontWeight="600" letterSpacing="0.5">
          PAD 03 (BW-17)
        </text>

        {/* Pad 04 */}
        <rect
          x="630"
          y="280"
          width="120"
          height="130"
          rx="5"
          fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(241, 245, 249, 0.7)'}
          stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(203, 213, 225, 0.9)'}
          strokeWidth="0.8"
        />
        <text x="636" y="292" fill={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'} fontSize="7" fontWeight="600" letterSpacing="0.5">
          PAD 04
        </text>

        {/* Thermal Steam Injection Influence Halo for BW-03 */}
        {(() => {
          const bw03 = wells.find(w => w.code === 'BW-03');
          if (bw03) {
            const pt = projectCoord(bw03.lat, bw03.lng);
            return (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="65"
                fill="url(#steamPlume)"
                pointerEvents="none"
              />
            );
          }
          return null;
        })()}

        {/* Well Markers */}
        {wells.map((well) => {
          const pt = projectCoord(well.lat, well.lng);
          const isSelected = selectedWellId === well.id;
          const markerColor = getMarkerColor(well);

          return (
            <g
              key={well.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWell(well.id);
              }}
              className="cursor-pointer group select-none"
              transform={`translate(${pt.x}, ${pt.y})`}
            >
              {/* Stable Invisible Hitbox - Prevents any hover jitter/glitch */}
              <circle cx="0" cy="0" r="18" fill="transparent" pointerEvents="all" />

              {/* Outer Pulse Ring for Active / CSS / Selected Wells */}
              {(isSelected || well.status === 'Attention Required' || well.status === 'Critical' || well.status === 'CSS-Active') && (
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? '17' : '14'}
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  pointerEvents="none"
                  className={well.status !== 'Shut-In' ? 'animate-ping' : ''}
                  style={{ animationDuration: well.status === 'Critical' ? '1.5s' : '3s' }}
                />
              )}

              {/* Selection Halo */}
              {isSelected && (
                <circle
                  cx="0"
                  cy="0"
                  r="15"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                  pointerEvents="none"
                />
              )}

              {/* Base Marker Shadow & Rim */}
              <circle
                cx="0"
                cy="0"
                r="8.5"
                fill={isDark ? '#0f172a' : '#ffffff'}
                stroke={markerColor}
                strokeWidth="2"
                pointerEvents="none"
                className="transition-all duration-150 group-hover:stroke-[3px]"
              />

              {/* Center Core Indicator */}
              <circle
                cx="0"
                cy="0"
                r="4"
                fill={markerColor}
                pointerEvents="none"
                className="transition-all duration-150 group-hover:r-[5px]"
              />

              {/* Refined Small Well Label Pill */}
              <g transform="translate(0, 15)" pointerEvents="none">
                <rect
                  x="-23"
                  y="-7"
                  width="46"
                  height="14"
                  rx="3"
                  fill={isDark ? 'rgba(15, 23, 42, 0.9)' : '#ffffff'}
                  stroke={isSelected ? '#0284c7' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(148, 163, 184, 0.6)'}
                  strokeWidth={isSelected ? '1.2' : '0.75'}
                  filter={isDark ? undefined : 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))'}
                />
                <text
                  x="0"
                  y="2.5"
                  textAnchor="middle"
                  fill={isDark ? '#ffffff' : '#0f172a'}
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="0.3"
                >
                  {well.code}
                </text>
              </g>

              {/* Refined Subtitle Status / BOPD text */}
              <text
                x="0"
                y="33"
                textAnchor="middle"
                fill={isDark ? 'rgba(255,255,255,0.7)' : '#475569'}
                fontSize="6.5"
                fontWeight="600"
                pointerEvents="none"
              >
                {well.status === 'CSS-Active' ? 'STEAM' : well.status === 'Shut-In' ? 'OFFLINE' : `${well.oilRateBopd} BOPD`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Embedded Selected Well Popup Card */}
      {popupWell && (
        <div className="map-popup-overlay absolute top-4 left-4 z-20">
          <WellPopup
            well={popupWell}
            onClose={() => onSelectWell('')}
            onOpenWell={onOpenWell}
          />
        </div>
      )}

      {/* Map Overlay Controls: Zoom In, Out, Reset */}
      <div className="map-control-btn absolute top-4 right-4 flex flex-col gap-1.5 z-10">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-surface/90 backdrop-blur-md border border-border text-ink hover:bg-surface flex items-center justify-center shadow-md transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-surface/90 backdrop-blur-md border border-border text-ink hover:bg-surface flex items-center justify-center shadow-md transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-8 h-8 rounded-lg bg-surface/90 backdrop-blur-md border border-border text-ink hover:bg-surface flex items-center justify-center shadow-md transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* North Compass Indicator */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur-md border border-border text-ink text-[10px] font-semibold tracking-wider shadow-sm">
        <Compass className="w-3.5 h-3.5 text-petroleum dark:text-cyan-400 animate-spin-slow" />
        <span>N 27°32' · E 72°09'</span>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
        <FieldMapLegend activeLayer={activeLayer} />
      </div>
    </div>
  );
};
