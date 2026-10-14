import React, { useState } from 'react';
import { StellarObject, StarSystem, PlayerState, Mission } from '../types/game';
import { generateMissionsForPlanet } from '../data/galaxyData';
import { formatGameDate } from '../utils/dateUtils';
import { sound } from '../audio/soundFx';
import { Briefcase, CheckCircle2, Clock, MapPin, AlertTriangle, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header Mission Diagnostic */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">INTERSTELLAR JOB BOARD</span>
            <span className="text-base font-display font-bold text-slate-100">
              {planet.name} Logistics Clearinghouse
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playMenu();
              setActiveTab('available');
            }}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'available'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Available Jobs ({availableMissions.length})
          </button>
          <button
            onClick={() => {
              sound.playMenu();
              setActiveTab('active');
            }}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Active Contracts ({player.activeMissions.length})
          </button>
        </div>
      </div>

      {/* Deliverable Missions Banner (Ready for Payout right now!) */}
      {deliverableMissions.length > 0 && (
        <div className="bg-emerald-950/40 border border-emerald-500/50 p-3.5 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-display font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Target Destination Reached · Ready for Consignment Handover!</span>
          </div>
          <div className="space-y-2">
            {deliverableMissions.map((m) => (
              <div
                key={m.id}
                className="bg-slate-950/80 p-3 rounded border border-emerald-800/40 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-slate-100 block">{m.title}</span>
                  <span className="text-slate-400 text-[10px]">
                    Contract signed at origin. Delivery authorized on {planet.name}.
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playCredit();
                    onCompleteMission(m.id);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-slate-950 font-display font-bold text-xs rounded shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer transition-all whitespace-nowrap"
                >
                  Deliver & Collect +{m.rewardCredits.toLocaleString()} Cr
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Available Missions */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          {availableMissions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded text-xs font-mono text-slate-400">
              No new contracts posted at this terminal right now. Check neighboring systems or advance stardate.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {availableMissions.map((mission) => {
                const needsCargo = (mission.cargoTons || 0) > freeCargoTons;

                return (
                  <div
                    key={mission.id}
                    className="p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-slate-100">
                            {mission.title}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                            mission.riskLevel === 'Dangerous'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {mission.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                          {mission.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-mono font-bold text-amber-400 tabular-nums block">
                          +{mission.rewardCredits.toLocaleString()} Cr
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Contract Bounty</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <div className="flex flex-wrap items-center gap-4 text-slate-300">
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Dest: <strong>{mission.targetPlanetName}</strong> ({mission.targetSystemName})</span>
                        </div>
                        {mission.cargoTons && (
                          <span className={needsCargo ? 'text-rose-400' : 'text-slate-300'}>
                            Cargo: {mission.cargoTons} Tons {needsCargo && '(Hold Full!)'}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Expires: {formatGameDate(mission.deadlineStardate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            sound.playClick(600);
                            onPlotRouteToSystem(mission.targetSystemId);
                          }}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
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
                          className={`px-3.5 py-1.5 font-display font-semibold text-xs rounded transition-all cursor-pointer ${
                            !needsCargo
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
        <div className="space-y-3">
          {player.activeMissions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded text-xs font-mono text-slate-400">
              No active mission contracts. Accept contracts from the job board above!
            </div>
          ) : (
            <div className="space-y-3">
              {player.activeMissions.map((m) => {
                const isExpired = player.stardate > m.deadlineStardate;

                return (
                  <div
                    key={m.id}
                    className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-mono space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block text-sm font-display">
                          {m.title}
                        </span>
                        <span className="text-slate-400 text-xs">
                          Deliver to {m.targetPlanetName} ({m.targetSystemName})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-400 tabular-nums block">
                          +{m.rewardCredits.toLocaleString()} Cr
                        </span>
                        <span className={isExpired ? 'text-rose-400 font-semibold' : 'text-slate-500'}>
                          {isExpired ? 'OVERDUE' : `Due: ${formatGameDate(m.deadlineStardate)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400">
                        {m.cargoTons ? `Occupies ${m.cargoTons} tons cargo hold` : 'Data manifest'}
                      </span>
                      <button
                        onClick={() => {
                          sound.playClick(600);
                          onPlotRouteToSystem(m.targetSystemId);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Show on Starchart</span>
                        <ArrowRight className="w-3 h-3" />
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
