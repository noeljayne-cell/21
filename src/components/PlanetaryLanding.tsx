import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Commodity, Ship, OutfitItem, Mission, EscortWingman } from '../types/game';
import { ASSET_IMAGES, getStellarObjectImage } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import { SpaceportBar } from './SpaceportBar';
import { CommodityExchange } from './CommodityExchange';
import { Shipyard } from './Shipyard';
import { Outfitter } from './Outfitter';
import { MissionComputer } from './MissionComputer';
import { BankTerminal } from './BankTerminal';
import { ShareDossierModal } from './ShareDossierModal';
import { SectionEditButton } from './SectionEditButton';
import { 
  ShieldCheck, 
  Fuel, 
  Dices, 
  Sparkles, 
  FileText,
  ExternalLink
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
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

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

  const handleDirectRefuel = () => {
    if (missingFuel > 0 && player.credits >= totalRefuelCost) {
      sound.playFuel();
      onRefuel(totalRefuelCost);
    } else if (missingFuel > 0) {
      sound.playAlert();
    }
  };

  // Facility navigation buttons: 2 per row across 4 rows
  const facilityButtons = [
    { id: 'overview', label: 'Port Overview', available: true },
    { id: 'bar', label: 'Spaceport Bar', available: planet.facilities.spaceportBar },
    { id: 'commodities', label: 'Commodities', available: planet.facilities.commodityExchange },
    { id: 'shipyard', label: 'Shipyard', available: planet.facilities.shipyard },
    { id: 'outfitter', label: 'Outfitter Bay', available: planet.facilities.outfitter },
    { id: 'missions', label: 'Mission Board', available: planet.facilities.missionComputer },
    { id: 'bank', label: 'Bank & Harbor', available: planet.facilities.bank },
  ] as const;

  return (
    <div className="w-full h-full bg-[#050810]/95 text-slate-100 flex flex-col overflow-y-auto no-scrollbar select-none p-3 sm:p-4 md:p-5 lg:p-6 relative">
      {/* Background Starfield Layer */}
      <div className="cosmic-starfield z-0 opacity-60 pointer-events-none">
        <div className="stars-layer-1" />
        <div className="stars-layer-2" />
      </div>

      {/* Docked Spaceport Workspace */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-start relative z-10">
        
        {/* ========================================================
            LEFT COLUMN: Prominent Artwork & 2-per-row Buttons Below
            ======================================================== */}
        <section className="w-full lg:w-[48%] xl:w-[50%] shrink-0 flex flex-col space-y-3">
          
          {/* Prominent Art Box below Command Bar */}
          <div className="relative w-full rounded-xl overflow-hidden bg-black border-2 border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.9)] group">
            {/* Cinematic viewport monitor */}
            <div className="relative w-full h-60 sm:h-72 md:h-84 lg:h-92 flex items-center justify-center bg-black overflow-hidden">
              <img
                src={getStellarObjectImage(planet)}
                alt={planet.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Combined Location Breadcrumb & Port Name over TOP LEFT of the image (Non-redundant) */}
              <div className="absolute top-3 left-3 bg-[#03060c]/92 border border-slate-700/80 px-3 sm:px-3.5 py-1.5 rounded shadow-xl backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
                <span className="text-amber-300 font-mono text-xs sm:text-sm font-semibold tracking-wide">
                  {system.name}
                </span>
                <span className="text-slate-500 font-mono text-xs">/</span>
                <span className="font-display font-black text-sm sm:text-base md:text-lg text-white uppercase tracking-wider">
                  {planet.name}
                </span>
                <SectionEditButton label="Edit" className="ml-1" />
              </div>
            </div>
          </div>

          {/* Buttons directly beneath the art: 20% taller, 100% wider (2 per row, 4 rows), lighter grey + Refuel & Depart */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Operational Facilities</span>
              <SectionEditButton label="Edit Buttons" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {facilityButtons.map((item) => {
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
                    disabled={!isAvailable}
                    className={`h-9 sm:h-10 md:h-10.5 px-3 rounded font-display font-bold uppercase tracking-wider text-xs sm:text-xs transition-all flex items-center justify-center cursor-pointer text-center truncate ${
                      isActive
                        ? 'ev-port-btn-active ring-1 ring-cyan-400/80 shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                        : isAvailable
                        ? 'ev-port-btn hover:text-white'
                        : 'ev-port-btn opacity-40 cursor-not-allowed text-slate-400'
                    }`}
                    title={isAvailable ? `Open ${item.label}` : `${item.label} (Offline at this port)`}
                  >
                    <span className="whitespace-nowrap truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {/* Refuel Button: Added to these menu buttons in the 4th row (lighter gray) */}
              <button
                onClick={handleDirectRefuel}
                disabled={missingFuel <= 0 || player.credits < totalRefuelCost}
                className={`h-9 sm:h-10 md:h-10.5 px-3 rounded font-display font-bold uppercase tracking-wider text-xs sm:text-xs transition-all flex items-center justify-center cursor-pointer text-center truncate ${
                  missingFuel <= 0
                    ? 'ev-port-btn opacity-60 text-slate-400 cursor-default'
                    : player.credits >= totalRefuelCost
                    ? 'ev-port-btn hover:text-white border-cyan-500/60'
                    : 'ev-port-btn opacity-50 text-rose-300 cursor-not-allowed'
                }`}
                title={missingFuel <= 0 ? 'Tanks already full' : `Refuel hyperdrive tanks for ${totalRefuelCost} Cr`}
              >
                <span className="whitespace-nowrap truncate w-full text-center">
                  {missingFuel <= 0 ? 'Tanks Full' : `Refuel (${totalRefuelCost} Cr)`}
                </span>
              </button>

              {/* Depart Button: 20% taller, 100% wider spanning across, keeping original amber colors */}
              <button
                onClick={() => {
                  sound.playLanding();
                  onDepart();
                }}
                className="col-span-2 h-9 sm:h-10 md:h-10.5 px-4 rounded font-display font-black uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer text-center ev-btn-amber shadow-lg truncate"
                title="Launch ship into orbit and enter space"
              >
                <span className="whitespace-nowrap truncate text-slate-950 font-black">
                  Depart &amp; Enter Orbit
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            RIGHT COLUMN: Spaceport Info on top right next to image
            & Active Port Facility Screens (Darkened foreground panels)
            ======================================================== */}
        <section className="flex-1 w-full min-w-0 space-y-4">
          
          {/* If on Port Overview: Spaceport Info featured prominently on top right next to the image */}
          {subView === 'overview' && (
            <div className="space-y-4">
              
              {/* Spaceport Info Header Panel - Darkened foreground panel */}
              <div className="ev-panel rounded-xl p-4 sm:p-5 shadow-2xl border border-slate-800 bg-[#070b13]/98 space-y-4">
                
                {/* 1. Blue "orbital" text on one line instead of two (no icon in front) */}
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider whitespace-nowrap truncate w-full">
                  Orbital Clearance Confirmed · {formatGameDate(player.stardate)}
                </div>

                {/* 2. Directly below it: title expanded to the right and filled out horizontally on one line with section edit button */}
                <div className="flex items-center justify-between gap-3 w-full">
                  <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-wide uppercase whitespace-nowrap truncate">
                    Spaceport information:
                  </h1>
                  <SectionEditButton label="Edit Info" />
                </div>

                {/* 3. Below that: tier, security, and faction boxes evenly spaced in a horizontal layout */}
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">System Specifications</span>
                    <SectionEditButton label="Edit Specs" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                  <div className="ev-panel-inset py-2.5 px-2 sm:px-3 rounded-lg text-center flex flex-col items-center justify-center border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">TECH TIER</span>
                    <span className="text-xs sm:text-sm font-mono text-cyan-300 font-bold truncate w-full mt-0.5">
                      Level {system.techLevel}
                    </span>
                  </div>
                  <div className="ev-panel-inset py-2.5 px-2 sm:px-3 rounded-lg text-center flex flex-col items-center justify-center border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">SECURITY</span>
                    <span className="text-xs sm:text-sm font-mono text-amber-300 font-bold truncate w-full mt-0.5">
                      {system.security}
                    </span>
                  </div>
                  <div className="ev-panel-inset py-2.5 px-2 sm:px-3 rounded-lg text-center flex flex-col items-center justify-center border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">FACTION</span>
                    <span className="text-xs sm:text-sm font-mono text-emerald-300 font-bold truncate w-full mt-0.5">
                      {system.faction}
                    </span>
                  </div>
                </div>

                {/* 4. Below that: spaceport log and planet dossier button */}
                <div className="w-full">
                  <button
                    onClick={() => {
                      sound.playMenu();
                      setIsDossierOpen(true);
                    }}
                    className="w-full py-2.5 sm:py-3 px-4 ev-btn-cyan text-xs sm:text-sm font-display font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border border-cyan-400/50"
                    title="Open Complete Spaceport Log & Planet Dossier"
                  >
                    <FileText className="w-4 h-4 text-cyan-300" />
                    <span>Spaceport Log &amp; Planet Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-300 ml-1" />
                  </button>
                </div>

                {/* Verbatim Planetary Description Text: Spacious, Wide, and Highly Legible */}
                <div className="ev-panel-inset rounded-lg p-3.5 sm:p-4.5 border border-slate-800/80 bg-black/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Surface Briefing</span>
                    <SectionEditButton label="Edit Lore" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                    {planet.description}
                  </p>
                </div>
              </div>

              {/* UNINHABITED WORLDS: Surface Expedition & Survey Tools */}
              {!planet.habitable && (
                <div className="space-y-4">
                  <div className="ev-panel rounded-xl p-4 sm:p-5 border border-slate-800 bg-[#070b13]/98 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-display font-black text-base sm:text-lg text-amber-300 uppercase">
                          Desolate Surface Exploration
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                          Uninhabited frontier world with no spaceport facilities. Deploy remote rovers or log survey telemetry.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <SectionEditButton label="Edit Section" />
                        <button
                          onClick={handleDeployRover}
                          disabled={isDeployingRover}
                          className="ev-btn-cyan px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isDeployingRover ? 'Scanning...' : 'Deploy Survey Rover'}</span>
                        </button>

                        <button
                          onClick={handleRollDiceCheck}
                          className="ev-btn px-3 py-2 text-xs flex items-center gap-1 text-slate-200 cursor-pointer"
                        >
                          <Dices className="w-3.5 h-3.5 text-amber-400" />
                          <span>Roll d20 Check</span>
                        </button>
                      </div>
                    </div>

                    {/* Dice Roll Result */}
                    {diceRollResult && (
                      <div className={`p-3 rounded-lg border flex items-center justify-between text-xs sm:text-sm font-mono ${
                        diceRollResult.success 
                          ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300' 
                          : 'bg-rose-950/80 border-rose-600/60 text-rose-300'
                      }`}>
                        <span>d20 Surface Check: Roll <strong>[{diceRollResult.roll}]</strong></span>
                        <span className="font-bold uppercase">{diceRollResult.label}</span>
                      </div>
                    )}

                    {/* Rover Expedition Log Feed */}
                    {expeditionLogs.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                          Recent Surface Discoveries
                        </span>
                        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                          {expeditionLogs.map((log) => (
                            <div key={log.id} className="ev-panel-inset p-3 rounded-lg text-xs space-y-1">
                              <span className="font-display font-bold text-amber-300 uppercase block">{log.title}</span>
                              <p className="text-slate-200 font-sans leading-relaxed">{log.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Log Survey Notes */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleLogSurveyToNotes}
                        disabled={surveyLogged}
                        className="ev-btn px-4 py-2 text-xs text-cyan-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{surveyLogged ? 'Survey Logged to Notes!' : 'Log Survey to Tabletop Journal'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 2: SPACEPORT BAR */}
          {subView === 'bar' && planet.facilities.spaceportBar && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  SPACEPORT BAR // {planet.name.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setSubView('overview');
                  }}
                  className="ev-btn px-2.5 py-1 text-xs text-slate-300 cursor-pointer"
                >
                  ← Return to Port Overview
                </button>
              </div>

              <SpaceportBar
                planet={planet}
                system={system}
                player={player}
                onHireEscort={onHireEscort}
                onDismissEscort={onDismissEscort}
                onSpendCredits={onSpendCredits}
              />
            </div>
          )}

          {/* SUB-VIEW 3: COMMODITIES */}
          {subView === 'commodities' && planet.facilities.commodityExchange && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  COMMODITY EXCHANGE // {planet.name.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setSubView('overview');
                  }}
                  className="ev-btn px-2.5 py-1 text-xs text-slate-300 cursor-pointer"
                >
                  ← Return to Port Overview
                </button>
              </div>

              <CommodityExchange
                planet={planet}
                system={system}
                player={player}
                onBuyCommodity={onBuyCommodity}
                onSellCommodity={onSellCommodity}
              />
            </div>
          )}

          {/* SUB-VIEW 4: SHIPYARD */}
          {subView === 'shipyard' && planet.facilities.shipyard && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  NAVAL DRYDOCK &amp; SHIPYARD // {planet.name.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setSubView('overview');
                  }}
                  className="ev-btn px-2.5 py-1 text-xs text-slate-300 cursor-pointer"
                >
                  ← Return to Port Overview
                </button>
              </div>

              <Shipyard
                planet={planet}
                system={system}
                player={player}
                onPurchaseShip={onPurchaseShip}
              />
            </div>
          )}

          {/* SUB-VIEW 5: OUTFITTER BAY */}
          {subView === 'outfitter' && planet.facilities.outfitter && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  OUTFITTER BAY &amp; MUNITIONS // {planet.name.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setSubView('overview');
                  }}
                  className="ev-btn px-2.5 py-1 text-xs text-slate-300 cursor-pointer"
                >
                  ← Return to Port Overview
                </button>
              </div>

              <Outfitter
                planet={planet}
                system={system}
                player={player}
                onBuyOutfit={onBuyOutfit}
                onSellOutfit={onSellOutfit}
              />
            </div>
          )}

          {/* SUB-VIEW 6: MISSION COMPUTER */}
          {subView === 'missions' && planet.facilities.missionComputer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  MISSION COMPUTER TERMINAL // {planet.name.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setSubView('overview');
                  }}
                  className="ev-btn px-2.5 py-1 text-xs text-slate-300 cursor-pointer"
                >
                  ← Return to Port Overview
                </button>
              </div>

              <MissionComputer
                planet={planet}
                system={system}
                player={player}
                onAcceptMission={onAcceptMission}
                onCompleteMission={onCompleteMission}
                onPlotRouteToSystem={onPlotRouteToSystem}
              />
            </div>
          )}

          {/* SUB-VIEW 7: BANK & HARBOR */}
          {subView === 'bank' && planet.facilities.bank && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  COMMERCE HARBOR &amp; BANK // {planet.name.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setSubView('overview');
                  }}
                  className="ev-btn px-2.5 py-1 text-xs text-slate-300 cursor-pointer"
                >
                  ← Return to Port Overview
                </button>
              </div>

              <BankTerminal
                planet={planet}
                system={system}
                player={player}
                onTakeLoan={onTakeLoan}
                onRepayLoan={onRepayLoan}
                onRefuel={onRefuel}
                onRepairHull={onRepairHull}
              />
            </div>
          )}
        </section>
      </div>

      {/* Complete Spaceport Log & Planet Dossier Modal */}
      <ShareDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        system={system}
        landedObject={planet}
        onAppendNotes={onAppendNotes}
      />
    </div>
  );
};
