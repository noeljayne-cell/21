import React, { useState, useEffect } from 'react';
import { StellarObject, StarSystem, PlayerState, EscortWingman } from '../types/game';
import { SPACEPORT_RUMORS, ESCORT_WINGMEN } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { 
  Wine, 
  Users, 
  MessageSquareQuote, 
  ChevronRight, 
  ChevronLeft, 
  UserPlus, 
  Sparkles, 
  Radio, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { SectionEditButton } from './SectionEditButton';

interface SpaceportBarProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onHireEscort: (escort: EscortWingman) => void;
  onDismissEscort: (escortId: string) => void;
  onSpendCredits: (amount: number) => void;
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
  
  // Random overheard tips count between 1 and 5
  const [overheardTips, setOverheardTips] = useState<string[]>([]);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [drinksBought, setDrinksBought] = useState(0);

  // Initialize randomized 1-5 overheard tips on planet visit
  useEffect(() => {
    // Generate random number of tips between 1 and 5
    const count = Math.floor(Math.random() * 5) + 1;
    // Shuffle rumors pool
    const shuffled = [...SPACEPORT_RUMORS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    setOverheardTips(selected);
    setActiveTipIndex(0);
  }, [planet.id]);

  const handleNextTip = () => {
    sound.playSelect();
    setActiveTipIndex((prev) => (prev + 1) % overheardTips.length);
  };

  const handlePrevTip = () => {
    sound.playSelect();
    setActiveTipIndex((prev) => (prev - 1 + overheardTips.length) % overheardTips.length);
  };

  const handleBuySynthAle = () => {
    if (player.credits >= 20) {
      sound.playCredit();
      onSpendCredits(20);
      setDrinksBought((prev) => prev + 1);

      // Generating a fresh batch of 1-5 randomized rumors
      const newCount = Math.floor(Math.random() * 5) + 1;
      const shuffled = [...SPACEPORT_RUMORS].sort(() => 0.5 - Math.random());
      setOverheardTips(shuffled.slice(0, newCount));
      setActiveTipIndex(0);
    } else {
      sound.playAlert();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 select-none w-full min-w-0">
      
      {/* ========================================================
          1. TOP LOCATION BAR: Clean, spacious panel with no redundant artwork
          ======================================================== */}
      <div className="ev-panel rounded-xl p-4 sm:p-5 shadow-xl border border-slate-800 bg-[#070b13]/98 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5 min-w-0">
          {/* Top metadata breadcrumb with fixed, clean text spacing */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1.5">
              <Wine className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{planet.name} Spaceport Cantina</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal">{planet.name} Surface Facility</span>
          </div>

          {/* Main title */}
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-100 uppercase tracking-wide truncate">
            {planet.name} Spaceport Bar
          </h2>

          {/* Operational purpose & jurisdiction tag */}
          <div className="text-xs font-mono text-slate-400 tracking-wide flex flex-wrap items-center gap-2">
            <span>Social &amp; Galactic Intel Exchange</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400">{system.faction} Core Sector</span>
          </div>
        </div>

        {/* Status indicator on right + Section Edit Button */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <SectionEditButton label="Edit Header" />
          <div className="flex items-center gap-2 text-xs font-mono bg-black/80 px-3.5 py-2 rounded-lg border border-slate-800 text-slate-300 shadow-sm">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="font-bold text-amber-300">{overheardTips.length}</span>
            <span className="text-slate-400">Patron Table{overheardTips.length > 1 ? 's' : ''} Active</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. BAR SUB-TABS: Responsive Grid to prevent any clipping on tablet or mobile
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-slate-800 pb-3 text-xs sm:text-sm font-mono w-full">
        <button
          onClick={() => {
            sound.playMenu();
            setActiveTab('rumors');
          }}
          className={`px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center w-full min-w-0 truncate ${
            activeTab === 'rumors'
              ? 'ev-btn-amber shadow-md'
              : 'ev-btn text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="truncate">Overheard Tips ({overheardTips.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setActiveTab('escorts');
          }}
          className={`px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center w-full min-w-0 truncate ${
            activeTab === 'escorts'
              ? 'ev-btn-amber shadow-md'
              : 'ev-btn text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 shrink-0 text-cyan-400" />
          <span className="truncate">Hire Escorts ({player.escorts.length} Active)</span>
        </button>

        <button
          onClick={() => {
            sound.playMenu();
            setActiveTab('shady');
          }}
          className={`px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center w-full min-w-0 truncate ${
            activeTab === 'shady'
              ? 'ev-btn-amber shadow-md'
              : 'ev-btn text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="truncate">Backroom Contracts</span>
        </button>
      </div>

      {/* ========================================================
          3. TAB 1: OVERHEARD TIPS & SPACER LORE
          Wider box in the center under the title, with long horizontal button below
          ======================================================== */}
      {activeTab === 'rumors' && (
        <div className="space-y-4 w-full">
          <div className="ev-panel p-4 sm:p-6 rounded-xl space-y-4 shadow-xl border border-slate-800 bg-[#070b13]/98 w-full">
            
            {/* Top Diagnostic Title & Pager Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono text-slate-300 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-2 text-amber-300 font-bold">
                  <Wine className="w-4 h-4 text-amber-400" />
                  Overheard Spacer Intelligence
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-300">
                  {drinksBought > 0 ? `${drinksBought} Ale Rounds Bought` : 'Sober'}
                </span>
                <SectionEditButton label="Edit Tips" />
              </div>

              {/* Navigation controls if more than 1 tip */}
              {overheardTips.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevTip}
                    className="ev-btn px-2.5 py-1 text-xs text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Previous Overheard Tip"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <span className="px-2 text-xs sm:text-sm text-amber-300 font-bold font-mono">
                    {activeTipIndex + 1} / {overheardTips.length}
                  </span>
                  <button
                    onClick={handleNextTip}
                    className="ev-btn px-2.5 py-1 text-xs text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Next Overheard Tip"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* WIDER BOX IN THE CENTER UNDER THE TITLE FOR TIP TEXT */}
            <div className="w-full min-h-[140px] sm:min-h-[160px] p-6 sm:p-8 ev-panel-inset rounded-xl border border-amber-500/25 bg-black/70 shadow-inner flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-3xl space-y-3">
                <span className="text-amber-400/60 font-serif text-3xl sm:text-4xl leading-none select-none">“</span>
                <p className="text-base sm:text-lg lg:text-xl text-amber-100 font-sans italic leading-relaxed text-center px-2 sm:px-6">
                  {overheardTips[activeTipIndex]}
                </p>
                <span className="text-amber-400/60 font-serif text-3xl sm:text-4xl leading-none select-none block -mt-2">”</span>
              </div>

              {/* Multiple tips quick dots indicator */}
              {overheardTips.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3 pt-2">
                  {overheardTips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        sound.playSelect();
                        setActiveTipIndex(i);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeTipIndex === i 
                          ? 'w-6 bg-amber-400' 
                          : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      title={`Go to Tip ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* LONG AND HORIZONTAL BUTTON ON THE BOTTOM BELOW THE TIP TEXT */}
            <div className="w-full pt-1 space-y-2">
              <button
                onClick={handleBuySynthAle}
                disabled={player.credits < 20}
                className={`w-full py-3.5 sm:py-4 px-6 font-display font-black text-sm sm:text-base uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-amber-950/40 border border-amber-500/60 ${
                  player.credits >= 20
                    ? 'ev-btn-amber text-slate-950 hover:brightness-110 active:scale-[0.99]'
                    : 'ev-btn opacity-50 text-slate-400 cursor-not-allowed'
                }`}
                title="Order another round of synth-ale to uncover fresh rumors"
              >
                <Wine className="w-5 h-5 text-slate-950 shrink-0" />
                <span>Buy Round of Synth-Ale (20 Cr) — Overhear Fresh Spacer Rumors</span>
              </button>

              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 px-1 gap-2">
                <span>Player Balance: <strong className="text-amber-300">{player.credits.toLocaleString()} Cr</strong></span>
                <span>Synth-Ale loosens spacer tongues across all {overheardTips.length} cantina tables</span>
              </div>
            </div>
          </div>

          {/* Local planetary atmosphere flavor panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
            <div className="ev-panel p-4 rounded-lg space-y-1 bg-[#070b13]/90 border border-slate-800">
              <span className="text-cyan-400 uppercase text-xs font-bold block">LOCAL JURISDICTION</span>
              <span className="text-slate-100 font-semibold text-sm">{system.faction} Military Police</span>
              <p className="text-slate-300 font-sans text-xs sm:text-sm mt-1 leading-relaxed">
                {system.security === 'High'
                  ? 'Strict customs scans active at landing gates. Contraband will result in immediate impound fines.'
                  : system.security === 'Anarchy'
                  ? 'No law enforcement presence. Watch your back and keep your particle blasters charged.'
                  : 'Moderate patrols. Minor contraband checks on heavy freighters.'}
              </p>
            </div>

            <div className="ev-panel p-4 rounded-lg space-y-1 bg-[#070b13]/90 border border-slate-800">
              <span className="text-amber-400 uppercase text-xs font-bold block">SPACER ADVICE</span>
              <span className="text-amber-300 font-semibold text-sm">Hyperlane Navigation</span>
              <p className="text-slate-300 font-sans text-xs sm:text-sm mt-1 leading-relaxed">
                Refuel your hyperspace drive before launching. The bank or port authority refuels for nominal fees, or install a Solar Scoop for free recharge near stars.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. TAB 2: ESCORTS & MERCENARY WINGMEN (Anti-Clipping layout)
          ======================================================== */}
      {activeTab === 'escorts' && (
        <div className="space-y-4 w-full">
          <div className="text-xs sm:text-sm text-slate-300 font-mono ev-panel-inset p-3.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
            <span>Hire mercenary combat pilots to fly in formation with your ship. Escorts assist in tabletop dogfights and deter pirate ambushes.</span>
            <SectionEditButton label="Edit Roster" />
          </div>

          <div className="grid grid-cols-1 gap-3.5 w-full">
            {ESCORT_WINGMEN.map((escort) => {
              const isHired = player.escorts.some((e) => e.id === escort.id);

              return (
                <div
                  key={escort.id}
                  className={`p-4 rounded-xl transition-all w-full min-w-0 ${
                    isHired
                      ? 'ev-panel border-2 border-emerald-500/60 shadow-lg bg-[#070b13]/98'
                      : 'ev-panel bg-[#070b13]/95 border border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 w-full min-w-0">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-black text-base text-slate-100">{escort.name}</span>
                        <span className="text-xs font-mono text-cyan-300 font-bold">"{escort.callsign}"</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-200">
                          {escort.shipModel}
                        </span>
                        {isHired && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 flex items-center gap-1 font-bold">
                            <Check className="w-3 h-3" /> Hired
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans italic leading-relaxed">
                        "{escort.dialogue}"
                      </p>
                    </div>

                    {/* Wage and Action Button - responsive wrapping so button never clips */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                      <div className="text-left md:text-right text-xs font-mono">
                        <span className="text-amber-300 font-black text-sm sm:text-base block">{escort.dailyWage} Cr</span>
                        <span className="text-slate-400 block text-xs">Per Jump Day</span>
                      </div>

                      {isHired ? (
                        <button
                          onClick={() => {
                            sound.playSelect();
                            onDismissEscort(escort.id);
                          }}
                          className="ev-btn py-2 px-3.5 text-xs text-rose-300 hover:text-white cursor-pointer whitespace-nowrap"
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
                          className="ev-btn-cyan py-2.5 px-4 text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
                        >
                          <UserPlus className="w-4 h-4 shrink-0" />
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

      {/* ========================================================
          5. TAB 3: BACKROOM CONTACTS & CONTRACTS
          ======================================================== */}
      {activeTab === 'shady' && (
        <div className="space-y-4 w-full">
          <div className="ev-panel p-5 rounded-xl space-y-3.5 shadow-xl border border-slate-800 bg-[#070b13]/98">
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <h3 className="text-base font-display font-bold text-rose-400 uppercase tracking-wide">
                  Cloaked Figure in Corner Booth
                </h3>
              </div>
              <SectionEditButton label="Edit Dialogue" />
            </div>
            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed ev-panel-inset p-4 rounded-lg border border-slate-800/80">
              "Looking to make real credits, Captain? The Confederation tariffs in Sol bleed honest traders dry. 
              Load up on Unregistered Particle Blasters or Starlight Narcotics at Tartarus, slip past the radar net with a Sensor-Shielded Hold, and you will be wealthy enough to purchase a Kestrel Battlecruiser."
            </p>
            <div className="pt-2 text-xs sm:text-sm font-mono text-slate-300">
              Check the <span className="text-cyan-400 font-bold">Mission Board</span> for high-paying Covert Consignment contracts.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
