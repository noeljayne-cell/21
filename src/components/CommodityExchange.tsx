import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Commodity } from '../types/game';
import { COMMODITIES } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Store, TrendingUp, TrendingDown, Package, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SectionEditButton } from './SectionEditButton';

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
    <div className="space-y-5 select-none">
      {/* Header Cargo Status Bar in Escape Velocity Console Style */}
      <div className="ev-panel p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                INTERSTELLAR COMMODITY CLEARINGHOUSE
              </span>
              <SectionEditButton label="Edit Header" />
            </div>
            <span className="text-lg sm:text-xl font-display font-black text-slate-100">
              {planet.name} Market Terminal
            </span>
          </div>
        </div>

        {/* Cargo Capacity Meter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-5 ev-panel-inset px-4 py-2.5 rounded-lg border border-slate-700">
          <div>
            <span className="text-slate-400 text-xs block uppercase font-bold">CARGO HOLD STATUS</span>
            <span className="text-slate-100 font-black text-sm sm:text-base tabular-nums">
              {usedCargoTons} / {maxCargoTons} <span className="text-slate-400 text-xs font-bold">TONS</span>
            </span>
          </div>
          <div className="w-24 sm:w-28 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all ${
                usedCargoTons >= maxCargoTons ? 'bg-rose-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (usedCargoTons / maxCargoTons) * 100)}%` }}
            />
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs block uppercase font-bold">LIQUID CREDITS</span>
            <span className="text-amber-300 font-black text-sm sm:text-base tabular-nums">
              {player.credits.toLocaleString()} Cr
            </span>
          </div>
        </div>
      </div>

      {/* Contraband Customs Warning Banner */}
      {system.security === 'High' && (
        <div className="ev-panel-inset border border-amber-500/50 p-3.5 rounded-lg text-xs sm:text-sm text-amber-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="leading-relaxed">
            <strong>Confederation High Security Zone:</strong> Customs sweeps check cargo upon orbital departure. Contraband will incur heavy fines unless concealed in a sensor-shielded hold.
          </span>
        </div>
      )}

      {/* Two Column Layout: Commodity Table & Trade Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Commodity Price Table (7 cols) */}
        <div className="lg:col-span-7 ev-panel rounded-xl overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span>COMMODITY TYPE</span>
              <SectionEditButton label="Edit Table" />
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
              <span>LOCAL PRICE</span>
              <span>IN HOLD</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[420px] overflow-y-auto no-scrollbar">
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
                  className={`px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-mono cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/60 border-l-4 border-cyan-400 shadow-inner'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold truncate ${isSelected ? 'text-cyan-300 text-base' : 'text-slate-100'}`}>
                        {comm.name}
                      </span>
                      {comm.isContraband && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold uppercase shrink-0">
                          Contraband
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block">
                      Base Tariff: {comm.basePrice} Cr
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8 text-right shrink-0">
                    <div>
                      <span className="font-black text-slate-100 tabular-nums text-sm sm:text-base block">{localPrice} Cr</span>
                      <div className="flex items-center justify-end gap-1 text-xs">
                        {isCheap ? (
                          <span className="text-emerald-400 font-bold flex items-center">
                            <TrendingDown className="w-3 h-3 inline mr-0.5" /> Bargain
                          </span>
                        ) : isExpensive ? (
                          <span className="text-amber-400 font-bold flex items-center">
                            <TrendingUp className="w-3 h-3 inline mr-0.5" /> High
                          </span>
                        ) : (
                          <span className="text-slate-400">Normal</span>
                        )}
                      </div>
                    </div>

                    <div className="w-16 text-right">
                      <span className={`font-black text-sm sm:text-base tabular-nums ${held > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
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
        <div className="lg:col-span-5 ev-panel rounded-xl p-5 flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-4">
            <div className="border-b border-slate-700/80 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 block font-bold tracking-wider">SELECTED CARGO CONSIGNMENT</span>
                <SectionEditButton label="Edit Info" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-black text-slate-100 uppercase mt-0.5">
                {selectedCommodity.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-sans mt-1.5 leading-relaxed">
                {selectedCommodity.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="ev-panel-inset p-3 rounded-lg">
                <span className="text-slate-400 block text-xs font-bold uppercase">UNIT BUY/SELL</span>
                <span className="text-amber-300 font-black text-base sm:text-lg tabular-nums mt-0.5 block">
                  {selectedLocalPrice} Cr / ton
                </span>
              </div>
              <div className="ev-panel-inset p-3 rounded-lg">
                <span className="text-slate-400 block text-xs font-bold uppercase">IN SHIP'S HOLD</span>
                <span className="text-slate-100 font-black text-base sm:text-lg tabular-nums mt-0.5 block">
                  {selectedHeldTons} tons
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Buy and Sell Controls with authentic EV push buttons */}
          <div className="space-y-4 pt-2">
            {/* BUY SECTION */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider block">
                  Purchase Cargo (Hold Free: {freeCargoTons}t)
                </span>
                <SectionEditButton label="Edit Trade" />
              </div>
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
                  className="ev-btn py-2.5 text-xs text-emerald-300 hover:text-white"
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
                  className="ev-btn py-2.5 text-xs text-emerald-300 hover:text-white"
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
                  className="ev-btn-emerald py-2.5 text-xs font-bold"
                >
                  Fill Hold ({maxCanBuy}t)
                </button>
              </div>
            </div>

            {/* SELL SECTION */}
            <div className="space-y-2 pt-2 border-t border-slate-700/80">
              <span className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider block">
                Offload / Sell Cargo (Held: {selectedHeldTons}t)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    if (selectedHeldTons >= 1) {
                      sound.playCredit();
                      onSellCommodity(selectedCommodity, 1, selectedLocalPrice);
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={selectedHeldTons < 1}
                  className="ev-btn py-2.5 text-xs text-amber-300 hover:text-white"
                >
                  Sell 1t
                </button>

                <button
                  onClick={() => {
                    const amount = Math.min(5, selectedHeldTons);
                    if (amount > 0) {
                      sound.playCredit();
                      onSellCommodity(selectedCommodity, amount, selectedLocalPrice);
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={selectedHeldTons < 1}
                  className="ev-btn py-2.5 text-xs text-amber-300 hover:text-white"
                >
                  Sell 5t
                </button>

                <button
                  onClick={() => {
                    if (selectedHeldTons > 0) {
                      sound.playCredit();
                      onSellCommodity(selectedCommodity, selectedHeldTons, selectedLocalPrice);
                    } else {
                      sound.playAlert();
                    }
                  }}
                  disabled={selectedHeldTons < 1}
                  className="ev-btn-amber py-2.5 text-xs font-bold"
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
