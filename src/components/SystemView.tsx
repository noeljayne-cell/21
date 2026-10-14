import React, { useState, useEffect } from 'react';
import { StarSystem, StellarObject, PlayerState } from '../types/game';
import { ASSET_IMAGES, generateSystemDossierText, getStellarObjectImage } from '../data/galaxyData';
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
  Target,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { ShareDossierModal } from './ShareDossierModal';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [quickCopied, setQuickCopied] = useState<boolean>(false);

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

  const selectedObject = system.stellarObjects.find(o => o.id === selectedObjectId) || system.stellarObjects[0];

  const handleQuickCopy = async () => {
    sound.playCredit();
    const text = generateSystemDossierText(system, selectedObject);
    try {
      await navigator.clipboard.writeText(text);
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col md:flex-row select-none">
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

          <button
            onClick={() => {
              sound.playMenu();
              setIsShareModalOpen(true);
            }}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded px-2.5 sm:px-3 py-1.5 text-xs font-display uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share System Dossier</span>
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

          {/* Orbiting Planets & Space Stations */}
          {system.stellarObjects.map((obj) => {
            const angle = obj.initialAngle + orbitalTime * obj.orbitSpeed * 30;
            const x = Math.cos(angle) * (obj.orbitRadius * 1.25);
            const y = Math.sin(angle) * (obj.orbitRadius * 1.25);
            const isSelected = selectedObjectId === obj.id;
            const isLanded = player.landedObjectId === obj.id;

            return (
              <g key={obj.id}>
                {/* Orbital Track */}
                <circle
                  r={obj.orbitRadius * 1.25}
                  fill="none"
                  stroke={isSelected ? '#06b6d4' : '#1e293b'}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                  strokeDasharray={isSelected ? '4 2' : 'none'}
                  opacity={isSelected ? 0.7 : 0.4}
                />

                {/* Target Body Group */}
                <g
                  transform={`translate(${x}, ${y})`}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedObjectId(obj.id);
                  }}
                  className="cursor-pointer group"
                >
                  <circle r={32} fill="transparent" />

                  {/* Selected Reticle */}
                  {isSelected && (
                    <g className="animate-spin" style={{ animationDuration: '8s' }}>
                      <circle
                        r={obj.size + 12}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      <line x1={-(obj.size + 16)} y1={0} x2={-(obj.size + 8)} y2={0} stroke="#38bdf8" strokeWidth={2} />
                      <line x1={obj.size + 8} y1={0} x2={obj.size + 16} y2={0} stroke="#38bdf8" strokeWidth={2} />
                      <line x1={0} y1={-(obj.size + 16)} x2={0} y2={-(obj.size + 8)} stroke="#38bdf8" strokeWidth={2} />
                      <line x1={0} y1={obj.size + 8} x2={0} y2={obj.size + 16} stroke="#38bdf8" strokeWidth={2} />
                    </g>
                  )}

                  {/* Landed indicator icon */}
                  {isLanded && (
                    <g transform={`translate(0, ${-(obj.size + 16)})`}>
                      <circle r={7} fill="#10b981" />
                      <polygon points="-3,-1 0,3 3,-1" fill="#ffffff" />
                    </g>
                  )}

                  {/* Atmosphere Glow */}
                  {obj.atmosphereColor && (
                    <circle
                      r={obj.size * 1.25}
                      fill={obj.atmosphereColor}
                      opacity={0.3}
                      filter="blur(2px)"
                    />
                  )}

                  {/* Rings if applicable */}
                  {obj.rings && (
                    <ellipse
                      rx={obj.size * 2.2}
                      ry={obj.size * 0.7}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth={3}
                      opacity={0.7}
                      transform="rotate(-25)"
                    />
                  )}

                  {/* Body Circle */}
                  <circle
                    r={obj.size}
                    fill={obj.color}
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Name Label */}
                  <text
                    y={obj.size + 16}
                    textAnchor="middle"
                    className={`text-[11px] font-display font-semibold tracking-wider uppercase pointer-events-none ${
                      isSelected ? 'fill-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'fill-slate-300'
                    }`}
                  >
                    {obj.name}
                  </text>

                  {/* Subtitle */}
                  <text
                    y={obj.size + 27}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-400 capitalize pointer-events-none"
                  >
                    {obj.type}
                  </text>
                </g>
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

          {/* Target Header with Share Button */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-400">
                <Target className="w-3 h-3 text-cyan-400" />
                <span>Selected Celestial Body</span>
              </div>
              <h2 className="text-xl font-display font-bold text-cyan-300 uppercase tracking-wide">
                {selectedObject?.name || 'Uncharted Body'}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleQuickCopy}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer"
                title="Copy body info to clipboard"
              >
                {quickCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  sound.playClick(600);
                  setIsShareModalOpen(true);
                }}
                className="p-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 rounded text-cyan-300 cursor-pointer"
                title="Open Complete Galactic Directory"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Artwork Thumbnail */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800 h-44 bg-black group shadow-xl">
            <img
              src={getStellarObjectImage(selectedObject)}
              alt={selectedObject?.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover md:object-contain object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
            <div className="absolute top-2 left-2 bg-slate-950/90 border border-cyan-500/50 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Original EV Landing Art</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-semibold">{selectedObject?.name}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Port Cleared
              </span>
            </div>
          </div>

          {/* Target Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded">
              <span className="text-slate-400 block text-[10px]">JURISDICTION</span>
              <span className="text-cyan-300 font-medium">{system.faction}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded">
              <span className="text-slate-400 block text-[10px]">SECURITY LEVEL</span>
              <span className="text-amber-300 font-medium">{system.security} Protocol</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded">
              <span className="text-slate-400 block text-[10px]">TECH TIER</span>
              <span className="text-slate-200 font-medium">Level {system.techLevel} Facilities</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded">
              <span className="text-slate-400 block text-[10px]">STATUS</span>
              <span className="text-emerald-400 font-medium">Inhabited Port</span>
            </div>
          </div>

          {/* Planetary Description Lore */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded text-xs text-slate-300 leading-relaxed font-sans">
            {selectedObject?.description}
          </div>

          {/* Available Landing Facilities on This Specific Planet */}
          <div>
            <div className="flex items-center justify-between mb-2 text-[11px] font-mono text-slate-400">
              <span className="uppercase tracking-wider">Operational Facilities:</span>
              <span className="text-cyan-400 font-semibold">{selectedObject?.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
              {/* Bar */}
              <div className={`flex items-center gap-1.5 border px-2 py-1.5 rounded ${
                selectedObject?.facilities.spaceportBar
                  ? 'bg-slate-900/80 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
              }`}>
                <Wine className="w-3 h-3 text-amber-400" />
                <span>Bar</span>
              </div>

              {/* Commodities */}
              <div className={`flex items-center gap-1.5 border px-2 py-1.5 rounded ${
                selectedObject?.facilities.commodityExchange
                  ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
              }`}>
                <Store className="w-3 h-3 text-emerald-400" />
                <span>Market</span>
              </div>

              {/* Shipyard */}
              <div className={`flex items-center gap-1.5 border px-2 py-1.5 rounded ${
                selectedObject?.facilities.shipyard
                  ? 'bg-slate-900/80 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
              }`}>
                <Wrench className="w-3 h-3 text-cyan-400" />
                <span>Shipyard</span>
              </div>

              {/* Outfitter */}
              <div className={`flex items-center gap-1.5 border px-2 py-1.5 rounded ${
                selectedObject?.facilities.outfitter
                  ? 'bg-slate-900/80 border-purple-500/40 text-purple-300'
                  : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
              }`}>
                <Radio className="w-3 h-3 text-purple-400" />
                <span>Outfitter</span>
              </div>

              {/* Jobs */}
              <div className={`flex items-center gap-1.5 border px-2 py-1.5 rounded ${
                selectedObject?.facilities.missionComputer
                  ? 'bg-slate-900/80 border-blue-500/40 text-blue-300'
                  : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
              }`}>
                <Briefcase className="w-3 h-3 text-blue-400" />
                <span>Jobs</span>
              </div>

              {/* Bank */}
              <div className={`flex items-center gap-1.5 border px-2 py-1.5 rounded ${
                selectedObject?.facilities.bank
                  ? 'bg-slate-900/80 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
              }`}>
                <Landmark className="w-3 h-3 text-amber-300" />
                <span>Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Landing Action Button */}
        <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
          {player.landedObjectId === selectedObject?.id ? (
            <button
              onClick={() => {
                sound.playLanding();
                onLandOnObject(selectedObject);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-display font-bold text-sm rounded shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Anchor className="w-4 h-4" />
              <span>Enter {selectedObject?.name} Spaceport</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playLanding();
                onLandOnObject(selectedObject);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-display font-bold text-sm rounded shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Anchor className="w-4 h-4" />
              <span>Initiate Landing / Dock at {selectedObject?.name}</span>
            </button>
          )}

          <div className="text-center text-[10px] font-mono text-slate-500">
            Docking guidance authorized by {system.faction} Port Traffic Control
          </div>
        </div>
      </div>

      {/* Share Dossier Modal */}
      <ShareDossierModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        system={system}
        landedObject={selectedObject}
        onAppendNotes={onAppendNotes}
      />
    </div>
  );
};
