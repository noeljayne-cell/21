import React, { useState, useEffect } from 'react';
import { StellarObject, StarSystem, PlayerState, EscortWingman } from '../types/game';
import { SPACEPORT_RUMORS, ESCORT_WINGMEN, getStellarObjectImage } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Wine, Users, MessageSquareQuote, ChevronLeft, ChevronRight, UserPlus, Sparkles, Radio } from 'lucide-react';

interface SpaceportBarProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onHireEscort: (escort: EscortWingman) => void;
  onDismissEscort: (escortId: string) => void;
  onSpendCredits: (amount: number) => boolean;
}

export const SpaceportBar: React.FC<SpaceportBarProps> = ({
  planet,
  system,
  player,
  onHireEscort,
  onDismissEscort,
  onSpendCredits,
}) => {
  const [activeTab, setActiveTab] = useState<'rumors' | 'escorts' | 'shady'>('rumors');
  
  // Randomly generate between 1 and 5 overheard tips
  const generateRandomTips = (): string[] => {
    const count = Math.floor(Math.random() * 5) + 1; // 1 to 5 tips
    const shuffled = [...SPACEPORT_RUMORS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [overheardTips, setOverheardTips] = useState<string[]>(() => generateRandomTips());
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);
  const [drinksBought, setDrinksBought] = useState<number>(0);

  // Synth-ale purchase: 20 credits to eavesdrop on neighboring tables & refresh tips
  const handleBuySynthAle = () => {
    if (onSpendCredits(20)) {
      sound.playCredit();
      setDrinksBought((prev) => prev + 1);
      
      // If there are more tips in the current batch, advance to next, or roll fresh 1-5 tips
      if (activeTipIndex < overheardTips.length - 1) {
        setActiveTipIndex((prev) => prev + 1);
      } else {
        const fresh = generateRandomTips();
        setOverheardTips(fresh);
        setActiveTipIndex(0);
      }
    } else {
      sound.playAlert();
    }
  };

  const handleNextTip = () => {
    sound.playSelect();
    setActiveTipIndex((prev) => (prev + 1) % overheardTips.length);
  };

  const handlePrevTip = () => {
    sound.playSelect();
    setActiveTipIndex((prev) => (prev - 1 + overheardTips.length) % overheardTips.length);
  };

  return (
    <div className="space-y-4">
      {/* Visual Cantina Header - Clean & Atmospheric */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 h-36 sm:h-40 bg-black group shadow-xl">
        <img
          src={getStellarObjectImage(planet)}
          alt={`${planet.name} Spaceport Bar`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover md:object-contain object-center group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        <div className="absolute top-2.5 left-3 bg-slate-950/90 border border-amber-500/50 px-2.5 py-1 rounded text-[10px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
          <Wine className="w-3 h-3 text-amber-400" />
          <span>{planet.name} Spaceport Cantina</span>
        </div>

        <div className="absolute bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
              {planet.name} Surface Facility · Social & Intel Exchange
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-slate-100 uppercase tracking-wide">
              {planet.name} Spaceport Bar
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono bg-slate-950/90 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{overheardTips.length} Table{overheardTips.length > 1 ? 's' : ''} Active</span>
          </div>
        </div>
      </div>

      {/* Bar Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            sound.playMenu();
            setActiveTab('rumors');
          }}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'rumors'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Overheard Tips ({overheardTips.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setActiveTab('escorts');
          }}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'escorts'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Hire Escorts ({player.escorts.length} Active)</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setActiveTab('shady');
          }}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'shady'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Backroom Contacts</span>
        </button>
      </div>

      {/* Tab 1: Rumors & Overheard Spacer Lore */}
      {activeTab === 'rumors' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-4">
            {/* Top diagnostic and pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Wine className="w-3.5 h-3.5" />
                  Overheard Spacer Tip {activeTipIndex + 1} of {overheardTips.length}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {drinksBought > 0 ? `${drinksBought} Ale Bought` : 'Sober'}
                </span>
              </div>

              {/* Navigation controls if more than 1 tip */}
              {overheardTips.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevTip}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                    title="Previous Tip"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-[11px] text-amber-300 font-semibold">
                    {activeTipIndex + 1} / {overheardTips.length}
                  </span>
                  <button
                    onClick={handleNextTip}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                    title="Next Tip"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Tip Quote Display */}
            <div className="p-4 bg-slate-950/90 rounded border border-amber-500/30 min-h-[90px] flex items-center shadow-inner">
              <p className="text-sm md:text-base text-slate-200 font-sans italic leading-relaxed pl-3 border-l-2 border-amber-400">
                "{overheardTips[activeTipIndex]}"
              </p>
            </div>

            {/* Clean Bartender Station & Synth-Ale Order Control */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Wine className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-200 block">
                    Cantina Bar Counter
                  </span>
                  <p className="text-[11px] font-sans text-slate-400">
                    {drinksBought > 0 
                      ? 'The synth-ale is flowing. Order another round to eavesdrop on neighboring tables.'
                      : 'Patrons keep quiet around dry glasses. Buy a round of synth-ale to uncover spacer intel.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end shrink-0">
                <button
                  onClick={handleBuySynthAle}
                  disabled={player.credits < 20}
                  className={`px-4 py-2 font-display font-semibold text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-md ${
                    player.credits >= 20
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Wine className="w-3.5 h-3.5" />
                  <span>Order Synth-Ale (20 Cr)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Local planetary atmosphere flavor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900/40 border border-slate-800 p-3 rounded">
              <span className="text-slate-400 uppercase text-[10px] block">LOCAL JURISDICTION</span>
              <span className="text-slate-200 font-medium">{system.faction} Military Police</span>
              <p className="text-slate-400 font-sans text-xs mt-1">
                {system.security === 'High'
                  ? 'Strict customs scans active at landing gates. Contraband will result in immediate impound fines.'
                  : system.security === 'Anarchy'
                  ? 'No law enforcement presence. Watch your back and keep your particle blasters charged.'
                  : 'Moderate patrols. Minor contraband checks on heavy freighters.'}
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-3 rounded">
              <span className="text-slate-400 uppercase text-[10px] block">SPACER ADVICE</span>
              <span className="text-amber-300 font-medium">Hyperlane Navigation</span>
              <p className="text-slate-400 font-sans text-xs mt-1">
                Refuel your hyperspace drive before launching. The bank or port authority refuels for nominal fees.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Escorts & Mercenary Wingmen */}
      {activeTab === 'escorts' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-mono">
            Hire mercenary combat pilots to fly in formation with your ship. Escorts assist in tabletop dogfights and deter pirate ambushes.
          </div>

          <div className="grid grid-cols-1 gap-3">
            {ESCORT_WINGMEN.map((escort) => {
              const isHired = player.escorts.some((e) => e.id === escort.id);

              return (
                <div
                  key={escort.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isHired
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-slate-100">{escort.name}</span>
                        <span className="text-xs font-mono text-cyan-400">"{escort.callsign}"</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {escort.shipModel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 italic">"{escort.dialogue}"</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right text-xs font-mono">
                        <span className="text-amber-400 font-bold">{escort.dailyWage} Cr</span>
                        <span className="text-slate-500 block text-[10px]">Per Day</span>
                      </div>

                      {isHired ? (
                        <button
                          onClick={() => {
                            sound.playSelect();
                            onDismissEscort(escort.id);
                          }}
                          className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono rounded cursor-pointer transition-colors"
                        >
                          Dismiss Escort
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (player.credits >= escort.dailyWage) {
                              sound.playCredit();
                              onHireEscort(escort);
                            } else {
                              sound.playAlert();
                            }
                          }}
                          disabled={player.credits < escort.dailyWage}
                          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Contract Escort</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Backroom Contacts */}
      {activeTab === 'shady' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-sm font-display font-bold text-rose-400 uppercase tracking-wide">
                Cloaked Figure in Corner Booth
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              "Looking to make real credits, Captain? The Confederation tariffs in Sol bleed honest traders dry. 
              Load up on Unregistered Particle Blasters or Starlight Narcotics at Tartarus, slip past the radar net with a Sensor-Shielded Hold, and you will be wealthy enough to purchase a Kestrel Battlecruiser."
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              Check the <span className="text-cyan-400 font-semibold">Mission Computer</span> for high-paying Covert Consignment contracts.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
