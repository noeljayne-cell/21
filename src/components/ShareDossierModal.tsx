import React, { useState } from 'react';
import { StarSystem, StellarObject } from '../types/game';
import { STAR_SYSTEMS, generateSystemDossierText } from '../data/galaxyData';
import { sound } from '../audio/soundFx';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  Store, 
  Wrench, 
  Radio, 
  Briefcase, 
  Landmark, 
  Wine, 
  MapPin, 
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ShareDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: StarSystem;
  landedObject: StellarObject | null;
  onAppendNotes: (noteText: string) => void;
}

export const ShareDossierModal: React.FC<ShareDossierModalProps> = ({
  isOpen,
  onClose,
  system,
  landedObject,
  onAppendNotes,
}) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>(system.id);
  const [copied, setCopied] = useState<boolean>(false);
  const [addedToNotes, setAddedToNotes] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  if (!isOpen) return null;

  const currentSys = STAR_SYSTEMS.find((s) => s.id === selectedSystemId) || system;
  const isViewingCurrent = currentSys.id === system.id;
  const activeLanded = isViewingCurrent ? landedObject : null;

  const fullDossierText = generateSystemDossierText(currentSys, activeLanded || undefined);

  const handleCopy = async () => {
    sound.playCredit();
    try {
      await navigator.clipboard.writeText(fullDossierText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleAddToNotes = () => {
    sound.playCredit();
    onAppendNotes(`\n\n[STARDATE ARCHIVE: ${currentSys.name.toUpperCase()}]\n` + fullDossierText);
    setAddedToNotes(true);
    setTimeout(() => setAddedToNotes(false), 2500);
  };

  const filteredSystems = STAR_SYSTEMS.filter(s => 
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.faction.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-950 border border-cyan-800/60 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-500/10 rounded border border-cyan-500/30 text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                GALACTIC RECONNAISSANCE & TABLETOP DOSSIER
              </span>
              <h2 className="text-base font-display font-bold text-slate-100 uppercase tracking-wide">
                Planetary Systems & Landing Options Directory
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Quick System Search Bar */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* System Switcher Dropdown */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <select
              value={selectedSystemId}
              onChange={(e) => {
                sound.playClick(600);
                setSelectedSystemId(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {STAR_SYSTEMS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.faction}) - {s.stellarObjects.length} bodies
                </option>
              ))}
            </select>
          </div>

          {/* Share & Copy Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Dossier Copied!' : 'Copy Tabletop Intel'}</span>
            </button>

            <button
              onClick={handleAddToNotes}
              className="flex-1 sm:flex-none px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-display font-semibold text-xs rounded border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {addedToNotes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{addedToNotes ? 'Added to Notes!' : 'Append to Notes'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: System & Planetary Breakdown */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-xs">
          {/* Active System Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  SYSTEM OVERVIEW // {currentSys.sector}
                </span>
                <h3 className="text-xl font-display font-bold text-cyan-300 uppercase">
                  {currentSys.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {currentSys.faction}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                  Tech Tier {currentSys.techLevel}/7
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                  {currentSys.security} Security
                </span>
              </div>
            </div>

            <p className="text-slate-300 font-sans leading-relaxed text-xs">
              {currentSys.description}
            </p>

            <div className="text-[11px] font-mono text-slate-400 pt-1">
              <strong>Hyperlane Jump Links: </strong>
              <span className="text-slate-300">
                {currentSys.connectedSystemIds
                  .map((id) => STAR_SYSTEMS.find((s) => s.id === id)?.name || id)
                  .join(' · ')}
              </span>
            </div>
          </div>

          {/* Planetary Bodies & Individual Options Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Planets & Spaceports in {currentSys.name} ({currentSys.stellarObjects.length})
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Individual Landing Facility Status
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentSys.stellarObjects.map((obj) => {
                const isLandedHere = activeLanded && activeLanded.id === obj.id;

                return (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isLandedHere
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-2">
                      <div className="flex items-start gap-3">
                        {obj.customImage && (
                          <div className="w-14 h-11 rounded border border-slate-800 bg-black overflow-hidden shrink-0 hidden sm:block">
                            <img
                              src={obj.customImage}
                              alt={obj.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-slate-100 uppercase">
                              {obj.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 capitalize">
                              {obj.type}
                            </span>
                            {isLandedHere && (
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Current Vessel Location
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-sans leading-relaxed">
                            {obj.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Facility Options Grid on This Specific Planet */}
                    <div className="pt-2.5 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                        Available Landing Options on {obj.name}:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 font-mono text-[11px]">
                        {/* 1. Bar */}
                        <div
                          className={`p-1.5 rounded flex items-center gap-1.5 border ${
                            obj.facilities.spaceportBar
                              ? 'bg-amber-950/30 text-amber-300 border-amber-500/30'
                              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                          }`}
                        >
                          <Wine className="w-3 h-3 shrink-0" />
                          <span>Spaceport Bar</span>
                        </div>

                        {/* 2. Commodities */}
                        <div
                          className={`p-1.5 rounded flex items-center gap-1.5 border ${
                            obj.facilities.commodityExchange
                              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                          }`}
                        >
                          <Store className="w-3 h-3 shrink-0" />
                          <span>Commodities</span>
                        </div>

                        {/* 3. Shipyard */}
                        <div
                          className={`p-1.5 rounded flex items-center gap-1.5 border ${
                            obj.facilities.shipyard
                              ? 'bg-cyan-950/30 text-cyan-300 border-cyan-500/30 font-semibold'
                              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                          }`}
                        >
                          <Wrench className="w-3 h-3 shrink-0" />
                          <span>Shipyard</span>
                        </div>

                        {/* 4. Outfitter */}
                        <div
                          className={`p-1.5 rounded flex items-center gap-1.5 border ${
                            obj.facilities.outfitter
                              ? 'bg-purple-950/30 text-purple-300 border-purple-500/30'
                              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                          }`}
                        >
                          <Radio className="w-3 h-3 shrink-0" />
                          <span>Outfitter</span>
                        </div>

                        {/* 5. Mission Board */}
                        <div
                          className={`p-1.5 rounded flex items-center gap-1.5 border ${
                            obj.facilities.missionComputer
                              ? 'bg-blue-950/30 text-blue-300 border-blue-500/30'
                              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                          }`}
                        >
                          <Briefcase className="w-3 h-3 shrink-0" />
                          <span>Mission Board</span>
                        </div>

                        {/* 6. Bank */}
                        <div
                          className={`p-1.5 rounded flex items-center gap-1.5 border ${
                            obj.facilities.bank
                              ? 'bg-amber-950/30 text-amber-300 border-amber-500/30'
                              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                          }`}
                        >
                          <Landmark className="w-3 h-3 shrink-0" />
                          <span>Bank & Harbor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Starchart Database · {STAR_SYSTEMS.length} Systems Cataloged</span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
