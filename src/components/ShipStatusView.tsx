import React, { useState } from 'react';
import { PlayerState, StarSystem, StellarObject } from '../types/game';
import { sound } from '../audio/soundFx';
import { ShieldCheck, Crosshair, Package, Users, Fuel, Wrench, Edit3, Compass } from 'lucide-react';

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
    <div className="w-full h-full bg-slate-950 p-3 sm:p-5 md:p-6 pb-20 md:pb-6 overflow-y-auto no-scrollbar select-none">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Pilot & Ship Callout Card (EV Beveled Command Panel) */}
        <div className="ev-panel p-5 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold">
              REGISTRATION &amp; PILOT DOSSIER
            </span>
            {isEditingNames ? (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={pilotName}
                  onChange={(e) => setPilotName(e.target.value)}
                  placeholder="Pilot Name"
                  className="ev-panel-inset px-3 py-1.5 rounded text-sm text-slate-100 font-display"
                />
                <input
                  type="text"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  placeholder="Ship Name"
                  className="ev-panel-inset px-3 py-1.5 rounded text-sm text-slate-100 font-display"
                />
                <button
                  onClick={handleSaveNames}
                  className="ev-btn-cyan px-4 py-1.5 text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-display font-black text-slate-100 uppercase tracking-wide truncate">
                    {player.shipName}
                  </h1>
                  <span className="text-xs sm:text-sm font-mono text-slate-300 block truncate">
                    Commanded by <strong className="text-amber-300">{player.pilotName}</strong> · Model: {player.currentShip.name}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingNames(true)}
                  className="ev-btn p-1.5 text-slate-300 hover:text-cyan-300"
                  title="Edit Callnames"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono ev-panel-inset px-4 py-2.5 rounded-lg shrink-0">
            <div>
              <span className="text-slate-400 text-xs block font-bold uppercase">CURRENT SYSTEM</span>
              <span className="text-cyan-300 font-bold text-sm">{currentSystem.name}</span>
            </div>
            <div className="w-[1px] h-7 bg-slate-700" />
            <div>
              <span className="text-slate-400 text-xs block font-bold uppercase">LOCATION</span>
              <span className="text-amber-300 font-bold text-sm">
                {landedObject ? `Landed on ${landedObject.name}` : 'In Orbit'}
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Hull & Shield Sliders (Essential for Tabletop Dogfights) */}
        <div className="ev-panel p-5 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                TACTICAL COMBAT MONITOR
              </span>
              <h2 className="text-base sm:text-lg font-display font-black text-slate-100 uppercase">
                Hull Integrity &amp; Deflector Status
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-300">
              Manual Tabletop Damage Adjuster
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shield Gauge */}
            <div className="ev-panel-inset p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Deflector Shields
                </span>
                <span className="text-slate-100 font-black text-sm tabular-nums">
                  {player.currentShields} / {player.currentShip.baseShields}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  style={{ width: `${Math.min(100, (player.currentShields / player.currentShip.baseShields) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => onAdjustDamage(0, -25)}
                  className="flex-1 py-1.5 ev-btn text-rose-300 hover:text-white text-xs font-mono font-bold"
                >
                  -25 Shields
                </button>
                <button
                  onClick={() => onAdjustDamage(0, 25)}
                  className="flex-1 py-1.5 ev-btn text-cyan-300 hover:text-white text-xs font-mono font-bold"
                >
                  +25 Shields
                </button>
              </div>
            </div>

            {/* Armor Gauge */}
            <div className="ev-panel-inset p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 font-bold flex items-center gap-1.5 text-sm">
                  <Wrench className="w-4 h-4 text-amber-400" /> Hull Armor Plate
                </span>
                <span className="text-slate-100 font-black text-sm tabular-nums">
                  {player.currentArmor} / {player.currentShip.baseArmor}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-400 transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  style={{ width: `${Math.min(100, (player.currentArmor / player.currentShip.baseArmor) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => onAdjustDamage(-25, 0)}
                  className="flex-1 py-1.5 ev-btn text-rose-300 hover:text-white text-xs font-mono font-bold"
                >
                  -25 Hull
                </button>
                <button
                  onClick={() => onAdjustDamage(25, 0)}
                  className="flex-1 py-1.5 ev-btn text-emerald-300 hover:text-white text-xs font-mono font-bold"
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
          <div className="ev-panel p-4 rounded-xl space-y-3 text-xs font-mono shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <span className="text-slate-200 font-bold flex items-center gap-1.5 text-sm">
                <Package className="w-4 h-4 text-emerald-400" /> Cargo Hold
              </span>
              <span className="text-amber-300 font-bold text-xs sm:text-sm">{usedCargo} / {maxCargo}t</span>
            </div>
            {Object.keys(player.cargo).length === 0 ? (
              <span className="text-slate-400 italic block py-2 text-xs">Hold is currently empty</span>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {Object.entries(player.cargo).map(([commId, tons]) => (
                  <div key={commId} className="flex justify-between py-0.5 text-slate-200 text-xs">
                    <span className="capitalize">{commId.replace('_', ' ')}</span>
                    <strong className="text-amber-300 font-bold">{tons} t</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Installed Outfits */}
          <div className="ev-panel p-4 rounded-xl space-y-3 text-xs font-mono shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <span className="text-slate-200 font-bold flex items-center gap-1.5 text-sm">
                <Crosshair className="w-4 h-4 text-cyan-400" /> Mounted Outfits
              </span>
              <span className="text-cyan-300 font-bold text-xs sm:text-sm">{player.equippedOutfits.length}</span>
            </div>
            {player.equippedOutfits.length === 0 ? (
              <span className="text-slate-400 italic block py-2 text-xs">No extra outfits or weapons mounted</span>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {player.equippedOutfits.map((o, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5 text-slate-200 text-xs">
                    <span className="truncate">{o.name}</span>
                    <span className="text-slate-400 uppercase text-[10px] px-1.5 py-0.2 rounded bg-black/80 border border-slate-700 shrink-0">{o.slotType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hired Escorts */}
          <div className="ev-panel p-4 rounded-xl space-y-3 text-xs font-mono shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <span className="text-slate-200 font-bold flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4 text-amber-400" /> Wingman Escorts
              </span>
              <span className="text-amber-300 font-bold text-xs sm:text-sm">{player.escorts.length}</span>
            </div>
            {player.escorts.length === 0 ? (
              <span className="text-slate-400 italic block py-2 text-xs">No wingmen currently under contract</span>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {player.escorts.map((e) => (
                  <div key={e.id} className="flex justify-between py-0.5 text-slate-200 text-xs">
                    <span className="truncate">{e.name}</span>
                    <span className="text-amber-400 font-bold shrink-0">{e.dailyWage} Cr/d</span>
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
