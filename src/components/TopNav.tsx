import React from 'react';
import { Volume2, VolumeX, Dices, Compass, Globe, Anchor, ShieldCheck, Menu, Calendar, ChevronLeft, Edit3 } from 'lucide-react';
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
  onNavigateBack: () => void;
  isGlobalEditMode: boolean;
  onToggleGlobalEditMode: () => void;
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
  onNavigateBack,
  isGlobalEditMode,
  onToggleGlobalEditMode,
}) => {
  return (
    <>
      {/* Top Console Command Bar: Location breadcrumb moved to art overlay; navigation locked in bottom dock */}
      <header className="h-12 sm:h-13 md:h-14 ev-titlebar ev-panel px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-40 select-none w-full max-w-full overflow-hidden">
        
        {/* Zone 1: Back Navigation Button & Wordmark Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          {/* Back Button */}
          <button
            onClick={() => {
              sound.playClick(500);
              onNavigateBack();
            }}
            className="ev-btn px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs flex items-center gap-1.5 cursor-pointer text-cyan-300 hover:text-cyan-100 hover:border-cyan-400/60 shrink-0 transition-colors shadow-sm"
            title="Go back to previous screen"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-display font-bold tracking-wider text-xs">BACK</span>
          </button>

          {/* Wordmark Logo */}
          <button
            onClick={() => {
              sound.playMenu();
              setCurrentView('galaxy');
            }}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-1.5 shrink min-w-0"
          >
            <span className="font-display font-black text-xs sm:text-sm md:text-base tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase whitespace-nowrap truncate">
              <span className="sm:hidden">COSMOS</span>
              <span className="hidden sm:inline">
                THE COSMOS: <span className="text-amber-400 font-mono text-xs sm:text-sm font-semibold tracking-normal">DERELICT'S HUB</span>
              </span>
            </span>
          </button>
        </div>

        {/* Zone 2: Telemetry & Status Badges (Stardate, Full Credits, Full Fuel, Audio, Tools) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
          
          {/* Escape Velocity Date (Tablet & Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-cyan-200 bg-black/85 px-2.5 py-1 rounded border border-cyan-800/60 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold tracking-wide">{formatGameDate(player.stardate)}</span>
          </div>

          {/* Credits & Fuel Full Console Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/90 border border-slate-700/80 rounded px-2 sm:px-2.5 py-1 text-xs font-mono shadow-inner shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 text-amber-300">
              <span className="text-slate-400 text-xs font-bold">
                <span className="hidden sm:inline">CREDITS:</span>
                <span className="sm:hidden">CR:</span>
              </span>
              <span className="font-bold tabular-nums text-amber-400 text-xs sm:text-sm">
                {player.credits.toLocaleString()} Cr
              </span>
            </div>

            <div className="w-[1px] h-3.5 bg-slate-700" />

            <div className="flex items-center gap-1 sm:gap-1.5 text-cyan-300">
              <span className="text-slate-400 text-xs font-bold">
                <span className="hidden sm:inline">FUEL:</span>
                <span className="sm:hidden">F:</span>
              </span>
              <span className="font-bold tabular-nums text-cyan-300 text-xs sm:text-sm">
                {player.currentFuel} / {player.currentShip.fuelCapacity}
                <span className="hidden sm:inline text-slate-400 text-xs ml-1">Jumps</span>
              </span>
            </div>
          </div>

          {/* Audio Mute Button */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              sound.enabled = !soundEnabled;
              if (!soundEnabled) sound.playSelect();
            }}
            className="ev-btn p-1.5 text-slate-300 hover:text-white shrink-0 cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Audio Effects Active (Ambrosia Soundboard)' : 'Audio Effects Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Primary Tabletop Tools Action */}
          <button
            onClick={() => {
              sound.playMenu();
              onOpenTabletopTools();
            }}
            className="ev-btn px-2.5 py-1 sm:py-1.5 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer text-slate-200"
            title="Open Tabletop Companion Tools"
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-display text-xs">Tools</span>
          </button>

          {/* Master Inline Edit Mode Button */}
          <button
            onClick={() => {
              sound.playSelect();
              onToggleGlobalEditMode();
            }}
            className={`px-2.5 py-1 sm:py-1.5 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer rounded transition-all font-display ${
              isGlobalEditMode
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'ev-btn-amber text-slate-950 font-bold'
            }`}
            title="Toggle inline text editing mode to click and type directly on any text"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline text-xs">{isGlobalEditMode ? 'EDIT: ON' : 'EDIT TEXT'}</span>
          </button>
        </div>
      </header>

      {/* Persistent Bottom Dock Navigation Bar: Always locked to the screen across all versions */}
      <nav className="fixed bottom-0 left-0 right-0 h-13 sm:h-14 ev-panel border-t-2 border-t-slate-700 bg-slate-950/98 px-2 sm:px-6 md:px-12 flex items-center justify-around z-50 select-none shadow-[0_-4px_24px_rgba(0,0,0,0.95)]">
        <button
          onClick={() => {
            sound.playMenu();
            setCurrentView('galaxy');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs font-display uppercase tracking-wider transition-colors cursor-pointer ${
            currentView === 'galaxy' ? 'text-cyan-300 font-bold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Compass className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${currentView === 'galaxy' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]' : ''}`} />
          <span>Galaxy</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setCurrentView('system');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs font-display uppercase tracking-wider transition-colors cursor-pointer ${
            currentView === 'system' ? 'text-cyan-300 font-bold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Globe className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${currentView === 'system' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]' : ''}`} />
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
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs font-display uppercase tracking-wider transition-colors cursor-pointer ${
            currentView === 'planet' ? 'text-emerald-300 font-bold' : landedObject ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          <Anchor className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${currentView === 'planet' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]' : ''}`} />
          <span>Spaceport</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setCurrentView('ship');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs font-display uppercase tracking-wider transition-colors cursor-pointer ${
            currentView === 'ship' ? 'text-amber-300 font-bold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${currentView === 'ship' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]' : ''}`} />
          <span>Ship</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            onOpenMainMenu();
          }}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs font-display uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};
