export type Faction = 
  | 'Confederation'
  | 'Rebellion'
  | 'Guild of Traders'
  | 'Renegades'
  | 'Pirates'
  | 'Independent'
  | 'Cydonian'
  | 'Lethean'
  | 'Vell-os'
  | 'Alien Remnant';

export type SecurityLevel = 'High' | 'Medium' | 'Low' | 'Anarchy';

export interface Commodity {
  id: string;
  name: string;
  basePrice: number;
  category: 'essential' | 'industrial' | 'luxury' | 'contraband';
  description: string;
  isContraband?: boolean;
}

export interface OutfitItem {
  id: string;
  name: string;
  category: 'weapon' | 'turret' | 'shield' | 'engine' | 'cargo' | 'special';
  cost: number;
  mass: number;
  techLevel: number;
  description: string;
  slotType: 'gun' | 'turret' | 'engine' | 'internal';
  image?: string;
  statMod: {
    shields?: number;
    armor?: number;
    cargo?: number;
    fuel?: number;
    speed?: number;
    turn?: number;
    damage?: number;
    contrabandShielding?: number;
    solarScoop?: boolean;
  };
}

export interface Ship {
  id: string;
  name: string;
  modelClass: string;
  manufacturer: string;
  cost: number;
  description: string;
  baseArmor: number;
  baseShields: number;
  speed: number; // 1-10 scale
  turnRate: number; // 1-10 scale
  cargoCapacity: number; // tons
  fuelCapacity: number; // number of hyperjumps
  gunSlots: number;
  turretSlots: number;
  engineSlots: number;
  maxMass: number;
  requiredTechLevel: number;
  role: string;
  image?: string;
}

export interface StellarObject {
  id: string;
  name: string;
  type: 'planet' | 'station' | 'moon';
  parentId?: string; // Optional parent object ID if this body is a satellite (e.g. moon or orbital station)
  orbitRadius: number; // distance from central star or parent object (pixels in system view)
  orbitSpeed: number; // orbital angular velocity
  initialAngle: number;
  size: number;
  color: string;
  rings?: boolean;
  atmosphereColor?: string;
  habitable: boolean;
  landingAllowed: boolean;
  description: string;
  imageType: 'spire' | 'station' | 'cantina' | 'dock';
  customImage?: string;
  facilities: {
    spaceportBar: boolean;
    commodityExchange: boolean;
    shipyard: boolean;
    outfitter: boolean;
    missionComputer: boolean;
    bank: boolean;
  };
  commodityPriceModifiers: Record<string, number>; // multiplier on base price (e.g. 0.7 to 1.6)
}

export interface StarSystem {
  id: string;
  name: string;
  sector: string;
  x: number; // galaxy map coordinates (0 - 1000)
  y: number; // galaxy map coordinates (0 - 800)
  faction: Faction;
  techLevel: number; // 1 - 7
  security: SecurityLevel;
  stellarClass: string;
  starColor: string;
  starRadius: number;
  description: string;
  connectedSystemIds: string[];
  stellarObjects: StellarObject[];
  specialConditions?: string;
  loanInterestRate?: number; // 5% to 10% variable depending on system sec
}

export interface Mission {
  id: string;
  title: string;
  type: 'cargo' | 'passenger' | 'rush' | 'bounty' | 'smuggling';
  originSystemId: string;
  originObjectId: string;
  targetSystemId: string;
  targetObjectId: string;
  targetPlanetName: string;
  targetSystemName: string;
  cargoTons?: number;
  passengers?: number;
  rewardCredits: number;
  deadlineStardate: number;
  description: string;
  riskLevel: 'Safe' | 'Moderate' | 'Dangerous' | 'Lethal';
  completed: boolean;
}

export interface EscortWingman {
  id: string;
  name: string;
  callsign: string;
  shipModel: string;
  dailyWage: number;
  combatRating: number;
  dialogue: string;
}

export interface PlayerState {
  pilotName: string;
  shipName: string;
  currentShip: Ship;
  credits: number;
  debt: number;
  currentFuel: number;
  currentShields: number;
  currentArmor: number;
  currentSystemId: string;
  currentOrbitObjectId: string | null;
  landedObjectId: string | null;
  cargo: Record<string, number>; // commodityId -> tons
  equippedOutfits: OutfitItem[];
  activeMissions: Mission[];
  escorts: EscortWingman[];
  stardate: number; // e.g. 3026.10
  licenseActive: boolean;
  notes: string;
  visitedSystems: string[];
}

export interface TabletopLogEntry {
  id: string;
  stardate: number;
  type: 'jump' | 'land' | 'trade' | 'combat' | 'mission' | 'dice';
  text: string;
}

export type LogEntry = TabletopLogEntry;
