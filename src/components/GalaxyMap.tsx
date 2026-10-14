import React, { useState, useRef, useEffect } from 'react';
import { StarSystem, PlayerState, Faction, StellarObject } from '../types/game';
import { ASSET_IMAGES, generateSystemDossierText, getStellarObjectImage } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { 
  Zap, 
  Search, 
  Crosshair, 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Compass, 
  Layers, 
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Share2,
  Store,
  Wrench,
  Wine,
  Briefcase,
  Landmark,
  Eye,
  EyeOff,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Anchor,
  ShieldCheck,
  Target,
  Globe
} from 'lucide-react';
import { ShareDossierModal } from './ShareDossierModal';

interface GalaxyMapProps {
  systems: StarSystem[];
  player: PlayerState;
  onJumpToSystem: (targetSystem: StarSystem, stayOnGalaxyMap?: boolean) => void;
  onEnterSystemView: (system: StarSystem) => void;
  onLandOnObject?: (obj: StellarObject) => void;
  onAppendNotes: (notes: string) => void;
}

export const GalaxyMap: React.FC<GalaxyMapProps> = ({
  systems,
  player,
  onJumpToSystem,
  onEnterSystemView,
  onLandOnObject,
  onAppendNotes,
}) => {
  const currentSystem = systems.find(s => s.id === player.currentSystemId) || systems[0];
  const [selectedSystemId, setSelectedSystemId] = useState<string>(player.currentSystemId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFaction, setFilterFaction] = useState<string>('all');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [fogOfWarEnabled, setFogOfWarEnabled] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [zoom, setZoom] = useState(0.85); // Wider initial zoom for large map
  const [pan, setPan] = useState({ x: -100, y: -100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const selectedSystem = systems.find(s => s.id === selectedSystemId) || currentSystem;

  // Selected celestial body (planet/station) within the selected system
  const [selectedObjectId, setSelectedObjectId] = useState<string>(() => {
    if (selectedSystem.id === player.currentSystemId && player.landedObjectId) {
      return player.landedObjectId;
    }
    return selectedSystem.stellarObjects[0]?.id || '';
  });

  // Keep selectedObjectId synchronized with the selected system
  useEffect(() => {
    if (selectedSystem.stellarObjects.length > 0) {
      const exists = selectedSystem.stellarObjects.some(o => o.id === selectedObjectId);
      if (!exists) {
        if (selectedSystem.id === player.currentSystemId && player.landedObjectId) {
          setSelectedObjectId(player.landedObjectId);
        } else {
          setSelectedObjectId(selectedSystem.stellarObjects[0]?.id || '');
        }
      }
    } else {
      setSelectedObjectId('');
    }
  }, [selectedSystemId, selectedSystem]);

  const selectedObject = selectedSystem.stellarObjects.find(o => o.id === selectedObjectId) || selectedSystem.stellarObjects[0] || null;

  // Dynamically calculate unveiled systems:
  // - Visited systems remain permanently visible
  // - Jumping to new systems unveils that system and all surrounding connected systems!
  const unveiledSystemIds = React.useMemo(() => {
    const set = new Set<string>();
    // Always unveil current system
    set.add(player.currentSystemId);
    // All visited systems remain permanently visible
    (player.visitedSystems || []).forEach(id => set.add(id));
    // All surrounding systems connected to any visited system (or current system) are unveiled
    systems.forEach(sys => {
      if ((player.visitedSystems || []).includes(sys.id) || sys.id === player.currentSystemId) {
        sys.connectedSystemIds.forEach(connId => set.add(connId));
      }
    });
    return set;
  }, [player.visitedSystems, player.currentSystemId, systems]);

  // Center on current system initially and whenever player moves/jumps to a new system!
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

  // Zoom centered on viewport center or mouse position
  const handleZoom = (delta: number, focalX?: number, focalY?: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = focalX !== undefined ? focalX - rect.left : rect.width / 2;
    const centerY = focalY !== undefined ? focalY - rect.top : rect.height / 2;

    setZoom(prevZoom => {
      const nextZoom = Math.max(0.25, Math.min(2.5, Math.round((prevZoom + delta) * 100) / 100));
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

  // Smooth mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    handleZoom(delta, e.clientX, e.clientY);
  };

  // Smoothly fit galaxy / explored starchart to screen
  const fitGalaxyView = (onlyExplored = false) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const targetList = (onlyExplored && fogOfWarEnabled)
      ? systems.filter(s => unveiledSystemIds.has(s.id))
      : systems;
    if (targetList.length === 0) return;

    const minX = Math.min(...targetList.map(s => s.x)) - 80;
    const maxX = Math.max(...targetList.map(s => s.x)) + 80;
    const minY = Math.min(...targetList.map(s => s.y)) - 80;
    const maxY = Math.max(...targetList.map(s => s.y)) + 80;

    const rangeX = Math.max(250, maxX - minX);
    const rangeY = Math.max(250, maxY - minY);
    const scaleX = width / rangeX;
    const scaleY = height / rangeY;
    const targetScale = Math.max(0.28, Math.min(1.2, Math.min(scaleX, scaleY) * 0.88));

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    setZoom(targetScale);
    setPan({
      x: width / 2 - midX * targetScale,
      y: height / 2 - midY * targetScale,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { x: pan.x, y: pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (!hasDraggedRef.current && Math.hypot(dx, dy) > 5) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }

    if (hasDraggedRef.current) {
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (hasDraggedRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
    isPointerDownRef.current = false;
    hasDraggedRef.current = false;
    setIsDragging(false);
  };


  const isDirectlyConnected = currentSystem.connectedSystemIds.includes(selectedSystem.id);
  const isCurrent = currentSystem.id === selectedSystem.id;

  const getFactionColor = (faction: Faction) => {
    switch (faction) {
      case 'Confederation':
        return '#38bdf8'; // Sky Blue
      case 'Rebellion':
        return '#34d399'; // Emerald
      case 'Guild of Traders':
        return '#22d3ee'; // Cyan
      case 'Pirates':
        return '#f43f5e'; // Crimson Rose
      case 'Cydonian':
        return '#e879f9'; // Fuchsia
      case 'Lethean':
        return '#a855f7'; // Purple
      case 'Alien Remnant':
        return '#c084fc'; // Violet
      case 'Independent':
      default:
        return '#fbbf24'; // Amber
    }
  };

  // Find shortest route if not directly connected
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

  // Sectors for quick jumping
  const sectors = Array.from(new Set(systems.map(s => s.sector)));

  const handleQuickCopyDossier = async () => {
    sound.playCredit();
    const text = generateSystemDossierText(selectedSystem);
    try {
      await navigator.clipboard.writeText(text);
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex select-none">
      {/* Background Starchart Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${ASSET_IMAGES.galaxyBackdrop})` }}
      />
      {/* Deep coordinate grid lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"
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
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.12s ease-out',
            }}
          >
            {/* Hyperlanes */}
            <g className="hyperlanes">
              {systems.map(sys =>
                sys.connectedSystemIds.map(targetId => {
                  const target = systems.find(s => s.id === targetId);
                  if (!target || sys.id > target.id) return null;

                  const isSysUnveiled = !fogOfWarEnabled || unveiledSystemIds.has(sys.id);
                  const isTargetUnveiled = !fogOfWarEnabled || unveiledSystemIds.has(target.id);

                  const isPlayerAdjacent =
                    (sys.id === currentSystem.id && target.id === selectedSystem.id) ||
                    (target.id === currentSystem.id && sys.id === selectedSystem.id);

                  const isRouteLeg =
                    route.length > 1 &&
                    route.some((rId, idx) => {
                      const nextId = route[idx + 1];
                      return (rId === sys.id && nextId === target.id) || (rId === target.id && nextId === sys.id);
                    });

                  const isBothUnveiled = isSysUnveiled && isTargetUnveiled;
                  const isAtLeastOneUnveiled = isSysUnveiled || isTargetUnveiled;

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
                          : isBothUnveiled
                          ? '#334155'
                          : isAtLeastOneUnveiled
                          ? '#1e293b'
                          : '#0f172a'
                      }
                      strokeWidth={isPlayerAdjacent || isRouteLeg ? 3.5 : isBothUnveiled ? 1.5 : 1}
                      strokeDasharray={isPlayerAdjacent ? '5 3' : isRouteLeg ? '7 4' : !isBothUnveiled ? '2 4' : 'none'}
                      className={isPlayerAdjacent ? 'animate-pulse' : ''}
                      opacity={isPlayerAdjacent ? 0.95 : isRouteLeg ? 0.9 : isBothUnveiled ? 0.55 : 0.25}
                    />
                  );
                })
              )}
            </g>

            {/* Star System Nodes */}
            {systems.map(sys => {
              const isUnveiled = !fogOfWarEnabled || unveiledSystemIds.has(sys.id);
              const isVisited = (player.visitedSystems || []).includes(sys.id);
              const isCurrentSys = sys.id === currentSystem.id;
              const isSelected = sys.id === selectedSystem.id;
              const isConnected = currentSystem.connectedSystemIds.includes(sys.id);
              const isSurrounding = isUnveiled && !isVisited && !isCurrentSys;
              const factionColor = getFactionColor(sys.faction);
              const matchesFaction = filterFaction === 'all' || sys.faction === filterFaction;
              const matchesSector = filterSector === 'all' || sys.sector === filterSector;
              const opacity = matchesFaction && matchesSector ? 1 : 0.25;

              // Uncharted deep-space astronomical contact
              if (!isUnveiled) {
                return (
                  <g
                    key={sys.id}
                    transform={`translate(${sys.x}, ${sys.y})`}
                    opacity={matchesFaction && matchesSector ? 0.6 : 0.2}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playSelect();
                      setSelectedSystemId(sys.id);
                      setSelectedObjectId(sys.stellarObjects[0]?.id || '');
                      centerOnSystem(sys);
                      if (!isDrawerOpen) setIsDrawerOpen(true);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (isConnected && player.currentFuel >= 1) {
                        sound.playHyperspaceJump();
                        onJumpToSystem(sys, true);
                        setSelectedSystemId(sys.id);
                        setSelectedObjectId(sys.stellarObjects[0]?.id || '');
                        centerOnSystem(sys);
                      }
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Generous touch/mouse target */}
                    <circle r={36} fill="transparent" />

                    {/* Outer Selection Reticle */}
                    {isSelected && (
                      <g className="animate-spin" style={{ animationDuration: '14s' }}>
                        <circle
                          r={24}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth={1.5}
                          strokeDasharray="6 4"
                        />
                        <line x1={-28} y1={0} x2={-20} y2={0} stroke="#38bdf8" strokeWidth={2} />
                        <line x1={20} y1={0} x2={28} y2={0} stroke="#38bdf8" strokeWidth={2} />
                        <line x1={0} y1={-28} x2={0} y2={-20} stroke="#38bdf8" strokeWidth={2} />
                        <line x1={0} y1={20} x2={0} y2={28} stroke="#38bdf8" strokeWidth={2} />
                      </g>
                    )}

                    {/* Sensor Ping Beacon */}
                    <circle
                      r={10}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                      className="group-hover:stroke-cyan-400 transition-colors"
                      opacity={0.6}
                    />
                    {/* Star Core */}
                    <circle
                      r={Math.max(5, sys.starRadius * 0.32)}
                      fill={sys.starColor}
                      stroke="#475569"
                      strokeWidth={1.5}
                      opacity={0.65}
                      className="transition-transform group-hover:scale-125"
                    />
                    {/* System Name */}
                    <text
                      x={0}
                      y={18}
                      textAnchor="middle"
                      className={`text-[10px] font-mono tracking-wider transition-colors pointer-events-none ${
                        isSelected ? 'fill-cyan-300 font-bold' : 'fill-slate-400 group-hover:fill-slate-200'
                      }`}
                    >
                      {sys.name}
                    </text>
                    <text
                      x={0}
                      y={28}
                      textAnchor="middle"
                      className="text-[8px] font-mono fill-slate-500 pointer-events-none uppercase"
                    >
                      [Uncharted]
                    </text>
                  </g>
                );
              }

              // Fully Charted / Unveiled System
              return (
                <g
                  key={sys.id}
                  transform={`translate(${sys.x}, ${sys.y})`}
                  opacity={opacity}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSelect();
                    setSelectedSystemId(sys.id);
                    setSelectedObjectId(sys.stellarObjects[0]?.id || '');
                    centerOnSystem(sys);
                    if (!isDrawerOpen) setIsDrawerOpen(true);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (isConnected && player.currentFuel >= 1) {
                      sound.playHyperspaceJump();
                      onJumpToSystem(sys, true);
                      setSelectedSystemId(sys.id);
                      setSelectedObjectId(sys.stellarObjects[0]?.id || '');
                      centerOnSystem(sys);
                    }
                  }}
                  className="cursor-pointer group"
                >
                  {/* Hit target for touch */}
                  <circle r={40} fill="transparent" />

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

                  {/* Current Ship Location Visual & Miniature Ship Graphic */}
                  {isCurrentSys && (
                    <g className="pointer-events-none">
                      {/* Outer Beacon Radar Ring */}
                      <circle
                        r={26}
                        fill="rgba(245, 158, 11, 0.08)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        className="animate-pulse"
                      />
                      <circle
                        r={34}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        opacity={0.4}
                        strokeDasharray="2 4"
                      />

                      {/* Directional Navigation Reticle Pointers */}
                      <polygon points="0,-24 -3,-18 3,-18" fill="#f59e0b" />
                      <polygon points="0,24 -3,18 3,18" fill="#f59e0b" />
                      <polygon points="-24,0 -18,-3 -18,3" fill="#f59e0b" />
                      <polygon points="24,0 18,-3 18,3" fill="#f59e0b" />

                      {/* Miniature Graphic of the Player's Current Ship */}
                      {player.currentShip.image ? (
                        <image
                          href={player.currentShip.image}
                          x={-16}
                          y={-16}
                          width={32}
                          height={32}
                          preserveAspectRatio="xMidYMid meet"
                          style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.95))' }}
                        />
                      ) : (
                        <polygon
                          points="0,-14 9,8 -9,8"
                          fill="#f59e0b"
                          opacity={0.95}
                          style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))' }}
                        />
                      )}

                      {/* Floating Ship Name Callout Tag */}
                      <g transform="translate(0, -38)">
                        <rect
                          x={-Math.max(42, (player.currentShip.name.length * 4) + 14)}
                          y={-9}
                          width={Math.max(84, (player.currentShip.name.length * 8) + 28)}
                          height={17}
                          rx={3}
                          fill="#090d16"
                          stroke="#f59e0b"
                          strokeWidth={1.2}
                          opacity={0.95}
                        />
                        <text
                          x={0}
                          y={3}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          letterSpacing="0.05em"
                        >
                          YOU: {player.currentShip.name.toUpperCase()}
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Charted / Visited Badge Ring */}
                  {isVisited && !isCurrentSys && (
                    <circle
                      r={Math.max(13, sys.starRadius * 0.45 + 5)}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={1.4}
                      strokeDasharray="3 3"
                      opacity={0.8}
                    />
                  )}

                  {/* Unveiled Surrounding Sensor Ring */}
                  {isSurrounding && (
                    <circle
                      r={Math.max(13, sys.starRadius * 0.45 + 6)}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={1.2}
                      strokeDasharray="3 3"
                      opacity={0.65}
                    />
                  )}

                  {/* Star Corona */}
                  <circle
                    r={sys.starRadius * 0.75}
                    fill={sys.starColor}
                    opacity={0.25}
                    filter="blur(4px)"
                  />

                  {/* Star Core */}
                  <circle
                    r={Math.max(6, sys.starRadius * 0.38)}
                    fill={sys.starColor}
                    stroke={factionColor}
                    strokeWidth={2}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* System Name Label */}
                  <text
                    x={0}
                    y={sys.starRadius * 0.4 + 16}
                    textAnchor="middle"
                    className={`text-[12px] font-display font-bold tracking-wider uppercase pointer-events-none ${
                      isSelected ? 'fill-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : isVisited ? 'fill-emerald-200' : 'fill-slate-200'
                    }`}
                  >
                    {sys.name}
                  </text>

                  {/* Sector / Faction Subtext */}
                  <text
                    x={0}
                    y={sys.starRadius * 0.4 + 28}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-400 pointer-events-none"
                  >
                    {isVisited ? `${sys.faction} · Charted` : sys.faction}
                  </text>

                  {/* Direct Jump Indicator ping */}
                  {isConnected && !isCurrentSys && (
                    <circle
                      cx={18}
                      cy={-14}
                      r={4}
                      fill="#38bdf8"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Zoom & Centering Controls */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1 flex flex-col gap-1 backdrop-blur-md shadow-xl">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => fitGalaxyView(false)}
              className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Fit Galaxy to Screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => centerOnSystem(currentSystem, 0.9)}
              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Center on Ship Location"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sector HUD in Top Left */}
        <div className="absolute top-3 left-14 md:left-16 z-20 flex items-center gap-2 pointer-events-none">
          <div className="bg-slate-950/95 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">SECTOR:</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400 tracking-wide uppercase">
              {selectedSystem.sector}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              // {selectedSystem.name} [{selectedSystem.security} Sec]
            </span>
          </div>
        </div>

        {/* Top Floating Filter, Sector & Exploration Nav Controls */}
        <div className="absolute top-12 md:top-14 left-14 md:left-16 flex flex-wrap items-center gap-2 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg p-2 text-xs font-mono shadow-xl max-w-[calc(100vw-5rem)]">
          {/* Sector Jump */}
          <span className="text-slate-400 hidden sm:inline ml-1">Sector:</span>
          <select
            value={filterSector}
            onChange={(e) => {
              setFilterSector(e.target.value);
              if (e.target.value !== 'all') {
                const target = systems.find(s => s.sector === e.target.value);
                if (target) {
                  setSelectedSystemId(target.id);
                  centerOnSystem(target, 0.85);
                }
              }
            }}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Sectors ({systems.length})</option>
            {sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          {/* Faction Filter */}
          <span className="text-slate-400 hidden sm:inline ml-2">Faction:</span>
          <select
            value={filterFaction}
            onChange={e => setFilterFaction(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Factions</option>
            <option value="Confederation">Confederation (16)</option>
            <option value="Rebellion">Rebellion (26)</option>
            <option value="Pirates">Pirates (4)</option>
            <option value="Independent">Independent (60)</option>
            <option value="Cydonian">Cydonian Enclave (1)</option>
            <option value="Lethean">Lethean Enclave (1)</option>
          </select>

          {/* Fog of War / Exploration Mode Toggle */}
          <button
            onClick={() => {
              sound.playSelect();
              setFogOfWarEnabled(!fogOfWarEnabled);
            }}
            className={`px-2 py-1 rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
              fogOfWarEnabled
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Exploration Fog of War"
          >
            {fogOfWarEnabled ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{fogOfWarEnabled ? 'Exploration: ON' : `All ${systems.length} Systems`}</span>
          </button>

          {/* Directory Button */}
          <button
            onClick={() => {
              sound.playClick(600);
              setIsShareModalOpen(true);
            }}
            className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1.5 cursor-pointer ml-1"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Stellar Directory</span>
          </button>
        </div>

        {/* Bottom Mini-Radar Galaxy Overview (Tabletop Feel with proper spacing) */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:block bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg backdrop-blur-md shadow-2xl w-56 sm:w-60">
          <div className="flex items-center justify-between gap-6 text-[10px] font-mono text-slate-400 mb-2 px-1">
            <span className="tracking-widest">GALACTIC MACRO RADAR</span>
            <span className="text-cyan-400 font-bold tracking-wider">{systems.length} SYSTEMS</span>
          </div>
          <svg viewBox="0 0 1600 1450" className="w-full h-32 bg-slate-900/60 rounded border border-slate-800/80">
            {/* Miniature nodes */}
            {systems.map(s => {
              const isUnveiled = !fogOfWarEnabled || unveiledSystemIds.has(s.id);
              return (
                <circle
                  key={s.id}
                  cx={s.x}
                  cy={s.y}
                  r={s.id === selectedSystem.id ? 20 : s.id === currentSystem.id ? 16 : isUnveiled ? 8 : 4}
                  fill={s.id === selectedSystem.id ? '#38bdf8' : s.id === currentSystem.id ? '#f59e0b' : isUnveiled ? '#64748b' : '#334155'}
                  opacity={isUnveiled ? 1 : 0.4}
                  className={s.id === selectedSystem.id || s.id === currentSystem.id ? 'animate-pulse' : ''}
                />
              );
            })}
          </svg>
        </div>

        {/* Mobile backdrop for drawer */}
        {isDrawerOpen && (
          <div
            onClick={() => {
              sound.playMenu();
              setIsDrawerOpen(false);
            }}
            className="md:hidden fixed inset-0 bg-black/65 backdrop-blur-xs z-35"
          />
        )}

        {/* Floating Active Vessel HUD Indicator (Bottom Left on Desktop/Tablet) */}
        <div 
          onClick={() => centerOnSystem(currentSystem, 0.9)}
          className="absolute bottom-3 left-3 z-20 hidden md:flex items-center gap-2.5 bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 p-2 rounded-xl backdrop-blur-md shadow-xl cursor-pointer group transition-all"
          title="Click to Center on Your Ship"
        >
          <div className="w-10 h-10 rounded-lg bg-black/80 border border-amber-600/50 flex items-center justify-center p-1 shrink-0 relative">
            {player.currentShip.image ? (
              <img
                src={player.currentShip.image}
                alt={player.currentShip.name}
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
              />
            ) : (
              <span className="text-[9px] font-mono text-amber-400">SHIP</span>
            )}
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="text-left font-mono text-xs pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-amber-400 uppercase font-bold">ACTIVE VESSEL</span>
              <span className="text-[9px] text-slate-500">[{currentSystem.name}]</span>
            </div>
            <span className="font-display font-bold text-slate-200 block text-xs group-hover:text-amber-300 transition-colors">
              {player.currentShip.name}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {player.landedObjectId ? `Landed on ${currentSystem.stellarObjects.find(o => o.id === player.landedObjectId)?.name || 'Planet'}` : 'In Orbit'}
            </span>
          </div>
        </div>

        {/* Floating Live In-Map Celestial Body Quick-Preview Card (Visible on ALL devices) */}
        {selectedObject && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 z-25 flex items-center gap-2.5 sm:gap-3 bg-slate-950/95 border border-cyan-700/60 p-2 sm:p-2.5 rounded-xl backdrop-blur-md shadow-2xl max-w-sm border-l-4 border-l-cyan-400 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="w-12 h-12 sm:w-14 sm:h-12 rounded-lg border border-slate-800 bg-black overflow-hidden shrink-0 relative group">
              <img
                src={getStellarObjectImage(selectedObject)}
                alt={selectedObject.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-display font-bold text-cyan-300 uppercase truncate">
                  {selectedObject.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {selectedObject.type}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block truncate">
                {selectedSystem.name} · {selectedSystem.faction}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {isCurrent && selectedObject.landingAllowed && onLandOnObject ? (
                  <button
                    onClick={() => {
                      sound.playLanding();
                      onLandOnObject(selectedObject);
                    }}
                    className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-display font-bold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer transition-colors shadow-md"
                    title={`Land immediately at ${selectedObject.name}`}
                  >
                    <Anchor className="w-3 h-3" />
                    <span>Land / Dock</span>
                  </button>
                ) : isCurrent ? (
                  <button
                    onClick={() => {
                      sound.playMenu();
                      onEnterSystemView(selectedSystem);
                    }}
                    className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-display font-bold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Orbit</span>
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
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Jump (-1 Fuel)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playMenu();
                      onEnterSystemView(selectedSystem);
                    }}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-display text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Radar</span>
                  </button>
                )}

                {!isDrawerOpen && (
                  <button
                    onClick={() => {
                      sound.playMenu();
                      setIsDrawerOpen(true);
                    }}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer ml-1"
                  >
                    Full Intel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Expand Drawer Button when collapsed */}
        {!isDrawerOpen && (
          <button
            onClick={() => {
              sound.playMenu();
              setIsDrawerOpen(true);
            }}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 rounded-lg text-cyan-300 shadow-2xl flex items-center gap-1.5 text-xs font-mono cursor-pointer backdrop-blur-md transition-all"
            title="Expand System Telemetry Drawer"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Telemetry // {selectedSystem.name}</span>
            <span className="sm:hidden">Intel</span>
          </button>
        )}
      </div>

      {/* Right Telemetry & Complete Planetary Directory Drawer (Overlay on mobile, sidebar on desktop) */}
      <div className={`${isDrawerOpen ? 'fixed inset-y-0 right-0 z-40 w-full max-w-sm md:relative md:inset-auto md:w-96' : 'hidden'} h-full bg-slate-950/98 md:bg-slate-950/95 border-l border-cyan-900/40 p-4 md:p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl backdrop-blur-md transition-all`}>
        <div className="space-y-4">
          {/* Header & Status */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                {selectedSystem.sector}
              </span>
              <h2 className="text-xl font-display font-bold text-cyan-300 uppercase tracking-wide">
                {selectedSystem.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                selectedSystem.security === 'High'
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40'
                  : selectedSystem.security === 'Medium'
                  ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40'
                  : selectedSystem.security === 'Low'
                  ? 'border-amber-500/30 text-amber-400 bg-amber-950/40'
                  : 'border-rose-500/30 text-rose-400 bg-rose-950/40'
              }`}>
                {selectedSystem.security} Sec
              </span>
              <button
                onClick={() => {
                  sound.playClick(400);
                  setIsDrawerOpen(false);
                }}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Collapse Telemetry Drawer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search star systems..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                const match = systems.find(s => s.name.toLowerCase().includes(e.target.value.toLowerCase()));
                if (match) {
                  setSelectedSystemId(match.id);
                  centerOnSystem(match);
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Quick Share System Intel Bar */}
          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Tabletop Intel Dossier:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleQuickCopyDossier}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy formatted text to clipboard"
              >
                {quickCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3 text-cyan-400" />}
                <span>{quickCopied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick(600);
                  setIsShareModalOpen(true);
                }}
                className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Full Directory</span>
              </button>
            </div>
          </div>

          {/* System Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded">
              <span className="text-slate-400 block text-[10px]">FACTION</span>
              <span className="font-semibold" style={{ color: getFactionColor(selectedSystem.faction) }}>
                {selectedSystem.faction}
              </span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded">
              <span className="text-slate-400 block text-[10px]">TECH TIER</span>
              <span className="text-cyan-400 font-semibold">Tier {selectedSystem.techLevel} / 7</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded col-span-2">
              <span className="text-slate-400 block text-[10px]">STELLAR CLASS</span>
              <span className="text-slate-200 font-medium">{selectedSystem.stellarClass}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded col-span-2 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">SHIP FUEL GAUGE:</span>
              <span className={`font-semibold ${player.currentFuel >= 2 ? 'text-cyan-400' : player.currentFuel === 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                {player.currentFuel} / {player.currentShip.fuelCapacity} Tanks Available
              </span>
            </div>
          </div>

          {/* System Lore */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-lg text-xs sm:text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
            {selectedSystem.description}
          </div>

          {/* Individual Planets & Landing Facilities Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Celestial Bodies in System ({selectedSystem.stellarObjects.length})</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Click to Preview</span>
            </div>

            {/* Selectable Planet/Station Chips */}
            <div className="grid grid-cols-2 gap-1.5">
              {selectedSystem.stellarObjects.map(obj => {
                const isObjSelected = selectedObjectId === obj.id;
                const isObjLanded = player.landedObjectId === obj.id;
                return (
                  <button
                    key={obj.id}
                    onClick={() => {
                      sound.playSelect();
                      setSelectedObjectId(obj.id);
                    }}
                    className={`text-left p-2 rounded border transition-all cursor-pointer flex items-center gap-2 ${
                      isObjSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded border border-slate-800 bg-black overflow-hidden shrink-0">
                      <img
                        src={getStellarObjectImage(obj)}
                        alt={obj.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-display font-bold text-xs uppercase truncate block">
                          {obj.name}
                        </span>
                        {isObjLanded && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Docked here" />
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 capitalize block truncate">
                        {obj.type} · {obj.landingAllowed ? 'Inhabited' : 'Desolate'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DEDICATED CELESTIAL BODY PREVIEW CARD */}
            {selectedObject && (
              <div className="bg-slate-900/90 border-2 border-cyan-800/80 rounded-xl overflow-hidden shadow-2xl space-y-3">
                {/* Visual Artwork Box */}
                <div className="relative h-40 bg-black overflow-hidden group">
                  <img
                    src={getStellarObjectImage(selectedObject)}
                    alt={selectedObject.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-slate-950/90 border border-cyan-500/50 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-1 shadow-lg backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>Original EV Art · {selectedObject.type}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-100 font-bold uppercase tracking-wide drop-shadow-md">
                      {selectedObject.name}
                    </span>
                    {player.landedObjectId === selectedObject.id ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 shadow">
                        <Anchor className="w-3 h-3" /> Currently Docked
                      </span>
                    ) : selectedObject.landingAllowed ? (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-[10px] font-semibold flex items-center gap-1 shadow">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Docking Cleared
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-slate-400 text-[10px]">
                        Restricted / Desolate
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 space-y-2.5 pt-0">
                  {/* Planetary Lore Description */}
                  <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    {selectedObject.description}
                  </p>

                  {/* Operational Facilities Chips */}
                  <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] pt-1">
                    {selectedObject.facilities.spaceportBar && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Wine className="w-2.5 h-2.5" /> Bar
                      </span>
                    )}
                    {selectedObject.facilities.commodityExchange && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Store className="w-2.5 h-2.5" /> Market
                      </span>
                    )}
                    {selectedObject.facilities.shipyard ? (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                        <Wrench className="w-2.5 h-2.5" /> Shipyard
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-600 line-through">
                        No Shipyard
                      </span>
                    )}
                    {selectedObject.facilities.outfitter && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5" /> Outfitter
                      </span>
                    )}
                    {selectedObject.facilities.missionComputer && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <Briefcase className="w-2.5 h-2.5" /> Jobs
                      </span>
                    )}
                    {selectedObject.facilities.bank ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Landmark className="w-2.5 h-2.5" /> Bank
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-600 line-through">
                        No Bank
                      </span>
                    )}
                  </div>

                  {/* Direct Planet Move & Landing Actions */}
                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    {isCurrent && selectedObject.landingAllowed && onLandOnObject && (
                      <button
                        onClick={() => {
                          sound.playLanding();
                          onLandOnObject(selectedObject);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-display font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
                      >
                        <Anchor className="w-3.5 h-3.5" />
                        <span>Land at {selectedObject.name}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        sound.playClick(600);
                        onEnterSystemView(selectedSystem);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-display font-bold text-xs uppercase rounded border border-cyan-800/50 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Enter orbital view of this celestial body"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Orbit</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hyperlane Links */}
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block mb-1">
              Hyperlane Jump Links
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedSystem.connectedSystemIds.map(connId => {
                const connSys = systems.find(s => s.id === connId);
                if (!connSys) return null;
                return (
                  <button
                    key={connId}
                    onClick={() => {
                      sound.playClick(680);
                      setSelectedSystemId(connId);
                      centerOnSystem(connSys);
                    }}
                    className="text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded px-2 py-0.5 transition-colors cursor-pointer"
                  >
                    {connSys.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
          {isCurrent ? (
            <button
              onClick={() => {
                sound.playClick(850);
                onEnterSystemView(selectedSystem);
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-display font-bold text-sm rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Enter {selectedSystem.name} Orbit</span>
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
              className={`w-full py-3 font-display font-bold text-sm rounded transition-all flex items-center justify-center gap-2 cursor-pointer ${
                player.currentFuel >= 1
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {player.currentFuel >= 1
                  ? `Hyperspace Jump to ${selectedSystem.name} (-1 Fuel)`
                  : 'Insufficient Fuel to Jump'}
              </span>
            </button>
          ) : (
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
                <Radio className="w-3 h-3" />
                <span>Multi-Jump Route Plotted: {route.length - 1} Jumps</span>
              </div>
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
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-display font-semibold text-xs rounded border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Jump Next Leg: {systems.find(s => s.id === route[1])?.name || 'Next System'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!isCurrent && (
            <button
              onClick={() => {
                sound.playClick(500);
                onEnterSystemView(selectedSystem);
              }}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors font-mono"
            >
              Inspect In-System Radar
            </button>
          )}
        </div>
      </div>

      {/* Share Dossier Modal Component */}
      <ShareDossierModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        system={selectedSystem}
        landedObject={null}
        onAppendNotes={onAppendNotes}
      />
    </div>
  );
};
