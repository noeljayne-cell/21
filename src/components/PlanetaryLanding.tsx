import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Commodity, Ship, OutfitItem, Mission, EscortWingman } from '../types/game';
import { ASSET_IMAGES, generateSystemDossierText, getStellarObjectImage } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import { SpaceportBar } from './SpaceportBar';
import { CommodityExchange } from './CommodityExchange';
import { Shipyard } from './Shipyard';
import { Outfitter } from './Outfitter';
import { MissionComputer } from './MissionComputer';
import { BankTerminal } from './BankTerminal';
import { ShareDossierModal } from './ShareDossierModal';
import { 
  Anchor, 
  Wine, 
  Store, 
  Wrench, 
  Radio, 
  Briefcase, 
  Landmark, 
  Rocket, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Globe,
  Share2,
  Copy,
  Check,
  AlertCircle,
  FileText,
  Fuel,
  Dices,
  Sparkles,
  Zap,
  Crosshair,
  Search,
  RotateCcw
} from 'lucide-react';

interface PlanetaryLandingProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onDepart: () => void;
  onBuyCommodity: (commodity: Commodity, amount: number, pricePerTon: number) => void;
  onSellCommodity: (commodity: Commodity, amount: number, pricePerTon: number) => void;
  onPurchaseShip: (newShip: Ship, netCost: number) => void;
  onBuyOutfit: (outfit: OutfitItem) => void;
  onSellOutfit: (outfitIndex: number) => void;
  onAcceptMission: (mission: Mission) => boolean;
  onCompleteMission: (missionId: string) => void;
  onPlotRouteToSystem: (targetSystemId: string) => void;
  onHireEscort: (escort: EscortWingman) => void;
  onDismissEscort: (escortId: string) => void;
  onTakeLoan: (amount: number) => void;
  onRepayLoan: (amount: number) => void;
  onRefuel: (cost: number) => void;
  onRepairHull: (cost: number) => void;
  onSpendCredits: (amount: number) => boolean;
  onAppendNotes: (notes: string) => void;
}

