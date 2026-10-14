import React, { useState, useEffect } from 'react';
import { 
  StarSystem, 
  StellarObject, 
  PlayerState, 
  Commodity, 
  Ship, 
  OutfitItem, 
  Mission, 
  EscortWingman, 
  TabletopLogEntry 
} from './types/game';
import { STAR_SYSTEMS, INITIAL_PLAYER_STATE, getSystemInterestRate, SHIPS, OUTFITS } from './data/galaxyData';
import { TopNav } from './components/TopNav';
import { GalaxyMap } from './components/GalaxyMap';
import { SystemView } from './components/SystemView';
import { PlanetaryLanding } from './components/PlanetaryLanding';
import { ShipStatusView } from './components/ShipStatusView';
import { TabletopCompanionDrawer } from './components/TabletopCompanionDrawer';
import { MainMenu } from './components/MainMenu';
import { formatGameDate } from './utils/dateUtils';
import { sound } from './audio/soundFx';

const STORAGE_KEY = 'ev_starfall_companion_state_v1';

export default function App() {
  // Load saved player state or initialize default
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_PLAYER_STATE;
  });

  const [systems] = useState<StarSystem[]>(STAR_SYSTEMS);
  const [currentView, setCurrentView] = useState<'galaxy' | 'system' | 'planet' | 'ship'>('planet');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mainMenuOpen, setMainMenuOpen] = useState<boolean>(false);
  const [tabletopDrawerOpen, setTabletopDrawerOpen] = useState<boolean>(false);
  const [logEntries, setLogEntries] = useState<TabletopLogEntry[]>([
    {
      id: 'log_0',
      stardate: 0,
      type: 'land',
      text: 'Docked at Levo Spaceport. Date: November 1, 2279. Bank debt: 69,420 Cr.',
    }
  ]);

  // Persist state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch {
      // Ignore storage errors
    }
  }, [player]);

  // Listen for Escape key to toggle Main Menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMainMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentSystem = systems.find((s) => s.id === player.currentSystemId) || systems[0];
  const landedObject = currentSystem.stellarObjects.find((o) => o.id === player.landedObjectId) || null;

  const addLog = (entry: TabletopLogEntry) => {
    setLogEntries((prev) => [entry, ...prev.slice(0, 40)]);
  };

  // Hyperspace Jump Handler: Advances time by exactly 1 Day + applies 5-10% variable loan interest based on sec
  const handleJumpToSystem = (targetSystem: StarSystem, stayOnGalaxyMap = false) => {
    const systemInterestRate = getSystemInterestRate(targetSystem);
    let jumpInterest = 0;
    let escortWages = 0;
    let nextStardate = player.stardate;

    setPlayer((prev) => {
      const nextFuel = Math.max(0, prev.currentFuel - 1);
      // Automatically advance time by exactly 1 Day per system jump
      nextStardate = prev.stardate + 1;
      escortWages = prev.escorts.reduce((sum, e) => sum + e.dailyWage, 0);

      // Variable interest on loans: 5% to 10% variable based on system security
      if (prev.debt > 0) {
        jumpInterest = Math.max(1, Math.round(prev.debt * (systemInterestRate / 100 / 10)));
      }

      const visited = prev.visitedSystems.includes(targetSystem.id)
        ? prev.visitedSystems
        : [...prev.visitedSystems, targetSystem.id];

      // If ship has solar scoop, auto-recharge 1 fuel if passing stars
      const hasScoop = prev.equippedOutfits.some((o) => o.statMod.solarScoop);
      const finalFuel = hasScoop ? Math.min(prev.currentShip.fuelCapacity, nextFuel + 1) : nextFuel;

      return {
        ...prev,
        currentSystemId: targetSystem.id,
        currentFuel: finalFuel,
        landedObjectId: null,
        currentOrbitObjectId: targetSystem.stellarObjects[0]?.id || null,
        stardate: nextStardate,
        visitedSystems: visited,
        credits: Math.max(0, prev.credits - escortWages),
        debt: prev.debt + jumpInterest,
        currentShields: prev.currentShip.baseShields,
      };
    });

    const interestNote = jumpInterest > 0 
      ? ` Bank loan interest: +${jumpInterest.toLocaleString()} Cr (${systemInterestRate.toFixed(1)}% variable rate).` 
      : '';
    const wageNote = escortWages > 0 
      ? ` Crew wages: -${escortWages.toLocaleString()} Cr.` 
      : '';

    addLog({
      id: `jump_${Date.now()}`,
      stardate: nextStardate,
      type: 'jump',
      text: `Hyperspace transit completed to ${targetSystem.name} (+1 Day, ${formatGameDate(nextStardate)}). Fuel: ${Math.max(0, player.currentFuel - 1)}.${interestNote}${wageNote}`,
    });

    if (!stayOnGalaxyMap) {
      setCurrentView('system');
    }
  };

  // Land / Dock on Planet or Station
  const handleLandOnObject = (targetObject: StellarObject) => {
    setPlayer((prev) => ({
      ...prev,
      landedObjectId: targetObject.id,
      currentOrbitObjectId: targetObject.id,
    }));

    addLog({
      id: `land_${Date.now()}`,
      stardate: player.stardate,
      type: 'land',
      text: `Docked at ${targetObject.name} (${currentSystem.name}). Surface facilities online.`,
    });

    setCurrentView('planet');
  };

  // Depart from Planet / Station into System Orbit
  const handleDepart = () => {
    setPlayer((prev) => ({
      ...prev,
      landedObjectId: null,
    }));

    addLog({
      id: `depart_${Date.now()}`,
      stardate: player.stardate,
      type: 'land',
      text: `Departed from ${landedObject?.name || 'surface'} into orbital pattern.`,
    });

    setCurrentView('system');
  };

  // Transition to System View from Galaxy Map
  const handleEnterSystemView = (sys: StarSystem) => {
    if (sys.id !== player.currentSystemId) {
      handleJumpToSystem(sys);
    } else {
      setCurrentView('system');
    }
  };

  // Commodity Trade Handlers
  const handleBuyCommodity = (commodity: Commodity, amount: number, unitCost: number) => {
    const totalCost = amount * unitCost;
    if (player.credits < totalCost) return false;

    setPlayer((prev) => {
      const currentQty = prev.cargo[commodity.id] || 0;
      return {
        ...prev,
        credits: prev.credits - totalCost,
        cargo: {
          ...prev.cargo,
          [commodity.id]: currentQty + amount,
        },
      };
    });

    addLog({
      id: `buy_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Purchased ${amount}t of ${commodity.name} for ${totalCost.toLocaleString()} Cr.`,
    });

    return true;
  };

  const handleSellCommodity = (commodity: Commodity, amount: number, unitPrice: number) => {
    const currentQty = player.cargo[commodity.id] || 0;
    if (currentQty < amount) return false;

    const totalEarned = amount * unitPrice;

    setPlayer((prev) => {
      const nextQty = currentQty - amount;
      const nextCargo = { ...prev.cargo };
      if (nextQty <= 0) {
        delete nextCargo[commodity.id];
      } else {
        nextCargo[commodity.id] = nextQty;
      }

      return {
        ...prev,
        credits: prev.credits + totalEarned,
        cargo: nextCargo,
      };
    });

    addLog({
      id: `sell_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Sold ${amount}t of ${commodity.name} for +${totalEarned.toLocaleString()} Cr.`,
    });

    return true;
  };

  // Purchase New Ship (Trade-in Allowance applied)
  const handlePurchaseShip = (newShip: Ship, netCost: number) => {
    if (player.credits < netCost) return;

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - netCost,
      currentShip: newShip,
      currentShields: newShip.baseShields,
      currentArmor: newShip.baseArmor,
      currentFuel: newShip.fuelCapacity,
    }));

    addLog({
      id: `ship_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Traded in vessel and commissioned new ${newShip.name} (${newShip.modelClass}) for ${netCost.toLocaleString()} Cr.`,
    });
  };

  // Outfit Equipment Handlers
  const handleBuyOutfit = (outfit: OutfitItem) => {
    if (player.credits < outfit.cost) return;

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - outfit.cost,
      equippedOutfits: [...prev.equippedOutfits, outfit],
    }));

    addLog({
      id: `outfit_buy_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Installed ${outfit.name} for ${outfit.cost.toLocaleString()} Cr.`,
    });
  };

  const handleSellOutfit = (index: number) => {
    const outfit = player.equippedOutfits[index];
    if (!outfit) return;

    const refund = Math.round(outfit.cost * 0.9);

    setPlayer((prev) => {
      const nextOutfits = [...prev.equippedOutfits];
      nextOutfits.splice(index, 1);
      return {
        ...prev,
        credits: prev.credits + refund,
        equippedOutfits: nextOutfits,
      };
    });

    addLog({
      id: `outfit_sell_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Removed and sold ${outfit.name} for +${refund.toLocaleString()} Cr.`,
    });
  };

  // Mission Handlers
  const handleAcceptMission = (mission: Mission) => {
    setPlayer((prev) => ({
      ...prev,
      activeMissions: [...prev.activeMissions, mission],
    }));

    addLog({
      id: `mission_accept_${Date.now()}`,
      stardate: player.stardate,
      type: 'mission',
      text: `Accepted contract: "${mission.title}" to ${mission.targetPlanetName} (${mission.rewardCredits.toLocaleString()} Cr).`,
    });

    return true;
  };

  const handleCompleteMission = (missionId: string) => {
    const mission = player.activeMissions.find((m) => m.id === missionId);
    if (!mission) return;

    sound.playCredit();

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits + mission.rewardCredits,
      activeMissions: prev.activeMissions.filter((m) => m.id !== missionId),
    }));

    addLog({
      id: `mission_complete_${Date.now()}`,
      stardate: player.stardate,
      type: 'mission',
      text: `Completed logistics contract: "${mission.title}". Awarded +${mission.rewardCredits.toLocaleString()} Cr!`,
    });
  };

  const handlePlotRouteToSystem = (targetSystemId: string) => {
    setCurrentView('galaxy');
  };

  // Mercenary Wingmen Handlers
  const handleHireEscort = (escort: EscortWingman) => {
    if (player.credits < escort.dailyWage) return;

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - escort.dailyWage,
      escorts: [...prev.escorts, escort],
    }));

    addLog({
      id: `hire_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Contracted mercenary escort ${escort.name} ("${escort.callsign}") piloting a ${escort.shipModel}.`,
    });
  };

  const handleDismissEscort = (escortId: string) => {
    const escort = player.escorts.find((e) => e.id === escortId);
    setPlayer((prev) => ({
      ...prev,
      escorts: prev.escorts.filter((e) => e.id !== escortId),
    }));

    addLog({
      id: `dismiss_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Dismissed escort ${escort?.name || 'pilot'} from formation.`,
    });
  };

  // Harbor & Bank Handlers
  const handleTakeLoan = (amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits + amount,
      debt: prev.debt + amount,
    }));

    addLog({
      id: `loan_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Borrowed +${amount.toLocaleString()} Cr commercial loan from First Interstellar Bank.`,
    });
  };

  const handleRepayLoan = (amount: number) => {
    const actualRepay = Math.min(amount, player.debt, player.credits);
    if (actualRepay <= 0) return;

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - actualRepay,
      debt: prev.debt - actualRepay,
    }));

    addLog({
      id: `repay_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Repaid -${actualRepay.toLocaleString()} Cr toward outstanding bank loan. Remaining debt: ${(player.debt - actualRepay).toLocaleString()} Cr.`,
    });
  };

  const handleRefuel = (cost: number) => {
    if (player.credits < cost) return;

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - cost,
      currentFuel: prev.currentShip.fuelCapacity,
    }));

    addLog({
      id: `refuel_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Refueled deuterium hyperdrive tanks to 100% capacity (${cost.toLocaleString()} Cr).`,
    });
  };

  const handleRepairHull = (cost: number) => {
    if (player.credits < cost) return;

    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - cost,
      currentArmor: prev.currentShip.baseArmor,
    }));

    addLog({
      id: `repair_${Date.now()}`,
      stardate: player.stardate,
      type: 'trade',
      text: `Repaired hull armor plating to factory specification (${cost.toLocaleString()} Cr).`,
    });
  };

  const handleSpendCredits = (amount: number): boolean => {
    if (player.credits < amount) return false;
    setPlayer((prev) => ({
      ...prev,
      credits: prev.credits - amount,
    }));
    return true;
  };

  // Advance Tabletop Turn / Date (in full days)
  const handleAdvanceTurn = (days: number) => {
    setPlayer((prev) => {
      const nextDate = prev.stardate + days;
      const totalWages = prev.escorts.reduce((sum, e) => sum + e.dailyWage * days, 0);
      const interest = prev.debt > 0 ? Math.round(prev.debt * 0.005 * days) : 0;

      return {
        ...prev,
        stardate: nextDate,
        credits: Math.max(0, prev.credits - totalWages),
        debt: prev.debt + interest,
        currentShields: prev.currentShip.baseShields,
      };
    });

    addLog({
      id: `turn_${Date.now()}`,
      stardate: player.stardate + days,
      type: 'dice',
      text: `Advanced campaign ${days} day(s). Date is now ${formatGameDate(player.stardate + days)}.`,
    });
  };

  const handleUpdateNotes = (notes: string) => {
    setPlayer((prev) => ({ ...prev, notes }));
  };

  const handleAppendNotes = (text: string) => {
    setPlayer((prev) => ({
      ...prev,
      notes: (prev.notes ? prev.notes + '\n' : '') + text,
    }));
  };

  const handleUpdatePilotInfo = (pilotName: string, shipName: string) => {
    setPlayer((prev) => ({ ...prev, pilotName, shipName }));
  };

  const handleAdjustDamage = (shieldsDelta: number, armorDelta: number) => {
    setPlayer((prev) => ({
      ...prev,
      currentShields: Math.max(0, Math.min(prev.currentShip.baseShields, prev.currentShields + shieldsDelta)),
      currentArmor: Math.max(0, Math.min(prev.currentShip.baseArmor, prev.currentArmor + armorDelta)),
    }));
  };

  // Start New Game with parameters requested: Shuttlecraft on Levo with 69,420 credits in debt
  const handleStartNewGame = (customPilotName: string, customShipName: string) => {
    const shuttle = SHIPS[0];
    const newPlayerState: PlayerState = {
      pilotName: customPilotName || 'Captain Jonathan Corvus',
      shipName: customShipName || 'SS Peregrine',
      currentShip: shuttle,
      credits: 2000,
      debt: 69420, // 69,420 credits in debt to be repaid to the bank!
      currentFuel: shuttle.fuelCapacity,
      currentShields: shuttle.baseShields,
      currentArmor: shuttle.baseArmor,
      currentSystemId: 'levo',
      currentOrbitObjectId: 'levo',
      landedObjectId: 'levo',
      cargo: {},
      equippedOutfits: [OUTFITS[0]],
      activeMissions: [
        {
          id: `init_mission_levo_${Date.now()}`,
          title: 'Urgent Medical Relief to Rigel Colony',
          type: 'rush',
          originSystemId: 'levo',
          originObjectId: 'levo',
          targetSystemId: 'rigel',
          targetObjectId: 'rigel_prime',
          targetPlanetName: 'Rigel Prime',
          targetSystemName: 'Rigel',
          cargoTons: 4,
          rewardCredits: 14500,
          deadlineStardate: 14,
          description: 'Deliver 4 tons of emergency medical supplies from Levo to Rigel Prime.',
          riskLevel: 'Moderate',
          completed: false,
        }
      ],
      escorts: [],
      stardate: 0, // November 1, 2279
      licenseActive: true,
      notes: 'Tabletop Campaign Dossier:\n- Starting vessel: Shuttlecraft docked at Levo Spaceport.\n- Outstanding Debt: 69,420 Cr owed to First Interstellar Bank (needs to be repaid!).\n- Launch Date: November 1, 2279.',
      visitedSystems: ['levo'],
    };

    setPlayer(newPlayerState);
    setCurrentView('planet');
    setLogEntries([
      {
        id: `log_init_${Date.now()}`,
        stardate: 0,
        type: 'land',
        text: 'Commissioned Shuttlecraft on Levo. 69,420 Cr commercial debt recorded at First Interstellar Bank. Date: November 1, 2279.',
      }
    ]);
  };

  // Load Saved Game Profile
  const handleLoadGame = (savedPlayer: PlayerState) => {
    setPlayer(savedPlayer);
    if (savedPlayer.landedObjectId) {
      setCurrentView('planet');
    } else {
      setCurrentView('system');
    }

    addLog({
      id: `load_${Date.now()}`,
      stardate: savedPlayer.stardate,
      type: 'land',
      text: `Loaded flight dossier for ${savedPlayer.pilotName} (${savedPlayer.shipName}). Current location: ${savedPlayer.currentSystemId.toUpperCase()}.`,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Top Universal Cockpit Navigation Dock */}
      <TopNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        player={player}
        currentSystem={currentSystem}
        landedObject={landedObject}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenTabletopTools={() => setTabletopDrawerOpen(true)}
        onOpenMainMenu={() => setMainMenuOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full overflow-hidden relative pb-13 md:pb-0">
        {currentView === 'galaxy' && (
          <GalaxyMap
            systems={systems}
            player={player}
            onJumpToSystem={handleJumpToSystem}
            onEnterSystemView={handleEnterSystemView}
            onLandOnObject={handleLandOnObject}
            onAppendNotes={handleAppendNotes}
          />
        )}

        {currentView === 'system' && (
          <SystemView
            system={currentSystem}
            player={player}
            onLandOnObject={handleLandOnObject}
            onReturnToGalaxyMap={() => setCurrentView('galaxy')}
            onAppendNotes={handleAppendNotes}
          />
        )}

        {currentView === 'planet' && landedObject && (
          <PlanetaryLanding
            planet={landedObject}
            system={currentSystem}
            player={player}
            onDepart={handleDepart}
            onBuyCommodity={handleBuyCommodity}
            onSellCommodity={handleSellCommodity}
            onPurchaseShip={handlePurchaseShip}
            onBuyOutfit={handleBuyOutfit}
            onSellOutfit={handleSellOutfit}
            onAcceptMission={handleAcceptMission}
            onCompleteMission={handleCompleteMission}
            onPlotRouteToSystem={handlePlotRouteToSystem}
            onHireEscort={handleHireEscort}
            onDismissEscort={handleDismissEscort}
            onTakeLoan={handleTakeLoan}
            onRepayLoan={handleRepayLoan}
            onRefuel={handleRefuel}
            onRepairHull={handleRepairHull}
            onSpendCredits={handleSpendCredits}
            onAppendNotes={handleAppendNotes}
          />
        )}

        {currentView === 'planet' && !landedObject && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="text-sm font-mono text-slate-400">
              Vessel is currently in orbit around {currentSystem.name}.
            </span>
            <button
              onClick={() => {
                sound.playClick(600);
                setCurrentView('system');
              }}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded transition-colors cursor-pointer"
            >
              Open In-System Radar to Target a Planet
            </button>
          </div>
        )}

        {currentView === 'ship' && (
          <ShipStatusView
            player={player}
            currentSystem={currentSystem}
            landedObject={landedObject}
            onUpdatePilotInfo={handleUpdatePilotInfo}
            onAdjustDamage={handleAdjustDamage}
          />
        )}
      </main>

      {/* Main Menu Modal (New Game, Save Game, Load Game, Options) */}
      <MainMenu
        isOpen={mainMenuOpen}
        onClose={() => setMainMenuOpen(false)}
        player={player}
        onStartNewGame={handleStartNewGame}
        onLoadGame={handleLoadGame}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Tabletop Tablet Companion Tools Drawer */}
      <TabletopCompanionDrawer
        isOpen={tabletopDrawerOpen}
        onClose={() => setTabletopDrawerOpen(false)}
        player={player}
        currentSystem={currentSystem}
        onAdvanceTurn={handleAdvanceTurn}
        onUpdateNotes={handleUpdateNotes}
        logEntries={logEntries}
        onAddLog={addLog}
      />
    </div>
  );
}
