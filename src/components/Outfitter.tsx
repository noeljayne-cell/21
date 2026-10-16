import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, OutfitItem } from '../types/game';
import { OUTFITS } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Radio, Crosshair, Shield, Zap, Package, Trash2, Plus, Sparkles, Check, Wrench } from 'lucide-react';
import { SectionEditButton } from './SectionEditButton';

interface OutfitterProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onBuyOutfit: (outfit: OutfitItem) => void;
  onSellOutfit: (outfitIndex: number) => void;
}

export const Outfitter: React.FC<OutfitterProps> = ({
  planet,
  system,
  player,
  onBuyOutfit,
  onSellOutfit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(OUTFITS[0].id);

  // Filter outfits by system tech level
  const availableOutfits = OUTFITS.filter((o) => {
    const techMatch = o.techLevel <= system.techLevel + 1;
    const catMatch = selectedCategory === 'all' || o.category === selectedCategory;
    return techMatch && catMatch;
  });

  const selectedOutfit = OUTFITS.find((o) => o.id === selectedOutfitId) || OUTFITS[0];

  // Hardpoint calculations
  const usedGunSlots = player.equippedOutfits.filter((o) => o.slotType === 'gun').length;
  const maxGunSlots = player.currentShip.gunSlots;

  const usedTurretSlots = player.equippedOutfits.filter((o) => o.slotType === 'turret').length;
  const maxTurretSlots = player.currentShip.turretSlots;

  const usedMass = player.equippedOutfits.reduce((sum, o) => sum + o.mass, 0);
  const maxMass = player.currentShip.maxMass;

  // Validation
  const hasFreeGunSlot = selectedOutfit.slotType !== 'gun' || usedGunSlots < maxGunSlots;
  const hasFreeTurretSlot = selectedOutfit.slotType !== 'turret' || usedTurretSlots < maxTurretSlots;
  const hasFreeMass = usedMass + selectedOutfit.mass <= maxMass;
  const canAfford = player.credits >= selectedOutfit.cost;
  const canMount = hasFreeGunSlot && hasFreeTurretSlot && hasFreeMass && canAfford;

  return (
    <div className="space-y-4 select-none">
      {/* Header Slot Diagnostic */}
      <div className="ev-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-bold">
              SHIP OUTFITTER FACILITY // TIER {system.techLevel} TECH
            </span>
            <SectionEditButton label="Edit Facility" />
          </div>
          <span className="text-lg sm:text-xl font-display font-black text-slate-100 uppercase tracking-wide">
            {planet.name} Hardware Bay &amp; Gantries
          </span>
        </div>

        {/* Diagnostic hardpoint badges */}
        <div className="flex items-center gap-3">
          <div className="ev-panel-inset px-3 py-2 rounded-lg text-center">
            <span className="text-slate-400 text-xs block font-bold uppercase">GUN SLOTS</span>
            <span className={`font-black text-sm tabular-nums ${usedGunSlots >= maxGunSlots ? 'text-amber-400' : 'text-slate-100'}`}>
              {usedGunSlots} / {maxGunSlots}
            </span>
          </div>

          <div className="ev-panel-inset px-3 py-2 rounded-lg text-center">
            <span className="text-slate-400 text-xs block font-bold uppercase">TURRET SLOTS</span>
            <span className={`font-black text-sm tabular-nums ${usedTurretSlots >= maxTurretSlots ? 'text-amber-400' : 'text-slate-100'}`}>
              {usedTurretSlots} / {maxTurretSlots}
            </span>
          </div>

          <div className="ev-panel-inset px-3 py-2 rounded-lg text-center">
            <span className="text-slate-400 text-xs block font-bold uppercase">OUTFIT MASS</span>
            <span className={`font-black text-sm tabular-nums ${usedMass >= maxMass ? 'text-rose-400' : 'text-cyan-300'}`}>
              {usedMass} / {maxMass} t
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-mono">
        {['all', 'weapon', 'turret', 'shield', 'engine', 'cargo', 'special'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick(600);
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-2 rounded-lg capitalize whitespace-nowrap cursor-pointer transition-all font-bold ${
              selectedCategory === cat
                ? 'ev-btn-cyan text-white shadow-md'
                : 'ev-btn text-slate-300 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Hardware' : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Outfits for Sale & Currently Equipped */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Available Hardware (6 cols) */}
        <div className="lg:col-span-6 ev-panel rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-slate-900 border-b border-slate-700 text-xs font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>AVAILABLE MODULES ({availableOutfits.length})</span>
              <SectionEditButton label="Edit Catalog" />
            </div>
            <span>PRICE / TECH</span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[420px] overflow-y-auto no-scrollbar">
            {availableOutfits.map((outfit) => {
              const isSelected = selectedOutfitId === outfit.id;

              return (
                <div
                  key={outfit.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedOutfitId(outfit.id);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors text-xs font-mono flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-l-4 border-cyan-400 shadow-inner'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {outfit.image && (
                      <div className="w-12 h-12 rounded-lg bg-black border border-slate-700 flex items-center justify-center p-1 shrink-0">
                        <img
                          src={outfit.image}
                          alt={outfit.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <span className={`font-bold text-sm block truncate ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                        {outfit.name}
                      </span>
                      <span className="text-xs text-slate-400 capitalize truncate block">
                        {outfit.slotType} slot · {outfit.mass}t mass
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-amber-400 tabular-nums block text-sm sm:text-base">
                      {outfit.cost.toLocaleString()} Cr
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Tier {outfit.techLevel} Tech
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Detail & Currently Mounted List (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Selected Item Detail */}
          <div className="ev-panel rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-700/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 block font-bold tracking-wider">HARDWARE SPECIFICATION</span>
                  <SectionEditButton label="Edit Specs" />
                </div>
                <h4 className="text-lg sm:text-xl font-display font-black text-slate-100 uppercase">
                  {selectedOutfit.name}
                </h4>
              </div>
              <span className="text-lg sm:text-xl font-mono font-black text-amber-400 tabular-nums">
                {selectedOutfit.cost.toLocaleString()} Cr
              </span>
            </div>

            {/* Original Escape Velocity Hardware Artwork */}
            {selectedOutfit.image && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 ev-panel-inset p-4 flex items-center justify-center min-h-[110px]">
                <img
                  src={selectedOutfit.image}
                  alt={selectedOutfit.name}
                  className="max-h-24 max-w-[140px] object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/85 border border-cyan-500/50 text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                  Original EV Hardware Art
                </div>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed ev-panel-inset p-3.5 rounded-lg">
              {selectedOutfit.description}
            </p>

            <div className="flex items-center gap-2.5 text-xs font-mono flex-wrap">
              <span className="px-3 py-1 rounded ev-panel-inset text-slate-200">
                Mount: <strong className="capitalize text-cyan-300">{selectedOutfit.slotType}</strong>
              </span>
              <span className="px-3 py-1 rounded ev-panel-inset text-slate-200">
                Mass: <strong className="text-amber-300">{selectedOutfit.mass} t</strong>
              </span>
              <span className="px-3 py-1 rounded ev-panel-inset text-slate-200">
                Technology: <strong className="text-emerald-400">Tier {selectedOutfit.techLevel}</strong>
              </span>
            </div>

            {/* Mount Button */}
            <button
              onClick={() => {
                if (canMount) {
                  sound.playCredit();
                  onBuyOutfit(selectedOutfit);
                } else {
                  sound.playAlert();
                }
              }}
              disabled={!canMount}
              className={`w-full py-3.5 font-display font-black text-sm uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                canMount
                  ? 'ev-btn-cyan shadow-xl'
                  : 'ev-btn opacity-50 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>
                {!canAfford
                  ? 'Insufficient Credits'
                  : !hasFreeGunSlot
                  ? 'Gun Hardpoints Full'
                  : !hasFreeTurretSlot
                  ? 'Turret Mounts Full'
                  : !hasFreeMass
                  ? 'Exceeds Vessel Mass Limit'
                  : `Purchase & Mount (${selectedOutfit.cost.toLocaleString()} Cr)`}
              </span>
            </button>
          </div>

          {/* Currently Mounted Hardware on Vessel */}
          <div className="ev-panel rounded-xl p-4 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-700/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider">MOUNTED HARDWARE ({player.equippedOutfits.length})</span>
                <SectionEditButton label="Edit List" />
              </div>
              <span className="text-xs text-amber-300 font-semibold">SELL REFUND: 90%</span>
            </div>

            {player.equippedOutfits.length === 0 ? (
              <div className="py-4 text-center text-xs sm:text-sm font-mono text-slate-400">
                No custom outfits installed. Standard factory stock configuration.
              </div>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto no-scrollbar">
                {player.equippedOutfits.map((outfit, index) => {
                  const refund = Math.round(outfit.cost * 0.9);

                  return (
                    <div
                      key={`${outfit.id}-${index}`}
                      className="ev-panel-inset p-2.5 rounded-lg flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <span className="text-slate-100 font-bold block truncate">{outfit.name}</span>
                        <span className="text-xs text-slate-400 capitalize">
                          {outfit.slotType} · {outfit.mass}t
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-emerald-400 font-bold tabular-nums">+{refund.toLocaleString()} Cr</span>
                        <button
                          onClick={() => {
                            sound.playCredit();
                            onSellOutfit(index);
                          }}
                          className="ev-btn p-1.5 text-rose-300 hover:text-white"
                          title="Sell Outfit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
