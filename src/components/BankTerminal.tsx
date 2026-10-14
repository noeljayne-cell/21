import React from 'react';
import { StellarObject, StarSystem, PlayerState } from '../types/game';
import { getSystemInterestRate } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Landmark, Fuel, Shield, Wrench, DollarSign, FileCheck, AlertCircle, Percent } from 'lucide-react';

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

  // Refuel calculations
  const missingFuel = player.currentShip.fuelCapacity - player.currentFuel;
  const hasSolarScoop = player.equippedOutfits.some((o) => o.statMod.solarScoop);
  const fuelCostPerUnit = hasSolarScoop ? 0 : 50;
  const totalRefuelCost = missingFuel * fuelCostPerUnit;

  // Repair calculations
  const missingArmor = Math.max(0, player.currentShip.baseArmor - player.currentArmor);
  const repairCostPerPoint = 8;
  const totalRepairCost = missingArmor * repairCostPerPoint;

  return (
    <div className="space-y-4">
      {/* Header Diagnostic */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded text-amber-300">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">FINANCIAL & HARBOR SERVICES</span>
            <span className="text-base font-display font-bold text-slate-100">
              {planet.name} Port Authority & Credit Vault
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
          <div>
            <span className="text-slate-400 text-[10px] block">CURRENT DEBT</span>
            <span className={`font-bold tabular-nums ${player.debt > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {player.debt.toLocaleString()} Cr
            </span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800" />
          <div>
            <span className="text-slate-400 text-[10px] block">LIQUID CREDITS</span>
            <span className="font-bold text-amber-400 tabular-nums">
              {player.credits.toLocaleString()} Cr
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Harbor Maintenance & Bank Credit Line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Port Authority Maintenance (Refuel & Repairs) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">HARBOR SERVICES</span>
            <h3 className="text-sm font-display font-bold text-cyan-300 uppercase">
              Vessel Replenishment & Drydock
            </h3>
          </div>

          {/* REFUEL SECTION */}
          <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hyperdrive Deuterium Tanks</span>
              </span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {player.currentFuel} / {player.currentShip.fuelCapacity} Jumps
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{hasSolarScoop ? 'Solar Scoop equipped (Free Refuels)' : 'Refuel tariff: 50 Cr / Jump'}</span>
              <span>Needs: {missingFuel} Jumps</span>
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
              className={`w-full py-2 font-display font-semibold text-xs rounded transition-all cursor-pointer ${
                missingFuel > 0 && player.credits >= totalRefuelCost
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {missingFuel <= 0
                ? 'Fuel Tanks Full'
                : hasSolarScoop
                ? 'Top-Off Fuel Tanks (Free via Scoop)'
                : `Refuel to Full (${totalRefuelCost} Cr)`}
            </button>
          </div>

          {/* REPAIR SECTION */}
          <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Structural Hull Integrity</span>
              </span>
              <span className={`font-bold tabular-nums ${missingArmor > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {player.currentArmor} / {player.currentShip.baseArmor} HP
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Titanium plate welding</span>
              <span>Damage: {missingArmor} HP</span>
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
              className={`w-full py-2 font-display font-semibold text-xs rounded transition-all cursor-pointer ${
                missingArmor > 0 && player.credits >= totalRepairCost
                  ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {missingArmor <= 0
                ? 'Hull Structurally Pristine'
                : `Repair Hull Plates to 100% (${totalRepairCost.toLocaleString()} Cr)`}
            </button>
          </div>
        </div>

        {/* Right: Bank Loan & Credit Line */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">CREDIT FACILITY</span>
              <h3 className="text-sm font-display font-bold text-amber-300 uppercase">
                First Interstellar Bank
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">SYSTEM INTEREST</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                {localInterestRate.toFixed(1)}% Variable
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Need capital to buy that Argosy or new pulse lasers? First Interstellar Bank issues commercial credit. Variable interest of <strong>5%–10%</strong> applies based on system security ({system.name} tariff: {localInterestRate.toFixed(1)}%), accrued automatically as time advances on hyperspace jumps.
          </p>

          {/* Borrow Options */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
              Borrow Commercial Loan
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playCredit();
                  onTakeLoan(20000);
                }}
                className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-semibold text-amber-300 rounded transition-colors cursor-pointer"
              >
                +20,000 Cr Loan
              </button>
              <button
                onClick={() => {
                  sound.playCredit();
                  onTakeLoan(50000);
                }}
                className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-semibold text-amber-300 rounded transition-colors cursor-pointer"
              >
                +50,000 Cr Loan
              </button>
            </div>
          </div>

          {/* Repay Options */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
              Repay Outstanding Debt ({player.debt.toLocaleString()} Cr)
            </span>
            <div className="grid grid-cols-2 gap-2">
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
                className="py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-mono text-emerald-300 rounded transition-colors cursor-pointer"
              >
                Repay 10,000 Cr
              </button>
              <button
                onClick={() => {
                  if (player.debt > 0 && player.credits >= player.debt) {
                    sound.playCredit();
                    onRepayLoan(player.debt);
                  } else {
                    sound.playAlert();
                  }
                }}
                disabled={player.debt <= 0 || player.credits < player.debt}
                className="py-2.5 bg-emerald-950/70 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 rounded transition-colors cursor-pointer"
              >
                Repay Debt in Full
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
