import React, { useState, useEffect, useMemo } from 'react';
import { StarSystem, StellarObject, PlayerState } from '../types/game';
import { ASSET_IMAGES, generateSystemDossierText, getStellarObjectImage } from '../data/galaxyData';
import { CelestialBodyGraphic } from './CelestialBodyGraphic';
import { sound } from '../audio/soundFx';
import { 
  Anchor, 
  Compass, 
  Radio, 
  ShieldCheck, 
  Store, 
  Wrench, 
  Briefcase, 
  Landmark, 
  Wine, 
  ChevronRight, 
  ExternalLink, 
  Target 
} from 'lucide-react';

interface SystemViewProps {
  system: StarSystem;
  player: PlayerState;
  onLandOnObject: (obj: StellarObject) => void;
  onReturnToGalaxyMap: () => void;
  onAppendNotes: (notes: string) => void;
}

export const SystemView: React.FC<SystemViewProps> = ({
  system,
  player,
  onLandOnObject,
  onReturnToGalaxyMap,
  onAppendNotes,
}) => {
  const [selectedObjectId, setSelectedObjectId] = useState<string>(
    player.landedObjectId || system.stellarObjects[0]?.id || ''
  );
  const [mobileTab, setMobileTab] = useState<'radar' | 'telemetry'>('radar');
  const [orbitalTime, setOrbitalTime] = useState<number>(0);

  // Subtle orbital motion simulation
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setOrbitalTime(t => t + 0.003);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pre-calculate positions of all bodies (supporting satellites orbiting parent planets with comfortable spacing for clickability)
  const objectPositions = useMemo(() => {
    const posMap: Record<string, { x: number; y: number; parentX?: number; parentY?: number; isSatellite: boolean; sunAngle: number; satDist?: number }> = {};
    
    // First pass: Primary planets & standalone stations directly orbiting the central star
    system.stellarObjects.forEach(obj => {
      const parent = obj.parentId ? system.stellarObjects.find(p => p.id === obj.parentId) : null;
      if (!parent) {
        const angle = obj.initialAngle + orbitalTime * obj.orbitSpeed * 30;
        const x = Math.cos(angle) * (obj.orbitRadius * 1.25);
        const y = Math.sin(angle) * (obj.orbitRadius * 1.25);
        const sunAngle = Math.atan2(-y, -x);
        posMap[obj.id] = { x, y, isSatellite: false, sunAngle };
      }
    });

    // Group satellites by parent planet to ensure tiered, distinct non-overlapping orbital tracks
    const satellitesByParent: Record<string, StellarObject[]> = {};
    system.stellarObjects.forEach(obj => {
      if (obj.parentId) {
        if (!satellitesByParent[obj.parentId]) satellitesByParent[obj.parentId] = [];
        satellitesByParent[obj.parentId].push(obj);
      }
    });

    // Second pass: Calculate spaced orbits for satellites (moons and orbital stations)
    Object.entries(satellitesByParent).forEach(([parentId, sats]) => {
      // Sort by initial orbitRadius to preserve inner station vs outer moon hierarchy
      sats.sort((a, b) => (a.orbitRadius || 30) - (b.orbitRadius || 30));
      sats.forEach((obj, idx) => {
        const parentPos = posMap[parentId] || { x: 0, y: 0 };
        const satAngle = obj.initialAngle + orbitalTime * (obj.orbitSpeed || 0.02) * 50;
        // Spaced comfortably for easy clickability while staying tied to parent planet
        // 1st body (e.g. Stardock Alpha): 58px radius, 2nd body (e.g. Luna): 96px radius
        const satDist = 58 + idx * 38;
        const x = parentPos.x + Math.cos(satAngle) * satDist;
        const y = parentPos.y + Math.sin(satAngle) * satDist;
        const sunAngle = Math.atan2(-y, -x);
        posMap[obj.id] = { x, y, parentX: parentPos.x, parentY: parentPos.y, isSatellite: true, sunAngle, satDist };
      });
    });

    return posMap;
  }, [system.stellarObjects, orbitalTime]);

  const selectedObject = system.stellarObjects.find(o => o.id === selectedObjectId) || system.stellarObjects[0];

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col md:flex-row select-none">
      {/* Background Starfield */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${ASSET_IMAGES.galaxyBackdrop})` }}
      />
      {/* Radar range rings background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.06)_0%,_transparent_75%)] pointer-events-none" />

      {/* Main Solar System Orbital Canvas View */}
      <div className={`flex-1 h-full relative flex items-center justify-center p-2 sm:p-4 overflow-hidden ${
        mobileTab === 'telemetry' ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Navigation & Share Buttons Top Left + Mobile Switcher */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              sound.playMenu();
              onReturnToGalaxyMap();
            }}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded px-2.5 sm:px-3 py-1.5 text-xs font-display uppercase tracking-wider text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Galaxy Jump Map</span>
            <span className="sm:hidden">Jump Map</span>
          </button>

          {/* Mobile Radar / Telemetry Toggle (< md) */}
          <div className="md:hidden flex items-center bg-slate-900/90 border border-slate-800 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => {
                sound.playMenu();
                setMobileTab('radar');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                mobileTab === 'radar' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              Radar
            </button>
            <button
              onClick={() => {
                sound.playMenu();
                setMobileTab('telemetry');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                mobileTab === 'telemetry' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              Dossier
            </button>
          </div>
        </div>

        {/* System Radar HUD Header */}
        <div className="absolute top-4 right-4 z-20 hidden lg:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded text-xs font-mono">
          <span className="text-slate-400">IN-SYSTEM RADAR:</span>
          <span className="text-amber-400 font-bold uppercase">{system.name}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">{system.stellarObjects.length} Celestial Bodies</span>
        </div>

        {/* System Orbital Map SVG */}
        <svg
          viewBox="-400 -400 800 800"
          className="w-full h-full max-w-[850px] max-h-[850px] overflow-visible"
        >
          {/* Orbital Range Rings */}
          <circle r={360} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3 5" />
          <circle r={280} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3 5" />
          <circle r={200} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3 5" />
          <circle r={120} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3 5" />

          {/* Central Star */}
          <g>
            <circle
              r={system.starRadius * 1.8}
              fill={system.starColor}
              opacity={0.15}
              filter="blur(8px)"
            />
            <circle
              r={system.starRadius * 1.3}
              fill={system.starColor}
              opacity={0.35}
              filter="blur(4px)"
            />
            <circle
              r={system.starRadius}
              fill={system.starColor}
              stroke="#ffffff"
              strokeWidth={1}
            />
            <text
              y={system.starRadius + 18}
              textAnchor="middle"
              className="text-[12px] font-display font-semibold fill-amber-300 drop-shadow uppercase"
            >
              {system.name}
            </text>
            <text
              y={system.starRadius + 30}
              textAnchor="middle"
              className="text-[9px] font-mono fill-slate-400 uppercase"
            >
              {system.stellarClass}
            </text>
          </g>

          {/* ========================================================
              ORBITAL TRACKS (Primary orbits around Star & Satellites around Planets)
              ======================================================== */}
          <g className="orbital-tracks pointer-events-none">
            {system.stellarObjects.map((obj) => {
              const pos = objectPositions[obj.id];
              const isSelected = selectedObjectId === obj.id;
              if (!pos) return null;

              if (pos.isSatellite && pos.parentX !== undefined && pos.parentY !== undefined) {
                // Satellite orbit around parent planet (e.g. Luna and Stardock Alpha orbiting Earth)
                return (
                  <circle
                    key={`track-${obj.id}`}
                    cx={pos.parentX}
                    cy={pos.parentY}
                    r={pos.satDist || obj.orbitRadius}
                    fill="none"
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth={isSelected ? 1.4 : 0.8}
                    strokeDasharray="2 3"
                    opacity={isSelected ? 0.9 : 0.45}
                  />
                );
              }

              // Primary planet orbit around the central star
              return (
                <circle
                  key={`track-${obj.id}`}
                  cx={0}
                  cy={0}
                  r={obj.orbitRadius * 1.25}
                  fill="none"
                  stroke={isSelected ? '#06b6d4' : '#1e293b'}
                  strokeWidth={isSelected ? 1.6 : 0.8}
                  strokeDasharray={isSelected ? '4 2' : 'none'}
                  opacity={isSelected ? 0.8 : 0.4}
                />
              );
            })}
          </g>

          {/* ========================================================
              ORBITING PLANETS, MOONS & SPACE STATIONS
              ======================================================== */}
          {system.stellarObjects.map((obj) => {
            const pos = objectPositions[obj.id] || { x: 0, y: 0, sunAngle: 0 };
            const isSelected = selectedObjectId === obj.id;
            const isLanded = player.landedObjectId === obj.id;

            return (
              <g
                key={obj.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  sound.playSelect();
                  setSelectedObjectId(obj.id);
                }}
                className="cursor-pointer group"
              >
                {/* Generous touch / mouse click target */}
                <circle r={Math.max(30, (obj.size || 20) + 14)} fill="transparent" />

                {/* Detailed Procedural Celestial Graphic */}
                <CelestialBodyGraphic
                  obj={obj}
                  sunAngle={pos.sunAngle}
                  isSelected={isSelected}
                  isLanded={isLanded}
                />
              </g>
            );
          })}

          {/* Hyperspace Jump Buoy at perimeter */}
          <g
            transform="translate(320, -220)"
            onClick={() => {
              sound.playClick(600);
              onReturnToGalaxyMap();
            }}
            className="cursor-pointer group"
          >
            <circle r={28} fill="transparent" />
            <circle r={12} fill="#0284c7" opacity={0.3} className="animate-ping" />
            <polygon points="0,-8 7,6 -7,6" fill="#38bdf8" />
            <text
              y={20}
              textAnchor="middle"
              className="text-[10px] font-mono fill-cyan-400 group-hover:fill-cyan-300"
            >
              HYPERSPACE BUOY
            </text>
          </g>
        </svg>

        {/* Floating Target Quick Card on Mobile Radar (< md) */}
        {selectedObject && (
          <div className="md:hidden absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 bg-slate-950/95 border border-cyan-800/70 p-2 rounded-xl backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded border border-slate-800 bg-black overflow-hidden shrink-0">
                <img
                  src={getStellarObjectImage(selectedObject)}
                  alt={selectedObject.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-display font-bold text-cyan-300 uppercase block truncate">
                  {selectedObject.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {selectedObject.type} · {selectedObject.habitable ? 'Inhabited' : 'Uninhabited'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  sound.playLanding();
                  onLandOnObject(selectedObject);
                }}
                className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-slate-950 font-display font-bold text-[10px] uppercase rounded flex items-center gap-1 cursor-pointer shadow-md"
              >
                <Anchor className="w-3 h-3" />
                <span>Dock</span>
              </button>
              <button
                onClick={() => {
                  sound.playMenu();
                  setMobileTab('telemetry');
                }}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-display text-[10px] uppercase rounded border border-slate-700 cursor-pointer"
              >
                Intel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Target Telemetry & Landing Terminal */}
      <div className={`w-full md:w-96 bg-slate-950/98 md:bg-slate-950/95 border-t md:border-t-0 md:border-l border-cyan-900/40 p-3.5 sm:p-4 md:p-6 flex flex-col justify-between overflow-y-auto no-scrollbar z-30 shadow-2xl backdrop-blur-md ${
        mobileTab === 'radar' ? 'hidden md:flex' : 'flex flex-1 md:flex-initial'
      }`}>
        <div className="space-y-4">
          {/* Mobile Back Button (< md) */}
          <button
            onClick={() => {
              sound.playMenu();
              setMobileTab('radar');
            }}
            className="md:hidden py-1 px-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer w-fit"
          >
            ← Return to Orbital Radar
          </button>

          {/* Target Header */}
          <div className="pb-3 border-b border-slate-700/80">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-300 font-bold">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Selected Celestial Body</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-100 uppercase tracking-wide">
              {selectedObject?.name || 'Uncharted Body'}
            </h2>
          </div>

          {/* Visual Artwork Thumbnail - clean without original ev art text badge */}
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-700 h-44 sm:h-48 bg-black group shadow-xl">
            <img
              src={getStellarObjectImage(selectedObject)}
              alt={selectedObject?.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover md:object-contain object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-100 font-bold text-sm sm:text-base">{selectedObject?.name}</span>
              <span className="text-emerald-300 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Port Cleared
              </span>
            </div>
          </div>

          {/* Planetary Description Lore (at top above the docking button right below artwork) */}
          <div className="ev-panel-inset p-3.5 rounded-lg text-xs sm:text-sm text-slate-100 leading-relaxed font-sans shadow-inner border border-slate-800/80">
            {selectedObject?.description}
          </div>

          {/* Featured Prominent Dock Action Button at Top */}
          <div className="space-y-1.5 pt-1">
            {player.landedObjectId === selectedObject?.id ? (
              <button
                onClick={() => {
                  sound.playLanding();
                  onLandOnObject(selectedObject);
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-display font-black tracking-wider text-sm sm:text-base uppercase rounded-xl flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-950/60 transition-all border border-emerald-400/50"
              >
                <Anchor className="w-5 h-5 text-slate-950" />
                <span>Enter {selectedObject?.name} Spaceport</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playLanding();
                  onLandOnObject(selectedObject);
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-slate-950 font-display font-black tracking-wider text-sm sm:text-base uppercase rounded-xl flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-cyan-950/60 transition-all border border-cyan-300/60"
              >
                <Anchor className="w-5 h-5 text-slate-950" />
                <span>Dock at {selectedObject?.name}</span>
              </button>
            )}
            <div className="text-center text-[11px] font-mono text-slate-400">
              Docking guidance authorized by {system.faction} Port Traffic Control
            </div>
          </div>

          {/* Available Landing Facilities on This Specific Planet (above specifications) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold">
              <span className="uppercase tracking-wider">Operational Facilities:</span>
              <span className="text-cyan-300">{selectedObject?.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {/* Bar */}
              <div className={`flex items-center gap-1.5 border px-2.5 py-2 rounded-lg font-semibold ${
                selectedObject?.facilities.spaceportBar
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                  : 'bg-black text-slate-600 border-slate-900 line-through'
              }`}>
                <Wine className="w-3.5 h-3.5 text-amber-400" />
                <span>Bar</span>
              </div>

              {/* Commodities */}
              <div className={`flex items-center gap-1.5 border px-2.5 py-2 rounded-lg font-semibold ${
                selectedObject?.facilities.commodityExchange
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-black text-slate-600 border-slate-900 line-through'
              }`}>
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Market</span>
              </div>

              {/* Shipyard */}
              <div className={`flex items-center gap-1.5 border px-2.5 py-2 rounded-lg font-bold ${
                selectedObject?.facilities.shipyard
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                  : 'bg-black text-slate-600 border-slate-900 line-through'
              }`}>
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shipyard</span>
              </div>

              {/* Outfitter */}
              <div className={`flex items-center gap-1.5 border px-2.5 py-2 rounded-lg font-semibold ${
                selectedObject?.facilities.outfitter
                  ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                  : 'bg-black text-slate-600 border-slate-900 line-through'
              }`}>
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                <span>Outfitter</span>
              </div>

              {/* Jobs */}
              <div className={`flex items-center gap-1.5 border px-2.5 py-2 rounded-lg font-semibold ${
                selectedObject?.facilities.missionComputer
                  ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
                  : 'bg-black text-slate-600 border-slate-900 line-through'
              }`}>
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Jobs</span>
              </div>

              {/* Bank */}
              <div className={`flex items-center gap-1.5 border px-2.5 py-2 rounded-lg font-semibold ${
                selectedObject?.facilities.bank
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                  : 'bg-black text-slate-600 border-slate-900 line-through'
              }`}>
                <Landmark className="w-3.5 h-3.5 text-amber-300" />
                <span>Bank</span>
              </div>
            </div>
          </div>

          {/* Target Specifications Grid (below facilities) */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono pt-1">
            <div className="ev-panel-inset p-3 rounded-lg space-y-0.5">
              <span className="text-slate-400 block text-xs font-bold uppercase">JURISDICTION</span>
              <span className="text-cyan-300 font-bold text-sm">{system.faction}</span>
            </div>
            <div className="ev-panel-inset p-3 rounded-lg space-y-0.5">
              <span className="text-slate-400 block text-xs font-bold uppercase">SECURITY LEVEL</span>
              <span className="text-amber-300 font-bold text-sm">{system.security} Protocol</span>
            </div>
            <div className="ev-panel-inset p-3 rounded-lg space-y-0.5">
              <span className="text-slate-400 block text-xs font-bold uppercase">TECH TIER</span>
              <span className="text-slate-200 font-semibold text-sm">Level {system.techLevel} Facilities</span>
            </div>
            <div className="ev-panel-inset p-3 rounded-lg space-y-0.5">
              <span className="text-slate-400 block text-xs font-bold uppercase">STATUS</span>
              <span className="text-emerald-300 font-bold text-sm">Inhabited Port</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
