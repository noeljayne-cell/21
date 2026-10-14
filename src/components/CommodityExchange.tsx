import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Commodity } from '../types/game';
import { COMMODITIES } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Store, TrendingUp, TrendingDown, Package, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CommodityExchangeProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onBuyCommodity: (commodity: Commodity, amount: number, pricePerTon: number) => void;
  onSellCommodity: (commodity: Commodity, amount: number, pricePerTon: number) => void;
}

export const CommodityExchange: React.FC<CommodityExchangeProps> = ({
  planet,
  system,
  player,
  onBuyCommodity,
  onSellCommodity,
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(COMMODITIES[0].id);

  // Calculate current cargo usage
  const usedCargoTons = Object.values(player.cargo).reduce((sum, tons) => sum + tons, 0);
  const maxCargoTons = player.currentShip.cargoCapacity + 
    player.equippedOutfits.reduce((sum, o) => sum + (o.statMod.cargo || 0), 0);
  const freeCargoTons = Math.max(0, maxCargoTons - usedCargoTons);

  const getLocalPrice = (comm: Commodity): number => {
    const modifier = planet.commodityPriceModifiers[comm.id] || 1.0;
    return Math.round(comm.basePrice * modifier);
  };

  const selectedCommodity = COMMODITIES.find((c) => c.id === selectedCommodityId) || COMMODITIES[0];
  const selectedLocalPrice = getLocalPrice(selectedCommodity);
  const selectedHeldTons = player.cargo[selectedCommodity.id] || 0;

  // Max affordable within cargo space and player credits
  const maxCanBuy = Math.min(
    freeCargoTons,
    Math.floor(player.credits / selectedLocalPrice)
  );

  return (
    <div className="space-y-4">
      {/* Header Cargo Status Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded text-emerald-400">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">COMMODITY CLEARINGHOUSE</span>
            <span className="text-slate-100 font-display font-bold text-base">
              {planet.name} Market Terminal
            </span>
          </div>
        </div>

        {/* Cargo Capacity Meter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4 bg-slate-950 px-3 py-2 rounded border border-slate-800/80">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">CARGO HOLD CAPACITY</span>
            <span className="text-slate-100 font-bold tabular-nums">
              {usedCargoTons} / {maxCargoTons} <span className="text-slate-400 text-[10px]">TONS</span>
            </span>
          </div>
          <div className="w-20 sm:w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                usedCargoTons >= maxCargoTons ? 'bg-rose-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (usedCargoTons / maxCargoTons) * 100)}%` }}
            />
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block uppercase">AVAILABLE CREDITS</span>
            <span className="text-amber-400 font-bold tabular-nums">
              {player.credits.toLocaleString()} Cr
            </span>
          </div>
        </div>
      </div>

      {/* Contraband Customs Warning Banner */}
      {system.security === 'High' && (
        <div className="bg-amber-950/40 border border-amber-500/40 px-3.5 py-2 rounded text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Confederation High Security Zone:</strong> Customs sweeps check cargo upon orbital departure. Contraband will incur fines unless concealed in a sensor-shielded hold.
          </span>
        </div>
      )}

      {/* Two Column Layout: Commodity Table & Trade Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Commodity Price Table (8 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>COMMODITY</span>
            <div className="flex items-center gap-3 sm:gap-8">
              <span>LOCAL PRICE</span>
              <span>CARGO HOLD</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[360px] overflow-y-auto no-scrollbar">
            {COMMODITIES.map((comm) => {
              const localPrice = getLocalPrice(comm);
              const held = player.cargo[comm.id] || 0;
              const isSelected = selectedCommodityId === comm.id;
              const priceDelta = localPrice - comm.basePrice;
              const isCheap = priceDelta < -10;
              const isExpensive = priceDelta > 10;

              return (
                <div
                  key={comm.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedCommodityId(comm.id);
                  }}
                  className={`px-3.5 py-2.5 flex items-center justify-between text-xs font-mono cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className={`font-semibold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {comm.name}
                      </span>
                      {comm.isContraband && (
                        <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-semibold uppercase shrink-0">
                          Contraband
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block capitalize">
                      Base: {comm.basePrice} Cr
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-8 text-right shrink-0">
                    <div>
                      <span className="font-bold text-slate-100 tabular-nums">{localPrice} Cr</span>
                      <div className="flex items-center justify-end gap-1 text-[10px]">
                        {isCheap ? (
                          <span className="text-emerald-400 flex items-center">
                            <TrendingDown className="w-2.5 h-2.5 inline" /> Cheap
                          </span>
                        ) : isExpensive ? (
                          <span className="text-amber-400 flex items-center">
                            <TrendingUp className="w-2.5 h-2.5 inline" /> High
                          </span>
                        ) : (
                          <span className="text-slate-400">Normal</span>
                        )}
                      </div>
                    </div>

                    <div className="w-14 text-right">
                      <span className={`font-bold tabular-nums ${held > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
                        {held} t
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Buy/Sell Controller Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">SELECTED CARGO</span>
              <h3 className="text-base font-display font-bold text-slate-100 uppercase">
                {selectedCommodity.name}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                {selectedCommodity.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">UNIT BUY/SELL</span>
                <span className="text-amber-300 font-bold text-sm tabular-nums">
                  {selectedLocalPrice} Cr / ton
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">IN SHIP'S HOLD</span>
                <span className="text-slate-200 font-bold text-sm tabular-nums">
                  {selectedHeldTons} tons
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Buy and Sell Controls */}
          <div className="space-y-3 pt-2">
            {/* BUY SECTION */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Purchase Cargo (Hold Free: {freeCargoTons}t)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    if (freeCargoTons >= 1 && player.credits >= selectedLocalPrice) {
                      sound.playCredit();
                      onBuyCommodity(selectedCommodity, 1, selectedLocalPrice);
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={freeCargoTons < 1 || player.credits < selectedLocalPrice}
                  className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono font-semibold text-emerald-400 rounded border border-slate-700 cursor-pointer transition-colors"
                >
                  Buy +1t
                </button>

                <button
                  onClick={() => {
                    const amount = Math.min(5, maxCanBuy);
                    if (amount > 0) {
                      sound.playCredit();
                      onBuyCommodity(selectedCommodity, amount, selectedLocalPrice);
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={maxCanBuy < 1}
                  className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono font-semibold text-emerald-400 rounded border border-slate-700 cursor-pointer transition-colors"
                >
                  Buy +5t
                </button>

                <button
                  onClick={() => {
                    if (maxCanBuy > 0) {
                      sound.playCredit();
                      onBuyCommodity(selectedCommodity, maxCanBuy, selectedLocalPrice);
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={maxCanBuy < 1}
                  className="py-2 bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 text-xs font-mono font-bold text-emerald-300 rounded border border-emerald-500/40 cursor-pointer transition-colors"
                >
                  Buy Max ({maxCanBuy}t)
                </button>
              </div>
            </div>

            {/* SELL SECTION */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Liquidate / Sell from Hold
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    if (selectedHeldTons >= 1) {
                      sound.playCredit();
                      onSellCommodity(selectedCommodity, 1, selectedLocalPrice);
                    }
                  }}
                  disabled={selectedHeldTons < 1}
                  className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono font-semibold text-amber-400 rounded border border-slate-700 cursor-pointer transition-colors"
                >
                  Sell -1t
                </button>

                <button
                  onClick={() => {
                    const amount = Math.min(5, selectedHeldTons);
                    if (amount > 0) {
                      sound.playCredit();
                      onSellCommodity(selectedCommodity, amount, selectedLocalPrice);
                    }
                  }}
                  disabled={selectedHeldTons < 1}
                  className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono font-semibold text-amber-400 rounded border border-slate-700 cursor-pointer transition-colors"
                >
                  Sell -5t
                </button>

                <button
                  onClick={() => {
                    if (selectedHeldTons > 0) {
                      sound.playCredit();
                      onSellCommodity(selectedCommodity, selectedHeldTons, selectedLocalPrice);
                    }
                  }}
                  disabled={selectedHeldTons < 1}
                  className="py-2 bg-amber-950/80 hover:bg-amber-900 disabled:opacity-40 text-xs font-mono font-bold text-amber-300 rounded border border-amber-500/40 cursor-pointer transition-colors"
                >
                  Sell All ({selectedHeldTons}t)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
