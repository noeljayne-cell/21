import React, { useState, useEffect } from 'react';
import { PlayerState, StarSystem, Ship } from '../types/game';
import { SHIPS, STAR_SYSTEMS } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import {
  Play,
  Rocket,
  FolderOpen,
  Save,
  Settings,
  X,
  Volume2,
  VolumeX,
  Trash2,
  Download,
  Upload,
  ShieldAlert,
  Compass,
  Check,
  Smartphone,
  Apple,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  currentSystem?: StarSystem;
  onStartNewGame: (pilotName: string, shipName: string) => void;
  onLoadGame: (savedState: PlayerState) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

interface SaveSlotData {
  id: string;
  name: string;
  savedAt: string;
  playerState: PlayerState;
}

const STORAGE_SLOTS_KEY = 'ev_derelicts_hub_slots_v1';

export const MainMenu: React.FC<MainMenuProps> = ({
  isOpen,
  onClose,
  player,
  currentSystem,
  onStartNewGame,
  onLoadGame,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'new_game' | 'save_game' | 'load_game' | 'options' | 'app_store'>('menu');

  // New game form inputs
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

      {/* Main Container Styled as Classic Ambrosia/EV Metallic Command Window */}
      <div className="relative w-full max-w-2xl ev-panel rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar with Dual Pinstripe Accent */}
        <div className="ev-titlebar p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-500/60 flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold block">
                MAIN COMMAND CONSOLE // ESCAPE VELOCITY
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
            className="ev-btn p-2 text-slate-300 hover:text-white"
            title="Resume Flight"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="bg-cyan-950/95 border-b border-cyan-500/60 px-4 py-2 text-center text-xs sm:text-sm font-mono text-cyan-200 font-bold animate-in fade-in duration-150">
            {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          
          {/* VIEW: MAIN ROOT MENU with classic EV Beveled Action Buttons */}
          {activeTab === 'menu' && (
            <div className="space-y-6 max-w-md mx-auto py-2">
              <div className="text-center space-y-1.5">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Escape Velocity (1996) Space Opera System
                </span>
                <p className="text-xs sm:text-sm font-sans text-slate-300 leading-normal">
                  Select an operational mode to command your vessel and journey through the galaxy.
                </p>
              </div>

              <div className="space-y-3 font-display">
                {/* 1. Resume Game */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    onClose();
                  }}
                  className="w-full py-3.5 px-5 ev-btn-emerald rounded-xl flex items-center justify-between cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 fill-current" />
                    <span className="text-sm sm:text-base font-black">Resume Flight</span>
                  </div>
                  <span className="text-xs font-mono uppercase font-bold opacity-85 group-hover:translate-x-1 transition-transform">
                    {player.pilotName}
                  </span>
                </button>

                {/* 2. New Game */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('new_game');
                  }}
                  className="w-full py-3.5 px-5 ev-btn-cyan rounded-xl flex items-center justify-between cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5" />
                    <span className="text-sm sm:text-base font-black">New Game</span>
                  </div>
                  <span className="text-xs font-mono uppercase font-bold opacity-85 group-hover:translate-x-1 transition-transform">
                    Start on Levo
                  </span>
                </button>

                {/* 3. Save Game */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('save_game');
                  }}
                  className="w-full py-3.5 px-5 ev-btn rounded-xl flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Save className="w-5 h-5 text-amber-400" />
                    <span className="text-sm sm:text-base font-bold">Save Game</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 group-hover:text-amber-300 font-semibold">
                    Store Dossier
                  </span>
                </button>

                {/* 4. Load Game */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('load_game');
                  }}
                  className="w-full py-3.5 px-5 ev-btn rounded-xl flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm sm:text-base font-bold">Load Game</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-300 font-semibold">
                    Saved Profiles
                  </span>
                </button>

                {/* 5. Options */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('options');
                  }}
                  className="w-full py-3.5 px-5 ev-btn rounded-xl flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-400 group-hover:rotate-45 transition-transform" />
                    <span className="text-sm sm:text-base font-bold">Options</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    Audio &amp; Display
                  </span>
                </button>

                {/* 6. Apple & Android App Store Guide */}
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('app_store');
                  }}
                  className="w-full py-3.5 px-5 ev-btn rounded-xl flex items-center justify-between cursor-pointer group border-cyan-800/80"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm sm:text-base font-bold text-cyan-300">App Store &amp; Mobile Setup</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-semibold">
                    iOS / Android Guide
                  </span>
                </button>
              </div>

              {/* Status summary at bottom */}
              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-300">
                <span>Current Date: <strong className="text-cyan-300">{formatGameDate(player.stardate)}</strong></span>
                <span className="text-amber-300 font-bold">{player.credits.toLocaleString()} Cr</span>
              </div>
            </div>
          )}

          {/* VIEW: NEW GAME CONFIGURATION */}
          {activeTab === 'new_game' && (
            <div className="space-y-5">
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-cyan-300 uppercase">
                    Initialize New Campaign
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    Commence your independent spacer career on the frontier.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer font-bold"
                >
                  ← Back to Menu
                </button>
              </div>

              {/* Starting Parameters Briefing Card */}
              <div className="ev-panel border-2 border-amber-500/50 rounded-xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Mandatory Starting Flight Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="ev-panel-inset p-3 rounded-lg">
                    <span className="text-slate-400 text-xs block font-bold">COMMISSIONED VESSEL</span>
                    <span className="text-slate-100 font-black text-base block mt-0.5">Shuttlecraft</span>
                    <span className="text-slate-300 text-xs">Rendelli Model 805R (20t Cargo Hold)</span>
                  </div>

                  <div className="ev-panel-inset p-3 rounded-lg">
                    <span className="text-slate-400 text-xs block font-bold">STARTING SYSTEM &amp; WORLD</span>
                    <span className="text-cyan-300 font-black text-base block mt-0.5">Levo Spaceport</span>
                    <span className="text-slate-300 text-xs">Independent Worlds Sector</span>
                  </div>

                  <div className="ev-panel-inset p-3 rounded-lg">
                    <span className="text-slate-400 text-xs block font-bold">COMMERCIAL BANK DEBT</span>
                    <span className="text-rose-400 font-black text-base block mt-0.5">69,420 Credits</span>
                    <span className="text-slate-300 text-xs">Owed to First Interstellar Bank</span>
                  </div>

                  <div className="ev-panel-inset p-3 rounded-lg">
                    <span className="text-slate-400 text-xs block font-bold">LAUNCH DATE</span>
                    <span className="text-emerald-400 font-black text-base block mt-0.5">November 1, 2279</span>
                    <span className="text-slate-300 text-xs">Starting Pocket Cash: 2,000 Cr</span>
                  </div>
                </div>

                <div className="p-3.5 ev-panel-inset rounded-lg text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  You awaken on the ocean world of <strong>Levo</strong> with a secondhand Shuttlecraft, 2,000 liquid credits, and a heavy <strong>69,420 Cr</strong> debt to repay the bank. Accept shipping contracts, barter commodities across hyperspace, and repay your loan to earn true freedom.
                </div>
              </div>

              {/* Pilot & Ship Customization */}
              <div className="space-y-3 ev-panel-inset p-4 rounded-xl border border-slate-700">
                <span className="text-xs font-mono uppercase text-cyan-400 block tracking-wider font-bold">
                  Pilot Registration Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">Pilot Callname:</label>
                    <input
                      type="text"
                      value={pilotName}
                      onChange={(e) => setPilotName(e.target.value)}
                      className="w-full bg-black/90 border border-slate-600 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                      placeholder="e.g. Captain Jonathan Corvus"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">Vessel Transponder Designation:</label>
                    <input
                      type="text"
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
                      className="w-full bg-black/90 border border-slate-600 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono"
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
                  className="ev-btn px-4 py-2.5 text-xs text-slate-300"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    sound.playLanding();
                    onStartNewGame(pilotName || 'Captain Jonathan Corvus', shipName || 'SS Peregrine');
                    onClose();
                  }}
                  className="ev-btn-cyan px-6 py-3 text-xs sm:text-sm font-bold flex items-center gap-2"
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
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-amber-300 uppercase">
                    Save Flight Dossier
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    Record your current campaign progress into browser storage.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer font-bold"
                >
                  ← Back to Menu
                </button>
              </div>

              {/* Save Slots with Clear, High-Contrast Typography */}
              <div className="space-y-3">
                {['slot_1', 'slot_2', 'slot_3', 'quicksave'].map((slotId, index) => {
                  const existing = saveSlots[slotId];
                  const slotLabel = slotId === 'quicksave' ? 'Quick Save Slot' : `Manual Save Slot ${index + 1}`;

                  return (
                    <div
                      key={slotId}
                      className="p-4 ev-panel rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{slotLabel}</span>
                          {existing ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                              Archived Profile
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-black text-slate-400 border border-slate-700">
                              Empty Slot
                            </span>
                          )}
                        </div>

                        {existing ? (
                          <div className="text-xs text-slate-300 space-y-0.5">
                            <div>
                              Pilot: <strong className="text-slate-100">{existing.playerState.pilotName}</strong> · Ship: <span className="text-cyan-300 font-semibold">{existing.playerState.currentShip.name}</span>
                            </div>
                            <div>
                              Location: <span className="text-amber-300 font-semibold">{existing.playerState.currentSystemId.toUpperCase()}</span> · Balance: <span className="text-emerald-400 font-bold">{existing.playerState.credits.toLocaleString()} Cr</span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              Archived: {existing.savedAt} · Date: {formatGameDate(existing.playerState.stardate)}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Empty save slot ready for new telemetry record.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => saveToSlot(slotId, slotLabel)}
                          className="ev-btn-amber px-4 py-2 text-xs font-bold"
                        >
                          Save To Slot
                        </button>
                        {existing && (
                          <button
                            onClick={() => deleteSlot(slotId)}
                            className="ev-btn p-2 text-rose-400 hover:text-white"
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

              {/* JSON Backup Utility */}
              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">
                  Export save file to your local computer:
                </span>
                <button
                  onClick={() => exportSaveFile()}
                  className="ev-btn px-3 py-1.5 text-xs flex items-center gap-1.5 text-slate-200"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download .json Save</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: LOAD GAME */}
          {activeTab === 'load_game' && (
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-cyan-300 uppercase">
                    Load Flight Dossier
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    Restore a saved profile from local storage or backup file.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer font-bold"
                >
                  ← Back to Menu
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
                      className="p-4 ev-panel rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{slotLabel}</span>
                          {existing ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                              Ready to Load
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-black text-slate-400 border border-slate-700">
                              Empty Slot
                            </span>
                          )}
                        </div>

                        {existing ? (
                          <div className="text-xs text-slate-300 space-y-0.5">
                            <div>
                              Pilot: <strong className="text-slate-100">{existing.playerState.pilotName}</strong> · Ship: <span className="text-cyan-300 font-semibold">{existing.playerState.currentShip.name}</span>
                            </div>
                            <div>
                              Location: <span className="text-amber-300 font-semibold">{existing.playerState.currentSystemId.toUpperCase()}</span> · Balance: <span className="text-emerald-400 font-bold">{existing.playerState.credits.toLocaleString()} Cr</span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              Archived: {existing.savedAt} · Date: {formatGameDate(existing.playerState.stardate)}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            No flight records saved in this slot.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {existing ? (
                          <>
                            <button
                              onClick={() => loadFromSlot(slotId)}
                              className="ev-btn-cyan px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Load Game</span>
                            </button>
                            <button
                              onClick={() => deleteSlot(slotId)}
                              className="ev-btn p-2 text-rose-400 hover:text-white"
                              title="Delete Save"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-500 font-mono text-xs italic">
                            Empty
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* JSON Import Utility */}
              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">
                  Restore from external backup file:
                </span>
                <label className="ev-btn px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer text-slate-200">
                  <Upload className="w-4 h-4 text-cyan-400" />
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
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-slate-100 uppercase">
                    System Configuration
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    Audio telemetry and user interface options.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer font-bold"
                >
                  ← Back to Menu
                </button>
              </div>

              {/* Audio Controls */}
              <div className="ev-panel p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-display font-bold text-slate-100 block">
                      Sound Effects (Escape Velocity Audio)
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      Classic Ambrosia WAV soundboard with retro audio synthesizer
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      sound.enabled = next;
                      if (next) sound.playSelect();
                    }}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      soundEnabled ? 'ev-btn-cyan' : 'ev-btn opacity-60 text-slate-400'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
                    <span>{soundEnabled ? 'Audio Active' : 'Muted'}</span>
                  </button>
                </div>

                {/* Sound effect tester buttons */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-bold">
                    Audio Diagnostic Soundboard Test:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <button
                      onClick={() => sound.playSelect()}
                      className="ev-btn px-3 py-1.5 text-slate-200"
                    >
                      Item Select
                    </button>
                    <button
                      onClick={() => sound.playMenu()}
                      className="ev-btn px-3 py-1.5 text-cyan-300"
                    >
                      Menu Beep
                    </button>
                    <button
                      onClick={() => sound.playHyperspaceJump()}
                      className="ev-btn px-3 py-1.5 text-amber-300"
                    >
                      Warp Jump
                    </button>
                    <button
                      onClick={() => sound.playLanding()}
                      className="ev-btn px-3 py-1.5 text-emerald-300"
                    >
                      Planetary Landing
                    </button>
                    <button
                      onClick={() => sound.playCredit()}
                      className="ev-btn px-3 py-1.5 text-yellow-300"
                    >
                      Credits Sound
                    </button>
                  </div>
                </div>
              </div>

              {/* Data & Reset Actions */}
              <div className="ev-panel p-5 rounded-xl space-y-3.5">
                <span className="text-sm sm:text-base font-display font-bold text-slate-100 block">
                  Campaign Dossier Management
                </span>
                <p className="text-xs font-mono text-slate-300">
                  Reset current active flight data or restore the initial game starting scenario.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset current game back to the starting parameters on Levo (Shuttlecraft with 69,420 Cr debt)?')) {
                        sound.playAlert();
                        onStartNewGame('Captain Jonathan Corvus', 'SS Peregrine');
                        showNotice('Reset back to Levo starting parameters!');
                        onClose();
                      }
                    }}
                    className="ev-btn py-2 px-3.5 text-rose-300 hover:text-white text-xs"
                  >
                    Reset Campaign to Levo Baseline
                  </button>

                  <button
                    onClick={() => {
                      sound.playMenu();
                      setActiveTab('menu');
                    }}
                    className="ev-btn px-4 py-2 text-xs"
                  >
                    Close Options
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: APP STORE & MOBILE EXPORT GUIDE (Comprehensive In-App Guide) */}
          {activeTab === 'app_store' && (
            <div className="space-y-5">
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-cyan-300 uppercase">
                    Publishing to Apple &amp; Android App Stores
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    Step-by-step workflow for iOS App Store and Google Play Store distribution.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playMenu();
                    setActiveTab('menu');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer font-bold"
                >
                  ← Back to Menu
                </button>
              </div>

              {/* Method 1: Capacitor (Recommended Standard) */}
              <div className="ev-panel p-5 rounded-xl space-y-3.5 shadow-xl">
                <div className="flex items-center gap-2.5 text-cyan-300">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-display font-bold text-base uppercase">
                    Method 1: Native Wrapper via Capacitor (Industry Standard)
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  Capacitor (by Ionic) turns this React + Vite app into full native iOS (Xcode) and Android (Android Studio) projects. You get native status bar control, app icons, splash screens, and direct App Store / Play Store binary outputs (.ipa / .aab).
                </p>

                <div className="ev-panel-inset p-3.5 rounded-lg space-y-2 font-mono text-xs text-slate-200">
                  <div className="text-amber-400 font-bold uppercase tracking-wider">Terminal Commands:</div>
                  <pre className="p-2.5 bg-black/90 rounded border border-slate-800 text-cyan-300 overflow-x-auto">
{`# 1. Install Capacitor packages
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# 2. Initialize Capacitor project
npx cap init "The Cosmos: Derelict's Hub" "com.derelictshub.game"

# 3. Build production web bundle
npm run build

# 4. Add native platforms
npx cap add ios
npx cap add android

# 5. Open in native IDEs
npx cap open ios      # Opens in Xcode (for Apple App Store)
npx cap open android  # Opens in Android Studio (for Google Play)`}
                  </pre>
                </div>
              </div>

              {/* Method 2: PWABuilder (Zero-Code Packaging) */}
              <div className="ev-panel p-5 rounded-xl space-y-3.5 shadow-xl">
                <div className="flex items-center gap-2.5 text-amber-300">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <h4 className="font-display font-bold text-base uppercase">
                    Method 2: PWABuilder (Fastest PWA-to-Store Package)
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  Microsoft's open-source <strong>PWABuilder</strong> (pwabuilder.com) takes your deployed web URL, reads the included <code>manifest.json</code> and Service Worker (which are already configured in this app), and generates ready-to-submit packages for both stores.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="ev-panel-inset p-3 rounded-lg space-y-1">
                    <span className="text-cyan-400 font-bold block uppercase">Apple App Store (iOS)</span>
                    <p className="text-slate-300 font-sans text-xs">
                      Generates an Xcode project with WebKit wrapper and icons pre-configured, ready to archive and upload via Transporter.
                    </p>
                  </div>

                  <div className="ev-panel-inset p-3 rounded-lg space-y-1">
                    <span className="text-emerald-400 font-bold block uppercase">Google Play (Android)</span>
                    <p className="text-slate-300 font-sans text-xs">
                      Generates a Trusted Web Activity (TWA) Android App Bundle (.aab) with digital asset links, ready to upload directly to Play Console.
                    </p>
                  </div>
                </div>
              </div>

              {/* Store Requirements Checklist */}
              <div className="ev-panel p-5 rounded-xl space-y-3 shadow-xl">
                <h4 className="font-display font-bold text-base text-slate-100 uppercase">
                  Developer Accounts &amp; Store Requirements
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
                  <div className="ev-panel-inset p-3.5 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-100 font-bold">
                      <Apple className="w-4 h-4 text-slate-200" />
                      <span>Apple App Store Checklist</span>
                    </div>
                    <ul className="text-slate-300 space-y-1 font-sans text-xs list-disc pl-4">
                      <li>Apple Developer Program ($99/year)</li>
                      <li>App icon: 1024x1024 PNG (no transparency)</li>
                      <li>Screenshots: 6.7" iPhone &amp; 12.9" iPad</li>
                      <li>Hosted Privacy Policy URL</li>
                      <li>Mac with Xcode required for final code signing</li>
                    </ul>
                  </div>

                  <div className="ev-panel-inset p-3.5 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-100 font-bold">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Google Play Store Checklist</span>
                    </div>
                    <ul className="text-slate-300 space-y-1 font-sans text-xs list-disc pl-4">
                      <li>Google Play Console account ($25 one-time fee)</li>
                      <li>App icon: 512x512 PNG</li>
                      <li>Feature graphic: 1024x500 PNG</li>
                      <li>Hosted Privacy Policy URL</li>
                      <li>20 testers for 14 days (Google closed testing rule)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
