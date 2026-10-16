import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Mission } from '../types/game';
import { generateMissionsForPlanet } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import { Briefcase, CheckCircle2, Clock, MapPin, AlertTriangle, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import { SectionEditButton } from './SectionEditButton';

interface MissionComputerProps {
  planet: StellarObject;
  system: StarSystem;
  player: PlayerState;
  onAcceptMission: (mission: Mission) => boolean;
  onCompleteMission: (missionId: string) => void;
  onPlotRouteToSystem: (targetSystemId: string) => void;
}

export const MissionComputer: React.FC<MissionComputerProps> = ({
  planet,
  system,
  player,
  onAcceptMission,
  onCompleteMission,
  onPlotRouteToSystem,
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active'>('available');
  // Generate missions available at this station
  const [availableMissions, setAvailableMissions] = useState<Mission[]>(() =>
    generateMissionsForPlanet(system, planet.id, player.stardate)
  );

  // Check which active missions can be delivered right here on this planet!
  const deliverableMissions = player.activeMissions.filter(
    (m) => m.targetSystemId === system.id && m.targetObjectId === planet.id
  );

  // Free cargo space
  const usedCargoTons = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  const maxCargoTons = player.currentShip.cargoCapacity + 
    player.equippedOutfits.reduce((sum, o) => sum + (o.statMod.cargo || 0), 0);
  const freeCargoTons = Math.max(0, maxCargoTons - usedCargoTons);

  return (
    <div className="space-y-5 select-none">
      {/* Header Mission Diagnostic in Escape Velocity Console Style */}
      <div className="ev-panel p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                INTERSTELLAR LOGISTICS JOB BOARD
              </span>
              <SectionEditButton label="Edit Header" />
            </div>
            <span className="text-lg sm:text-xl font-display font-black text-slate-100">
              {planet.name} Freight Dispatch &amp; Courier Terminal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playMenu();
              setActiveTab('available');
            }}
            className={`px-3.5 py-2 rounded text-xs sm:text-sm font-display font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'available'
                ? 'ev-btn-cyan shadow-md'
                : 'ev-btn text-slate-300 hover:text-white'
            }`}
          >
            Available Jobs ({availableMissions.length})
          </button>
          <button
            onClick={() => {
              sound.playMenu();
              setActiveTab('active');
            }}
            className={`px-3.5 py-2 rounded text-xs sm:text-sm font-display font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'active'
                ? 'ev-btn-amber shadow-md'
                : 'ev-btn text-slate-300 hover:text-white'
            }`}
          >
            Active Contracts ({player.activeMissions.length})
          </button>
        </div>
      </div>

      {/* Deliverable Missions Banner (Ready for Payout right now!) */}
      {deliverableMissions.length > 0 && (
        <div className="ev-panel border-2 border-emerald-500/70 p-4 sm:p-5 rounded-xl space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-display font-black uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Target Destination Reached · Ready for Consignment Handover!</span>
          </div>
          <div className="space-y-2.5">
            {deliverableMissions.map((m) => (
              <div
                key={m.id}
                className="ev-panel-inset p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-mono"
              >
                <div>
                  <span className="font-bold text-slate-100 text-base block font-display">{m.title}</span>
                  <span className="text-slate-300 text-xs mt-0.5 block">
                    Contract signed at origin. Delivery authorized on {planet.name}.
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playCredit();
                    onCompleteMission(m.id);
                  }}
                  className="ev-btn-emerald px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap"
                >
                  Deliver &amp; Collect +{m.rewardCredits.toLocaleString()} Cr
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Available Missions */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableMissions.length === 0 ? (
            <div className="p-10 text-center ev-panel rounded-xl text-xs sm:text-sm font-mono text-slate-400">
              No new contracts posted at this terminal right now. Check neighboring systems or advance time with system jumps.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                  Postings ({availableMissions.length} Contracts Open)
                </span>
                <SectionEditButton label="Edit Postings" />
              </div>
              <div className="grid grid-cols-1 gap-4">
              {availableMissions.map((mission) => {
                const needsCargo = (mission.cargoTons || 0) > freeCargoTons;

                return (
                  <div
                    key={mission.id}
                    className="p-5 ev-panel rounded-xl transition-all space-y-3.5 shadow-md hover:border-slate-600"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="space-y-1.5 flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-display font-black text-base sm:text-lg text-slate-100">
                            {mission.title}
                          </span>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            mission.riskLevel === 'Dangerous'
                              ? 'bg-rose-950 text-rose-300 border border-rose-600'
                              : 'bg-black text-slate-300 border border-slate-700'
                          }`}>
                            {mission.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 font-sans leading-relaxed">
                          {mission.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg sm:text-xl font-mono font-black text-amber-400 tabular-nums block">
                          +{mission.rewardCredits.toLocaleString()} Cr
                        </span>
                        <span className="text-xs font-mono text-slate-400">Contract Bounty</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono">
                      <div className="flex flex-wrap items-center gap-4 text-slate-200">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>Dest: <strong>{mission.targetPlanetName}</strong> ({mission.targetSystemName})</span>
                        </div>
                        {mission.cargoTons && (
                          <span className={needsCargo ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            Cargo: {mission.cargoTons} Tons {needsCargo && '(Hold Full!)'}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Expires: {formatGameDate(mission.deadlineStardate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => {
                            sound.playClick(600);
                            onPlotRouteToSystem(mission.targetSystemId);
                          }}
                          className="ev-btn px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                        >
                          View Route
                        </button>

                        <button
                          onClick={() => {
                            if (!needsCargo) {
                              const success = onAcceptMission(mission);
                              if (success) {
                                sound.playCredit();
                                setAvailableMissions(prev => prev.filter(m => m.id !== mission.id));
                              } else {
                                sound.playAlert();
                              }
                            } else {
                              sound.playAlert();
                            }
                          }}
                          disabled={needsCargo}
                          className={`px-4 py-2 font-display font-bold text-xs sm:text-sm rounded transition-all cursor-pointer ${
                            !needsCargo
                              ? 'ev-btn-cyan'
                              : 'ev-btn opacity-50 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {needsCargo ? 'Cargo Hold Full' : 'Accept Job'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Player Missions */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {player.activeMissions.length === 0 ? (
            <div className="p-10 text-center ev-panel rounded-xl text-xs sm:text-sm font-mono text-slate-400">
              No active mission contracts. Accept courier or cargo contracts from the job board above!
            </div>
          ) : (
            <div className="space-y-3.5">
              {player.activeMissions.map((m) => {
                const isExpired = player.stardate > m.deadlineStardate;

                return (
                  <div
                    key={m.id}
                    className="p-4 sm:p-5 ev-panel rounded-xl text-xs sm:text-sm font-mono space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-black text-slate-100 text-base sm:text-lg block font-display">
                          {m.title}
                        </span>
                        <span className="text-slate-300 text-xs sm:text-sm mt-0.5 block">
                          Consignment Bound for <strong className="text-cyan-300">{m.targetPlanetName}</strong> in the {m.targetSystemName} System
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-amber-400 tabular-nums text-base sm:text-lg block">
                          +{m.rewardCredits.toLocaleString()} Cr
                        </span>
                        <span className={`text-xs font-bold ${isExpired ? 'text-rose-400' : 'text-slate-400'}`}>
                          {isExpired ? 'CONTRACT OVERDUE' : `Deadline: ${formatGameDate(m.deadlineStardate)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-xs">
                      <span className="text-slate-300">
                        {m.cargoTons ? `Occupies ${m.cargoTons} tons of cargo space` : 'Data disc / passenger charter'}
                      </span>
                      <button
                        onClick={() => {
                          sound.playClick(600);
                          onPlotRouteToSystem(m.targetSystemId);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Plot Starchart Route</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
