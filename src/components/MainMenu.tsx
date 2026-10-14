import React, { useState, useEffect } from 'react';
import { PlayerState, StarSystem, Ship } from '../types/game';
import { SHIPS, STAR_SYSTEMS } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import { 
  Play, 
  RotateCcw, 
  Save, 
  FolderOpen, 
  Settings, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle, 
  X, 
  Compass, 
  Sparkles, 
  Rocket, 
  DollarSign, 
  ShieldAlert
} from 'lucide-react';

export interface SaveSlotData {
  id: string;
  name: string;
  savedAt: string;
  playerState: PlayerState;
}

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  onStartNewGame: (pilotName: string, shipName: string) => void;
  onLoadGame: (savedPlayer: PlayerState) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const STORAGE_SLOTS_KEY = 'ev_starfall_save_slots_v1';

export const MainMenu: React.FC<MainMenuProps> = ({
  isOpen,
  onClose,
  player,
  onStartNewGame,
  onLoadGame,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'new_game' | 'save_game' | 'load_game' | 'options'>('menu');
  
  // New Game parameters
  const [pilotName, setPilotName] = useState('Captain Jonathan Corvus');
  const [shipName, setShipName] = useState('SS Peregrine');

  // Save slots
  const [saveSlots, setSaveSlots] = useState<Record<string, SaveSlotData>>(() => {
    try {
      const data = localStorage.getItem(STORAGE_SLOTS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return {};
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const saveToSlot = (slotKey: string, slotTitle: string) => {
    const slotData: SaveSlotData = {
      id: slotKey,
      name: slotTitle,
      savedAt: new Date().toLocaleString(),
      playerState: player,
    };
    const updated = { ...saveSlots, [slotKey]: slotData };
    setSaveSlots(updated);
    try {
      localStorage.setItem(STORAGE_SLOTS_KEY, JSON.stringify(updated));
      sound.playCredit();
      showNotice(`Game successfully saved to ${slotTitle}!`);
    } catch {
      sound.playAlert();
      showNotice('Error writing save to browser storage.');
    }
  };

  const loadFromSlot = (slotKey: string) => {
    const slotData = saveSlots[slotKey];
    if (slotData) {
      sound.playLanding();
      onLoadGame(slotData.playerState);
      showNotice(`Loaded flight dossier: ${slotData.playerState.pilotName}`);
      setTimeout(() => {
        onClose();
        setActiveTab('menu');
      }, 500);
    }
  };

  const deleteSlot = (slotKey: string) => {
    const updated = { ...saveSlots };
    delete updated[slotKey];
    setSaveSlots(updated);
    try {
      localStorage.setItem(STORAGE_SLOTS_KEY, JSON.stringify(updated));
      sound.playSelect();
      showNotice('Save slot cleared.');
    } catch {
      // ignore
    }
  };

  // Export JSON save file
  const exportSaveFile = (slotKey?: string) => {
    const dataToExport = slotKey && saveSlots[slotKey] ? saveSlots[slotKey].playerState : player;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ev_campaign_${dataToExport.pilotName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playSelect();
    showNotice('Save file downloaded!');
  };

  // Import JSON save file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.currentShip && parsed.pilotName && parsed.currentSystemId) {
          sound.playLanding();
          onLoadGame(parsed);
          showNotice(`Imported flight profile for ${parsed.pilotName}!`);
          onClose();
        } else {
          sound.playAlert();
          showNotice('Invalid Escape Velocity campaign save format.');
        }
      } catch {
        sound.playAlert();
        showNotice('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      {/* Background Starfield Particles & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12)_0%,rgba(0,0,0,0.95)_75%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-900/80 to-amber-900/40 border border-cyan-500/60 flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block">
                MAIN COMMAND CONSOLE
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-wider text-slate-100 uppercase">
                THE COSMOS: <span className="text-cyan-400">DERELICT'S HUB</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playMenu();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Resume Flight"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/60 px-4 py-2 text-center text-xs font-mono text-cyan-300 animate-in fade-in duration-150">
            {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          
          {/* VIEW: MAIN ROOT MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-6 max-w-md mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Escape Velocity (1996) Space Opera System
                </span>
                <p className="text-xs font-sans text-slate-400">
                  Select an operational mode to begin your journey through the cosmos.
                </p>
              </div>

              <div className="space-y-3 font-display">
                {/* 1. Resume Game (if in active game) */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    onClose();
                  }}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 fill-current" />
                    <span>Resume Flight</span>
                  </div>
                  <span className="text-xs font-mono uppercase opacity-80 group-hover:translate-x-1 transition-transform">
                    {player.pilotName}
                  </span>
                </button>

                {/* 2. New Game */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('new_game');
                  }}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5" />
                    <span>New Game</span>
                  </div>
                  <span className="text-xs font-mono uppercase opacity-80 group-hover:translate-x-1 transition-transform">
                    Start on Levo
                  </span>
                </button>

                {/* 3. Save Game */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('save_game');
                  }}
                  className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 text-slate-200 font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Save className="w-5 h-5 text-amber-400" />
                    <span>Save Game</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 group-hover:text-amber-300">
                    Store Dossier
                  </span>
                </button>

                {/* 4. Load Game */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('load_game');
                  }}
                  className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                    <span>Load Game</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-300">
                    Saved Profiles
                  </span>
                </button>

                {/* 5. Options */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('options');
                  }}
                  className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-400 group-hover:rotate-45 transition-transform" />
                    <span>Options</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Audio & Display
                  </span>
                </button>
              </div>

              {/* Status summary at bottom */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Date: {formatGameDate(player.stardate)}</span>
                <span className="text-amber-400 font-semibold">{player.credits.toLocaleString()} Cr</span>
              </div>
            </div>
          )}

          {/* VIEW: NEW GAME CONFIGURATION */}
          {activeTab === 'new_game' && (
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-cyan-300 uppercase">
                    Initialize New Campaign
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Commence your independent spacer career on the frontier.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>

              {/* Starting Parameters Briefing Card */}
              <div className="bg-slate-900/80 border border-amber-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Mandatory Starting Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">COMMISSIONED VESSEL</span>
                    <span className="text-slate-100 font-bold text-sm block">Shuttlecraft</span>
                    <span className="text-slate-400 text-[10px]">Rendelli Model 805R (20t Hold)</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">STARTING PLANET & SYSTEM</span>
                    <span className="text-cyan-400 font-bold text-sm block">Levo Spaceport</span>
                    <span className="text-slate-400 text-[10px]">Independent Worlds Sector</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">COMMERCIAL BANK DEBT</span>
                    <span className="text-rose-400 font-bold text-sm block">69,420 Credits</span>
                    <span className="text-slate-400 text-[10px]">Owed to First Interstellar Bank</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">LAUNCH DATE</span>
                    <span className="text-emerald-400 font-bold text-sm block">November 1, 2279</span>
                    <span className="text-slate-400 text-[10px]">Starting Pocket Cash: 2,000 Cr</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80 text-xs font-sans text-slate-300 leading-relaxed">
                  You awaken on the ocean world of <strong>Levo</strong> with a secondhand Shuttlecraft, 2,000 liquid credits, and a heavy <strong>69,420 Cr</strong> debt to repay the bank. Accept shipping contracts, barter commodities across hyperspace, and repay your loan to earn true freedom.
                </div>
              </div>

              {/* Pilot & Ship Customization */}
              <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                  Pilot Registration Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Pilot Name:</label>
                    <input
                      type="text"
                      value={pilotName}
                      onChange={(e) => setPilotName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                      placeholder="e.g. Captain Jonathan Corvus"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Vessel Designation:</label>
                    <input
                      type="text"
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                      placeholder="e.g. SS Peregrine"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    sound.playLanding();
                    onStartNewGame(pilotName || 'Captain Jonathan Corvus', shipName || 'SS Peregrine');
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-display font-bold text-sm rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Launch Campaign on Levo</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: SAVE GAME */}
          {activeTab === 'save_game' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-amber-300 uppercase">
                    Save Flight Dossier
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Record your current campaign progress into browser storage.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>

              {/* Save Slots List */}
              <div className="space-y-3">
                {['slot_1', 'slot_2', 'slot_3', 'quicksave'].map((slotId, index) => {
                  const existing = saveSlots[slotId];
                  const slotLabel = slotId === 'quicksave' ? 'Quick Save Slot' : `Manual Save Slot ${index + 1}`;

                  return (
                    <div
                      key={slotId}
                      className="p-3.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{slotLabel}</span>
                          {existing ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                              Occupied
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Empty Slot
                            </span>
                          )}
                        </div>

                        {existing ? (
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <div>
                              Pilot: <span className="text-slate-200">{existing.playerState.pilotName}</span> · Vessel: <span className="text-cyan-300">{existing.playerState.currentShip.name}</span>
                            </div>
                            <div>
                              Location: <span className="text-amber-300">{existing.playerState.currentSystemId.toUpperCase()}</span> · Date: <span className="text-slate-300">{formatGameDate(existing.playerState.stardate)}</span>
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              Saved on: {existing.savedAt}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">
                            No flight data currently archived in this slot.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => saveToSlot(slotId, slotLabel)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-display font-semibold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{existing ? 'Overwrite' : 'Save Game'}</span>
                        </button>

                        {existing && (
                          <button
                            onClick={() => deleteSlot(slotId)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Delete Save"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* JSON Export Utility */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Export save file for local backup:
                </span>
                <button
                  onClick={() => exportSaveFile()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download .json Save</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: LOAD GAME */}
          {activeTab === 'load_game' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-cyan-300 uppercase">
                    Load Flight Dossier
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Restore a saved profile from local storage or backup file.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>

              {/* Available Save Slots */}
              <div className="space-y-3">
                {['slot_1', 'slot_2', 'slot_3', 'quicksave'].map((slotId, index) => {
                  const existing = saveSlots[slotId];
                  const slotLabel = slotId === 'quicksave' ? 'Quick Save Slot' : `Manual Save Slot ${index + 1}`;

                  return (
                    <div
                      key={slotId}
                      className="p-3.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{slotLabel}</span>
                          {existing ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                              Ready to Load
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Empty Slot
                            </span>
                          )}
                        </div>

                        {existing ? (
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <div>
                              Pilot: <span className="text-slate-100 font-semibold">{existing.playerState.pilotName}</span> · Ship: <span className="text-cyan-300">{existing.playerState.currentShip.name}</span>
                            </div>
                            <div>
                              Location: <span className="text-amber-300">{existing.playerState.currentSystemId.toUpperCase()}</span> · Balance: <span className="text-emerald-400">{existing.playerState.credits.toLocaleString()} Cr</span>
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              Archived: {existing.savedAt} · Date: {formatGameDate(existing.playerState.stardate)}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">
                            No flight records saved in this slot.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {existing ? (
                          <>
                            <button
                              onClick={() => loadFromSlot(slotId)}
                              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Load Game</span>
                            </button>
                            <button
                              onClick={() => deleteSlot(slotId)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                              title="Delete Save"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-600 font-mono text-[11px] italic">
                            Empty
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* JSON Import Utility */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Restore from external backup file:
                </span>
                <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Import .json Save</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* VIEW: OPTIONS */}
          {activeTab === 'options' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-100 uppercase">
                    System Configuration
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Audio telemetry and user interface options.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>

              {/* Audio Controls */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-display font-semibold text-slate-200 block">
                      Sound Effects (Escape Velocity Audio)
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Dual-mode synthesizer &amp; custom WAV soundboard
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      sound.enabled = next;
                      if (next) sound.playSelect();
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      soundEnabled
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                    <span>{soundEnabled ? 'Enabled' : 'Muted'}</span>
                  </button>
                </div>

                {/* Sound effect tester buttons */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Audio Diagnostic Soundboard Test:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <button
                      onClick={() => sound.playSelect()}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer"
                    >
                      Item Select
                    </button>
                    <button
                      onClick={() => sound.playMenu()}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-cyan-300 cursor-pointer"
                    >
                      Menu Beep
                    </button>
                    <button
                      onClick={() => sound.playHyperspaceJump()}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-amber-300 cursor-pointer"
                    >
                      Warp Jump
                    </button>
                    <button
                      onClick={() => sound.playLanding()}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-emerald-300 cursor-pointer"
                    >
                      Planetary Landing
                    </button>
                    <button
                      onClick={() => sound.playCredit()}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-yellow-300 cursor-pointer"
                    >
                      Credits Sound
                    </button>
                  </div>
                </div>
              </div>

              {/* Data & Reset Actions */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-sm font-display font-semibold text-slate-200 block">
                  Campaign Dossier Management
                </span>
                <p className="text-xs font-mono text-slate-400">
                  Reset current active flight data or restore initial game baseline.
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset current game back to the starting parameters on Levo (Shuttlecraft with 69,420 Cr debt)?')) {
                        sound.playAlert();
                        onStartNewGame('Captain Jonathan Corvus', 'SS Peregrine');
                        showNotice('Reset back to Levo starting parameters!');
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-600/50 text-rose-300 text-xs font-mono rounded cursor-pointer transition-colors"
                  >
                    Reset Campaign to Levo Baseline
                  </button>

                  <button
                    onClick={() => {
                      sound.playMenu();
                      setActiveTab('menu');
                    }}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded cursor-pointer"
                  >
                    Close Options
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
