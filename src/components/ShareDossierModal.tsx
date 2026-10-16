import React, { useState } from 'react';
import { StarSystem, StellarObject } from '../types/game';
import { STAR_SYSTEMS, generateSystemDossierText, getStellarObjectImage } from '../data/galaxyData';
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
  Search,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-3xl max-h-[92vh] ev-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-slate-700">
        {/* Modal Header */}
        <div className="px-5 py-4 ev-titlebar flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 rounded-lg border border-cyan-500/50 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                GALACTIC RECONNAISSANCE &amp; TABLETOP DOSSIER
              </span>
              <h2 className="text-base sm:text-lg font-display font-black text-slate-100 uppercase tracking-wide">
                Planetary Systems &amp; Landing Options Directory
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="ev-btn p-2 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Quick System Search Bar */}
        <div className="p-4 ev-panel-inset border-b border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* System Switcher Dropdown */}
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={selectedSystemId}
              onChange={(e) => {
                sound.playClick(600);
                setSelectedSystemId(e.target.value);
              }}
              className="w-full ev-panel-inset rounded-lg pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono font-bold"
            >
              {STAR_SYSTEMS.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-950 text-slate-100">
                  {s.name} ({s.faction}) - {s.stellarObjects.length} bodies
                </option>
              ))}
            </select>
          </div>

          {/* Share & Copy Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2 ev-btn-cyan text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Dossier Copied!' : 'Copy Tabletop Intel'}</span>
            </button>

            <button
              onClick={handleAddToNotes}
              className="flex-1 sm:flex-none px-4 py-2 ev-btn text-amber-300 hover:text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {addedToNotes ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
              <span>{addedToNotes ? 'Added to Notes!' : 'Append to Notes'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: System & Planetary Breakdown */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-xs">
          {/* Active System Card */}
          <div className="ev-panel p-5 rounded-xl space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  SYSTEM OVERVIEW // {currentSys.sector}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-black text-slate-100 uppercase">
                  {currentSys.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1 rounded ev-panel-inset text-slate-200 font-bold">
                  {currentSys.faction}
                </span>
                <span className="px-3 py-1 rounded ev-panel-inset text-amber-400 font-bold">
                  Tech Tier {currentSys.techLevel}/7
                </span>
                <span className="px-3 py-1 rounded ev-panel-inset text-emerald-400 font-bold">
                  {currentSys.security} Security
                </span>
              </div>
            </div>

            <p className="text-slate-100 font-sans leading-relaxed text-sm ev-panel-inset p-3.5 rounded-lg">
              {currentSys.description}
            </p>

            <div className="text-xs font-mono text-slate-300 pt-1">
              <strong className="text-cyan-300">Hyperlane Jump Links: </strong>
              <span>
                {currentSys.connectedSystemIds
                  .map((id) => STAR_SYSTEMS.find((s) => s.id === id)?.name || id)
                  .join(' · ')}
              </span>
            </div>
          </div>

          {/* Planetary Bodies & Individual Options Breakdown */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="uppercase tracking-wider text-cyan-300 font-bold">
                Planets &amp; Spaceports in {currentSys.name} ({currentSys.stellarObjects.length})
              </span>
              <span className="text-slate-400">
                Individual Landing Facility Status
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {currentSys.stellarObjects.map((obj) => {
                const isLandedHere = activeLanded && activeLanded.id === obj.id;

                return (
                  <div
                    key={obj.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isLandedHere
                        ? 'ev-panel border-2 border-emerald-500/80 shadow-xl'
                        : 'ev-panel shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-700/80 pb-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-16 h-14 rounded-lg border border-slate-700 bg-black overflow-hidden shrink-0 hidden sm:block">
                          <img
                            src={getStellarObjectImage(obj)}
                            alt={obj.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-display font-black text-base text-slate-100 uppercase">
                              {obj.name}
                            </span>
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-black border border-slate-700 text-slate-300 capitalize font-semibold">
                              {obj.type}
                            </span>
                            {isLandedHere && (
                              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/60 flex items-center gap-1 font-bold">
                                <ShieldCheck className="w-3.5 h-3.5" /> Current Vessel Location
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                            {obj.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Facility Options Grid on This Specific Planet */}
                    <div className="pt-3 space-y-2">
                      <span className="text-xs font-mono uppercase text-slate-300 block tracking-wider font-bold">
                        Available Landing Options on {obj.name}:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-xs">
                        {/* 1. Bar */}
                        <div
                          className={`p-2 rounded-lg flex items-center gap-1.5 border font-semibold ${
                            obj.facilities.spaceportBar
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                              : 'bg-black text-slate-600 border-slate-900 line-through'
                          }`}
                        >
                          <Wine className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          <span className="truncate">Bar</span>
                        </div>

                        {/* 2. Commodities */}
                        <div
                          className={`p-2 rounded-lg flex items-center gap-1.5 border font-semibold ${
                            obj.facilities.commodityExchange
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                              : 'bg-black text-slate-600 border-slate-900 line-through'
                          }`}
                        >
                          <Store className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span className="truncate">Market</span>
                        </div>

                        {/* 3. Shipyard */}
                        <div
                          className={`p-2 rounded-lg flex items-center gap-1.5 border font-bold ${
                            obj.facilities.shipyard
                              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                              : 'bg-black text-slate-600 border-slate-900 line-through'
                          }`}
                        >
                          <Wrench className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                          <span className="truncate">Shipyard</span>
                        </div>

                        {/* 4. Outfitter */}
                        <div
                          className={`p-2 rounded-lg flex items-center gap-1.5 border font-semibold ${
                            obj.facilities.outfitter
                              ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                              : 'bg-black text-slate-600 border-slate-900 line-through'
                          }`}
                        >
                          <Radio className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                          <span className="truncate">Outfitter</span>
                        </div>

                        {/* 5. Mission Board */}
                        <div
                          className={`p-2 rounded-lg flex items-center gap-1.5 border font-semibold ${
                            obj.facilities.missionComputer
                              ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                              : 'bg-black text-slate-600 border-slate-900 line-through'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                          <span className="truncate">Jobs</span>
                        </div>

                        {/* 6. Bank */}
                        <div
                          className={`p-2 rounded-lg flex items-center gap-1.5 border font-semibold ${
                            obj.facilities.bank
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                              : 'bg-black text-slate-600 border-slate-900 line-through'
                          }`}
                        >
                          <Landmark className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                          <span className="truncate">Bank</span>
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
        <div className="p-3.5 ev-titlebar flex items-center justify-between text-xs font-mono text-slate-300">
          <span>Starchart Database · {STAR_SYSTEMS.length} Systems Cataloged</span>
          <button
            onClick={onClose}
            className="ev-btn px-4 py-1.5 text-xs font-bold uppercase rounded cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
