import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, OutfitItem } from '../types/game';
import { OUTFITS } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { Radio, Crosshair, Shield, Zap, Package, Trash2, Plus, Sparkles, Check } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header Slot Diagnostic */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">SHIP OUTFITTER FACILITY</span>
          <span className="text-base font-display font-bold text-slate-100">
            {planet.name} Hardware Bay (Tier {system.techLevel})
          </span>
        </div>

        {/* Diagnostic hardpoint badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">GUN SLOTS</span>
            <span className={`font-bold tabular-nums ${usedGunSlots >= maxGunSlots ? 'text-amber-400' : 'text-slate-200'}`}>
              {usedGunSlots} / {maxGunSlots}
            </span>
          </div>

          <div className="bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">TURRET SLOTS</span>
            <span className={`font-bold tabular-nums ${usedTurretSlots >= maxTurretSlots ? 'text-amber-400' : 'text-slate-200'}`}>
              {usedTurretSlots} / {maxTurretSlots}
            </span>
          </div>

          <div className="bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">OUTFIT MASS</span>
            <span className={`font-bold tabular-nums ${usedMass >= maxMass ? 'text-rose-400' : 'text-cyan-300'}`}>
              {usedMass} / {maxMass} t
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-mono">
        {['all', 'weapon', 'turret', 'shield', 'engine', 'cargo', 'special'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick(600);
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded capitalize whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat === 'all' ? 'All Hardware' : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Outfits for Sale & Currently Equipped */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Available Hardware (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>AVAILABLE MODULES</span>
            <span>PRICE / TECH</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[360px] overflow-y-auto no-scrollbar">
            {availableOutfits.map((outfit) => {
              const isSelected = selectedOutfitId === outfit.id;

              return (
                <div
                  key={outfit.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedOutfitId(outfit.id);
                  }}
                  className={`p-3 cursor-pointer transition-colors text-xs font-mono flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {outfit.image && (
                      <div className="w-10 h-10 rounded bg-black/80 border border-slate-800 flex items-center justify-center p-0.5 shrink-0">
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
                      <span className={`font-semibold block truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {outfit.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize truncate block">
                        {outfit.slotType} slot · {outfit.mass}t mass
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-amber-400 tabular-nums block">
                      {outfit.cost.toLocaleString()} Cr
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tier {outfit.techLevel}
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
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-3">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">HARDWARE SPECIFICATION</span>
                <h4 className="text-base font-display font-bold text-cyan-300 uppercase">
                  {selectedOutfit.name}
                </h4>
              </div>
              <span className="text-base font-mono font-bold text-amber-400 tabular-nums">
                {selectedOutfit.cost.toLocaleString()} Cr
              </span>
            </div>

            {/* Original Escape Velocity Hardware Artwork */}
            {selectedOutfit.image && (
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-black/90 p-3 flex items-center justify-center min-h-[96px]">
                <img
                  src={selectedOutfit.image}
                  alt={selectedOutfit.name}
                  className="max-h-20 max-w-[120px] object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                  Original EV Hardware Art
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {selectedOutfit.description}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                Slot: <strong className="capitalize">{selectedOutfit.slotType}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                Mass: <strong>{selectedOutfit.mass} t</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                Tech: <strong>Tier {selectedOutfit.techLevel}</strong>
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
              className={`w-full py-2.5 font-display font-semibold text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer ${
                canMount
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {!canAfford
                  ? 'Insufficient Credits'
                  : !hasFreeGunSlot
                  ? 'Gun Slots Full'
                  : !hasFreeTurretSlot
                  ? 'Turret Slots Full'
                  : !hasFreeMass
                  ? 'Exceeds Vessel Mass Limit'
                  : `Purchase & Mount (${selectedOutfit.cost.toLocaleString()} Cr)`}
              </span>
            </button>
          </div>

          {/* Currently Mounted Hardware on Vessel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-1.5">
              <span>MOUNTED HARDWARE ({player.equippedOutfits.length})</span>
              <span className="text-[10px]">SELL REFUND: 90%</span>
            </div>

            {player.equippedOutfits.length === 0 ? (
              <div className="py-4 text-center text-xs font-mono text-slate-500">
                No custom outfits installed. Standard stock configuration.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto no-scrollbar">
                {player.equippedOutfits.map((outfit, index) => {
                  const refund = Math.round(outfit.cost * 0.9);

                  return (
                    <div
                      key={`${outfit.id}-${index}`}
                      className="bg-slate-950/80 border border-slate-800 p-2 rounded flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <span className="text-slate-200 font-semibold block">{outfit.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {outfit.slotType} · {outfit.mass}t
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-amber-300 tabular-nums">+{refund} Cr</span>
                        <button
                          onClick={() => {
                            sound.playCredit();
                            onSellOutfit(index);
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded transition-colors cursor-pointer"
                          title="Sell Outfit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
