import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Ship } from '../types/game';
import { SHIPS, getStellarObjectImage } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Wrench, Shield, Zap, Package, Compass, Crosshair, Check, AlertCircle, Fuel, ArrowDownUp } from 'lucide-react';

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
  // Available ships filtered by system tech level, sorted from lowest to highest price
  const availableShips = SHIPS
    .filter((s) => s.requiredTechLevel <= system.techLevel + 1)
    .sort((a, b) => a.cost - b.cost);

  const [selectedShipId, setSelectedShipId] = useState<string>(
    // Select player's current ship or first available
    availableShips.find((s) => s.id === player.currentShip.id)?.id || availableShips[0]?.id || SHIPS[0].id
  );

  const selectedShip = SHIPS.find((s) => s.id === selectedShipId) || availableShips[0] || SHIPS[0];
  const isCurrentShip = player.currentShip.id === selectedShip.id;

  // Trade in value is 80% of current ship cost
  const tradeInValue = Math.round(player.currentShip.cost * 0.8);
  const netCost = Math.max(0, selectedShip.cost - tradeInValue);
  const canAfford = player.credits >= netCost;

  // Check if cargo fits in new ship
  const currentCargoTons = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  const cargoFits = currentCargoTons <= selectedShip.cargoCapacity;

  return (
    <div className="space-y-4">
      {/* Shipyard Banner */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 h-28 sm:h-32 bg-black group shadow-lg">
        <img
          src={getStellarObjectImage(planet)}
          alt={`${planet.name} Shipyard`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover md:object-contain object-center group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-2.5 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
              {planet.name} Naval Fabrication Gantries · Tech Tier {system.techLevel}
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-100 uppercase tracking-wide">
              Interstellar Shipwrights & Drydock
            </h2>
          </div>
          <div className="text-right text-xs font-mono bg-slate-950/85 px-3 py-1 rounded border border-slate-800">
            <span className="text-slate-400 text-[9px] block">TRADE-IN VALUATION</span>
            <span className="text-emerald-400 font-bold tabular-nums">+{tradeInValue.toLocaleString()} Cr</span>
          </div>
        </div>
      </div>

      {/* TOP MAIN SCREEN: Showcase of the Selected Ship */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-xl">
        {/* Header Readout & Purchase Price Breakdown */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono uppercase tracking-wider">
                {selectedShip.role}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Tier {selectedShip.requiredTechLevel} Hull
              </span>
              {isCurrentShip && (
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-mono font-semibold">
                  Current Active Vessel
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-cyan-300 uppercase tracking-wide">
              {selectedShip.name}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {selectedShip.modelClass} · Built by {selectedShip.manufacturer}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="flex items-center sm:items-end flex-wrap sm:flex-col gap-2 sm:gap-1 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 sm:text-right shrink-0">
            <div className="flex sm:flex-col items-baseline gap-2 sm:gap-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Base Purchase Cost</span>
              <span className="text-base sm:text-xl font-mono font-bold text-amber-400 tabular-nums">
                {selectedShip.cost.toLocaleString()} Cr
              </span>
            </div>
            {!isCurrentShip && (
              <div className="text-xs font-mono border-t sm:border-t-0 border-slate-800 pt-1 sm:pt-0">
                <span className="text-[10px] text-slate-400">Net after trade-in: </span>
                <span className="text-emerald-400 font-bold tabular-nums">{netCost.toLocaleString()} Cr</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Large Ship Visual & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Main Large Ship Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 relative rounded-xl overflow-hidden border-2 border-cyan-900/60 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 p-6 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px] shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.14)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-slate-950/90 border border-cyan-800/60 text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Original Escape Velocity Vessel View</span>
            </div>

            <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
              Class: {selectedShip.role}
            </div>

            {selectedShip.image ? (
              <div className="my-6 flex items-center justify-center">
                <img
                  src={selectedShip.image}
                  alt={selectedShip.name}
                  className="max-h-40 sm:max-h-52 max-w-[320px] sm:max-w-[420px] object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="text-slate-500 font-mono text-xs py-12">
                [Vessel Visual Blueprint Linked via Port Subspace]
              </div>
            )}

            <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Class Registration: {selectedShip.modelClass}</span>
              <span className="text-cyan-300 font-semibold">{selectedShip.manufacturer}</span>
            </div>
          </div>

          {/* Ship Lore & Specifications Column (5 cols) */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            {/* Lore Log */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 shadow-sm">
              <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider block mb-1.5 font-semibold">
                SHIPWRIGHT TECHNICAL LOG
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {selectedShip.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold mb-0.5">
                  <span>HULL ARMOR</span>
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-slate-100 font-bold text-sm sm:text-base tabular-nums block">
                  {selectedShip.baseArmor}
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  vs {player.currentShip.baseArmor} current
                </span>
              </div>

              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold mb-0.5">
                  <span>SHIELD CAPACITY</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-cyan-400 font-bold text-sm sm:text-base tabular-nums block">
                  {selectedShip.baseShields}
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  vs {player.currentShip.baseShields} current
                </span>
              </div>

              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold mb-0.5">
                  <span>CARGO HOLD</span>
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-amber-300 font-bold text-sm sm:text-base tabular-nums block">
                  {selectedShip.cargoCapacity} Tons
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  vs {player.currentShip.cargoCapacity}t current
                </span>
              </div>

              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold mb-0.5">
                  <span>HYPERDRIVE FUEL</span>
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-emerald-400 font-bold text-sm sm:text-base tabular-nums block">
                  {selectedShip.fuelCapacity} Jumps
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  Standard tank
                </span>
              </div>

              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold mb-0.5">
                  <span>WEAPONS</span>
                  <Crosshair className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-slate-100 font-bold text-xs sm:text-sm tabular-nums block truncate">
                  {selectedShip.gunSlots} Gun · {selectedShip.turretSlots} Turret
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  Hardpoint mounts
                </span>
              </div>

              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold mb-0.5">
                  <span>SPEED & TURN</span>
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-slate-100 font-bold text-xs sm:text-sm tabular-nums block">
                  {selectedShip.speed} Speed · {selectedShip.turnRate} Turn
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  Thrust dynamics
                </span>
              </div>
            </div>

            {/* Purchase Action Button */}
            <div className="pt-1">
              {isCurrentShip ? (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs font-mono text-slate-300 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You are currently piloting this vessel.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {!cargoFits && (
                    <div className="p-2 bg-rose-950/60 border border-rose-800/80 rounded text-[11px] font-mono text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
                    className={`w-full py-3 px-4 font-display font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                      canAfford && cargoFits
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200 uppercase tracking-wide">
              Hulls Available for Sale ({availableShips.length} Models)
            </span>
          </div>
          <span className="text-[11px] text-amber-400 font-mono">
            Sorted: Lowest to Highest Price
          </span>
        </div>

        {/* Scrollable list of ship cards */}
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
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
                className={`w-52 sm:w-60 shrink-0 p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-2.5 select-none ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Thumbnail image and badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Tier {ship.requiredTechLevel}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 font-bold">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="w-full h-24 rounded bg-black/60 border border-slate-800/80 flex items-center justify-center p-2 mb-2">
                    {ship.image ? (
                      <img
                        src={ship.image}
                        alt={ship.name}
                        className="max-h-full max-w-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-600">[Graphic]</span>
                    )}
                  </div>

                  <h4 className={`font-display font-bold text-sm truncate ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                    {ship.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {ship.modelClass}
                  </p>
                </div>

                {/* Bottom price tag & role */}
                <div className="pt-2 border-t border-slate-800/80 flex items-end justify-between text-xs font-mono">
                  <span className="text-[10px] text-slate-500 uppercase">{ship.role}</span>
                  <div className="text-right">
                    <span className="font-bold text-amber-400 tabular-nums block">
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
