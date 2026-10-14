import React, { useState } from 'react';
import { PlayerState, StarSystem, StellarObject } from '../types/game';
import { sound } from '../audio/soundFx';
import { ShieldCheck, Crosshair, Package, Users, FileText, Anchor, Fuel, Wrench, Edit3 } from 'lucide-react';

interface ShipStatusViewProps {
  player: PlayerState;
  currentSystem: StarSystem;
  landedObject: StellarObject | null;
  onUpdatePilotInfo: (pilotName: string, shipName: string) => void;
  onAdjustDamage: (deltaArmor: number, deltaShields: number) => void;
}

export const ShipStatusView: React.FC<ShipStatusViewProps> = ({
  player,
  currentSystem,
  landedObject,
  onUpdatePilotInfo,
  onAdjustDamage,
}) => {
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [pilotName, setPilotName] = useState(player.pilotName);
  const [shipName, setShipName] = useState(player.shipName);

  const usedCargo = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  const maxCargo = player.currentShip.cargoCapacity + 
    player.equippedOutfits.reduce((sum, o) => sum + (o.statMod.cargo || 0), 0);

  const handleSaveNames = () => {
    sound.playClick(700);
    onUpdatePilotInfo(pilotName, shipName);
    setIsEditingNames(false);
  };

  return (
    <div className="w-full h-full bg-slate-950 p-3 sm:p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto no-scrollbar select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Pilot & Ship Callout Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
              REGISTRATION & PILOT DOSSIER
            </span>
            {isEditingNames ? (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={pilotName}
                  onChange={(e) => setPilotName(e.target.value)}
                  placeholder="Pilot Name"
                  className="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded text-sm text-slate-100 font-display"
                />
                <input
                  type="text"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  placeholder="Ship Name"
                  className="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded text-sm text-slate-100 font-display"
                />
                <button
                  onClick={handleSaveNames}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-display font-bold text-slate-100 uppercase tracking-wide">
                    {player.shipName}
                  </h1>
                  <span className="text-xs font-mono text-slate-400">
                    Commanded by <strong className="text-amber-300">{player.pilotName}</strong> · Model: {player.currentShip.name}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingNames(true)}
                  className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                  title="Edit Callnames"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">CURRENT SYSTEM</span>
              <span className="text-cyan-300 font-bold">{currentSystem.name}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="text-slate-400 text-[10px] block">LOCATION</span>
              <span className="text-amber-300 font-bold">
                {landedObject ? `Landed on ${landedObject.name}` : 'In Orbit'}
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Hull & Shield Sliders (Essential for Tabletop Dogfights) */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                TACTICAL COMBAT MONITOR
              </span>
              <h2 className="text-base font-display font-bold text-cyan-300 uppercase">
                Hull Integrity & Deflector Status
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Manual Tabletop Damage Adjuster
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shield Gauge */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Shields
                </span>
                <span className="text-slate-200 font-bold tabular-nums">
                  {player.currentShields} / {player.currentShip.baseShields}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (player.currentShields / player.currentShip.baseShields) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => onAdjustDamage(0, -25)}
                  className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 rounded text-xs font-mono cursor-pointer"
                >
                  -25 Shields
                </button>
                <button
                  onClick={() => onAdjustDamage(0, 25)}
                  className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded text-xs font-mono cursor-pointer"
                >
                  +25 Shields
                </button>
              </div>
            </div>

            {/* Armor Gauge */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-400" /> Armor Hull
                </span>
                <span className="text-slate-200 font-bold tabular-nums">
                  {player.currentArmor} / {player.currentShip.baseArmor}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (player.currentArmor / player.currentShip.baseArmor) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => onAdjustDamage(-25, 0)}
                  className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 rounded text-xs font-mono cursor-pointer"
                >
                  -25 Hull
                </button>
                <button
                  onClick={() => onAdjustDamage(25, 0)}
                  className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded text-xs font-mono cursor-pointer"
                >
                  +25 Hull
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Vessel Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cargo Hold Summary */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-400" /> Cargo Hold
              </span>
              <span className="text-slate-400">{usedCargo} / {maxCargo}t</span>
            </div>
            {Object.keys(player.cargo).length === 0 ? (
              <span className="text-slate-500 italic block py-2">Hold is empty</span>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                {Object.entries(player.cargo).map(([commId, tons]) => (
                  <div key={commId} className="flex justify-between py-0.5 text-slate-300">
                    <span className="capitalize">{commId.replace('_', ' ')}</span>
                    <strong className="text-amber-300">{tons} t</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Installed Outfits */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Mounted Outfits
              </span>
              <span className="text-slate-400">{player.equippedOutfits.length}</span>
            </div>
            {player.equippedOutfits.length === 0 ? (
              <span className="text-slate-500 italic block py-2">No extra weapons mounted</span>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                {player.equippedOutfits.map((o, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 text-slate-300">
                    <span className="truncate">{o.name}</span>
                    <span className="text-slate-400 text-[10px]">{o.slotType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hired Escorts */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Wingman Escorts
              </span>
              <span className="text-slate-400">{player.escorts.length}</span>
            </div>
            {player.escorts.length === 0 ? (
              <span className="text-slate-500 italic block py-2">No wingmen under contract</span>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                {player.escorts.map((e) => (
                  <div key={e.id} className="flex justify-between py-0.5 text-slate-300">
                    <span>{e.name}</span>
                    <span className="text-amber-400">{e.dailyWage} Cr/d</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
