import React, { useState } from 'react';
import { PlayerState, StarSystem, TabletopLogEntry } from '../types/game';
import { getSystemInterestRate } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import { 
  X, 
  Dices, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  ShieldAlert, 
  History, 
  Plus, 
  Minus,
  Check,
  AlertTriangle,
  Clock,
  Compass,
  Percent
} from 'lucide-react';

interface TabletopCompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  currentSystem: StarSystem;
  onAdvanceTurn: (days: number) => void;
  onUpdateNotes: (notes: string) => void;
  logEntries: TabletopLogEntry[];
  onAddLog: (entry: TabletopLogEntry) => void;
}

export const TabletopCompanionDrawer: React.FC<TabletopCompanionDrawerProps> = ({
  isOpen,
  onClose,
  player,
  currentSystem,
  onAdvanceTurn,
  onUpdateNotes,
  logEntries,
  onAddLog,
}) => {
  const [activeTab, setActiveTab] = useState<'dice' | 'turn' | 'encounters' | 'notes'>('dice');

  // Dice Roller State
  const [modifier, setModifier] = useState<number>(0);
  const [lastRoll, setLastRoll] = useState<{
    diceType: string;
    rolls: number[];
    modifier: number;
    total: number;
  } | null>(null);

  // Encounter State
  const [currentEncounter, setCurrentEncounter] = useState<{
    title: string;
    difficulty: string;
    description: string;
    tabletopCheck: string;
  } | null>(null);

  // Notes state
  const [notesText, setNotesText] = useState(player.notes);

  if (!isOpen) return null;

  const rollDice = (count: number, sides: number, diceLabel: string) => {
    sound.playDiceRoll();
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const sum = rolls.reduce((a, b) => a + b, 0);
    const total = sum + modifier;

    const result = {
      diceType: diceLabel,
      rolls,
      modifier,
      total,
    };
    setLastRoll(result);

    onAddLog({
      id: `roll_${Date.now()}`,
      stardate: player.stardate,
      type: 'dice',
      text: `Rolled ${diceLabel}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''} = [${rolls.join(', ')}] Total: ${total}`,
    });
  };

  const generateSpaceEncounter = () => {
    sound.playAlert();
    const sec = currentSystem.security;
    let pool = [];

    if (sec === 'Anarchy' || sec === 'Low') {
      pool = [
        {
          title: 'Pirate Corsair Ambush!',
          difficulty: 'Hard (DC 15)',
          description: 'Two Marauder gunboats drop out of stealth right off your starboard bow, targeting your cargo hold.',
          tabletopCheck: 'Dogfight Gunnery or Evasive Hyperdrive Jump (DC 15)',
        },
        {
          title: 'Derelict Freighter Distress Beacon',
          difficulty: 'Medium (DC 13)',
          description: 'A drifting Argosy hulk floating without power. Sensors detect automated defense turrets still active.',
          tabletopCheck: 'Salvage Electronics or Tech Breach Check (DC 13)',
        },
        {
          title: 'Smuggler Black Market Rendezvous',
          difficulty: 'Easy (DC 10)',
          description: 'A cloaked transport flashes encrypted identification offering discounted munitions or illegal blasters.',
          tabletopCheck: 'Streetwise / Spacer Barter Check (DC 10)',
        },
        {
          title: 'Dense Asteroid Field Navigation',
          difficulty: 'Medium (DC 14)',
          description: 'Tumbling iron boulders sweep across your vector path.',
          tabletopCheck: 'Piloting Thruster Check (DC 14) or suffer 20 Hull damage',
        }
      ];
    } else {
      pool = [
        {
          title: 'Confederation Customs Patrol Inspection',
          difficulty: 'Medium (DC 14)',
          description: 'A naval patrol cruiser scans your cargo hold for Starlight Narcotics or unlicensed weapons.',
          tabletopCheck: 'Sensor Shielding or Smuggler Bluff Check (DC 14)',
        },
        {
          title: 'Disabled Civilian Shuttle Rescue',
          difficulty: 'Easy (DC 11)',
          description: 'A civilian shuttle with blown fusion coils drifts toward a gas giant gravity well.',
          tabletopCheck: 'Tractor Beam Tow or Emergency Engineering Check (DC 11)',
        },
        {
          title: 'Solar Flare Ion Storm Surge',
          difficulty: 'Hard (DC 16)',
          description: 'Coronal mass ejection washes over the system, overloading deflector shields and communication arrays.',
          tabletopCheck: 'Shield Harmonization Check (DC 16) or lose 50 Shields',
        },
        {
          title: 'Merchant Convoy Escort Opportunity',
          difficulty: 'Medium (DC 12)',
          description: 'A guild trader asks you to fly escort through the neighboring jump vector for a 5,000 Cr bounty.',
          tabletopCheck: 'Formation Flying & Sensors Check (DC 12)',
        }
      ];
    }

    const selected = pool[Math.floor(Math.random() * pool.length)];
    setCurrentEncounter(selected);

    onAddLog({
      id: `enc_${Date.now()}`,
      stardate: player.stardate,
      type: 'combat',
      text: `Encounter: ${selected.title} (${selected.difficulty})`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-cyan-900/40 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar">
        <div className="space-y-5">
          {/* Top Drawer Title & Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-500/10 rounded border border-amber-500/30 text-amber-400">
                <Dices className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  TABLETOP COMPANION TOOLKIT
                </span>
                <h2 className="text-base font-display font-bold text-slate-100 uppercase tracking-wide">
                  Tabletop Game Bridge
                </h2>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick(500);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Tool Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-lg text-xs font-mono">
            <button
              onClick={() => {
                sound.playMenu();
                setActiveTab('dice');
              }}
              className={`py-1.5 rounded transition-colors text-center cursor-pointer ${
                activeTab === 'dice' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dice
            </button>
            <button
              onClick={() => {
                sound.playMenu();
                setActiveTab('turn');
              }}
              className={`py-1.5 rounded transition-colors text-center cursor-pointer ${
                activeTab === 'turn' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => {
                sound.playMenu();
                setActiveTab('encounters');
              }}
              className={`py-1.5 rounded transition-colors text-center cursor-pointer ${
                activeTab === 'encounters' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Encounters
            </button>
            <button
              onClick={() => {
                sound.playMenu();
                setActiveTab('notes');
              }}
              className={`py-1.5 rounded transition-colors text-center cursor-pointer ${
                activeTab === 'notes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Notes
            </button>
          </div>

          {/* TAB 1: DICE ROLLER */}
          {activeTab === 'dice' && (
            <div className="space-y-4">
              {/* Modifier Adjustment */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-2.5 rounded text-xs font-mono">
                <span className="text-slate-400">ROLL MODIFIER:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModifier(m => m - 1)}
                    className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-amber-300 tabular-nums">
                    {modifier > 0 ? `+${modifier}` : modifier}
                  </span>
                  <button
                    onClick={() => setModifier(m => m + 1)}
                    className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                  {modifier !== 0 && (
                    <button
                      onClick={() => setModifier(0)}
                      className="text-[10px] text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Dice Grid */}
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[
                  { label: '1d4', count: 1, sides: 4 },
                  { label: '1d6', count: 1, sides: 6 },
                  { label: '2d6', count: 2, sides: 6 },
                  { label: '1d8', count: 1, sides: 8 },
                  { label: '1d10', count: 1, sides: 10 },
                  { label: '1d12', count: 1, sides: 12 },
                  { label: '1d20', count: 1, sides: 20 },
                  { label: '1d100', count: 1, sides: 100 },
                ].map((d) => (
                  <button
                    key={d.label}
                    onClick={() => rollDice(d.count, d.sides, d.label)}
                    className="py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded text-center text-slate-100 font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Latest Roll Output */}
              {lastRoll && (
                <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-lg text-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    LATEST ROLL ({lastRoll.diceType})
                  </span>
                  <div className="text-3xl font-display font-bold text-amber-400 tabular-nums">
                    {lastRoll.total}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Dice: [{lastRoll.rolls.join(', ')}]
                    {lastRoll.modifier !== 0 && ` Modifier: ${lastRoll.modifier > 0 ? `+${lastRoll.modifier}` : lastRoll.modifier}`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUTOMATIC TIMELINE & CHRONOLOGY MONITOR */}
          {activeTab === 'turn' && (
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider block text-cyan-400">
                    AUTOMATIC CAMPAIGN TIMELINE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    HYPERDRIVE LINKED
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xl sm:text-2xl font-display font-bold text-cyan-300 tracking-wide block">
                      {formatGameDate(player.stardate)}
                    </span>
                    <span className="text-xs font-mono text-slate-400 block">Campaign Day {Math.floor(player.stardate) + 1}</span>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <span className="text-slate-400 block">Active Escorts: {player.escorts.length}</span>
                    <span className="text-amber-400 block font-semibold">
                      Wages: -{player.escorts.reduce((a, b) => a + b.dailyWage, 0)} Cr / Jump
                    </span>
                  </div>
                </div>

                {/* System-specific loan interest rate */}
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Local System Loan Tariff:</span>
                    <span className="text-amber-300 font-bold">
                      {getSystemInterestRate(currentSystem).toFixed(1)}% Variable APR
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Jurisdiction & Security:</span>
                    <span className="text-slate-300">{currentSystem.name} ({currentSystem.security})</span>
                  </div>
                  {player.debt > 0 && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                      <span className="text-rose-400">Outstanding Debt:</span>
                      <span className="text-rose-300 font-bold">
                        {player.debt.toLocaleString()} Cr (+{Math.max(1, Math.round(player.debt * (getSystemInterestRate(currentSystem) / 100 / 10))).toLocaleString()} Cr / Jump)
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded text-xs text-cyan-200/90 font-sans leading-relaxed">
                  Time advances <strong>automatically</strong> with each hyperspace transit (+1 Day per jump). Navigation computers automatically deduct crew wages and accrue system-variable loan interest (5%–10% based on security).
                </div>
              </div>

              {/* Recent Timeline Logs */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                  RECENT FLIGHT & TRANSIT LOGS
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar font-mono text-xs">
                  {logEntries
                    .filter((e) => e.type === 'jump' || e.type === 'land')
                    .slice(0, 5)
                    .map((entry) => (
                      <div key={entry.id} className="p-2 bg-slate-900/60 rounded border border-slate-800/80 text-[11px] text-slate-300">
                        <span className="text-cyan-400 mr-2">[{formatGameDate(entry.stardate)}]</span>
                        {entry.text}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RANDOM SPACE ENCOUNTERS */}
          {activeTab === 'encounters' && (
            <div className="space-y-4">
              <button
                onClick={generateSpaceEncounter}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-slate-950 font-display font-bold text-xs uppercase rounded transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Roll Space Encounter ({currentSystem.security} Sec)</span>
              </button>

              {currentEncounter && (
                <div className="bg-slate-900/80 border border-amber-500/40 p-4 rounded-lg space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-amber-300 text-sm uppercase">
                      {currentEncounter.title}
                    </h4>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {currentEncounter.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {currentEncounter.description}
                  </p>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
                    <strong>TABLETOP RESOLUTION:</strong> {currentEncounter.tabletopCheck}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GM & CAMPAIGN NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                TABLETOP CAMPAIGN SCRATCHPAD
              </span>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Record session notes, GM clues, secret wormholes, player debt agreements..."
                rows={8}
                className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              />
              <button
                onClick={() => {
                  sound.playClick(600);
                  onUpdateNotes(notesText);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-cyan-300 rounded border border-slate-700 cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          )}

          {/* Campaign Action Log History */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3 h-3 text-slate-500" /> Session Event History
            </span>
            <div className="max-h-36 overflow-y-auto no-scrollbar space-y-1 text-[11px] font-mono">
              {logEntries.slice(0, 8).map((log) => (
                <div key={log.id} className="text-slate-400 py-0.5 border-b border-slate-900 flex justify-between">
                  <span className="truncate max-w-[280px]">{log.text}</span>
                  <span className="text-slate-500 shrink-0 ml-2">{formatGameDate(log.stardate)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-center text-[10px] font-mono text-slate-500">
          Starfall Nav · Companion OS
        </div>
      </div>
    </div>
  );
};
