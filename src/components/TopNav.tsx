import React from 'react';
import { Volume2, VolumeX, Dices, Compass, Globe, Anchor, ShieldCheck, Menu, Calendar } from 'lucide-react';
import { PlayerState, StarSystem, StellarObject } from '../types/game';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';

interface TopNavProps {
  currentView: 'galaxy' | 'system' | 'planet' | 'ship';
  setCurrentView: (view: 'galaxy' | 'system' | 'planet' | 'ship') => void;
  player: PlayerState;
  currentSystem: StarSystem;
  landedObject: StellarObject | null;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenTabletopTools: () => void;
  onOpenMainMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  setCurrentView,
  player,
  currentSystem,
  landedObject,
  soundEnabled,
  setSoundEnabled,
  onOpenTabletopTools,
  onOpenMainMenu,
}) => {
  return (
    <>
      <header className="h-14 md:h-16 bg-slate-950/95 backdrop-blur-md border-b border-cyan-900/40 px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4 shrink-0 z-40 select-none">
        {/* Zone 1: Wordmark & Date Breadcrumb */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Main Menu Button */}
          <button
            onClick={() => {
              sound.playMenu();
              onOpenMainMenu();
            }}
            className="p-1.5 md:px-2.5 md:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Open Main Menu (New Game, Save, Load, Options)"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline font-mono text-xs font-semibold uppercase">Menu</span>
          </button>

          {/* Wordmark */}
          <button
            onClick={() => {
              sound.playMenu();
              setCurrentView('galaxy');
            }}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-display font-bold text-base md:text-lg tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase whitespace-nowrap">
              <span className="sm:hidden">COSMOS</span>
              <span className="hidden sm:inline">The Cosmos: <span className="text-amber-400 font-mono text-xs md:text-sm tracking-normal">Derelict's Hub</span></span>
            </span>
          </button>

          {/* Date Badge: e.g. November 1, 2279 */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{formatGameDate(player.stardate)}</span>
          </div>

          {/* Location breadcrumb */}
          <div className="hidden xl:flex items-center text-xs text-slate-400 font-mono border-l border-slate-800 pl-3">
            <span className="text-amber-300 font-semibold">{currentSystem.name}</span>
            <span className="mx-1.5 text-slate-600">/</span>
            {landedObject ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Anchor className="w-3 h-3 inline" /> Landed on {landedObject.name}
              </span>
            ) : (
              <span className="text-cyan-400">In Orbit</span>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links for Tablet & Desktop */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => {
              sound.playMenu();
              setCurrentView('galaxy');
            }}
            className={`px-3 py-1.5 rounded text-xs lg:text-sm font-display tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'galaxy'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Galaxy Map</span>
          </button>

          <button
            onClick={() => {
              sound.playMenu();
              setCurrentView('system');
            }}
            className={`px-3 py-1.5 rounded text-xs lg:text-sm font-display tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'system'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>System View</span>
          </button>

          <button
            onClick={() => {
              if (landedObject) {
                sound.playMenu();
                setCurrentView('planet');
              } else {
                sound.playMenu();
                setCurrentView('system');
              }
            }}
            className={`px-3 py-1.5 rounded text-xs lg:text-sm font-display tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'planet'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : landedObject
                ? 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300'
                : 'text-slate-600 hover:text-slate-400'
            }`}
            title={landedObject ? `Landed on ${landedObject.name}` : 'Dock at a planet first'}
          >
            <Anchor className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spaceport {landedObject ? `(${landedObject.name})` : ''}</span>
          </button>

          <button
            onClick={() => {
              sound.playMenu();
              setCurrentView('ship');
            }}
            className={`px-3 py-1.5 rounded text-xs lg:text-sm font-display tracking-wide uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'ship'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Ship Status</span>
          </button>
        </nav>

        {/* Zone 3: Credits & Fuel, Sound toggle & Tabletop Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Date Tag (visible on small screens when space allows) */}
          <div className="flex lg:hidden items-center text-[10px] sm:text-xs font-mono text-cyan-300 bg-slate-900/90 border border-slate-800 rounded px-2 py-1">
            <span>{formatGameDate(player.stardate)}</span>
          </div>

          {/* Credits & Fuel summary badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded px-2 py-1 text-[11px] sm:text-xs font-mono">
            <div className="flex items-center gap-1 text-amber-300">
              <span className="text-slate-400 text-[9px] sm:text-[10px]">CR:</span>
              <span className="font-semibold tabular-nums">{player.credits.toLocaleString()}</span>
            </div>
            <div className="w-[1px] h-3 bg-slate-800" />
            <div className="flex items-center gap-1 text-cyan-300">
              <span className="text-slate-400 text-[9px] sm:text-[10px]">F:</span>
              <span className="font-semibold tabular-nums">{player.currentFuel}/{player.currentShip.fuelCapacity}</span>
            </div>
          </div>

          {/* Audio Mute Button */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              sound.enabled = !soundEnabled;
              if (!soundEnabled) sound.playSelect();
            }}
            className="p-1.5 sm:p-2 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Audio Effects On' : 'Audio Effects Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
          </button>

          {/* Primary Tabletop Action */}
          <button
            onClick={() => {
              sound.playMenu();
              onOpenTabletopTools();
            }}
            className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-display font-semibold text-xs sm:text-xs md:text-sm rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Dices className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tabletop Tools</span>
            <span className="sm:hidden">Tools</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Dock Navigation Bar (< md) for thumb-friendly reach */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-13 bg-slate-950/98 border-t border-cyan-900/50 backdrop-blur-lg px-1 flex items-center justify-around z-40 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => {
            sound.playMenu();
            setCurrentView('galaxy');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] font-display uppercase tracking-wider transition-colors ${
            currentView === 'galaxy' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className={`w-4 h-4 ${currentView === 'galaxy' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : ''}`} />
          <span>Galaxy</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setCurrentView('system');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] font-display uppercase tracking-wider transition-colors ${
            currentView === 'system' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className={`w-4 h-4 ${currentView === 'system' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : ''}`} />
          <span>System</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            if (landedObject) {
              setCurrentView('planet');
            } else {
              setCurrentView('system');
            }
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] font-display uppercase tracking-wider transition-colors ${
            currentView === 'planet' ? 'text-emerald-300 font-bold' : landedObject ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          <Anchor className={`w-4 h-4 ${currentView === 'planet' ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]' : ''}`} />
          <span>Spaceport</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setCurrentView('ship');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] font-display uppercase tracking-wider transition-colors ${
            currentView === 'ship' ? 'text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${currentView === 'ship' ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : ''}`} />
          <span>Ship</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            onOpenMainMenu();
          }}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] font-display uppercase tracking-wider text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4 text-cyan-400" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};
