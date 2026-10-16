import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StarSystem, PlayerState, Faction, StellarObject } from '../types/game';
import { sound } from '../audio/soundFx';
import { 
  Zap, 
  Crosshair, 
  Compass, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface GalaxyMapProps {
  systems: StarSystem[];
  player: PlayerState;
  onJumpToSystem: (targetSystem: StarSystem, stayOnGalaxyMap?: boolean) => void;
  onEnterSystemView: (system: StarSystem) => void;
  onLandOnObject?: (obj: StellarObject) => void;
  onAppendNotes: (notes: string) => void;
}

// Pre-computed spiral galaxy star cluster
interface SpiralStar {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
}

const GALAXY_CORE_X = 620;
const GALAXY_CORE_Y = 705;

const SPIRAL_GALAXY_STARS: SpiralStar[] = (() => {
  const stars: SpiralStar[] = [];
  const cx = GALAXY_CORE_X;
  const cy = GALAXY_CORE_Y;
  const armColors = ['#ffffff', '#bae6fd', '#38bdf8', '#7dd3fc', '#fef08a', '#c084fc', '#818cf8', '#e0e7ff'];

  // Galactic core dense luminous cluster
  for (let i = 0; i < 110; i++) {
    const angle = (i / 110) * Math.PI * 2 + Math.sin(i * 1.7) * 0.5;
    const dist = Math.pow((i % 31) / 31, 1.6) * 170;
    stars.push({
      x: Math.round((cx + Math.cos(angle) * dist) * 10) / 10,
      y: Math.round((cy + Math.sin(angle) * (dist * 0.9)) * 10) / 10,
      r: Math.round(((i % 5 === 0 ? 2.2 : i % 3 === 0 ? 1.6 : 1.0) + (i % 7) * 0.1) * 10) / 10,
      color: i % 4 === 0 ? '#ffffff' : i % 3 === 0 ? '#fef08a' : '#bae6fd',
      opacity: Math.round((0.65 + ((i % 10) / 28)) * 100) / 100,
    });
  }

  // 2 major spiral arms winding outward
  for (let arm = 0; arm < 2; arm++) {
    const armOffset = arm * Math.PI;
    const armSteps = 180;
    for (let i = 0; i < armSteps; i++) {
      const t = i / armSteps;
      const theta = t * (Math.PI * 3.4); // 1.7 full turns
      const r = 110 + Math.pow(t, 1.25) * 1020;
      const spread = 25 + t * 105;
      const jitterAngle = ((i * 37) % 360) * (Math.PI / 180);
      const jitterDist = ((i * 17) % 100) / 100 * spread;

      const px = cx + Math.cos(theta + armOffset) * r + Math.cos(jitterAngle) * jitterDist;
      const py = cy + Math.sin(theta + armOffset) * (r * 0.86) + Math.sin(jitterAngle) * jitterDist;

      const color = armColors[i % armColors.length];
      stars.push({
        x: Math.round(px * 10) / 10,
        y: Math.round(py * 10) / 10,
        r: Math.round((i % 7 === 0 ? 2.0 : i % 3 === 0 ? 1.3 : 0.75) * 10) / 10,
        color,
        opacity: Math.round(Math.max(0.2, 0.9 - t * 0.45 + ((i % 5) * 0.04)) * 100) / 100,
      });
    }
  }

  // Inter-arm cosmic star dust and spurs
  for (let s = 0; s < 90; s++) {
    const angle = ((s * 41) % 360) * (Math.PI / 180);
    const r = 180 + ((s * 19) % 100) / 100 * 860;
    stars.push({
      x: Math.round((cx + Math.cos(angle) * r) * 10) / 10,
      y: Math.round((cy + Math.sin(angle) * (r * 0.86)) * 10) / 10,
      r: Math.round((0.5 + ((s % 4) * 0.25)) * 10) / 10,
      color: s % 2 === 0 ? '#94a3b8' : '#7dd3fc',
      opacity: Math.round((0.25 + ((s % 6) * 0.08)) * 100) / 100,
    });
  }

  return stars;
})();

export const GalaxyMap: React.FC<GalaxyMapProps> = ({
  systems,
  player,
  onJumpToSystem,
  onEnterSystemView,
}) => {
  const currentSystem = systems.find(s => s.id === player.currentSystemId) || systems[0];
  const [selectedSystemId, setSelectedSystemId] = useState<string>(player.currentSystemId);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [zoom, setZoom] = useState(0.72); // Spacious initial zoom for wider galaxy layout
  const [pan, setPan] = useState({ x: -150, y: -100 });
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const selectedSystem = systems.find(s => s.id === selectedSystemId) || currentSystem;

  // Center on current system initially and whenever player jumps
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = systems.find(s => s.id === player.currentSystemId) || currentSystem;
      centerOnSystem(current);
      setSelectedSystemId(player.currentSystemId);
    }, 40);
    return () => clearTimeout(timer);
  }, [player.currentSystemId]);

  const centerOnSystem = (sys: StarSystem, targetZoom = zoom) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || window.innerWidth - (isDrawerOpen ? 384 : 0);
    const height = containerRef.current.clientHeight || (window.innerHeight - 64);
    setPan({
      x: width / 2 - sys.x * targetZoom,
      y: height / 2 - sys.y * targetZoom,
    });
  };

  const fitGalaxyView = () => {
    if (!containerRef.current || systems.length === 0) return;
    const width = containerRef.current.clientWidth || window.innerWidth - (isDrawerOpen ? 384 : 0);
    const height = containerRef.current.clientHeight || (window.innerHeight - 64);

    const minX = Math.min(...systems.map(s => s.x)) - 100;
    const maxX = Math.max(...systems.map(s => s.x)) + 100;
    const minY = Math.min(...systems.map(s => s.y)) - 100;
    const maxY = Math.max(...systems.map(s => s.y)) + 100;

    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const scaleX = (width - 60) / spanX;
    const scaleY = (height - 60) / spanY;
    const newZoom = Math.max(0.35, Math.min(1.4, Math.min(scaleX, scaleY)));

    setZoom(newZoom);
    setPan({
      x: (width - spanX * newZoom) / 2 - minX * newZoom,
      y: (height - spanY * newZoom) / 2 - minY * newZoom,
    });
  };

  // Smooth mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;

    setZoom(prevZoom => {
      const nextZoom = Math.max(0.3, Math.min(2.5, Math.round((prevZoom + delta) * 100) / 100));
      setPan(prevPan => {
        const worldX = (centerX - prevPan.x) / prevZoom;
        const worldY = (centerY - prevPan.y) / prevZoom;
        return {
          x: centerX - worldX * nextZoom,
          y: centerY - worldY * nextZoom,
        };
      });
      return nextZoom;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).tagName === 'button' || (e.target as HTMLElement).closest('button')) {
      return;
    }
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { x: pan.x, y: pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (!hasDraggedRef.current && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      hasDraggedRef.current = true;
      setIsDragging(true);
    }

    if (hasDraggedRef.current) {
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
  };

  const isDirectlyConnected = currentSystem.connectedSystemIds.includes(selectedSystem.id);
  const isCurrent = currentSystem.id === selectedSystem.id;

  // Color coding by faction
  const getFactionColor = (faction: Faction) => {
    switch (faction) {
      case 'Confederation':
        return '#38bdf8'; // Sky Blue
      case 'Rebellion':
        return '#f59e0b'; // Amber / Gold
      case 'Guild of Traders':
        return '#22d3ee'; // Cyan
      case 'Pirates':
        return '#f43f5e'; // Crimson Rose
      case 'Cydonian':
        return '#a855f7'; // Purple
      case 'Lethean':
        return '#ec4899'; // Magenta Pink
      case 'Alien Remnant':
        return '#c084fc'; // Violet
      case 'Independent':
      default:
        return '#10b981'; // Emerald
    }
  };

  // Check if system has been discovered by player
  const isSystemDiscovered = (sysId: string) => {
    return (player.visitedSystems || []).includes(sysId) || sysId === player.currentSystemId;
  };

  const isSelectedDiscovered = isSystemDiscovered(selectedSystem.id);

  // Shortest route plotting if not directly connected
  const findRoute = (startId: string, endId: string): string[] => {
    if (startId === endId) return [startId];
    const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const sys = systems.find(s => s.id === current.id);
      if (!sys) continue;

      for (const neighborId of sys.connectedSystemIds) {
        if (neighborId === endId) {
          return [...current.path, neighborId];
        }
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ id: neighborId, path: [...current.path, neighborId] });
        }
      }
    }
    return [];
  };

  const route = !isCurrent && !isDirectlyConnected ? findRoute(currentSystem.id, selectedSystem.id) : [];

  return (
    <div className="relative w-full h-full bg-[#010206] overflow-hidden flex select-none">
      
      {/* Pitch-black space background with subtle grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
      />

      {/* Main Interactive Starchart SVG Area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="flex-1 h-full cursor-grab active:cursor-grabbing relative overflow-hidden touch-none select-none"
      >
        <svg className="w-full h-full select-none pointer-events-auto">
          <defs>
            {/* Spiral Galaxy Core Diffuse Nebula Glow */}
            <radialGradient id="galaxyCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="14%" stopColor="#fef08a" stopOpacity="0.32" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="85%" stopColor="#1e1b4b" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#010206" stopOpacity="0" />
            </radialGradient>

            {/* Spiral Arm Soft Nebular Glow */}
            <filter id="spiralGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.12s ease-out',
            }}
          >
            {/* ========================================================
                SPIRAL GALAXY BACKDROP OF STARS & NEBULAR ARMS
                ======================================================== */}
            <g className="spiral-galaxy-layer pointer-events-none">
              {/* Outer Deep Core Glow */}
              <circle
                cx={GALAXY_CORE_X}
                cy={GALAXY_CORE_Y}
                r={480}
                fill="url(#galaxyCoreGlow)"
              />

              {/* Faint Spiral Nebula Cloud Band 1 */}
              <path
                d="M 620 705 Q 820 580, 1040 760 T 1380 1200"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={140}
                strokeLinecap="round"
                opacity={0.05}
                filter="url(#spiralGlowFilter)"
              />

              {/* Faint Spiral Nebula Cloud Band 2 */}
              <path
                d="M 620 705 Q 420 830, 240 650 T 80 200"
                fill="none"
                stroke="#818cf8"
                strokeWidth={140}
                strokeLinecap="round"
                opacity={0.05}
                filter="url(#spiralGlowFilter)"
              />

              {/* Spiral Galaxy Star Particles */}
              {SPIRAL_GALAXY_STARS.map((star, idx) => (
                <circle
                  key={`spiral-star-${idx}`}
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill={star.color}
                  opacity={star.opacity}
                />
              ))}
            </g>

            {/* ========================================================
                HYPERLANE ROUTES WITH DYNAMIC ANGLES & DISTANCES
                ======================================================== */}
            <g className="hyperlanes">
              {systems.map(sys =>
                sys.connectedSystemIds.map(targetId => {
                  const target = systems.find(s => s.id === targetId);
                  if (!target || sys.id > target.id) return null;

                  const isSysDiscovered = isSystemDiscovered(sys.id);
                  const isTargetDiscovered = isSystemDiscovered(target.id);
                  const isBothDiscovered = isSysDiscovered && isTargetDiscovered;

                  const isPlayerAdjacent =
                    (sys.id === currentSystem.id && target.id === selectedSystem.id) ||
                    (target.id === currentSystem.id && sys.id === selectedSystem.id);

                  const isRouteLeg =
                    route.length > 1 &&
                    route.some((rId, idx) => {
                      const nextId = route[idx + 1];
                      return (rId === sys.id && nextId === target.id) || (rId === target.id && nextId === sys.id);
                    });

                  return (
                    <line
                      key={`${sys.id}-${target.id}`}
                      x1={sys.x}
                      y1={sys.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={
                        isPlayerAdjacent
                          ? '#38bdf8'
                          : isRouteLeg
                          ? '#f59e0b'
                          : isBothDiscovered
                          ? '#334155'
                          : '#1e293b'
                      }
                      strokeWidth={isPlayerAdjacent || isRouteLeg ? 3.5 : isBothDiscovered ? 1.5 : 1}
                      strokeDasharray={isPlayerAdjacent ? '5 3' : isRouteLeg ? '7 4' : !isBothDiscovered ? '2 4' : 'none'}
                      className={isPlayerAdjacent ? 'animate-pulse' : ''}
                      opacity={isPlayerAdjacent ? 0.95 : isRouteLeg ? 0.9 : isBothDiscovered ? 0.55 : 0.25}
                    />
                  );
                })
              )}
            </g>

            {/* ========================================================
                STAR SYSTEMS (COLOR-CODED BY FACTION & DISCOVERY STATUS)
                ======================================================== */}
            {systems.map(sys => {
              const isDiscovered = isSystemDiscovered(sys.id);
              const isCurrentSys = sys.id === currentSystem.id;
              const isSelected = sys.id === selectedSystem.id;
              const isConnected = currentSystem.connectedSystemIds.includes(sys.id);

              // Color-coded system: Faction color if discovered; Dim mysterious slate if undiscovered
              const factionColor = isDiscovered ? getFactionColor(sys.faction) : '#475569';
              const strokeColor = isDiscovered ? factionColor : '#64748b';
              const displayName = isDiscovered ? sys.name : '?';

              return (
                <g
                  key={sys.id}
                  transform={`translate(${sys.x}, ${sys.y})`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSelect();
                    setSelectedSystemId(sys.id);
                    centerOnSystem(sys);
                    if (!isDrawerOpen) setIsDrawerOpen(true);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (isConnected && player.currentFuel >= 1) {
                      sound.playHyperspaceJump();
                      onJumpToSystem(sys, true);
                      setSelectedSystemId(sys.id);
                      centerOnSystem(sys);
                    }
                  }}
                  className="cursor-pointer group"
                >
                  {/* Generous touch and click target */}
                  <circle r={36} fill="transparent" />

                  {/* Outer Selection Reticle */}
                  {isSelected && (
                    <g className="animate-spin" style={{ animationDuration: '14s' }}>
                      <circle
                        r={26}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={1.5}
                        strokeDasharray="6 4"
                      />
                      <line x1={-30} y1={0} x2={-22} y2={0} stroke="#38bdf8" strokeWidth={2} />
                      <line x1={22} y1={0} x2={30} y2={0} stroke="#38bdf8" strokeWidth={2} />
                      <line x1={0} y1={-30} x2={0} y2={-22} stroke="#38bdf8" strokeWidth={2} />
                      <line x1={0} y1={22} x2={0} y2={30} stroke="#38bdf8" strokeWidth={2} />
                    </g>
                  )}

                  {/* Current Location Beacon (Golden Reticle without Ship Picture) */}
                  {isCurrentSys && (
                    <g className="pointer-events-none">
                      <circle
                        r={24}
                        fill="rgba(245, 158, 11, 0.12)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        className="animate-pulse"
                      />
                      <circle
                        r={32}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        opacity={0.4}
                        strokeDasharray="2 4"
                      />
                      {/* Compass reticle markers */}
                      <polygon points="0,-22 -3,-17 3,-17" fill="#f59e0b" />
                      <polygon points="0,22 -3,17 3,17" fill="#f59e0b" />
                      <polygon points="-22,0 -17,-3 -17,3" fill="#f59e0b" />
                      <polygon points="22,0 17,-3 17,3" fill="#f59e0b" />

                      {/* Clean Location Tag */}
                      <g transform="translate(0, -34)">
                        <rect
                          x={-46}
                          y={-8}
                          width={92}
                          height={16}
                          rx={3}
                          fill="#090d16"
                          stroke="#f59e0b"
                          strokeWidth={1.2}
                          opacity={0.95}
                        />
                        <text
                          x={0}
                          y={3.5}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="8.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                          letterSpacing="0.08em"
                        >
                          YOU ARE HERE
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Faction / Discovery Color Corona Halo */}
                  <circle
                    r={isDiscovered ? 13 : 9}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isDiscovered ? 1.5 : 1}
                    strokeDasharray={isDiscovered ? 'none' : '2 3'}
                    opacity={isDiscovered ? 0.6 : 0.4}
                    className="group-hover:opacity-100 transition-opacity"
                  />

                  {/* Star Core Circle (Color-coded by faction or undiscovered) */}
                  <circle
                    r={isDiscovered ? Math.max(6, (sys.starRadius || 20) * 0.36) : 5}
                    fill={factionColor}
                    stroke={isDiscovered ? '#ffffff' : '#334155'}
                    strokeWidth={isDiscovered ? 1.2 : 1}
                    opacity={isDiscovered ? 0.95 : 0.55}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* System Name / Question Mark Text */}
                  <text
                    x={0}
                    y={isDiscovered ? 20 : 18}
                    textAnchor="middle"
                    className={`font-mono tracking-wider transition-colors pointer-events-none select-none ${
                      isDiscovered
                        ? isSelected
                          ? 'fill-cyan-300 font-bold text-[11px]'
                          : 'fill-slate-200 group-hover:fill-white text-[10px]'
                        : isSelected
                        ? 'fill-amber-400 font-black text-sm'
                        : 'fill-slate-400 group-hover:fill-slate-200 font-bold text-xs'
                    }`}
                  >
                    {displayName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Clean Minimal Controls (Center on Ship & Fit View) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button
            onClick={() => fitGalaxyView()}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 hover:text-emerald-400 shadow-xl transition-colors cursor-pointer backdrop-blur-md"
            title="Fit Entire Galaxy Starchart"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => centerOnSystem(currentSystem, 0.85)}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 hover:text-amber-400 shadow-xl transition-colors cursor-pointer backdrop-blur-md flex items-center gap-1.5 text-xs font-mono"
            title="Center View on Current System"
          >
            <Crosshair className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-bold">Center Ship</span>
          </button>
        </div>

        {/* Floating Expand Drawer Button when drawer is collapsed */}
        {!isDrawerOpen && (
          <button
            onClick={() => {
              sound.playMenu();
              setIsDrawerOpen(true);
            }}
            className="absolute top-4 right-4 z-20 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 rounded-lg text-cyan-300 shadow-2xl flex items-center gap-2 text-xs font-mono cursor-pointer backdrop-blur-md transition-all font-bold"
            title="Expand System Telemetry Drawer"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>Telemetry // {isSelectedDiscovered ? selectedSystem.name : '?'}</span>
          </button>
        )}
      </div>

      {/* ========================================================
          RIGHT POP-OUT DRAWER WHEN CLICKING A PLANET / SYSTEM
          Consists strictly of:
          1. Faction Box
          2. Tech Tier Box
          3. Stellar Class Box
          4. Hyperdrive Fuel Box
          5. Prominent & Large Button to Warp to this Location
          6. System Summary Box Below This
          ======================================================== */}
      <div 
        className={`${
          isDrawerOpen 
            ? 'fixed inset-y-0 right-0 z-40 w-full max-w-sm md:relative md:inset-auto md:w-96' 
            : 'hidden'
        } h-full bg-[#060a12]/98 border-l border-slate-800/90 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl backdrop-blur-md transition-all`}
      >
        <div className="space-y-4">
          
          {/* Header with System Name (or '?' if undiscovered) & Collapse Button */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 gap-2">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider block">
                {isSelectedDiscovered ? (selectedSystem.sector || 'STAR SYSTEM') : 'UNCHARTED SECTOR'}
              </span>
              <h2 className="text-2xl font-display font-black text-cyan-300 uppercase tracking-wide">
                {isSelectedDiscovered ? selectedSystem.name : '?'}
              </h2>
            </div>
            
            <button
              onClick={() => {
                sound.playClick(400);
                setIsDrawerOpen(false);
              }}
              className="ev-btn p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              title="Close Telemetry Box"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 1. FACTION BOX */}
          <div className="ev-panel-inset p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              FACTION
            </span>
            <span 
              className="font-display font-bold text-sm tracking-wide uppercase"
              style={{ color: isSelectedDiscovered ? getFactionColor(selectedSystem.faction) : '#94a3b8' }}
            >
              {isSelectedDiscovered ? selectedSystem.faction : '? (Undiscovered)'}
            </span>
          </div>

          {/* 2. TECH TIER BOX */}
          <div className="ev-panel-inset p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              TECH TIER
            </span>
            <span className="text-cyan-300 font-mono font-bold text-sm">
              {isSelectedDiscovered ? `Tier ${selectedSystem.techLevel} / 7` : '? (Undiscovered)'}
            </span>
          </div>

          {/* 3. STELLAR CLASS BOX */}
          <div className="ev-panel-inset p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              STELLAR CLASS
            </span>
            <span className="text-slate-100 font-mono text-xs sm:text-sm font-semibold truncate max-w-[200px]">
              {isSelectedDiscovered ? selectedSystem.stellarClass : '? (Unclassified)'}
            </span>
          </div>

          {/* 4. HYPERDRIVE FUEL BOX */}
          <div className="ev-panel-inset p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              HYPERDRIVE FUEL
            </span>
            <span className={`font-mono font-bold text-xs sm:text-sm ${
              player.currentFuel >= 2 
                ? 'text-cyan-300' 
                : player.currentFuel === 1 
                ? 'text-amber-400' 
                : 'text-rose-400'
            }`}>
              {player.currentFuel} / {player.currentShip.fuelCapacity} Tanks Available
            </span>
          </div>

          {/* 5. PROMINENT AND LARGE BUTTON TO WARP TO THIS LOCATION */}
          <div className="pt-2">
            {isCurrent ? (
              <button
                onClick={() => {
                  sound.playClick(850);
                  onEnterSystemView(selectedSystem);
                }}
                className="w-full py-4 rounded-xl ev-btn-cyan text-sm sm:text-base font-display font-black uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-xl transition-transform hover:scale-[1.01]"
              >
                <Compass className="w-5 h-5 text-cyan-300" />
                <span>Current Location · Enter Orbit</span>
              </button>
            ) : isDirectlyConnected ? (
              <button
                onClick={() => {
                  if (player.currentFuel >= 1) {
                    sound.playHyperspaceJump();
                    onJumpToSystem(selectedSystem, true);
                    setSelectedSystemId(selectedSystem.id);
                    centerOnSystem(selectedSystem);
                  } else {
                    sound.playAlert();
                  }
                }}
                disabled={player.currentFuel < 1}
                className={`w-full py-4 rounded-xl text-sm sm:text-base font-display font-black uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl transition-all ${
                  player.currentFuel >= 1
                    ? 'ev-btn-amber shadow-amber-500/20 hover:scale-[1.01]'
                    : 'ev-btn opacity-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-5 h-5 text-slate-950 fill-current" />
                <span className="text-slate-950 font-black">
                  {player.currentFuel >= 1
                    ? `Warp to ${isSelectedDiscovered ? selectedSystem.name : 'Unknown System'} (-1 Fuel)`
                    : 'Insufficient Fuel to Warp'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (route[1]) {
                    const nextHop = systems.find(s => s.id === route[1]);
                    if (nextHop && player.currentFuel >= 1) {
                      sound.playHyperspaceJump();
                      onJumpToSystem(nextHop, true);
                      setSelectedSystemId(nextHop.id);
                      centerOnSystem(nextHop);
                    } else {
                      sound.playAlert();
                    }
                  }
                }}
                disabled={player.currentFuel < 1 || !route[1]}
                className={`w-full py-4 rounded-xl text-sm sm:text-base font-display font-black uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl transition-all ${
                  player.currentFuel >= 1 && route[1]
                    ? 'ev-btn-amber shadow-amber-500/20 hover:scale-[1.01]'
                    : 'ev-btn opacity-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-5 h-5 text-slate-950 fill-current" />
                <span className="text-slate-950 font-black">
                  {player.currentFuel >= 1 && route[1]
                    ? `Warp Next Leg (${route.length - 1} Jumps)`
                    : 'Insufficient Fuel to Warp'}
                </span>
              </button>
            )}
          </div>

          {/* 6. SYSTEM SUMMARY BOX BELOW THIS */}
          <div className="ev-panel-inset p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold block tracking-wider">
              SYSTEM SUMMARY
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
              {isSelectedDiscovered
                ? selectedSystem.description
                : 'Undiscovered star system. Hyperdrive navigational coordinates registered, but planetary and surface intelligence remains uncataloged until you warp to this sector.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
