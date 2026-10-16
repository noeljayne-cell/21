import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState } from '../types/game';
import { getSystemInterestRate } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Landmark, Fuel, Shield, Wrench, DollarSign, FileCheck, AlertCircle, Percent, ArrowRight } from 'lucide-react';

interface BankTerminalProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onTakeLoan: (amount: number) => void;
  onRepayLoan: (amount: number) => void;
  onRefuel: (cost: number) => void;
  onRepairHull: (cost: number) => void;
}

export const BankTerminal: React.FC<BankTerminalProps> = ({
  planet,
  system,
  player,
  onTakeLoan,
  onRepayLoan,
  onRefuel,
  onRepairHull,
}) => {
  const localInterestRate = getSystemInterestRate(system);
  const [customRepayAmount, setCustomRepayAmount] = useState<string>('1000');

  // Refuel calculations
  const missingFuel = player.currentShip.fuelCapacity - player.currentFuel;
  const hasSolarScoop = player.equippedOutfits.some((o) => o.statMod.solarScoop);
  const fuelCostPerUnit = hasSolarScoop ? 0 : 50;
  const totalRefuelCost = missingFuel * fuelCostPerUnit;

  // Repair calculations
  const missingArmor = Math.max(0, player.currentShip.baseArmor - player.currentArmor);
  const repairCostPerPoint = 8;
  const totalRepairCost = missingArmor * repairCostPerPoint;

  const handleCustomRepay = () => {
    const val = parseInt(customRepayAmount, 10);
    if (!isNaN(val) && val > 0 && player.credits >= val && player.debt > 0) {
      sound.playCredit();
      onRepayLoan(Math.min(val, player.debt));
    } else {
      sound.playAlert();
    }
  };

  return (
    <div className="space-y-5 select-none">
      {/* Header Diagnostic in Escape Velocity Console Style */}
      <div className="ev-panel p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              PORT AUTHORITY FINANCIAL SERVICES
            </span>
            <span className="text-lg sm:text-xl font-display font-black text-slate-100">
              {planet.name} Port Authority &amp; First Interstellar Bank
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 ev-panel-inset px-4 py-2.5 rounded-lg border border-slate-700">
          <div>
            <span className="text-slate-400 text-xs block font-bold">CURRENT DEBT</span>
            <span className={`font-black text-base sm:text-lg tabular-nums ${player.debt > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {player.debt.toLocaleString()} Cr
            </span>
          </div>
          <div className="w-[1px] h-6 bg-slate-700" />
          <div>
            <span className="text-slate-400 text-xs block font-bold">AVAILABLE CREDITS</span>
            <span className="font-black text-base sm:text-lg text-amber-300 tabular-nums">
              {player.credits.toLocaleString()} Cr
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Harbor Maintenance & Bank Credit Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Port Authority Maintenance (Refuel & Repairs) */}
        <div className="ev-panel rounded-xl p-5 space-y-5 shadow-xl">
          <div className="border-b border-slate-700/80 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider block">
              HARBOR LOGISTICS &amp; DRYDOCK
            </span>
            <h3 className="text-base sm:text-lg font-display font-black text-cyan-300 uppercase">
              Vessel Replenishment &amp; Hull Welding
            </h3>
          </div>

          {/* REFUEL SECTION */}
          <div className="ev-panel-inset p-4 rounded-lg space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200 text-sm font-bold">
                <Fuel className="w-4 h-4 text-cyan-400" />
                <span>Hyperdrive Deuterium Tanks</span>
              </span>
              <span className="text-cyan-300 font-black text-sm tabular-nums">
                {player.currentFuel} / {player.currentShip.fuelCapacity} Jumps
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{hasSolarScoop ? 'Solar Scoop equipped (Free Refuels)' : 'Refuel tariff: 50 Cr / Jump'}</span>
              <span className="font-semibold">Required: {missingFuel} Jumps</span>
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
              className={`w-full py-2.5 font-display font-bold text-xs uppercase rounded transition-all ${
                missingFuel <= 0
                  ? 'ev-btn opacity-60 text-slate-400 cursor-default'
                  : player.credits >= totalRefuelCost
                  ? 'ev-btn-cyan cursor-pointer'
                  : 'ev-btn opacity-50 text-rose-300 cursor-not-allowed'
              }`}
            >
              {missingFuel <= 0
                ? 'Fuel Tanks At Maximum Capacity'
                : hasSolarScoop
                ? 'Top-Off Fuel Tanks (Free via Scoop)'
                : `Refuel to Full (${totalRefuelCost} Cr)`}
            </button>
          </div>

          {/* REPAIR SECTION */}
          <div className="ev-panel-inset p-4 rounded-lg space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200 text-sm font-bold">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Structural Armor Integrity</span>
              </span>
              <span className={`font-black text-sm tabular-nums ${missingArmor > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {player.currentArmor} / {player.currentShip.baseArmor} HP
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Titanium alloy hull welding</span>
              <span className="font-semibold">Damage: {missingArmor} HP</span>
            </div>

            <button
              onClick={() => {
                if (missingArmor > 0 && player.credits >= totalRepairCost) {
                  sound.playCredit();
                  onRepairHull(totalRepairCost);
                } else if (missingArmor > 0) {
                  sound.playAlert();
                }
              }}
              disabled={missingArmor <= 0 || player.credits < totalRepairCost}
              className={`w-full py-2.5 font-display font-bold text-xs uppercase rounded transition-all ${
                missingArmor <= 0
                  ? 'ev-btn opacity-60 text-slate-400 cursor-default'
                  : player.credits >= totalRepairCost
                  ? 'ev-btn-amber cursor-pointer'
                  : 'ev-btn opacity-50 text-rose-300 cursor-not-allowed'
              }`}
            >
              {missingArmor <= 0
                ? 'Hull Structurally Pristine (100%)'
                : `Weld Armor Plates to 100% (${totalRepairCost.toLocaleString()} Cr)`}
            </button>
          </div>
        </div>

        {/* Right: Bank Loan & Credit Line */}
        <div className="ev-panel rounded-xl p-5 space-y-5 shadow-xl">
          <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider block">
                FIRST INTERSTELLAR BANK
              </span>
              <h3 className="text-base sm:text-lg font-display font-black text-amber-300 uppercase">
                Commercial Credit Facility
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block uppercase font-bold">SYSTEM APR</span>
              <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500 text-xs font-mono font-bold">
                {localInterestRate.toFixed(1)}% Variable
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed ev-panel-inset p-3.5 rounded-lg">
            First Interstellar Bank issues commercial credit lines to licensed independent captains. Variable interest of <strong>5%–10%</strong> applies based on system security ({system.name} tariff: {localInterestRate.toFixed(1)}%), accrued automatically as time advances on hyperspace jumps.
          </p>

          {/* Borrow Options */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider block">
              Borrow Commercial Loan
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  sound.playCredit();
                  onTakeLoan(20000);
                }}
                className="ev-btn py-3 text-xs sm:text-sm text-amber-300 hover:text-white"
              >
                +20,000 Cr Loan
              </button>
              <button
                onClick={() => {
                  sound.playCredit();
                  onTakeLoan(50000);
                }}
                className="ev-btn py-3 text-xs sm:text-sm text-amber-300 hover:text-white"
              >
                +50,000 Cr Loan
              </button>
            </div>
          </div>

          {/* Repay Options - Flexible Tiers to accommodate 69,420 Cr Debt with starting 2,000 Cr balance */}
          <div className="space-y-3 pt-3 border-t border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider block">
                Repay Outstanding Debt ({player.debt.toLocaleString()} Cr)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Liquid: {player.credits.toLocaleString()} Cr
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  if (player.debt > 0 && player.credits >= 1000) {
                    sound.playCredit();
                    onRepayLoan(Math.min(1000, player.debt));
                  } else {
                    sound.playAlert();
                  }
                }}
                disabled={player.debt <= 0 || player.credits < 1000}
                className="ev-btn py-2 text-xs text-emerald-300 hover:text-emerald-100"
              >
                -1,000 Cr
              </button>

              <button
                onClick={() => {
                  if (player.debt > 0 && player.credits >= 5000) {
                    sound.playCredit();
                    onRepayLoan(Math.min(5000, player.debt));
                  } else {
                    sound.playAlert();
                  }
                }}
                disabled={player.debt <= 0 || player.credits < 5000}
                className="ev-btn py-2 text-xs text-emerald-300 hover:text-emerald-100"
              >
                -5,000 Cr
              </button>

              <button
                onClick={() => {
                  if (player.debt > 0 && player.credits >= 10000) {
                    sound.playCredit();
                    onRepayLoan(Math.min(10000, player.debt));
                  } else {
                    sound.playAlert();
                  }
                }}
                disabled={player.debt <= 0 || player.credits < 10000}
                className="ev-btn py-2 text-xs text-emerald-300 hover:text-emerald-100"
              >
                -10,000 Cr
              </button>

              <button
                onClick={() => {
                  const payAll = Math.min(player.credits, player.debt);
                  if (payAll > 0) {
                    sound.playCredit();
                    onRepayLoan(payAll);
                  } else {
                    sound.playAlert();
                  }
                }}
                disabled={player.debt <= 0 || player.credits <= 0}
                className="ev-btn-emerald py-2 text-xs font-bold"
                title="Pay all available liquid credits toward debt"
              >
                Pay All Liquid
              </button>
            </div>

            {/* Custom Repayment Amount Input Row */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max={Math.min(player.credits, player.debt)}
                  value={customRepayAmount}
                  onChange={(e) => setCustomRepayAmount(e.target.value)}
                  placeholder="Custom amount..."
                  className="w-full ev-panel-inset px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400 rounded"
                />
                <span className="absolute right-2.5 top-2 text-xs font-mono text-slate-400">Cr</span>
              </div>
              <button
                onClick={handleCustomRepay}
                disabled={player.debt <= 0 || player.credits < parseInt(customRepayAmount, 10)}
                className="ev-btn px-4 py-2 text-xs font-display font-bold uppercase text-emerald-300 hover:text-white"
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
