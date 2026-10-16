import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Ship } from '../types/game';
import { SHIPS, getStellarObjectImage } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Wrench, Shield, Zap, Package, Fuel, Crosshair, Compass, Check, AlertCircle, ArrowDownUp, Sparkles } from 'lucide-react';
import { SectionEditButton } from './SectionEditButton';

interface ShipyardProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onPurchaseShip: (newShip: Ship, netCost: number) => void;
}

export const Shipyard: React.FC<ShipyardProps> = ({
  planet,
  system,
  player,
  onPurchaseShip,
}) => {
  // Sort ships from lowest to highest price as requested
  const availableShips = [...SHIPS]
    .filter((s) => s.requiredTechLevel <= system.techLevel + 2)
    .sort((a, b) => a.cost - b.cost);

  // Selected ship for detailed showcase
  const [selectedShipId, setSelectedShipId] = useState<string>(
    availableShips.find((s) => s.id === player.currentShip.id)?.id || availableShips[0].id
  );

  const selectedShip = SHIPS.find((s) => s.id === selectedShipId) || availableShips[0];

  // Calculate trade-in value (65% of current ship base value)
  const tradeInValue = Math.round(player.currentShip.cost * 0.65);
  const netCost = Math.max(0, selectedShip.cost - tradeInValue);
  const canAfford = player.credits >= netCost;
  const isCurrentShip = player.currentShip.id === selectedShip.id;

  // Cargo hold validation
  const currentCargoTons = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  const cargoFits = currentCargoTons <= selectedShip.cargoCapacity;

  return (
    <div className="space-y-5 select-none">
      {/* Spaceport Drydock Header Banner */}
      <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden ev-panel group shadow-lg">
        <img
          src={getStellarObjectImage(planet)}
          alt={`${planet.name} Naval Gantries`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover md:object-contain object-center group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold block">
                {planet.name} NAVAL FABRICATION GANTRIES · TIER {system.techLevel} TECH
              </span>
              <SectionEditButton label="Edit Header" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-100 uppercase tracking-wide">
              Interstellar Shipwrights &amp; Drydock
            </h2>
          </div>
          <div className="text-right text-xs font-mono bg-black/85 px-3 py-1.5 rounded border border-slate-700 shadow-inner">
            <span className="text-slate-400 text-xs block">TRADE-IN VALUATION</span>
            <span className="text-emerald-400 font-bold tabular-nums text-sm">+{tradeInValue.toLocaleString()} Cr</span>
          </div>
        </div>
      </div>

      {/* TOP MAIN SCREEN: Showcase of the Selected Ship in Authentic Escape Velocity Style */}
      <div className="ev-panel rounded-xl p-4 sm:p-5 md:p-6 space-y-5 shadow-2xl">
        {/* Header Readout & Purchase Price Breakdown */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-xs font-mono font-bold uppercase tracking-wider">
                {selectedShip.role}
              </span>
              <span className="text-xs font-mono text-slate-300 uppercase">
                Tier {selectedShip.requiredTechLevel} Hull Specification
              </span>
              <SectionEditButton label="Edit Ship Info" />
              {isCurrentShip && (
                <span className="text-xs px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/70 font-mono font-bold">
                  Current Active Vessel
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-cyan-300 uppercase tracking-wide">
              {selectedShip.name}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-slate-300">
              {selectedShip.modelClass} · Designed &amp; Fabricated by <strong className="text-slate-100">{selectedShip.manufacturer}</strong>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="flex items-center sm:items-end flex-wrap sm:flex-col gap-2 sm:gap-1 ev-panel-inset p-3 rounded-lg sm:text-right shrink-0">
            <div className="flex sm:flex-col items-baseline gap-2 sm:gap-0">
              <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Base Purchase Cost</span>
              <span className="text-lg sm:text-2xl font-mono font-black text-amber-400 tabular-nums">
                {selectedShip.cost.toLocaleString()} Cr
              </span>
            </div>
            {!isCurrentShip && (
              <div className="text-xs sm:text-sm font-mono border-t sm:border-t-0 border-slate-800 pt-1 sm:pt-0">
                <span className="text-slate-400">Net after trade-in: </span>
                <span className="text-emerald-400 font-bold tabular-nums">{netCost.toLocaleString()} Cr</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Large Ship Visual & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Large Ship Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 ev-panel-inset relative rounded-xl overflow-hidden p-6 flex flex-col items-center justify-between min-h-[260px] sm:min-h-[300px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,transparent_75%)] pointer-events-none" />
            
            <div className="w-full flex items-center justify-between z-10">
              <div className="px-2.5 py-1 rounded bg-black/80 border border-cyan-700/60 text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Escape Velocity Vessel Preview</span>
              </div>

              <div className="px-2.5 py-1 rounded bg-black/80 border border-slate-700 text-xs font-mono text-slate-300 uppercase">
                Role: {selectedShip.role}
              </div>
            </div>

            {selectedShip.image ? (
              <div className="my-6 sm:my-8 flex items-center justify-center z-10">
                <img
                  src={selectedShip.image}
                  alt={selectedShip.name}
                  className="max-h-48 sm:max-h-60 max-w-[360px] sm:max-w-[460px] object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="text-slate-400 font-mono text-sm py-16 z-10">
                [Vessel Visual Blueprint Linked via Port Subspace]
              </div>
            )}

            <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300 z-10">
              <span>Hull Classification: <strong className="text-slate-100">{selectedShip.modelClass}</strong></span>
              <span className="text-cyan-300 font-bold">{selectedShip.manufacturer}</span>
            </div>
          </div>

          {/* Ship Lore & Specifications Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Lore Log */}
            <div className="ev-panel-inset rounded-lg p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider block font-bold">
                  SHIPWRIGHT TECHNICAL LOG
                </span>
                <SectionEditButton label="Edit Lore" />
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                {selectedShip.description}
              </p>
            </div>

            {/* Specifications Grid with Generous Spacing and High Contrast */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="ev-panel-inset p-3 rounded-lg">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold mb-1">
                  <span>HULL ARMOR</span>
                  <Shield className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-slate-100 font-black text-base sm:text-lg tabular-nums block">
                  {selectedShip.baseArmor}
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  vs {player.currentShip.baseArmor} current
                </span>
              </div>

              <div className="ev-panel-inset p-3 rounded-lg">
                <div className="flex items-center justify-between text-cyan-300 text-xs font-bold mb-1">
                  <span>SHIELD RATING</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-cyan-300 font-black text-base sm:text-lg tabular-nums block">
                  {selectedShip.baseShields}
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  vs {player.currentShip.baseShields} current
                </span>
              </div>

              <div className="ev-panel-inset p-3 rounded-lg">
                <div className="flex items-center justify-between text-amber-300 text-xs font-bold mb-1">
                  <span>CARGO HOLD</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-amber-300 font-black text-base sm:text-lg tabular-nums block">
                  {selectedShip.cargoCapacity} Tons
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  vs {player.currentShip.cargoCapacity}t current
                </span>
              </div>

              <div className="ev-panel-inset p-3 rounded-lg">
                <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-1">
                  <span>HYPERDRIVE FUEL</span>
                  <Fuel className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-emerald-400 font-black text-base sm:text-lg tabular-nums block">
                  {selectedShip.fuelCapacity} Jumps
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  Standard tanks
                </span>
              </div>

              <div className="ev-panel-inset p-3 rounded-lg">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold mb-1">
                  <span>HARDPOINTS</span>
                  <Crosshair className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-slate-100 font-bold text-xs sm:text-sm tabular-nums block truncate">
                  {selectedShip.gunSlots} Gun · {selectedShip.turretSlots} Turret
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  Weapon mounts
                </span>
              </div>

              <div className="ev-panel-inset p-3 rounded-lg">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold mb-1">
                  <span>DYNAMICS</span>
                  <Compass className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-slate-100 font-bold text-xs sm:text-sm tabular-nums block">
                  {selectedShip.speed} Spd · {selectedShip.turnRate} Turn
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  Thrust rating
                </span>
              </div>
            </div>

            {/* Purchase Action Button */}
            <div className="pt-2">
              {isCurrentShip ? (
                <div className="ev-panel-inset p-3.5 rounded-lg text-center text-xs sm:text-sm font-mono text-emerald-300 flex items-center justify-center gap-2 border border-emerald-500/40 font-bold">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>You are currently piloting this vessel.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {!cargoFits && (
                    <div className="p-2.5 bg-rose-950/80 border border-rose-600 rounded text-xs font-mono text-rose-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Cargo exceeds hold ({currentCargoTons}t &gt; {selectedShip.cargoCapacity}t). Sell cargo first!</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (canAfford && cargoFits) {
                        sound.playCredit();
                        onPurchaseShip(selectedShip, netCost);
                      } else {
                        sound.playAlert();
                      }
                    }}
                    disabled={!canAfford || !cargoFits}
                    className={`w-full py-3.5 px-5 font-display font-black text-sm sm:text-base rounded-lg transition-all flex items-center justify-center gap-2.5 ${
                      canAfford && cargoFits
                        ? 'ev-btn-amber shadow-xl cursor-pointer'
                        : 'ev-btn opacity-50 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>
                      {!cargoFits
                        ? 'Cargo Exceeds New Hold (Sell Cargo)'
                        : canAfford
                        ? `Trade-In & Buy ${selectedShip.name} (${netCost.toLocaleString()} Cr)`
                        : `Need ${netCost.toLocaleString()} Cr (Short ${(netCost - player.credits).toLocaleString()} Cr)`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Scrollable List of Ships Available for Sale (Sorted Lowest to Highest Price) */}
      <div className="ev-panel rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-300 border-b border-slate-700/80 pb-2">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-100 uppercase tracking-wide">
              Hulls Available for Sale ({availableShips.length} Models)
            </span>
            <SectionEditButton label="Edit Catalog" />
          </div>
          <span className="text-xs text-amber-400 font-mono font-semibold">
            Sorted: Lowest to Highest Price
          </span>
        </div>

        {/* Scrollable list of ship cards */}
        <div className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {availableShips.map((ship) => {
            const isSelected = selectedShipId === ship.id;
            const isCurrent = player.currentShip.id === ship.id;

            return (
              <div
                key={ship.id}
                onClick={() => {
                  sound.playSelect();
                  setSelectedShipId(ship.id);
                }}
                className={`w-60 sm:w-68 shrink-0 p-3.5 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-3 select-none ${
                  isSelected
                    ? 'ev-panel-inset border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400'
                    : 'ev-panel hover:border-slate-500'
                }`}
              >
                {/* Thumbnail image and badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-slate-700 font-bold">
                      Tier {ship.requiredTechLevel}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold">
                        Active Vessel
                      </span>
                    )}
                  </div>

                  <div className="w-full h-28 rounded-lg bg-black/70 border border-slate-800 flex items-center justify-center p-2.5 mb-2.5 shadow-inner">
                    {ship.image ? (
                      <img
                        src={ship.image}
                        alt={ship.name}
                        className="max-h-full max-w-full object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-mono text-slate-500">[Graphic]</span>
                    )}
                  </div>

                  <h4 className={`font-display font-black text-base truncate ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                    {ship.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-300 truncate">
                    {ship.modelClass}
                  </p>
                </div>

                {/* Bottom price tag & role */}
                <div className="pt-2.5 border-t border-slate-800 flex items-end justify-between text-xs font-mono">
                  <span className="text-xs text-slate-400 uppercase font-bold">{ship.role}</span>
                  <div className="text-right">
                    <span className="font-bold text-amber-400 tabular-nums text-sm block">
                      {ship.cost.toLocaleString()} Cr
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