export const PlanetaryLanding: React.FC<PlanetaryLandingProps> = ({
  planet,
  system,
  player,
  onDepart,
  onBuyCommodity,
  onSellCommodity,
  onPurchaseShip,
  onBuyOutfit,
  onSellOutfit,
  onAcceptMission,
  onCompleteMission,
  onPlotRouteToSystem,
  onHireEscort,
  onDismissEscort,
  onTakeLoan,
  onRepayLoan,
  onRefuel,
  onRepairHull,
  onSpendCredits,
  onAppendNotes,
}) => {
  const [subView, setSubView] = useState<
    'overview' | 'bar' | 'commodities' | 'shipyard' | 'outfitter' | 'missions' | 'bank'
  >('overview');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);

  // Fuel calculation (Fuel available on ALL inhabited worlds)
  const missingFuel = player.currentShip.fuelCapacity - player.currentFuel;
  const hasSolarScoop = player.equippedOutfits.some(o => o.statMod.solarScoop);
  const fuelCostPerUnit = hasSolarScoop ? 0 : 50;
  const totalRefuelCost = missingFuel * fuelCostPerUnit;

  // Uninhabited planet exploration & tabletop story state
  const [expeditionLogs, setExpeditionLogs] = useState<Array<{ id: string; title: string; desc: string; type: string; timestamp: number }>>([]);
  const [isDeployingRover, setIsDeployingRover] = useState(false);
  const [diceRollResult, setDiceRollResult] = useState<{ roll: number; success: boolean; label: string } | null>(null);
  const [surveyLogged, setSurveyLogged] = useState(false);

  const STORY_ENCOUNTERS = [
    {
      title: 'Crashed Pre-Warp Surveyor Probe',
      desc: 'Your survey rover detected an emergency locator transponder half-buried in a crater. The telemetry recorder yields valuable pre-expansion cartographic coordinates (+250 Cr discovery bounty).',
      type: 'salvage',
    },
    {
      title: 'Resonant Xeno-Monolith Foundations',
      desc: 'Towering basalt obelisks etched with harmonic fractals rise from the barren bedrock. Nav sensors record bizarre hyperspace resonance frequencies for your ship journal.',
      type: 'lore',
    },
    {
      title: 'Hidden Smuggler Dead-Drop Vault',
      desc: 'Beneath a disguised thermal blanket in a lava tube, your crew uncovers a waterproof container left by rim outlaws containing sealed credit chits and emergency fuel cells.',
      type: 'cache',
    },
    {
      title: 'Thermal Vent Rare Isotope Crystal Vein',
      desc: 'Spectrometer sweeps locate geothermal fissures rich in high-purity crystalline lanthanides. Mining Guild survey rights logged for a standard discovery fee (+180 Cr).',
      type: 'resource',
    },
    {
      title: 'Derelict Combat Cutter Hull',
      desc: 'The scarred, airless carcass of a derelict military scout lies pinned between jagged ridges. Intact composite armor plating and emergency batteries salvaged.',
      type: 'derelict',
    },
    {
      title: 'Automated Deep Space Distress Echo',
      desc: 'An ancient automated solar buoy loops a fractured audio broadcast from a lone prospector who disappeared eight decades ago. A compelling story hook for your tabletop session.',
      type: 'mystery',
    },
  ];

  const handleDeployRover = () => {
    setIsDeployingRover(true);
    sound.playSelect();
    setTimeout(() => {
      const randomEncounter = STORY_ENCOUNTERS[Math.floor(Math.random() * STORY_ENCOUNTERS.length)];
      sound.playCredit();
      setExpeditionLogs(prev => [
        {
          id: `exp_${Date.now()}`,
          title: randomEncounter.title,
          desc: randomEncounter.desc,
          type: randomEncounter.type,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
      setIsDeployingRover(false);
    }, 500);
  };

  const handleRollDiceCheck = () => {
    sound.playDiceRoll();
    const d20 = Math.floor(Math.random() * 20) + 1;
    const isSuccess = d20 >= 11;
    setDiceRollResult({
      roll: d20,
      success: isSuccess,
      label: isSuccess ? 'SUCCESS (DC 11)' : 'COMPLICATION (DC 11)',
    });
  };

  const handleLogSurveyToNotes = () => {
    sound.playClick(750);
    const text = `\n### [PLANETARY SURVEY] ${planet.name} (${system.name})\n- Type: ${planet.type.toUpperCase()} | Environment: Desolate Uninhabited\n- Surface Readout: ${planet.description}\n- Survey logged by ${player.pilotName} (${player.shipName}) on ${formatGameDate(player.stardate)}.\n`;
    onAppendNotes(text);
    setSurveyLogged(true);
    setTimeout(() => setSurveyLogged(false), 2500);
  };

  const menuItems = [
    { id: 'overview', label: 'Port Overview', icon: Globe, available: true },
    { id: 'bar', label: 'Spaceport Bar', icon: Wine, available: planet.facilities.spaceportBar },
    { id: 'commodities', label: 'Commodity Exchange', icon: Store, available: planet.facilities.commodityExchange },
    { id: 'shipyard', label: 'Shipyard', icon: Wrench, available: planet.facilities.shipyard },
    { id: 'outfitter', label: 'Outfitter Bay', icon: Radio, available: planet.facilities.outfitter },
    { id: 'missions', label: 'Mission Board', icon: Briefcase, available: planet.facilities.missionComputer },
    { id: 'bank', label: 'Bank & Harbor', icon: Landmark, available: planet.facilities.bank },
  ] as const;

  const handleQuickCopy = async () => {
    sound.playCredit();
    const dossierText = generateSystemDossierText(system, planet);
    try {
      await navigator.clipboard.writeText(dossierText);
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col md:flex-row overflow-hidden select-none">
      {/* Spaceport Navigation: Compact top bar on mobile (< md), Full vertical sidebar on tablet/desktop (md+) */}
      <aside className="w-full md:w-64 bg-slate-950/98 md:bg-slate-950/95 border-b md:border-b-0 md:border-r border-cyan-900/40 p-2.5 sm:p-3 md:p-4 flex flex-col justify-between shrink-0 z-20 backdrop-blur-md">
        <div className="space-y-2 md:space-y-4">
          {/* Location Badge & Mobile Depart Button Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="bg-slate-900/80 border border-slate-800 p-2 sm:p-2.5 rounded text-xs font-mono space-y-0.5 flex-1 min-w-0">
              <span className="text-[9px] text-slate-400 block uppercase tracking-wider">SPACEPORT</span>
              <span className="text-xs sm:text-sm font-display font-bold text-cyan-300 uppercase block truncate">
                {planet.name}
              </span>
              <div className="flex items-center justify-between text-[10px] truncate">
                <span className="text-amber-300 truncate">{system.name}</span>
                <span className="text-slate-400 font-sans hidden sm:inline">{system.faction}</span>
              </div>
            </div>

            {/* Quick Share Dossier Action (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-1.5 mt-2">
              <button
                onClick={handleQuickCopy}
                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Copy Spaceport Dossier for Tabletop"
              >
                {quickCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{quickCopied ? 'Copied!' : 'Copy Dossier'}</span>
              </button>
              <button
                onClick={() => {
                  sound.playMenu();
                  setIsShareModalOpen(true);
                }}
                className="p-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 rounded text-cyan-300 cursor-pointer"
                title="Open Full Galactic Directory"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Depart & Orbit Button (< md) */}
            <button
              onClick={() => {
                sound.playLanding();
                onDepart();
              }}
              className="md:hidden px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-slate-950 font-display font-bold text-[11px] uppercase rounded shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Launch ship into orbit"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Depart</span>
            </button>
          </div>

          {/* Navigation Options: Horizontal scroll on mobile, Vertical stack on desktop */}
          <nav className="flex md:flex-col gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = subView === item.id;
              const isAvailable = item.available;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isAvailable) sound.playMenu();
                    else sound.playAlert();
                    setSubView(item.id);
                  }}
                  className={`text-left px-2.5 sm:px-3 py-1.5 sm:py-2 md:py-2.5 rounded font-display tracking-wide uppercase text-[11px] sm:text-xs transition-all flex items-center justify-between gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-semibold'
                      : isAvailable
                      ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                      : 'text-slate-500 hover:bg-slate-900/40 border border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-cyan-400' : isAvailable ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={!isAvailable ? 'line-through' : ''}>{item.label}</span>
                  </div>
                  {!isAvailable && (
                    <span className="text-[8px] sm:text-[9px] font-mono uppercase text-slate-500 px-1 rounded bg-slate-900">
                      Closed
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Depart Action Button (Desktop & Tablet only) */}
        <div className="hidden md:block pt-3 border-t border-slate-800 mt-2">
          <button
            onClick={() => {
              sound.playLanding();
              onDepart();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-display font-bold text-xs uppercase rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Depart & Enter Orbit</span>
          </button>
        </div>
      </aside>

      {/* Main Spaceport Facility Content Area */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar p-4 md:p-6 bg-slate-950">
        {/* SUB-VIEW 1: OVERVIEW */}
        {subView === 'overview' && (
          <div className="max-w-4xl space-y-5">
            {/* Authentic Original Escape Velocity Planetary Landing Visual */}
            <div className="relative rounded-xl overflow-hidden border-2 border-cyan-800/60 bg-slate-950 group shadow-2xl">
              <div className="relative h-64 md:h-80 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={getStellarObjectImage(planet)}
                  alt={planet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover md:object-contain object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                
                {/* Vintage Mac EV Art Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/90 border border-cyan-500/50 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Original EV (1996) Landing Art</span>
                </div>
              </div>
              
              <div className="p-4 md:p-5 bg-slate-900/90 border-t border-slate-800 space-y-3">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Orbital Clearance Confirmed · {formatGameDate(player.stardate)}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-wide">
                      {planet.name}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      Tier {system.techLevel} Tech
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-950 text-amber-300 border border-slate-800">
                      {system.security} Security
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick(600);
                        setIsShareModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share Port</span>
                    </button>
                  </div>
                </div>

                {/* Verbatim Original Planetary Description Text */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>Spaceport Log & Dossier</span>
                  </div>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">
                    {planet.description}
                  </p>
                </div>
              </div>
            </div>

            {/* INHABITED WORLDS: Official Spaceport Fuel Depot & Facility Cards */}
            {planet.habitable ? (
              <>
                {/* Official Spaceport Hyperdrive Fuel Depot (Guaranteed on ALL inhabited planets) */}
                <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
                      <Fuel className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-cyan-300 uppercase tracking-wide">
                          Spaceport Hyperdrive Fuel Depot
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 font-bold">
                          ACTIVE PUMP
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">
                        Reserve: <strong className="text-amber-300 font-bold">{player.currentFuel}</strong> / {player.currentShip.fuelCapacity} Jumps
                        {missingFuel > 0 ? (
                          <span className="text-slate-400"> · Tariff: {hasSolarScoop ? 'Free (Solar Scoop)' : `${totalRefuelCost} Cr (${fuelCostPerUnit} Cr/Jump)`}</span>
                        ) : (
                          <span className="text-emerald-400"> · Hyperdrive tanks at full operational capacity</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (missingFuel > 0 && player.credits >= totalRefuelCost) {
                        sound.playFuel();
                        onRefuel(totalRefuelCost);
                      } else if (missingFuel > 0) {
                        sound.playAlert();
                      }
                    }}
                    disabled={missingFuel <= 0 || player.credits < totalRefuelCost}
                    className={`px-4 py-2.5 rounded-lg font-display text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
                      missingFuel <= 0
                        ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-default'
                        : player.credits >= totalRefuelCost
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/60 cursor-not-allowed'
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                    <span>
                      {missingFuel <= 0
                        ? 'Tanks Full (100%)'
                        : player.credits < totalRefuelCost
                        ? `Need ${totalRefuelCost} Cr`
                        : `Refuel Hyperdrive (${totalRefuelCost} Cr)`}
                    </span>
                  </button>
                </div>

                {/* Planetary Spaceport Facilities Card Grid (Classic Escape Velocity Tablet Layout) */}
                <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-cyan-400">
                  SPACEPORT FACILITIES // {planet.name.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400">Tap any available facility to enter</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Bar */}
                <button
                  onClick={() => {
                    if (planet.facilities.spaceportBar) {
                      sound.playClick(600);
                      setSubView('bar');
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={!planet.facilities.spaceportBar}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                    planet.facilities.spaceportBar
                      ? 'bg-slate-900/80 hover:bg-slate-800/90 border-amber-500/40 hover:border-amber-400/70 shadow-lg hover:shadow-amber-950/20 cursor-pointer group'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${planet.facilities.spaceportBar ? 'bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform' : 'bg-slate-800 text-slate-600'}`}>
                        <Wine className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                          Spaceport Bar
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Cantina & Contacts
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      planet.facilities.spaceportBar
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {planet.facilities.spaceportBar ? 'OPEN' : 'NONE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2">
                    {planet.facilities.spaceportBar
                      ? 'Eavesdrop on spacer rumors with 20 Cr synth-ale and hire escort wingmen.'
                      : 'No tavern or pilots lounge operating at this outpost.'}
                  </p>
                </button>

                {/* 2. Commodities */}
                <button
                  onClick={() => {
                    if (planet.facilities.commodityExchange) {
                      sound.playClick(600);
                      setSubView('commodities');
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={!planet.facilities.commodityExchange}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                    planet.facilities.commodityExchange
                      ? 'bg-slate-900/80 hover:bg-slate-800/90 border-emerald-500/40 hover:border-emerald-400/70 shadow-lg hover:shadow-emerald-950/20 cursor-pointer group'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${planet.facilities.commodityExchange ? 'bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform' : 'bg-slate-800 text-slate-600'}`}>
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                          Commodity Exchange
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Trade Clearinghouse
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      planet.facilities.commodityExchange
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {planet.facilities.commodityExchange ? 'ACTIVE' : 'NONE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2">
                    {planet.facilities.commodityExchange
                      ? 'Buy and sell regional commodities, industrial ores, food, and contraband.'
                      : 'No commercial freight exchange established at this port.'}
                  </p>
                </button>

                {/* 3. Shipyard */}
                <button
                  onClick={() => {
                    if (planet.facilities.shipyard) {
                      sound.playClick(600);
                      setSubView('shipyard');
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={!planet.facilities.shipyard}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                    planet.facilities.shipyard
                      ? 'bg-slate-900/80 hover:bg-slate-800/90 border-cyan-500/40 hover:border-cyan-400/70 shadow-lg hover:shadow-cyan-950/20 cursor-pointer group'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${planet.facilities.shipyard ? 'bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform' : 'bg-slate-800 text-slate-600'}`}>
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                          Shipyard
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Naval Drydocks & Hull Visuals
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      planet.facilities.shipyard
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {planet.facilities.shipyard ? 'DRYDOCK' : 'NONE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2">
                    {planet.facilities.shipyard
                      ? 'Inspect original EV ship graphics, trade-in your hull, and commission new starships.'
                      : 'No shipbuilding gantries or drydock facilities available here.'}
                  </p>
                </button>

                {/* 4. Outfitter */}
                <button
                  onClick={() => {
                    if (planet.facilities.outfitter) {
                      sound.playClick(600);
                      setSubView('outfitter');
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={!planet.facilities.outfitter}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                    planet.facilities.outfitter
                      ? 'bg-slate-900/80 hover:bg-slate-800/90 border-purple-500/40 hover:border-purple-400/70 shadow-lg hover:shadow-purple-950/20 cursor-pointer group'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${planet.facilities.outfitter ? 'bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform' : 'bg-slate-800 text-slate-600'}`}>
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                          Outfitter Bay
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Weapons & Upgrades
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      planet.facilities.outfitter
                        ? 'bg-purple-950 text-purple-300 border border-purple-600/50'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {planet.facilities.outfitter ? 'HARDWARE' : 'NONE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2">
                    {planet.facilities.outfitter
                      ? 'Purchase laser cannons, pulse beams, missile racks, shields, and cargo expansions.'
                      : 'No avionics or weapons modification workshops at this station.'}
                  </p>
                </button>

                {/* 5. Mission Board */}
                <button
                  onClick={() => {
                    if (planet.facilities.missionComputer) {
                      sound.playClick(600);
                      setSubView('missions');
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={!planet.facilities.missionComputer}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                    planet.facilities.missionComputer
                      ? 'bg-slate-900/80 hover:bg-slate-800/90 border-blue-500/40 hover:border-blue-400/70 shadow-lg hover:shadow-blue-950/20 cursor-pointer group'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${planet.facilities.missionComputer ? 'bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform' : 'bg-slate-800 text-slate-600'}`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                          Mission Board
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Logistics & Bounties
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      planet.facilities.missionComputer
                        ? 'bg-blue-950 text-blue-300 border border-blue-600/50'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {planet.facilities.missionComputer ? 'CONTRACTS' : 'NONE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2">
                    {planet.facilities.missionComputer
                      ? 'Accept freight deliveries, VIP passenger charters, and bounty hunting contracts.'
                      : 'No logistics dispatcher network operating from this terminal.'}
                  </p>
                </button>

                {/* 6. Bank */}
                <button
                  onClick={() => {
                    if (planet.facilities.bank) {
                      sound.playClick(600);
                      setSubView('bank');
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={!planet.facilities.bank}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                    planet.facilities.bank
                      ? 'bg-slate-900/80 hover:bg-slate-800/90 border-amber-500/40 hover:border-amber-400/70 shadow-lg hover:shadow-amber-950/20 cursor-pointer group'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${planet.facilities.bank ? 'bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform' : 'bg-slate-800 text-slate-600'}`}>
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                          Bank & Harbor
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Credit, Refuel & Repair
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      planet.facilities.bank
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {planet.facilities.bank ? 'SERVICES' : 'NONE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2">
                    {planet.facilities.bank
                      ? 'Refuel hyperdrive, weld armor plates, and access 5%–10% variable commercial credit.'
                      : 'Outside the First Interstellar Bank clearinghouse network.'}
                  </p>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* UNINHABITED PLANET STORY EXPEDITION TERMINAL */
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-4 space-y-3 shadow-2xl">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    UNINHABITED PLANETARY EXPEDITION // STORY SURVEY SITE
                  </span>
                  <h3 className="text-lg font-display font-bold text-slate-100 uppercase tracking-wide mt-0.5">
                    Surface Reconnaissance & Deep Sensor Analysis
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-600/50 text-[10px] font-mono font-bold uppercase shrink-0">
                  DESOLATE WORLD
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                This celestial body lacks civilian spaceport infrastructure. The hostile, airless surface affords rich tabletop exploration opportunities, salvage discoveries, and hidden lore remnants from across the galaxy.
              </p>

              {/* Environmental Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                  <span className="text-[10px] text-slate-500 block">ATMOSPHERE</span>
                  <span className="text-slate-200 font-semibold">{planet.atmosphereColor ? 'Toxic Nitrogen / Argon' : 'Vacuum Hard Vacuum'}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                  <span className="text-[10px] text-slate-500 block">SURFACE RADIATION</span>
                  <span className="text-amber-400 font-semibold">1.42 mSv/hr</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                  <span className="text-[10px] text-slate-500 block">SURFACE GRAVITY</span>
                  <span className="text-cyan-400 font-semibold">0.38 G Earth-Norm</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                  <span className="text-[10px] text-slate-500 block">EXPEDITION STATUS</span>
                  <span className="text-emerald-400 font-semibold">SURVEY READY</span>
                </div>
              </div>

              {/* Interactive Tabletop Expedition Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2.5">
                {/* Deploy Rover */}
                <button
                  onClick={handleDeployRover}
                  disabled={isDeployingRover}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs uppercase rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Crosshair className={`w-4 h-4 ${isDeployingRover ? 'animate-spin' : ''}`} />
                  <span>{isDeployingRover ? 'Scanning Surface...' : 'Deploy Recon Rover / EVA Team'}</span>
                </button>

                {/* Tabletop d20 Check */}
                <button
                  onClick={handleRollDiceCheck}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs rounded-lg border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                  title="Roll d20 Survival / Exploration check"
                >
                  <Dices className="w-4 h-4 text-amber-400" />
                  <span>Roll Survival d20</span>
                </button>

                {/* Emergency Fuel Siphon */}
                {missingFuel > 0 && (
                  <button
                    onClick={() => {
                      sound.playFuel();
                      onRefuel(0); // Emergency geothermal siphon restores fuel jump
                    }}
                    className="px-3.5 py-2.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-mono text-xs rounded-lg flex items-center gap-2 cursor-pointer"
                    title="Emergency isotope siphon for stranded pilots"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Emergency Fuel Siphon (+1 Jump)</span>
                  </button>
                )}

                {/* Log to Tabletop Notes */}
                <button
                  onClick={handleLogSurveyToNotes}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 font-mono text-xs rounded-lg flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                >
                  {surveyLogged ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{surveyLogged ? 'Survey Logged!' : 'Log to Campaign Journal'}</span>
                </button>
              </div>

              {/* Dice Roll Result Display */}
              {diceRollResult && (
                <div className="bg-slate-950/90 border border-amber-500/40 rounded p-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-400">TABLETOP D20 CHECK:</span>
                    <strong className="text-slate-100 text-sm">Rolled {diceRollResult.roll}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    diceRollResult.success 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/50' 
                      : 'bg-amber-950 text-amber-400 border border-amber-600/50'
                  }`}>
                    {diceRollResult.label}
                  </span>
                </div>
              )}
            </div>

            {/* Expedition Encounter Results Stream */}
            {expeditionLogs.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  SURFACE RECON DISCOVERIES & TELEMETRY ({expeditionLogs.length})
                </span>
                <div className="space-y-2">
                  {expeditionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-lg space-y-1.5 font-sans"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-display font-bold text-sm text-cyan-300 uppercase tracking-wide flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          {log.title}
                        </h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 uppercase">
                          {log.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {log.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

            {/* Lore Description Prose */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Planetary Archive Dossier
              </h3>
              <p className="text-sm md:text-base text-slate-200 font-sans leading-relaxed">
                {planet.description}
              </p>
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-500">Government: </span>
                  <strong className="text-slate-200">{system.faction}</strong>
                </div>
                <div>
                  <span className="text-slate-500">System: </span>
                  <strong className="text-slate-200">{system.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Sector: </span>
                  <strong className="text-slate-200">{system.sector}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Stellar Class: </span>
                  <strong className="text-slate-200">{system.stellarClass}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: SPACEPORT BAR */}
        {subView === 'bar' && (
          planet.facilities.spaceportBar ? (
            <SpaceportBar
              planet={planet}
              system={system}
              player={player}
              onHireEscort={onHireEscort}
              onDismissEscort={onDismissEscort}
              onSpendCredits={onSpendCredits}
            />
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200 uppercase">No Spaceport Cantina Available</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {planet.name} is a remote or restricted station without open tavern facilities. Spacers looking for rumors and escorts should visit Core or Independent colonies.
              </p>
            </div>
          )
        )}

        {/* SUB-VIEW 3: COMMODITIES */}
        {subView === 'commodities' && (
          planet.facilities.commodityExchange ? (
            <CommodityExchange
              planet={planet}
              system={system}
              player={player}
              onBuyCommodity={onBuyCommodity}
              onSellCommodity={onSellCommodity}
            />
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200 uppercase">No Commodity Exchange at this Port</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {planet.name} does not operate open freight clearinghouses. Bulk trade cargo cannot be bought or sold here.
              </p>
            </div>
          )
        )}

        {/* SUB-VIEW 4: SHIPYARD */}
        {subView === 'shipyard' && (
          planet.facilities.shipyard ? (
            <Shipyard
              planet={planet}
              system={system}
              player={player}
              onPurchaseShip={onPurchaseShip}
            />
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-cyan-400 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200 uppercase">No Naval Shipyard at this Port</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {planet.name} does not possess starship fabrication gantries. To purchase starships or trade in your vessel, visit major naval centers on <strong>Sol, Sirius, Capella, Regulus, or Tartarus</strong>.
              </p>
            </div>
          )
        )}

        {/* SUB-VIEW 5: OUTFITTER */}
        {subView === 'outfitter' && (
          planet.facilities.outfitter ? (
            <Outfitter
              planet={planet}
              system={system}
              player={player}
              onBuyOutfit={onBuyOutfit}
              onSellOutfit={onSellOutfit}
            />
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-purple-400 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200 uppercase">No Outfitter Bay Available</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {planet.name} does not have weapons mounting racks or deflector modification bays.
              </p>
            </div>
          )
        )}

        {/* SUB-VIEW 6: MISSIONS */}
        {subView === 'missions' && (
          planet.facilities.missionComputer ? (
            <MissionComputer
              planet={planet}
              system={system}
              player={player}
              onAcceptMission={onAcceptMission}
              onCompleteMission={onCompleteMission}
              onPlotRouteToSystem={onPlotRouteToSystem}
            />
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-blue-400 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200 uppercase">No Mission Dispatch Terminal</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No active logistics dispatchers operate out of {planet.name}.
              </p>
            </div>
          )
        )}

        {/* SUB-VIEW 7: BANK */}
        {subView === 'bank' && (
          planet.facilities.bank ? (
            <BankTerminal
              planet={planet}
              system={system}
              player={player}
              onTakeLoan={onTakeLoan}
              onRepayLoan={onRepayLoan}
              onRefuel={onRefuel}
              onRepairHull={onRepairHull}
            />
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200 uppercase">No Commercial Banking Branch</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {planet.name} is outside the First Interstellar Bank clearinghouse network. To take out or repay loans, travel to Confederation Core or Guild worlds.
              </p>
            </div>
          )
        )}
      </main>

      {/* Share Spaceport Dossier Modal */}
      <ShareDossierModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        system={system}
        landedObject={planet}
        onAppendNotes={onAppendNotes}
      />
    </div>
  );
};
