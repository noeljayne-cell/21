import { Commodity, Faction, Mission, OutfitItem, PlayerState, Ship, StarSystem, EscortWingman, StellarObject } from '../types/game';
import galaxyBackdropImg from '../assets/images/ev_galaxy_backdrop_1791643142686.jpg';

// Image assets with restored original starfield backdrop
export const ASSET_IMAGES = {
  galaxyBackdrop: galaxyBackdropImg,
  planetSpire: '/assets/original/landings/PICT_10001.png',
  orbitalStation: '/assets/original/landings/PICT_11000.png',
  spaceportCantina: '/assets/original/landings/PICT_10006.png',
  shipyardDock: '/assets/original/landings/PICT_10028.png',
};

/**
 * Coherent and consistent image resolver across Port Overview, Spaceport Bar, System View, and Map Previews
 */
export function getStellarObjectImage(obj: StellarObject | null | undefined): string {
  if (!obj) return ASSET_IMAGES.planetSpire;
  if (obj.customImage) return obj.customImage;
  switch (obj.imageType) {
    case 'station':
      return ASSET_IMAGES.orbitalStation;
    case 'dock':
      return ASSET_IMAGES.shipyardDock;
    case 'cantina':
      return ASSET_IMAGES.spaceportCantina;
    case 'spire':
    default:
      return ASSET_IMAGES.planetSpire;
  }
}


export const COMMODITIES: Commodity[] = [
  { id: 'food', name: 'Food & Agricultural Rations', basePrice: 110, category: 'essential', description: 'Hydroponic grain, nutrient pastes, and fresh planetary produce.' },
  { id: 'ore', name: 'Raw Asteroid Ore', basePrice: 85, category: 'industrial', description: 'Unrefined iron, bauxite, and titanium slag mined from belt clusters.' },
  { id: 'machinery', name: 'Heavy Industrial Machinery', basePrice: 580, category: 'industrial', description: 'Robotic assembly rigs, terraforming atmospheric scrubbers, and industrial drills.' },
  { id: 'meds', name: 'Medical Supplies & Serums', basePrice: 420, category: 'essential', description: 'Cellular regeneration matrices and broad-spectrum vaccines.' },
  { id: 'electronics', name: 'Consumer Electronics & Avionics', basePrice: 340, category: 'industrial', description: 'Subspace transceivers and micro-fusion processors.' },
  { id: 'metals', name: 'Rare Isotopes & Precious Metals', basePrice: 850, category: 'industrial', description: 'Refined hyper-metals essential for warp coils and energy shielding.' },
  { id: 'luxury', name: 'Luxury Goods & Vintage Wines', basePrice: 1250, category: 'luxury', description: 'Vintage Hera vineyards, holographic fashion, and rare pearls.' },
  { id: 'munitions', name: 'Military Munitions & Warheads', basePrice: 720, category: 'industrial', description: 'Railgun slugs, plasma charges, and naval ordnance.' },
  { id: 'narcotics', name: 'Starlight Narcotics (Contraband)', basePrice: 1850, category: 'contraband', isContraband: true, description: 'Ill-gotten synthetic chemicals banned under Confederation law.' },
  { id: 'stembolts', name: 'Self-Sealing Stembolts', basePrice: 174, category: 'industrial', description: 'Standard high-tensile fasteners ubiquitous in interstellar trade.' },
  { id: 'seafood', name: 'Gourmet Oceanic Seafood', basePrice: 134, category: 'luxury', description: 'Frozen ocean delicacies harvested from ocean garden worlds.' },
  { id: 'root_extract', name: 'Medicinal Root Extract', basePrice: 138, category: 'essential', description: 'Potent botanical alkaloids coveted by pharmaceutical synthesizers.' },
  { id: 'workdroids', name: 'Heavy Labor Workdroids', basePrice: 144, category: 'industrial', description: 'Semi-autonomous bipedal droids designed for harsh orbital labor.' },
  { id: 'grain', name: 'Terraformed Wheat & Grain', basePrice: 212, category: 'essential', description: 'Staple bulk grain feeds billions in the core sectors.' }
];

export const SHIPS: Ship[] = [
  {
    "id": "shuttlecraft",
    "name": "Shuttlecraft",
    "modelClass": "Rendelli Model 805R Cargo Shuttle",
    "manufacturer": "Rendelli StarDrive",
    "cost": 10000,
    "description": "The Rendelli StarDrive Model 805R cargo shuttle is perhaps the least glamorous, but also the most versatile, of all starships. Its diminutive size and low cost make it popular with the smaller shipping firms and charter services, and it makes a good courier ship as well. Its boxy appearance belies its rugged and durable construction. This sturdy little vessel is found virtually everywhere in the galaxy.",
    "baseArmor": 100,
    "baseShields": 180,
    "speed": 10,
    "turnRate": 7,
    "cargoCapacity": 20,
    "fuelCapacity": 4,
    "gunSlots": 3,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 15,
    "requiredTechLevel": 1,
    "role": "Light Runabout",
    "image": "/assets/original/ships/shuttlecraft.gif"
  },
  {
    "id": "light_freighter",
    "name": "Light Freighter",
    "modelClass": "Model AS129 Light Freighter",
    "manufacturer": "Allied Shipyards",
    "cost": 280000,
    "description": "Allied Shipyards\u2019 stalwart Model AS129 light freighter has been one of the most popular cargo ships on the market for the last decade. Its speed and maneuverability aren\u2019t the best, and its survivability in combat is questionable, but it can still haul more goods than its closest rival, the CDX Argosy.",
    "baseArmor": 300,
    "baseShields": 150,
    "speed": 6,
    "turnRate": 4,
    "cargoCapacity": 150,
    "fuelCapacity": 3,
    "gunSlots": 0,
    "turretSlots": 1,
    "engineSlots": 1,
    "maxMass": 50,
    "requiredTechLevel": 1,
    "role": "Merchant Trader",
    "image": "/assets/original/ships/light-freighter.gif"
  },
  {
    "id": "bulk_freighter",
    "name": "Bulk Freighter",
    "modelClass": "AS1300 Bulk Cargo Hauler",
    "manufacturer": "Allied Shipyards",
    "cost": 120000,
    "description": "The Allied Shipyards AS1300 is the best - indeed, the only - bulk freighter available. Their high cost and weak defenses preclude their use in the frontier systems, but further in, these huge ships carry the majority of commerce between the Core Worlds.",
    "baseArmor": 250,
    "baseShields": 100,
    "speed": 4,
    "turnRate": 2,
    "cargoCapacity": 500,
    "fuelCapacity": 10,
    "gunSlots": 0,
    "turretSlots": 1,
    "engineSlots": 1,
    "maxMass": 150,
    "requiredTechLevel": 4,
    "role": "Heavy Cargo Hauler",
    "image": "/assets/original/ships/bulk-freighter.gif"
  },
  {
    "id": "courier",
    "name": "Courier",
    "modelClass": "Fast Blockade Courier",
    "manufacturer": "Consolidated Courier",
    "cost": 180000,
    "description": "If you\u2019re looking to get your large cargo to its destination as quickly as possible, look no further than the Metroworks V7 courier. It is essentially nothing more than a triad of large engines with a cargo bay and a life-support pod attached. A testament to this ship\u2019s high speed, long range, and great reliability is the fact that Starbound Express uses them for nearly 95% of its domestic cargo routes.",
    "baseArmor": 250,
    "baseShields": 150,
    "speed": 10,
    "turnRate": 7,
    "cargoCapacity": 50,
    "fuelCapacity": 8,
    "gunSlots": 2,
    "turretSlots": 1,
    "engineSlots": 1,
    "maxMass": 30,
    "requiredTechLevel": 1,
    "role": "High-Speed Courier",
    "image": "/assets/original/ships/courier.gif"
  },
  {
    "id": "argosy",
    "name": "Argosy",
    "modelClass": "Armored Multi-Role Merchantman",
    "manufacturer": "CDX Starworks",
    "cost": 750000,
    "description": "CDX Starworks is a relatively new player in the cargo-ship market, having previously established its reputation building fighters. Its Argosy-class light freighter has already become quite popular with shipping companies operating near the edge of Confederation space, because of its advantages over the AS129 in the areas of speed, maneuverability, and firepower. Its only real liabilities are its higher price and slightly smaller cargo capacity.",
    "baseArmor": 400,
    "baseShields": 350,
    "speed": 9,
    "turnRate": 5,
    "cargoCapacity": 130,
    "fuelCapacity": 4,
    "gunSlots": 3,
    "turretSlots": 2,
    "engineSlots": 1,
    "maxMass": 60,
    "requiredTechLevel": 3,
    "role": "Heavy Armed Merchant",
    "image": "/assets/original/ships/argosy.gif"
  },
  {
    "id": "confed_frigate",
    "name": "Confederate Frigate",
    "modelClass": "FF-4237 Fleet Frigate",
    "manufacturer": "Terran Naval Yards",
    "cost": 5000000,
    "description": "Terran Naval Yards builds the FF-4237 frigate exclusively for the Confederation Navy. It is a rugged and flexible design, more than a match for the puny Atonida Kestrel and any other escort ships. The use of this glorious ship as the backbone of the Navy\u2019s task forces will surely be sufficent to crush the Rebellion\u2019s pitiful space fleets.",
    "baseArmor": 500,
    "baseShields": 2500,
    "speed": 7,
    "turnRate": 4,
    "cargoCapacity": 50,
    "fuelCapacity": 3,
    "gunSlots": 6,
    "turretSlots": 3,
    "engineSlots": 1,
    "maxMass": 60,
    "requiredTechLevel": 4,
    "role": "Confed Naval Escort",
    "image": "/assets/original/ships/confed-frigate.gif"
  },
  {
    "id": "confed_cruiser",
    "name": "Confederate Cruiser",
    "modelClass": "CR-1095 Heavy Battlecruiser",
    "manufacturer": "Terran Naval Yards",
    "cost": 20000000,
    "description": "The Terran Naval Yards CR-1095 heavy cruiser is a natural outgrowth of the FF-4237 frigate, and indeed it resembles it closely, except for size. These glorious ships, with their complement of four patrol ships each, will surely bring the Rebellion to its knees.",
    "baseArmor": 1000,
    "baseShields": 8000,
    "speed": 7,
    "turnRate": 2,
    "cargoCapacity": 75,
    "fuelCapacity": 4,
    "gunSlots": 8,
    "turretSlots": 4,
    "engineSlots": 1,
    "maxMass": 100,
    "requiredTechLevel": 4,
    "role": "Confed Capital Warship",
    "image": "/assets/original/ships/confed-heavy-cruiser.gif"
  },
  {
    "id": "confed_patrol",
    "name": "Confed Patrol Ship",
    "modelClass": "P-361 Patrol Starfighter",
    "manufacturer": "Terran Naval Yards",
    "cost": 700000,
    "description": "The P-361 patrol fighter, manufactured by the Terran Naval Yards, is the best starfighter ever designed. No other small ship can beat it in a dogfight - at least, such an occurance has never been publically reported\u2026",
    "baseArmor": 1,
    "baseShields": 200,
    "speed": 10,
    "turnRate": 7,
    "cargoCapacity": 5,
    "fuelCapacity": 3,
    "gunSlots": 4,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 5,
    "requiredTechLevel": 4,
    "role": "Military Patrol Interceptor",
    "image": "/assets/original/ships/confed-patrol-ship.gif"
  },
  {
    "id": "rapier",
    "name": "Rapier",
    "modelClass": "F/A-927E Rapier Heavy Fighter",
    "manufacturer": "CDX Starworks",
    "cost": 1200000,
    "description": "CDX Starworks\u2019s most popular offering, the F/A-927E Rapier attack fighter, is the heaviest-armed starfighter on the market. It has both missile racks and a torpedo launcher, and it is equipped with a laser turret for self-defense as well. However, all this firepower comes at the expense of speed and maneuverability, making the Rapier the clumsiest starfighter around. Still, it is popular with bounty hunters, corporate governments, and anyone needing a little more punch than is offered by other fighters.",
    "baseArmor": 150,
    "baseShields": 350,
    "speed": 10,
    "turnRate": 7,
    "cargoCapacity": 15,
    "fuelCapacity": 4,
    "gunSlots": 4,
    "turretSlots": 1,
    "engineSlots": 1,
    "maxMass": 20,
    "requiredTechLevel": 3,
    "role": "Superiority Strike Craft",
    "image": "/assets/original/ships/rapier.gif"
  },
  {
    "id": "lightning",
    "name": "Lightning",
    "modelClass": "F-563 Lightning Fighter-Bomber",
    "manufacturer": "Blazitron Industries",
    "cost": 1000000,
    "description": "Blazitron Industries\u2019 new F-563 Lightning fighter-bomber recently won the Shelton Award for Extreme Cleverness, and it\u2019s easy to see why. The Lightning mixes high speed and good maneuverability with excellent firepower, resulting in an unbeatable combination. In addition, the design is so adaptable that a modified version, the F-563N, has been produced for shipboard operations.",
    "baseArmor": 50,
    "baseShields": 250,
    "speed": 10,
    "turnRate": 9,
    "cargoCapacity": 5,
    "fuelCapacity": 5,
    "gunSlots": 5,
    "turretSlots": 1,
    "engineSlots": 1,
    "maxMass": 15,
    "requiredTechLevel": 3,
    "role": "Strike Fighter-Bomber",
    "image": "/assets/original/ships/lightning.gif"
  },
  {
    "id": "defender",
    "name": "Defender",
    "modelClass": "I-287B Defender Escort",
    "manufacturer": "CDX Starworks",
    "cost": 100000,
    "description": "The CDX Starworks I-287B Defender is used primarily by corporations and small governments who wish to protect their spheres of influence. Although the Defender is the fastest and most maneuverable fighter in production, its light armament, weak shielding, and abysmal fuel capacity relegate it to the role of an in-system interceptor, not a strike fighter. This latest version, the Defender Mk. II, has been retrofitted with larger fuel tanks to address this concern, but it is still limited in range.",
    "baseArmor": 1,
    "baseShields": 100,
    "speed": 10,
    "turnRate": 10,
    "cargoCapacity": 1,
    "fuelCapacity": 3,
    "gunSlots": 3,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 5,
    "requiredTechLevel": 2,
    "role": "System Patrol Interceptor",
    "image": "/assets/original/ships/defender.gif"
  },
  {
    "id": "executive_transport",
    "name": "Executive Transport",
    "modelClass": "Mk. VIII Executive Shuttle",
    "manufacturer": "Krydanti Systems",
    "cost": 90000,
    "description": "Forward-thinking executives of the galaxy\u2019s top corporations use the Krydanti Systems Mk. VI executive transport for their business needs. It enables its wealthy passengers to travel quickly in style and comfort, though admittedly without any defensive armament.",
    "baseArmor": 50,
    "baseShields": 100,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 10,
    "fuelCapacity": 3,
    "gunSlots": 0,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 10,
    "requiredTechLevel": 1,
    "role": "VIP Transport",
    "image": "/assets/original/ships/executive-transport.gif"
  },
  {
    "id": "luxury_liner",
    "name": "Luxury Liner",
    "modelClass": "Starlight Grand Cruise Vessel",
    "manufacturer": "Centauri Spacelines",
    "cost": 1000000,
    "description": "Centauri Spacelines operates its custom-built luxury liners between all of the Core Worlds. For the price of a ticket, which is literally astronomical, you get six days and nights of blissful relaxation aboard what has been called \u201cthe most decadent thing ever to leave drydock.\u201d A gourmet chef and an eager crew are always at your disposal, and, if you\u2019re a member of the aristocracy, so are the pretty young flight attendants who see to the wealthy\u2019s \u201cspecial\u201d desires.",
    "baseArmor": 200,
    "baseShields": 300,
    "speed": 7,
    "turnRate": 2,
    "cargoCapacity": 20,
    "fuelCapacity": 4,
    "gunSlots": 0,
    "turretSlots": 2,
    "engineSlots": 1,
    "maxMass": 30,
    "requiredTechLevel": 4,
    "role": "Passenger Starliner",
    "image": "/assets/original/ships/luxury-liner.gif"
  },
  {
    "id": "rebel_destroyer",
    "name": "Rebel Destroyer",
    "modelClass": "Liberator-Class Destroyer",
    "manufacturer": "Rebel High Command",
    "cost": 2800000,
    "description": "When a team of defecting engineers from CDX Starworks approached the Rebel High Command with a unique proposal, the Rebel destroyer was born. Because of the fact that it is essentially a CDX Argosy with extra armor, uprated engines, and gun turrets, the destroyer is cheap to mass-produce. However, because it is still a freighter at heart, its performance is not up to the level of the Confederate frigate or the Atinoda Kestrel. Still, it remains an important part of the Rebel fleet.",
    "baseArmor": 500,
    "baseShields": 2000,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 30,
    "fuelCapacity": 4,
    "gunSlots": 5,
    "turretSlots": 4,
    "engineSlots": 1,
    "maxMass": 80,
    "requiredTechLevel": 4,
    "role": "Rebel Fleet Escort",
    "image": "/assets/original/ships/rebel-destroyer.gif"
  },
  {
    "id": "rebel_cruiser",
    "name": "Rebel Cruiser",
    "modelClass": "Vanguard Heavy Cruiser",
    "manufacturer": "Rebel High Command",
    "cost": 14000000,
    "description": "Operating in secret and in the worst of conditions from bases on primitive backwater planets, the shipwrights of the Rebellion have crafted one of the most beautiful and lethal fighting ships in existence. The Rebel cruiser\u2019s circular engine-support pylons double as an external docking rack for its complement of Manta fighters; this unique arrangement allows the ship to launch its entire squadron of fighters almost simultaneously, giving it a great advantage in combat.",
    "baseArmor": 800,
    "baseShields": 5000,
    "speed": 9,
    "turnRate": 4,
    "cargoCapacity": 600,
    "fuelCapacity": 5,
    "gunSlots": 7,
    "turretSlots": 4,
    "engineSlots": 1,
    "maxMass": 120,
    "requiredTechLevel": 4,
    "role": "Rebel Capital Warship",
    "image": "/assets/original/ships/rebel-cruiser.gif"
  },
  {
    "id": "kestrel",
    "name": "Kestrel",
    "modelClass": "Kestrel Heavy Gunship",
    "manufacturer": "Atinoda Starworks",
    "cost": 10000000,
    "description": "The Atinoda Kestrel is the most powerful ship available to civilians. In addition to its already formidable complement of weaponry, this sleek, black vessel carries a pair of Lightning fighter-bombers; this combination is the reason the Kestrel is classified as an escort frigate. Of course, Atinoda only sells this kind of firepower to the most reputable of private customers, but rumor has it that a freighter full of Kestrel subassemblies recently disappeared near the edge of Confederation space\u2026 ",
    "baseArmor": 500,
    "baseShields": 1300,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 80,
    "fuelCapacity": 5,
    "gunSlots": 6,
    "turretSlots": 3,
    "engineSlots": 1,
    "maxMass": 120,
    "requiredTechLevel": 5,
    "role": "High-Performance Gunship",
    "image": "/assets/original/ships/kestrel.gif"
  },
  {
    "id": "manta",
    "name": "Manta",
    "modelClass": "Manta Fast Interceptor",
    "manufacturer": "Astrotech Space Industries",
    "cost": 180000,
    "description": "When Astrotech Space Industries went bankrupt seven years ago, their remaining inventory of Model F-37B Manta light fighters was quietly bought up by an anonymous party. The Manta, heavily used by the Confederation during the early days of the Great War, has fallen out of favor with modern combateers due to its light armament. Recently, though, a Confederate freighter captain reported being attacked by several \u201ctriangular space fighters,\u201d suggesting that the Rebellion may be using these outdated but highly maneuverable ships to further its cause.",
    "baseArmor": 1,
    "baseShields": 200,
    "speed": 10,
    "turnRate": 10,
    "cargoCapacity": 3,
    "fuelCapacity": 3,
    "gunSlots": 4,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 5,
    "requiredTechLevel": 4,
    "role": "Light Strike Craft",
    "image": "/assets/original/ships/rebel-manta.gif"
  },
  {
    "id": "scoutship",
    "name": "Scoutship",
    "modelClass": "Mk. XVII Long-Range Scout",
    "manufacturer": "Krydanti Systems",
    "cost": 80000,
    "description": "Krydanti Systems\u2019 Mk. XVII scoutship is used primarily by mining corporations and entrepreneurs to seek out new mineral deposits. It is also a fairly decent courier ship, though its light armament poses a serious disadvantage in a fight. Its main selling point is its extremely long range.",
    "baseArmor": 50,
    "baseShields": 300,
    "speed": 10,
    "turnRate": 7,
    "cargoCapacity": 40,
    "fuelCapacity": 9,
    "gunSlots": 4,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 35,
    "requiredTechLevel": 1,
    "role": "Deep-Space Scout & Courier",
    "image": "/assets/original/ships/scoutship.gif"
  },
  {
    "id": "corvette",
    "name": "Corvette",
    "modelClass": "IPV-1 Fast Attack Corvette",
    "manufacturer": "Maskirovka Shipyards",
    "cost": 2500000,
    "description": "The Maskirovka IPV-1 Corvette is a hard ship to classify - its maneuverability and acceleration make it perform like a heavy fighter, but it is armed like a light capital ship. Maskirovka builds the Corvette to fill the gap in the commercial starship market between the classical starfighters and the super-powerful Atinoda Kestrel. The Corvette has been popular with corporate governments who need to police their space, as it makes an excellent customs and patrol vessel.",
    "baseArmor": 300,
    "baseShields": 700,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 60,
    "fuelCapacity": 4,
    "gunSlots": 5,
    "turretSlots": 2,
    "engineSlots": 1,
    "maxMass": 50,
    "requiredTechLevel": 4,
    "role": "Fast Attack Warship",
    "image": "/assets/original/ships/corvette.gif"
  },
  {
    "id": "confed_gunboat",
    "name": "Confed Gunboat",
    "modelClass": "G-564 Missile Gunboat",
    "manufacturer": "Terran Naval Yards",
    "cost": 900000,
    "description": "The Terran Naval Yards G-564 missile gunboat is essentially a stretched model of its cousin, the P-361 patrol fighter. As an outgrowth of the earlier P-361 design program, the gunboat\u2019s designers were able to keep high the parts commonality between the two ships; for example, the gunboat\u2019 unique tri-mounted wings are identical to the assemblies used by the patrol ship. The forwarded-mounted strakes along the fuselage sides hold missile racks and rocket launchers.",
    "baseArmor": 50,
    "baseShields": 200,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 5,
    "fuelCapacity": 3,
    "gunSlots": 3,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 5,
    "requiredTechLevel": 4,
    "role": "Missile Support Gunboat",
    "image": "/assets/original/ships/confed-gunboat.gif"
  },
  {
    "id": "hawk",
    "name": "Hawk",
    "modelClass": "F-5 Hawk Light Fighter",
    "manufacturer": "Mastech Corporation",
    "cost": 250000,
    "description": "A sturdy spacecraft of the Hawk class.",
    "baseArmor": 1,
    "baseShields": 230,
    "speed": 10,
    "turnRate": 9,
    "cargoCapacity": 3,
    "fuelCapacity": 3,
    "gunSlots": 4,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 10,
    "requiredTechLevel": 4,
    "role": "Light Interceptor",
    "image": "/assets/original/ships/hawk.gif"
  },
  {
    "id": "alien_fighter",
    "name": "Alien Fighter",
    "modelClass": "Vell-os / Alien Interceptor",
    "manufacturer": "Unknown Origin",
    "cost": 1800000,
    "description": "A sturdy spacecraft of the Alien Fighter class.",
    "baseArmor": 1,
    "baseShields": 5000,
    "speed": 10,
    "turnRate": 10,
    "cargoCapacity": 10,
    "fuelCapacity": 10,
    "gunSlots": 8,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 10,
    "requiredTechLevel": 4,
    "role": "Alien Starfighter",
    "image": "/assets/original/ships/alien-fighter.gif"
  },
  {
    "id": "alien_cruiser",
    "name": "Alien Cruiser",
    "modelClass": "Alien Heavy Dreadnought",
    "manufacturer": "Unknown Origin",
    "cost": 15000000,
    "description": "A sturdy spacecraft of the Alien Cruiser class.",
    "baseArmor": 1,
    "baseShields": 15000,
    "speed": 10,
    "turnRate": 4,
    "cargoCapacity": 50,
    "fuelCapacity": 10,
    "gunSlots": 12,
    "turretSlots": 4,
    "engineSlots": 1,
    "maxMass": 60,
    "requiredTechLevel": 4,
    "role": "Alien Capital Vessel",
    "image": "/assets/original/ships/alien-battle-cruiser.gif"
  },
  {
    "id": "clipper",
    "name": "Clipper",
    "modelClass": "Swift Clipper Merchant Vessel",
    "manufacturer": "Aerostar Space Industries",
    "cost": 400000,
    "description": "Aerostar Space Industries\u2019 assembly lines are mainly devoted to producing starship subassemblies for other manufacturers, but their C-35 Star Clipper Mk. IV is their most widely-recognized product. This sleek, delta-winged ship is a combination courier vessel and light warship, and excels in both roles. Its offensive and defensive capabilities are quite good for a ship of its size, and it has ample room for expansion that allows it to be turned into either a top-flight cargo hauler or an outstanding heavy fighter.",
    "baseArmor": 200,
    "baseShields": 300,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 35,
    "fuelCapacity": 4,
    "gunSlots": 4,
    "turretSlots": 1,
    "engineSlots": 1,
    "maxMass": 25,
    "requiredTechLevel": 3,
    "role": "Fast Light Hauler",
    "image": "/assets/original/ships/clipper.gif"
  },
  {
    "id": "kestrel_prototype",
    "name": "Kestrel",
    "modelClass": "Kestrel Heavy Gunship (Prototype)",
    "manufacturer": "Atinoda Starworks",
    "cost": 7500000,
    "description": "The Atinoda Kestrel is the most powerful ship available to civilians. In addition to its already formidable complement of weaponry, this sleek, black vessel carries a pair of Lightning fighter-bombers; this combination is the reason the Kestrel is classified as an escort frigate. Kestrels are manufactured here from subassemblies captured from a disabled freighter, and are discounted twenty percent off the regular price. Unfortunately, they aren\u2019t quite up to the Atinoda specs...",
    "baseArmor": 500,
    "baseShields": 1050,
    "speed": 10,
    "turnRate": 5,
    "cargoCapacity": 80,
    "fuelCapacity": 5,
    "gunSlots": 6,
    "turretSlots": 3,
    "engineSlots": 1,
    "maxMass": 120,
    "requiredTechLevel": 4,
    "role": "Command Gunship",
    "image": "/assets/original/ships/kestrel.gif"
  },
  {
    "id": "escort_carrier",
    "name": "Escort Carrier",
    "modelClass": "Escort Carrier Support Ship",
    "manufacturer": "Terran Fleet Systems",
    "cost": 5000000,
    "description": "A sturdy spacecraft of the Escort Carrier class.",
    "baseArmor": 500,
    "baseShields": 850,
    "speed": 5,
    "turnRate": 2,
    "cargoCapacity": 20,
    "fuelCapacity": 10,
    "gunSlots": 0,
    "turretSlots": 2,
    "engineSlots": 1,
    "maxMass": 10,
    "requiredTechLevel": 4,
    "role": "Escort Carrier",
    "image": "/assets/original/ships/light-freighter.gif"
  },
  {
    "id": "escape_pod",
    "name": "Escape Pod",
    "modelClass": "Emergency Survival Capsule",
    "manufacturer": "Universal Safety",
    "cost": 5000,
    "description": "Your escape pod drifts through space for several days, until a passing freighter picks up your distress signal and deigns to rescue you.  You slowly make your way back to civilization, where you work several dreary odd jobs to scratch up enough money to buy a new ship and once again begin roaming the spaceways...",
    "baseArmor": 0,
    "baseShields": 0,
    "speed": 10,
    "turnRate": 2,
    "cargoCapacity": 0,
    "fuelCapacity": 5,
    "gunSlots": 2,
    "turretSlots": 0,
    "engineSlots": 1,
    "maxMass": 0,
    "requiredTechLevel": 4,
    "role": "Escape Craft",
    "image": "/assets/original/ships/shuttlecraft.gif"
  }
];

export const OUTFITS: OutfitItem[] = [
  {
    "id": "laser_cannon",
    "name": "Laser Cannon",
    "category": "weapon",
    "cost": 5000,
    "mass": 5,
    "techLevel": 1,
    "description": "The Centauri Munitions laser cannon has been the standard defensive weapon for freighters and patrol craft for the last fifty years.",
    "slotType": "gun",
    "image": "/assets/original/outfits/laserca1.jpg",
    "statMod": {
      "damage": 18
    }
  },
  {
    "id": "neutron_blaster",
    "name": "Neutron Blaster",
    "category": "weapon",
    "cost": 30000,
    "mass": 35,
    "techLevel": 4,
    "description": "The neutron blaster is the most powerful energy weapon available on the open market. Its short range is offset by its very high damage rating. ",
    "slotType": "gun",
    "image": "/assets/original/outfits/neutronbl1.jpg",
    "statMod": {
      "damage": 45
    }
  },
  {
    "id": "proton_bolt_cannon",
    "name": "Proton Bolt Cannon",
    "category": "weapon",
    "cost": 8500,
    "mass": 8,
    "techLevel": 2,
    "description": "Proton bolt cannons use coaxial magnetic accelerators to boost charged particles to incredible velocities. As a result, proton bolts have a long range and good accuracy, though they don\u2019t do as much damage as neutron rounds.",
    "slotType": "gun",
    "image": "/assets/original/outfits/protonca1.jpg",
    "statMod": {
      "damage": 28
    }
  },
  {
    "id": "torpedo_launcher",
    "name": "Torpedo Launcher",
    "category": "weapon",
    "cost": 20000,
    "mass": 25,
    "techLevel": 3,
    "description": "Torpedo launchers are used to load, arm, and fire homing torpedoes.",
    "slotType": "gun",
    "image": "/assets/original/outfits/torpedola1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "torpedo",
    "name": "Torpedo",
    "category": "weapon",
    "cost": 2000,
    "mass": 1,
    "techLevel": 2,
    "description": "Homing torpedoes are relatively cheap, long-range weapons. Their guidance systems are primitive, however, and they are much slower than missiles. The electromagnetic fields used to separate the components of the torpedo\u2019s matter/antimatter warhead cause it to glow in flight. This same electromagnetic field, when combined with excessive interference, can sometimes confuse the torpedo\u2019s guidance systems.",
    "slotType": "internal",
    "image": "/assets/original/outfits/torpedo1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "missile_rack",
    "name": "Missile Rack",
    "category": "weapon",
    "cost": 15000,
    "mass": 10,
    "techLevel": 3,
    "description": "Missile racks are used to carry and fire guided missiles.",
    "slotType": "gun",
    "image": "/assets/original/outfits/missilera1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "missile",
    "name": "Missile",
    "category": "weapon",
    "cost": 3500,
    "mass": 1,
    "techLevel": 2,
    "description": "Very few things can a shake Consolidated Arms Mk. 83 guided missile once it has acquired its target. However, its targeting sensor array does have a manufacturing flaw that occasionally causes it to become distracted by other objects moving across its flight path.",
    "slotType": "internal",
    "image": "/assets/original/outfits/missile1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "cargo_pod",
    "name": "Cargo Pod",
    "category": "cargo",
    "cost": 7500,
    "mass": 20,
    "techLevel": 2,
    "description": "This auxilliary cargo hold attaches to the hull of your ship and increases your cargo capacity by 10 tons.",
    "slotType": "internal",
    "image": "/assets/original/outfits/cargopod1.jpg",
    "statMod": {
      "cargo": 20
    }
  },
  {
    "id": "laser_turret",
    "name": "Laser Turret",
    "category": "turret",
    "cost": 20000,
    "mass": 20,
    "techLevel": 4,
    "description": "The turreted version of Centauri Munitions\u2019 laser cannon combines the original\u2019s long range and decent punch with a computer-guided omnidirectional targeting platform, which provides the dual-mounted laser turret with a 360\u00b0 field of fire.",
    "slotType": "turret",
    "image": "/assets/original/outfits/lasertu1.jpg",
    "statMod": {
      "damage": 18
    }
  },
  {
    "id": "proton_turret",
    "name": "Proton Turret",
    "category": "turret",
    "cost": 30000,
    "mass": 30,
    "techLevel": 5,
    "description": "The proton bolt turret, like the standard proton bolt cannon, excels at damaging both shields and armor. This model features triple proton bolt cannons mounted on a computer-guided swivel platform, for accurate tracking at all angles.",
    "slotType": "turret",
    "image": "/assets/original/outfits/protontu1.jpg",
    "statMod": {
      "damage": 28
    }
  },
  {
    "id": "fighter_bay",
    "name": "Fighter Bay",
    "category": "special",
    "cost": 1000000,
    "mass": 50,
    "techLevel": 4,
    "description": "The Mastech corporation struck gold with its F-5 Hawk light fighters and their associated launching bay. Previously, shipborne fighters had been the playthings of the rich and the military. Mastech\u2019s idea was to market a low-cost starfighter that the average starship captain could afford to add to his ship. This self-contained launching bay includes all the equipment needed to launch, recover, repair, and rearm a pair of Hawks.",
    "slotType": "internal",
    "image": "/assets/original/outfits/fighterbay1.jpg",
    "statMod": {}
  },
  {
    "id": "hawk_light_fighter",
    "name": "Hawk Light Fighter",
    "category": "special",
    "cost": 250000,
    "mass": 0,
    "techLevel": 4,
    "description": "Mastech\u2019s F-5 Hawk light fighter provides an excellent defense for all types of starships. This specialized fighter was designed to operate only from the launch bays of other ships, and the resulting design compromises mean that its manuverability and speed aren\u2019t the greatest, and it is only armed with a set of laser cannons and a pair of missiles. Still, the fact that any large ship can mount the Hawk\u2019s launch bay makes it an attractive aftermarket addition to any space captain\u2019s arsenal.",
    "slotType": "internal",
    "image": "/assets/original/outfits/fighterbay1.jpg",
    "statMod": {}
  },
  {
    "id": "mass_expansion",
    "name": "Mass Expansion",
    "category": "special",
    "cost": 50000,
    "mass": -10,
    "techLevel": 3,
    "description": "By sacrificing fifteen tons of cargo capacity, this modification to your ship\u2019s structure allows you to carry ten tons more of weapons and upgrades.",
    "slotType": "internal",
    "image": "/assets/original/outfits/massupgrade1.jpg",
    "statMod": {
      "cargo": -15
    }
  },
  {
    "id": "confed_patrol_ship_hangar",
    "name": "Confed Patrol Ship",
    "category": "special",
    "cost": 700000,
    "mass": 0,
    "techLevel": 6,
    "description": "The P-361 patrol fighter, manufactured by the Terran Naval Yards, is the best starfighter ever designed. No other small ship can beat it in a dogfight - at least, such an occurance has never been publically reported\u2026",
    "slotType": "internal",
    "image": "/assets/original/outfits/fighterbay1.jpg",
    "statMod": {}
  },
  {
    "id": "manta_light_fighter",
    "name": "Manta Light Fighter",
    "category": "special",
    "cost": 180000,
    "mass": 0,
    "techLevel": 6,
    "description": "When Astrotech Space Industries went bankrupt seven years ago, their remaining inventory of Model F-37B Manta light fighters was quietly bought up by an anonymous party. The Manta, heavily used by the Confederation during the early days of the Great War, has fallen out of favor with modern combateers due to its light armament. Recently, though, a Confederate freighter captain reported being attacked by several \u201ctriangular space fighters,\u201d suggesting that the Rebellion may be using these outdated but highly maneuverable ships to further its cause.",
    "slotType": "internal",
    "image": "/assets/original/outfits/fighterbay1.jpg",
    "statMod": {}
  },
  {
    "id": "lightning_fighter_bomber",
    "name": "Lightning Fighter-Bomber",
    "category": "special",
    "cost": 1000000,
    "mass": 0,
    "techLevel": 5,
    "description": "The navalized version of Blazitron\u2019s popular Lightning fighter-bomber has a strengthened main keel and special fittings for landing aboard other starships. Currently, the only ship capable of carrying it is the Atonida Kestrel.",
    "slotType": "internal",
    "image": "/assets/original/outfits/fighterbay1.jpg",
    "statMod": {}
  },
  {
    "id": "mass_driver",
    "name": "Mass Driver",
    "category": "weapon",
    "cost": 80000,
    "mass": 40,
    "techLevel": 6,
    "description": "Old technologies never die, they just get new names. The mass driver is the modern-day equivalent of the ancient gatling gun; it uses electromagnets to accelerate small metallic slugs - usually made of depleted uranium - to reasonably high velocities. Because of their composition, mass driver slugs do much more damage to armor than to shields.",
    "slotType": "gun",
    "image": "/assets/original/outfits/massdr1.jpg",
    "statMod": {}
  },
  {
    "id": "shield_capacitor",
    "name": "Shield Capacitor",
    "category": "shield",
    "cost": 90000,
    "mass": 3,
    "techLevel": 5,
    "description": "Shield capacitors are pure tantalum energy storage modules that can increase the maximum shield capacity of any ship by 15 terawatts.",
    "slotType": "internal",
    "image": "/assets/original/outfits/shieldca1.jpg",
    "statMod": {
      "shields": 50
    }
  },
  {
    "id": "shield_booster",
    "name": "Shield Booster",
    "category": "shield",
    "cost": 125000,
    "mass": 2,
    "techLevel": 5,
    "description": "A shield booster is a dangerous and highly illegal ship upgrade, available only on seedier planets. It routes drive plasma directly from a ship\u2019s engine core to its shield generator, increasing the rate of shield regeneration.",
    "slotType": "internal",
    "image": "/assets/original/outfits/shieldbo1.jpg",
    "statMod": {
      "shields": 120
    }
  },
  {
    "id": "armaplast_plating",
    "name": "Armaplast Plating",
    "category": "shield",
    "cost": 30000,
    "mass": 5,
    "techLevel": 2,
    "description": "DoPunt\u2019s #3019 Armaplast is a hybrid material, combining the lightness of Sup-R-Kevlar or TuffSheath with reasonably good strength.",
    "slotType": "internal",
    "image": "/assets/original/outfits/armaplastpl1.jpg",
    "statMod": {
      "armor": 50
    }
  },
  {
    "id": "durasteel_armor",
    "name": "Durasteel Armor",
    "category": "shield",
    "cost": 90000,
    "mass": 20,
    "techLevel": 3,
    "description": "Durasteel armor is made of a denser material than Armaplast, resulting in a higher strength rating. Most warships\u2019 hulls are composed of durasteel, and add-on plating kits like this one are popular as well.",
    "slotType": "internal",
    "image": "/assets/original/outfits/durasteelar1.jpg",
    "statMod": {
      "armor": 150
    }
  },
  {
    "id": "tritanium_armor",
    "name": "Tritanium Armor",
    "category": "shield",
    "cost": 1000000,
    "mass": 40,
    "techLevel": 5,
    "description": "This newest creation from the labs of Terran MetalWorks is one of the strongest metals known to man. The Confederation Navy has requisitioned all supplies of tritanium for use in its Cruiser Upgrade Program, and tritanium armor plating kits like this are only available on the black market.",
    "slotType": "internal",
    "image": "/assets/original/outfits/tritaniumar1.jpg",
    "statMod": {
      "armor": 350
    }
  },
  {
    "id": "thrust_enhancement",
    "name": "Thrust Enhancement",
    "category": "engine",
    "cost": 100000,
    "mass": 0,
    "techLevel": 5,
    "description": "Give a skilled technician a few hours with your engine and a wrench, and he can work miracles. By tweaking the fuel flow to the engine core, this upgrade actually increases your ship\u2019s available acceleration.",
    "slotType": "engine",
    "image": "/assets/original/outfits/afterburner1.jpg",
    "statMod": {
      "speed": 1
    }
  },
  {
    "id": "engine_upgrade",
    "name": "Engine Upgrade",
    "category": "engine",
    "cost": 150000,
    "mass": 0,
    "techLevel": 5,
    "description": "Various add-on devices have been manufactured with the intent of increasing a ship\u2019s speed, but none have been as effective as this simple tune-up. A talented mechanic who performs this operation on your ship\u2019s propulsion system can boost your ship\u2019s top speed by 150 AU/h.",
    "slotType": "engine",
    "image": "/assets/original/outfits/afterburner1.jpg",
    "statMod": {
      "speed": 1,
      "turn": 1
    }
  },
  {
    "id": "rcs_upgrade",
    "name": "RCS Upgrade",
    "category": "engine",
    "cost": 180000,
    "mass": 0,
    "techLevel": 5,
    "description": "Those looking for a little extra maneuverability should look into this upgrade. Gifted shipwrights refit your vessel with improved, platinum-plated ducting between the engine core and the reaction control systems, resulting in increased plasma flow. This modification can increase your ship\u2019s turn rate by 30\u00b0/sec. ",
    "slotType": "engine",
    "image": "/assets/original/outfits/afterburner1.jpg",
    "statMod": {
      "turn": 2
    }
  },
  {
    "id": "external_fuel_tank",
    "name": "External Fuel Tank",
    "category": "special",
    "cost": 1500,
    "mass": 5,
    "techLevel": 2,
    "description": "This fuel tank attaches to the hull of your ship and increases your fuel capacity by 100 units, enough for one additional hyperspace jump before refuelling.",
    "slotType": "internal",
    "image": "/assets/original/outfits/cargopod1.jpg",
    "statMod": {
      "fuel": 3
    }
  },
  {
    "id": "escape_pod",
    "name": "Escape Pod",
    "category": "special",
    "cost": 5000,
    "mass": 1,
    "techLevel": 1,
    "description": "No pilot should fly without the trusty and reliable Markin-Bater escape pod. It allows a pilot to eject from his stricken ship and survive for up to a week. Granted, the included rations aren\u2019t all that tasty, but it beats breathing vacuum.",
    "slotType": "internal",
    "image": "/assets/original/outfits/escapepod1.jpg",
    "statMod": {}
  },
  {
    "id": "density_scanner",
    "name": "Density Scanner",
    "category": "special",
    "cost": 8000,
    "mass": 0,
    "techLevel": 3,
    "description": "This device is able to detect the approximate mass of any ship within range of your ship\u2019s scanners, allowing you to differentiate between large and small ships on your radar display.",
    "slotType": "internal",
    "image": "/assets/original/outfits/densitysc1.jpg",
    "statMod": {}
  },
  {
    "id": "iff_decoder",
    "name": "IFF Decoder",
    "category": "special",
    "cost": 11000,
    "mass": 0,
    "techLevel": 4,
    "description": "This piece of equipment inserts into your scanner\u2019s upgrade port and provides realtime interrogation of subspace transponders. This allows your scanner to color-code your radar display, based on your legal standing with other ships and planets.",
    "slotType": "internal",
    "image": "/assets/original/outfits/iffdec1.jpg",
    "statMod": {}
  },
  {
    "id": "afterburner",
    "name": "Afterburner",
    "category": "engine",
    "cost": 10000,
    "mass": 5,
    "techLevel": 1,
    "description": "No privateer should be without this handy add-on. By dumping raw fuel directly into your engine\u2019s exhaust stream, the afterburner dramatically increases both your thrust and your top speed for short periods of time. However, it consumes fuel at a prodigious rate.",
    "slotType": "engine",
    "image": "/assets/original/outfits/afterburner1.jpg",
    "statMod": {
      "speed": 2
    }
  },
  {
    "id": "missile_jammer",
    "name": "Missile Jammer",
    "category": "special",
    "cost": 30000,
    "mass": 0,
    "techLevel": 5,
    "description": "This advanced electronic countermeasures device broadcasts subspace interference waves that confuse the seeker heads of incoming missiles, causing them to track less accurately. Be forewarned, though, that torpedoes seem unaffected by such jamming.",
    "slotType": "internal",
    "image": "/assets/original/outfits/missileja1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "rocket_launcher",
    "name": "Rocket Launcher",
    "category": "weapon",
    "cost": 20000,
    "mass": 30,
    "techLevel": 3,
    "description": "Rocket launchers are used to load, arm, and fire unguided heavy rockets.",
    "slotType": "gun",
    "image": "/assets/original/outfits/rocketla1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "heavy_rocket",
    "name": "Heavy Rocket",
    "category": "weapon",
    "cost": 1000,
    "mass": 2,
    "techLevel": 2,
    "description": "The heavy rocket is a primitive but devastating weapon. After it is launched, its engine propels it along a straight course until its proximity detector senses a nearby ship and detonates its high-explosive warhead. Though simple, the heavy rocket packs quite a wallop.",
    "slotType": "internal",
    "image": "/assets/original/outfits/rocket1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "bomb_rack",
    "name": "Bomb Rack",
    "category": "weapon",
    "cost": 20000,
    "mass": 30,
    "techLevel": 5,
    "description": "Bomb racks are used to carry gravitic space bombs.",
    "slotType": "gun",
    "image": "/assets/original/outfits/bombra1.jpg",
    "statMod": {}
  },
  {
    "id": "space_bomb",
    "name": "Space Bomb",
    "category": "weapon",
    "cost": 15000,
    "mass": 2,
    "techLevel": 5,
    "description": "Gravitic space bombs are probably the most difficult-to-deliver type of weapon, but they are also the highest-yield munitions available. They simply drift through space until their sensitive gravitic detectors register the mass shadow of an approaching ship. The titanic energy waves released by an exploding space bomb are enough to knock an asteroid from its orbit. ",
    "slotType": "internal",
    "image": "/assets/original/outfits/bomb1.jpg",
    "statMod": {}
  },
  {
    "id": "javelin_pod",
    "name": "Javelin Pod",
    "category": "weapon",
    "cost": 20000,
    "mass": 5,
    "techLevel": 3,
    "description": "This externally-mounted weapons pod holds Javelin rockets and fires them through the exit ports mounted on its front surface. ",
    "slotType": "gun",
    "image": "/assets/original/outfits/javelinpod1.jpg",
    "statMod": {}
  },
  {
    "id": "javelin_rocket",
    "name": "Javelin Rocket",
    "category": "weapon",
    "cost": 175,
    "mass": 0,
    "techLevel": 2,
    "description": "Fulcrum Munitions\u2019 Javelin hypervelocity rocket is the high-tech equivalent of the bow and arrow. These tiny but incredibly fast powered projectiles inflict great damage to small targets, due to the hardened alloys used in the construction of their reinforced, armor-piercing nose cones. Javelins work best when fired by fighters and patrol craft, as  their high speed and lack of guidance necessitate an agile firing platform.",
    "slotType": "internal",
    "image": "/assets/original/outfits/javelin1.jpg",
    "statMod": {
      "damage": 40
    }
  },
  {
    "id": "regional_map",
    "name": "Regional Map",
    "category": "special",
    "cost": 2500,
    "mass": 0,
    "techLevel": 2,
    "description": "This map will automatically update your ship\u2019s computer with information about surrounding systems up to two jumps away.",
    "slotType": "internal",
    "image": "/assets/original/outfits/regionalmap1.jpg",
    "statMod": {}
  },
  {
    "id": "particle_beam",
    "name": "Particle Beam",
    "category": "weapon",
    "cost": 1000000,
    "mass": 0,
    "techLevel": 7,
    "description": "Particle Beam",
    "slotType": "gun",
    "image": "/assets/original/outfits/particlebe1.jpg",
    "statMod": {
      "damage": 60
    }
  },
  {
    "id": "cloaking_device",
    "name": "Cloaking Device",
    "category": "special",
    "cost": 1000000,
    "mass": 0,
    "techLevel": 7,
    "description": "Cloaking Device",
    "slotType": "internal",
    "image": "/assets/original/outfits/cloakingde1.jpg",
    "statMod": {}
  },
  {
    "id": "meizner_ramscoop",
    "name": "Meizner Ramscoop",
    "category": "engine",
    "cost": 25000,
    "mass": 5,
    "techLevel": 2,
    "description": "The Meizner ramscoop uses high-energy magnetoscopic fields to extract charged hydrogen ions from the solar wind. It can slowly regenerate your fuel supply while in flight.",
    "slotType": "internal",
    "image": "/assets/original/outfits/meiznerrs1.jpg",
    "statMod": {
      "solarScoop": true
    }
  },
  {
    "id": "auto_refueller",
    "name": "Auto-Refueller",
    "category": "special",
    "cost": 5000,
    "mass": 0,
    "techLevel": 1,
    "description": "This handy device automatically contacts spaceport computers and arranges for them to refuel your ship, saving you the worry. Of course, it still costs the same to top off your tanks.",
    "slotType": "internal",
    "image": "/assets/original/outfits/autorf1.jpg",
    "statMod": {}
  },
  {
    "id": "tractor_beam",
    "name": "Tractor Beam",
    "category": "special",
    "cost": 1000000,
    "mass": 0,
    "techLevel": 7,
    "description": "Hardware upgrade: Tractor Beam.",
    "slotType": "internal",
    "image": "/assets/original/outfits/tractorbe1.jpg",
    "statMod": {}
  },
  {
    "id": "flare_launcher",
    "name": "Flare Launcher",
    "category": "weapon",
    "cost": 35000,
    "mass": 1,
    "techLevel": 1,
    "description": "Flare launchers are used to drop missile-foiling decoy flares.",
    "slotType": "gun",
    "image": "/assets/original/outfits/flarela1.jpg",
    "statMod": {}
  },
  {
    "id": "decoy_flare",
    "name": "Decoy Flare",
    "category": "special",
    "cost": 250,
    "mass": 0,
    "techLevel": 1,
    "description": "The Hall Munitions Company\u2019s decoy flares are a popular after-market add on among starship captains who prefer to run rather than fight. The shape of the magnisite-impregnated flare is designed to afford the maximum possible radiation of energy in all directions. As a result, they excel at luring away guided missiles.",
    "slotType": "internal",
    "image": "/assets/original/outfits/flare1.jpg",
    "statMod": {}
  },
  {
    "id": "fake_id_papers",
    "name": "Fake ID Papers",
    "category": "special",
    "cost": 2500000,
    "mass": 0,
    "techLevel": 5,
    "description": "These highly illegal false identification papers will effectively eliminate your criminal record in Confederation systems.",
    "slotType": "internal",
    "image": "/assets/original/outfits/fakeid.jpg",
    "statMod": {
      "contrabandShielding": 80
    }
  },
  {
    "id": "auto_ejection_system",
    "name": "Auto-Ejection System",
    "category": "special",
    "cost": 3000,
    "mass": 0,
    "techLevel": 2,
    "description": "This auto-ejection system will save you the worry of manually bailing out of your ship should it be destroyed in combat \u2014 assuming you already have an escape pod installed, that is.",
    "slotType": "internal",
    "image": "/assets/original/outfits/autoeject.jpg",
    "statMod": {}
  }
];

export const STAR_SYSTEMS: StarSystem[] = [
  {
    "id": "levo",
    "name": "Levo",
    "sector": "Independent Worlds",
    "x": 689.1,
    "y": 287.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "As every schoolkid knows, Earth is the homeworld of the human race. It is also the capital of the Confederation.",
    "connectedSystemIds": [
      "rigel",
      "capella",
      "kathoon",
      "vulcan"
    ],
    "stellarObjects": [
      {
        "id": "levo",
        "name": "Levo",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Levo is an independent world that has resisted joining the Confederation. Anyone is welcome at the tiny but neutral Levo Spaceport, located on the island of Locanda in Levo\u2019s southern ocean.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10006.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.89,
          "ore": 0.81,
          "machinery": 0.97,
          "meds": 1.04,
          "luxury": 1.07
        }
      }
    ]
  },
  {
    "id": "sol",
    "name": "Sol",
    "sector": "Confederation Core",
    "x": 596.7,
    "y": 447.2,
    "faction": "Confederation",
    "techLevel": 5,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Stardock Alpha is the Confederation Navy\u2019s primary spacedock and ship refitting complex.",
    "connectedSystemIds": [
      "centauri",
      "tau_ceti",
      "eridani",
      "barnard"
    ],
    "stellarObjects": [
      {
        "id": "earth",
        "name": "Earth",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "As every schoolkid knows, Earth is the homeworld of the human race. It is also the capital of the Confederation.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10000.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.04,
          "ore": 0.96,
          "machinery": 1.07,
          "meds": 1.09,
          "luxury": 1.12
        }
      },
      {
        "id": "stardock_alpha",
        "name": "Stardock Alpha",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Stardock Alpha is the Confederation Navy\u2019s primary spacedock and ship refitting complex.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_11000.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.17,
          "ore": 1.13,
          "machinery": 0.91,
          "meds": 0.92,
          "luxury": 1.41
        }
      },
      {
        "id": "luna",
        "name": "Luna",
        "type": "moon",
        "orbitRadius": 160,
        "orbitSpeed": 0.009000000000000001,
        "initialAngle": 3.6,
        "size": 14,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Luna is Earth\u2019s only moon. Terran Naval yards has its main shipyard facilities here, as Luna\u2019s low gravity and near-perfect vacuum are ideal for heavy warship construction.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10028.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.16,
          "ore": 1.14,
          "machinery": 1.13,
          "meds": 1.21,
          "luxury": 1.28
        }
      },
      {
        "id": "mars",
        "name": "Mars",
        "type": "planet",
        "orbitRadius": 205,
        "orbitSpeed": 0.005,
        "initialAngle": 4.8,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Mars is the human race\u2019s second-oldest colony world. It was first settled in the middle of the 21st century, and is now home to nearly a billion inhabitants.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10020.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.9,
          "ore": 0.8,
          "machinery": 1.1,
          "meds": 1.15,
          "luxury": 1.2
        }
      }
    ]
  },
  {
    "id": "centauri",
    "name": "Centauri",
    "sector": "Confederation Core",
    "x": 550.5,
    "y": 402.4,
    "faction": "Confederation",
    "techLevel": 1,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Mars is the human race\u2019s second-oldest colony world. It was first settled in the middle of the 21st century, and is now home to nearly a billion inhabitants.",
    "connectedSystemIds": [
      "sol",
      "sirius",
      "rigel"
    ],
    "stellarObjects": [
      {
        "id": "landfall",
        "name": "Landfall",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Landfall was the first extrasolar planet settled by colony ships from Earth. Today it is a booming industrial world.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10008.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.03,
          "ore": 0.97,
          "machinery": 0.94,
          "meds": 0.98,
          "luxury": 1.49
        }
      }
    ]
  },
  {
    "id": "tau_ceti",
    "name": "Tau Ceti",
    "sector": "Confederation Core",
    "x": 543.9,
    "y": 525.6,
    "faction": "Confederation",
    "techLevel": 2,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Landfall was the first extrasolar planet settled by colony ships from Earth. Today it is a booming industrial world.",
    "connectedSystemIds": [
      "sol",
      "sirius",
      "antares",
      "pollux",
      "procyon"
    ],
    "stellarObjects": [
      {
        "id": "tau_ceti_iv",
        "name": "Tau Ceti IV",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "Tau Ceti IV was first visited by the colony ship Marathon.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.85,
          "ore": 0.85,
          "machinery": 1.15,
          "meds": 1.0,
          "luxury": 1.05
        }
      },
      {
        "id": "merlin",
        "name": "Merlin",
        "type": "moon",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 14,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Merlin is the largest moon of Tau Ceti IV. Its size is sufficent to hold an atmosphere, and conditions on Merlin are quite Earthlike, save for the somewhat lower gravity. The inhabitants of Merlin hold human-powered air races several times a year.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10032.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.98,
          "ore": 1.02,
          "machinery": 0.99,
          "meds": 1.23,
          "luxury": 1.34
        }
      },
      {
        "id": "new_columbia",
        "name": "New Columbia",
        "type": "planet",
        "orbitRadius": 160,
        "orbitSpeed": 0.009000000000000001,
        "initialAngle": 3.6,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Columbia\u2019s rugged terrain forces its inhabitants to live mostly around the port city of New Seattle. Much of the planet is still unexplored.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10002.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.01,
          "ore": 0.79,
          "machinery": 0.93,
          "meds": 1.16,
          "luxury": 1.33
        }
      }
    ]
  },
  {
    "id": "eridani",
    "name": "Eridani",
    "sector": "Confederation Core",
    "x": 725.4,
    "y": 478.0,
    "faction": "Confederation",
    "techLevel": 3,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Luna is Earth\u2019s only moon. Terran Naval yards has its main shipyard facilities here, as Luna\u2019s low gravity and near-perfect vacuum are ideal for heavy warship construction.",
    "connectedSystemIds": [
      "sol",
      "zebetrious",
      "vega",
      "procyon"
    ],
    "stellarObjects": [
      {
        "id": "tabletop",
        "name": "Tabletop",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Tabletop is a planet almost completely devoid of trees. Raw timber and wood products fetch a high price in Tabletop\u2019s commodity exchange. There is even a flourishing black market, which provides Tabletop\u2019s residents with expensive, imported wood products.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10003.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.11,
          "ore": 1.19,
          "machinery": 1.18,
          "meds": 1.06,
          "luxury": 1.13
        }
      }
    ]
  },
  {
    "id": "barnard",
    "name": "Barnard",
    "sector": "Confederation Core",
    "x": 679.2,
    "y": 410.8,
    "faction": "Confederation",
    "techLevel": 4,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Levo is an independent world that has resisted joining the Confederation. Anyone is welcome at the tiny but neutral Levo Spaceport, located on the island of Locanda in Levo\u2019s southern ocean.",
    "connectedSystemIds": [
      "sol",
      "zebetrious"
    ],
    "stellarObjects": [
      {
        "id": "new_sahara",
        "name": "New Sahara",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Sahara is a hot, dry, flat, and highly uninteresting planet. Its main feature is its resemblance to Earth\u2019s Sahara desert. The planet has only a few nomadic inhabitants.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10005.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.1,
          "ore": 0.7,
          "machinery": 1.05,
          "meds": 0.95,
          "luxury": 1.0
        }
      }
    ]
  },
  {
    "id": "vega",
    "name": "Vega",
    "sector": "Confederation Core",
    "x": 725.4,
    "y": 578.8,
    "faction": "Confederation",
    "techLevel": 5,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "New Britain is a populous island world, and one of the first worlds settled during the Great Expansion. Much of New Britain\u2019s exports are food products, as its oceans are teeming with plant and animal life. ",
    "connectedSystemIds": [
      "pollux",
      "regulus",
      "eridani"
    ],
    "stellarObjects": [
      {
        "id": "enyo_s_world",
        "name": "Enyo's World",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Enyo\u2019s World",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10007.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.84,
          "ore": 0.86,
          "machinery": 1.02,
          "meds": 0.89,
          "luxury": 1.42
        }
      },
      {
        "id": "enyo_fuel_refinery",
        "name": "Enyo Fuel Refinery",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "The Enyo Orbital Fuel Refinery is one of the largest producers of processed fuel products in the galaxy. It makes fuel for everything from starships to ground vehicles. The boredom of life on a space station makes the refinery\u2019s crew eager for diversion brought by visiting ships.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10025.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.97,
          "ore": 1.03,
          "machinery": 1.21,
          "meds": 1.12,
          "luxury": 1.21
        }
      }
    ]
  },
  {
    "id": "sirius",
    "name": "Sirius",
    "sector": "Confederation Core",
    "x": 494.4,
    "y": 464.0,
    "faction": "Confederation",
    "techLevel": 1,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Capella is a lush, beautiful planet that attracts many tourists. Hundreds of Centauri Spacelines ships visit Capella each year.",
    "connectedSystemIds": [
      "centauri",
      "tau_ceti",
      "altair"
    ],
    "stellarObjects": [
      {
        "id": "sirius_station",
        "name": "Sirius Station",
        "type": "station",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Sirius Station is the main operating base of the Sirius Cybernetics Corporation, makers of fine cybernetic products.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10024.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.12,
          "ore": 1.18,
          "machinery": 0.96,
          "meds": 1.17,
          "luxury": 1.26
        }
      },
      {
        "id": "sirius_iii",
        "name": "Sirius III",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Sirius III - a gas giant.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10007.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.99,
          "ore": 1.01,
          "machinery": 1.12,
          "meds": 0.94,
          "luxury": 1.47
        }
      }
    ]
  },
  {
    "id": "rigel",
    "name": "Rigel",
    "sector": "Confederation Core",
    "x": 619.8,
    "y": 354.8,
    "faction": "Confederation",
    "techLevel": 2,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Dune is a parched desert world. The few people who live on this planet say they do so for the solitude.",
    "connectedSystemIds": [
      "centauri",
      "levo",
      "matar"
    ],
    "stellarObjects": [
      {
        "id": "new_britain",
        "name": "New Britain",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Britain is a populous island world, and one of the first worlds settled during the Great Expansion. Much of New Britain\u2019s exports are food products, as its oceans are teeming with plant and animal life. ",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10002.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.02,
          "ore": 0.98,
          "machinery": 1.16,
          "meds": 0.87,
          "luxury": 1.36
        }
      }
    ]
  },
  {
    "id": "capella",
    "name": "Capella",
    "sector": "Confederation Core",
    "x": 722.1,
    "y": 338.0,
    "faction": "Confederation",
    "techLevel": 3,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Spica is a world shrouded by toxic clouds and a choking atmosphere. The uridium miners who work here have the highest fatality rate of any in the galaxy, as even a brief accidental exposure to Spica\u2019s atmosphere is instantly fatal.",
    "connectedSystemIds": [
      "levo",
      "zebetrious",
      "arrakis"
    ],
    "stellarObjects": [
      {
        "id": "capella",
        "name": "Capella",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Capella is a lush, beautiful planet that attracts many tourists. Hundreds of Centauri Spacelines ships visit Capella each year.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10003.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.15,
          "ore": 1.15,
          "machinery": 1.0,
          "meds": 1.1,
          "luxury": 1.15
        }
      }
    ]
  },
  {
    "id": "altair",
    "name": "Altair",
    "sector": "Frontier Void",
    "x": 438.3,
    "y": 408.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Maxwell\u2019s Purchase is a peaceful, independent world dedicated mainly to farming and some light manufacturing. The delicious junga root is grown primarily on  this planet.",
    "connectedSystemIds": [
      "polaris",
      "sirius",
      "zaxted"
    ],
    "stellarObjects": []
  },
  {
    "id": "antares",
    "name": "Antares",
    "sector": "Confederation Core",
    "x": 481.2,
    "y": 562.0,
    "faction": "Confederation",
    "techLevel": 5,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Hodgson\u2019s World is home to some of the best lobster in the galaxy.",
    "connectedSystemIds": [
      "diphidia",
      "tau_ceti",
      "mentos"
    ],
    "stellarObjects": [
      {
        "id": "new_providence",
        "name": "New Providence",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Providence is a peaceful world, founded long ago during the Great Expansion. During the Great War, the Confederation converted the once-agrarian colony into a huge mining operation, run by the Confederation-loyal Astex Mining Corporation.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.82,
          "ore": 0.88,
          "machinery": 1.11,
          "meds": 1.07,
          "luxury": 1.16
        }
      },
      {
        "id": "antares_station",
        "name": "Antares Station",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Due to the postwar rise in commercial traffic in the vicinity of the Antares system, the Confederation has constructed this small orbital garrison. It serves as a refuelling base for Confederation patrol ships, as well as a vanguard against possible Rebel incursions against the mines of New Providence.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10027.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.95,
          "ore": 1.05,
          "machinery": 0.95,
          "meds": 0.9,
          "luxury": 1.45
        }
      }
    ]
  },
  {
    "id": "pollux",
    "name": "Pollux",
    "sector": "Confederation Core",
    "x": 616.5,
    "y": 598.4,
    "faction": "Confederation",
    "techLevel": 1,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "The nighttime sky of Northstar is truly a sight to behold. The luminescent rings that circle the planet carve a glimmering arc across the sky each night, providing a spectacular show for natives and visitors alike. ",
    "connectedSystemIds": [
      "castor",
      "alcyon",
      "vega",
      "tau_ceti",
      "procyon"
    ],
    "stellarObjects": [
      {
        "id": "pollux_vi",
        "name": "Pollux VI",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Pollux VI",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.12,
          "ore": 0.98,
          "machinery": 1.21,
          "meds": 1.17,
          "luxury": 1.36
        }
      },
      {
        "id": "new_japan",
        "name": "New Japan",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Japan is a peaceful island world, and a well-established colony.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10032.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.85,
          "ore": 1.15,
          "machinery": 1.05,
          "meds": 1.0,
          "luxury": 1.15
        }
      }
    ]
  },
  {
    "id": "castor",
    "name": "Castor",
    "sector": "Frontier Void",
    "x": 530.7,
    "y": 629.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Master\u2019s Planet is a strange world with few known inhabitants. The occasional visitor has been known to disappear on Master\u2019s Planet, though so far no explanation has been found for these occurrances.",
    "connectedSystemIds": [
      "pollux",
      "tiber",
      "ursa"
    ],
    "stellarObjects": []
  },
  {
    "id": "deneb",
    "name": "Deneb",
    "sector": "Independent Worlds",
    "x": 774.9,
    "y": 626.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Many of the inhabitants of Torgo Prime are carriers of the awful Torgo virus, which causes extreme swelling of the joints and degradation of the speech centers of the brain. In its later stages, the Torgo virus renders its victims incapable of functioning in normal society. No cure is known, so the relief ships keep coming here, delivering medical supplies to fight off the disease.",
    "connectedSystemIds": [
      "alcyon",
      "tryvin"
    ],
    "stellarObjects": [
      {
        "id": "deneb_iii",
        "name": "Deneb III",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Deneb III is a major agricultural world, specializing in the production of grain and fruit.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.16,
          "ore": 0.74,
          "machinery": 0.93,
          "meds": 1.21,
          "luxury": 1.48
        }
      }
    ]
  },
  {
    "id": "regulus",
    "name": "Regulus",
    "sector": "Confederation Core",
    "x": 804.6,
    "y": 536.8,
    "faction": "Confederation",
    "techLevel": 4,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Sirius III - a gas giant.",
    "connectedSystemIds": [
      "vega",
      "tryvin",
      "pelagon"
    ],
    "stellarObjects": [
      {
        "id": "regulus_ii",
        "name": "Regulus II",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Regulus II is a Confederation penal colony. Some of the most outspoken opponents of Confederation rule were shipped here after the Great War, and none have been heard from since.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.92,
          "ore": 1.08,
          "machinery": 0.91,
          "meds": 0.97,
          "luxury": 1.06
        }
      },
      {
        "id": "new_france",
        "name": "New France",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New France was colonized during the Great Expansion as a center of culture, learning, and enlightenment. Now, it has the highest number of gift shops and burger bars per capita of any known planet.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10032.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.15,
          "ore": 0.95,
          "machinery": 0.9,
          "meds": 1.1,
          "luxury": 1.25
        }
      }
    ]
  },
  {
    "id": "polaris",
    "name": "Polaris",
    "sector": "Confederation Core",
    "x": 497.7,
    "y": 349.2,
    "faction": "Confederation",
    "techLevel": 5,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Sirius Station is the main operating base of the Sirius Cybernetics Corporation, makers of fine cybernetic products.",
    "connectedSystemIds": [
      "matar",
      "altair",
      "propus"
    ],
    "stellarObjects": [
      {
        "id": "northstar",
        "name": "Northstar",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "The nighttime sky of Northstar is truly a sight to behold. The luminescent rings that circle the planet carve a glimmering arc across the sky each night, providing a spectacular show for natives and visitors alike. ",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10023.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.0,
          "ore": 1.0,
          "machinery": 0.9,
          "meds": 1.05,
          "luxury": 1.1
        }
      }
    ]
  },
  {
    "id": "zebetrious",
    "name": "Zebetrious",
    "sector": "Frontier Void",
    "x": 781.5,
    "y": 391.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Tau Ceti IV was first visited by the colony ship Marathon.",
    "connectedSystemIds": [
      "capella",
      "barnard",
      "eridani",
      "pelagon",
      "arrakis"
    ],
    "stellarObjects": []
  },
  {
    "id": "mentos",
    "name": "Mentos",
    "sector": "Frontier Void",
    "x": 428.4,
    "y": 604.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Merlin is the largest moon of Tau Ceti IV. Its size is sufficent to hold an atmosphere, and conditions on Merlin are quite Earthlike, save for the somewhat lower gravity. The inhabitants of Merlin hold human-powered air races several times a year.",
    "connectedSystemIds": [
      "antares",
      "sauron",
      "tiber"
    ],
    "stellarObjects": []
  },
  {
    "id": "alcyon",
    "name": "Alcyon",
    "sector": "Frontier Void",
    "x": 699.0,
    "y": 654.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Tabletop is a planet almost completely devoid of trees. Raw timber and wood products fetch a high price in Tabletop\u2019s commodity exchange. There is even a flourishing black market, which provides Tabletop\u2019s residents with expensive, imported wood products.",
    "connectedSystemIds": [
      "pollux",
      "deneb",
      "adhara",
      "agena",
      "lethe"
    ],
    "stellarObjects": []
  },
  {
    "id": "tryvin",
    "name": "Tryvin",
    "sector": "Rebel Space",
    "x": 834.3,
    "y": 581.6,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Enyo\u2019s World",
    "connectedSystemIds": [
      "deneb",
      "regulus",
      "aries",
      "scorpio"
    ],
    "stellarObjects": []
  },
  {
    "id": "diphidia",
    "name": "Diphidia",
    "sector": "Independent Worlds",
    "x": 428.4,
    "y": 500.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "The Enyo Orbital Fuel Refinery is one of the largest producers of processed fuel products in the galaxy. It makes fuel for everything from starships to ground vehicles. The boredom of life on a space station makes the refinery\u2019s crew eager for diversion brought by visiting ships.",
    "connectedSystemIds": [
      "antares",
      "zaxted",
      "farazon"
    ],
    "stellarObjects": [
      {
        "id": "diphidia_ii",
        "name": "Diphidia II",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Diphidia II is a major exporter of fish and ocean products. Diphidia seaweed, which grows only in Diphidia\u2019s oceans, is renowned for its remarkable strength and durability; no synthetic fiber has yet matched its tensile strength.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10006.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.88,
          "ore": 1.12,
          "machinery": 1.09,
          "meds": 0.93,
          "luxury": 1.04
        }
      }
    ]
  },
  {
    "id": "zaxted",
    "name": "Zaxted",
    "sector": "Independent Worlds",
    "x": 369.0,
    "y": 450.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "New Sahara is a hot, dry, flat, and highly uninteresting planet. Its main feature is its resemblance to Earth\u2019s Sahara desert. The planet has only a few nomadic inhabitants.",
    "connectedSystemIds": [
      "altair",
      "diphidia",
      "farazon"
    ],
    "stellarObjects": [
      {
        "id": "zaxted",
        "name": "Zaxted",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Zaxted",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10014.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.18,
          "ore": 0.92,
          "machinery": 0.94,
          "meds": 1.03,
          "luxury": 1.14
        }
      },
      {
        "id": "zaxted_starport",
        "name": "Zaxted Starport",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Zaxted Starport is a bustling center of trade and commerce.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10025.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.05,
          "ore": 0.75,
          "machinery": 1.1,
          "meds": 1.2,
          "luxury": 1.35
        }
      }
    ]
  },
  {
    "id": "matar",
    "name": "Matar",
    "sector": "Confederation Core",
    "x": 573.6,
    "y": 304.4,
    "faction": "Confederation",
    "techLevel": 2,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Samson\u2019s Planet is a grim and uninteresting ball of dirty ice. However, underneath the glaciers are large deposits of valuable metal ore.",
    "connectedSystemIds": [
      "rigel",
      "risa",
      "polaris",
      "yemuro"
    ],
    "stellarObjects": [
      {
        "id": "hodgson_s_world",
        "name": "Hodgson's World",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Hodgson\u2019s World is home to some of the best lobster in the galaxy.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10005.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.87,
          "ore": 0.83,
          "machinery": 1.06,
          "meds": 1.22,
          "luxury": 1.31
        }
      }
    ]
  },
  {
    "id": "pelagon",
    "name": "Pelagon",
    "sector": "Independent Worlds",
    "x": 834.3,
    "y": 492.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Plateau is a planet composed entirely of mesa-like islands. All the land is flat, and where it isn\u2019t, it\u2019s underwater. Plateau\u2019s inhabitants live in isolated island communities, claiming they find life on this planet peaceful.",
    "connectedSystemIds": [
      "zebetrious",
      "regulus",
      "sirgil",
      "jadzia",
      "nexus"
    ],
    "stellarObjects": [
      {
        "id": "opal",
        "name": "Opal",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Opal is a tranquil island world, much preferable to neighboring Quake.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10006.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.15,
          "ore": 0.75,
          "machinery": 1.15,
          "meds": 1.1,
          "luxury": 1.35
        }
      },
      {
        "id": "quake",
        "name": "Quake",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "Quake is a world continually shaken by seismic tremors. Anyone who lands here immediately blasts off again and heads for Opal, Quake\u2019s sister world and a far more calming place. Of course, anyone with any sense at all wouldn\u2019t come to Quake in the first place.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10011.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.14,
          "ore": 0.96,
          "machinery": 1.12,
          "meds": 0.99,
          "luxury": 1.12
        }
      }
    ]
  },
  {
    "id": "propus",
    "name": "Propus",
    "sector": "Independent Worlds",
    "x": 392.1,
    "y": 360.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "The colony on Hikeeba was founded by a group of Japanese Haikebo experts intent on establishing a place free of distraction where they could teach martial arts. Pity it\u2019s such a dump, though.",
    "connectedSystemIds": [
      "polaris",
      "curzon",
      "darven"
    ],
    "stellarObjects": [
      {
        "id": "propus_vii",
        "name": "Propus VII",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Propus VII",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10021.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.16,
          "ore": 0.94,
          "machinery": 1.03,
          "meds": 1.21,
          "luxury": 1.38
        }
      },
      {
        "id": "new_scotland",
        "name": "New Scotland",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Scotland\u2019s motto is \u201cIt\u2019s Our Bloody Moon, We Can Play The Bagpipes And Eat Haggis All We Want!\u201d",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10029.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.89,
          "ore": 1.11,
          "machinery": 1.22,
          "meds": 1.04,
          "luxury": 1.17
        }
      },
      {
        "id": "new_ireland",
        "name": "New Ireland",
        "type": "planet",
        "orbitRadius": 160,
        "orbitSpeed": 0.009000000000000001,
        "initialAngle": 3.6,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Scotland\u2019s sister moon, New Ireland, was terraformed during the Great Expansion. Now, its capital city of New Belfast is a model of industrial society.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10030.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.02,
          "ore": 0.78,
          "machinery": 1.06,
          "meds": 0.87,
          "luxury": 1.46
        }
      }
    ]
  },
  {
    "id": "risa",
    "name": "Risa",
    "sector": "Frontier Void",
    "x": 441.6,
    "y": 293.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "New Providence is a peaceful world, founded long ago during the Great Expansion. During the Great War, the Confederation converted the once-agrarian colony into a huge mining operation, run by the Confederation-loyal Astex Mining Corporation.",
    "connectedSystemIds": [
      "matar",
      "curzon",
      "zaphod"
    ],
    "stellarObjects": []
  },
  {
    "id": "yemuro",
    "name": "Yemuro",
    "sector": "Independent Worlds",
    "x": 550.5,
    "y": 259.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Due to the postwar rise in commercial traffic in the vicinity of the Antares system, the Confederation has constructed this small orbital garrison. It serves as a refuelling base for Confederation patrol ships, as well as a vanguard against possible Rebel incursions against the mines of New Providence.",
    "connectedSystemIds": [
      "matar",
      "turin",
      "zaphod",
      "kathoon"
    ],
    "stellarObjects": [
      {
        "id": "new_istanbul",
        "name": "New Istanbul",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Istanbul is a major source of prosthetic SynthFlesh and other medical goods, as Flood Medical Technologies has its main factory here.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10004.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.08,
          "ore": 0.72,
          "machinery": 1.14,
          "meds": 1.13,
          "luxury": 1.24
        }
      }
    ]
  },
  {
    "id": "arrakis",
    "name": "Arrakis",
    "sector": "Independent Worlds",
    "x": 811.2,
    "y": 301.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "New Istanbul is a major source of prosthetic SynthFlesh and other medical goods, as Flood Medical Technologies has its main factory here.",
    "connectedSystemIds": [
      "nemesis",
      "capella",
      "zebetrious"
    ],
    "stellarObjects": [
      {
        "id": "dune",
        "name": "Dune",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Dune is a parched desert world. The few people who live on this planet say they do so for the solitude.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10005.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.88,
          "ore": 0.82,
          "machinery": 1.19,
          "meds": 0.93,
          "luxury": 1.44
        }
      }
    ]
  },
  {
    "id": "nemesis",
    "name": "Nemesis",
    "sector": "Rebel Space",
    "x": 887.1,
    "y": 346.4,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "George\u2019s World is perodically rocked by violent earthquakes, and a deep rumbling can be heard at all times, all over the planet. No one has yet postulated an explanation for this phenomenon, but settlers are reluctant to emigrate to George\u2019s World until the mystery is solved.",
    "connectedSystemIds": [
      "arrakis",
      "manos",
      "topaz",
      "nexus"
    ],
    "stellarObjects": [
      {
        "id": "darkstar",
        "name": "Darkstar",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Darkstar\u2019s sun, Nemesis, is a massive red giant - a star which has nearly exhausted its supply of nuclear fuel. At night on the planet, the beautiful Serpens Nebula can be seen drifting across the sky. The people of Darkstar are expert metalworkers, able to turn piles of raw sheet metal into a myriad of useful industrial equipment.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10011.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.96,
          "ore": 0.84,
          "machinery": 0.98,
          "meds": 1.01,
          "luxury": 1.18
        }
      }
    ]
  },
  {
    "id": "aries",
    "name": "Aries",
    "sector": "Cydonian Expanse",
    "x": 864.0,
    "y": 657.2,
    "faction": "Cydonian",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "P-8457 is a Marslike desert world with a thin atmosphere and low temperatures. It is uninhabited.",
    "connectedSystemIds": [
      "tryvin",
      "lethe"
    ],
    "stellarObjects": [
      {
        "id": "new_cydonia",
        "name": "New Cydonia",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Cydonia was founded by natives of the Mars Colony, who claimed that Mars was too civilized and terraformed for their tastes. The Aries system is currently at war with its neighboring system, Lethe, over water rights.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.89,
          "ore": 0.91,
          "machinery": 1.12,
          "meds": 1.04,
          "luxury": 1.27
        }
      }
    ]
  },
  {
    "id": "ursa",
    "name": "Ursa",
    "sector": "Rebel Space",
    "x": 603.3,
    "y": 671.2,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Beeblebrox is a wild world, a world of wild parties and wild people. If you have two heads, three arms, and an ego problem, don\u2019t travel to Beeblebrox; you will be laughed at and considered boring and unoriginal.",
    "connectedSystemIds": [
      "agena",
      "castor"
    ],
    "stellarObjects": [
      {
        "id": "ursa_minor_beta",
        "name": "Ursa Minor Beta",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Ursa Minor Beta is a luxury world, full of tourists and wealthy citizens. Their membership in the Rebellion is more a matter of location than of political sympathies.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10005.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.84,
          "ore": 1.16,
          "machinery": 0.92,
          "meds": 0.89,
          "luxury": 1.02
        }
      }
    ]
  },
  {
    "id": "sauron",
    "name": "Sauron",
    "sector": "Independent Worlds",
    "x": 372.3,
    "y": 556.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Turin V is an arid, barren world, characterized by freezing temperatures and fierce winds. The colony ship Sojourner II was the first ship to reach this planet, and was forced to crash-land in the desert when its propulsion and life support systems were destroyed by a meteorite.",
    "connectedSystemIds": [
      "farazon",
      "canopus",
      "mentos"
    ],
    "stellarObjects": [
      {
        "id": "sauron",
        "name": "Sauron",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Sauron is the only inhabited world in this small region of space, as it is convienently located to serve as a refuelling and outfitting base for passing ships.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10010.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.83,
          "ore": 1.17,
          "machinery": 1.14,
          "meds": 1.18,
          "luxury": 1.39
        }
      }
    ]
  },
  {
    "id": "farazon",
    "name": "Farazon",
    "sector": "Frontier Void",
    "x": 309.6,
    "y": 497.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Palshife is a beautiful world of rocky islands and gorgeous skies. It was one of the galaxy\u2019s more popular vacation spots, before the Great War. Now, it is home to the Rebel High Command and the Rebellion\u2019s main troop-training center and shipyard.",
    "connectedSystemIds": [
      "diphidia",
      "sauron",
      "gamera",
      "perseus",
      "zaxted"
    ],
    "stellarObjects": []
  },
  {
    "id": "curzon",
    "name": "Curzon",
    "sector": "Frontier Void",
    "x": 355.8,
    "y": 310.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Alkaid",
    "connectedSystemIds": [
      "risa",
      "propus",
      "clotho",
      "orion"
    ],
    "stellarObjects": []
  },
  {
    "id": "jadzia",
    "name": "Jadzia",
    "sector": "Independent Worlds",
    "x": 910.2,
    "y": 461.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Alkaidion is the second moon of Alkaid, and the only one capable of supporting life. Its businesses make a huge profit each year through the export of advanced quasiconductor devices constructed in the colony\u2019s high-tech factories - a very valuable source of funds for the Rebellion. However, the moon\u2019s soil has an extremely low concentration of nutrients, forcing the inhabitants of Alkaidion to import much of their food.",
    "connectedSystemIds": [
      "pelagon",
      "nexus"
    ],
    "stellarObjects": [
      {
        "id": "new_bavaria",
        "name": "New Bavaria",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Bavaria is a lovely planet, and its inhabitants are proud of their Germanic heritage. This is one of the few planets in the galaxy where Galactic Standard is not the first language.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10012.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.09,
          "ore": 1.01,
          "machinery": 1.17,
          "meds": 1.24,
          "luxury": 1.47
        }
      }
    ]
  },
  {
    "id": "vulcan",
    "name": "Vulcan",
    "sector": "Frontier Void",
    "x": 758.4,
    "y": 248.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Regulus II is a Confederation penal colony. Some of the most outspoken opponents of Confederation rule were shipped here after the Great War, and none have been heard from since.",
    "connectedSystemIds": [
      "levo",
      "spica",
      "apollo",
      "gymkata"
    ],
    "stellarObjects": []
  },
  {
    "id": "kathoon",
    "name": "Kathoon",
    "sector": "Independent Worlds",
    "x": 639.6,
    "y": 226.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Zaxted Starport is a bustling center of trade and commerce.",
    "connectedSystemIds": [
      "levo",
      "spica",
      "yemuro"
    ],
    "stellarObjects": [
      {
        "id": "maxwell_s_purchase",
        "name": "Maxwell's Purchase",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Maxwell\u2019s Purchase is a peaceful, independent world dedicated mainly to farming and some light manufacturing. The delicious junga root is grown primarily on  this planet.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10003.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.14,
          "ore": 1.16,
          "machinery": 1.22,
          "meds": 0.99,
          "luxury": 1.02
        }
      }
    ]
  },
  {
    "id": "thanos",
    "name": "Thanos",
    "sector": "Rebel Space",
    "x": 474.6,
    "y": 668.4,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Zaxted",
    "connectedSystemIds": [
      "el_santo"
    ],
    "stellarObjects": [
      {
        "id": "thanos_iv",
        "name": "Thanos IV",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Thanos IV",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10023.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.98,
          "ore": 0.82,
          "machinery": 1.24,
          "meds": 1.23,
          "luxury": 1.44
        }
      },
      {
        "id": "syntex_refinery",
        "name": "Syntex Refinery",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "The Syntex Refinery makes most of the coolant fluids for the engines of the galaxy\u2019s starships. Crew members on this remote station lead a boring life, and welcome any diversion brought by passing ships.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10027.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.11,
          "ore": 0.99,
          "machinery": 1.08,
          "meds": 1.06,
          "luxury": 1.23
        }
      }
    ]
  },
  {
    "id": "darven",
    "name": "Darven",
    "sector": "Independent Worlds",
    "x": 319.5,
    "y": 402.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Clotho Prime is often visited by Rebel warships, as the Rebellion maintains a repair and refuelling base on the surface of the planet.",
    "connectedSystemIds": [
      "propus",
      "perseus",
      "atropos"
    ],
    "stellarObjects": [
      {
        "id": "darven",
        "name": "Darven",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Darven",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.86,
          "ore": 1.14,
          "machinery": 1.18,
          "meds": 1.11,
          "luxury": 1.28
        }
      },
      {
        "id": "blackthorne",
        "name": "Blackthorne",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Blackthorne is an extremely dangerous place for a law-abiding citizen to hang out. If you don\u2019t actually get your cargo stolen, you\u2019ll at least get your pocket picked. Still, Blackthorne is the place to come if you\u2019re looking for any of the \u201cspecial\u201d items available here.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10027.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.99,
          "ore": 0.81,
          "machinery": 1.02,
          "meds": 0.94,
          "luxury": 1.07
        }
      }
    ]
  },
  {
    "id": "zaphod",
    "name": "Zaphod",
    "sector": "Rebel Space",
    "x": 438.3,
    "y": 242.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Clotho II is a dismal world, wreathed by perpetual storm clouds. The planet was colonized so that the Delahanty plant, a spicy delicacy that grows only on this world, could be harvested.",
    "connectedSystemIds": [
      "yemuro",
      "risa",
      "alkaid"
    ],
    "stellarObjects": [
      {
        "id": "beeblebrox",
        "name": "Beeblebrox",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Beeblebrox is a wild world, a world of wild parties and wild people. If you have two heads, three arms, and an ego problem, don\u2019t travel to Beeblebrox; you will be laughed at and considered boring and unoriginal.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10005.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.07,
          "ore": 0.73,
          "machinery": 1.01,
          "meds": 1.02,
          "luxury": 1.11
        }
      }
    ]
  },
  {
    "id": "turin",
    "name": "Turin",
    "sector": "Rebel Space",
    "x": 524.1,
    "y": 209.2,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Orion",
    "connectedSystemIds": [
      "yemuro",
      "persephone",
      "cygnus"
    ],
    "stellarObjects": [
      {
        "id": "turin_v",
        "name": "Turin V",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Turin V is an arid, barren world, characterized by freezing temperatures and fierce winds. The colony ship Sojourner II was the first ship to reach this planet, and was forced to crash-land in the desert when its propulsion and life support systems were destroyed by a meteorite.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.8,
          "ore": 0.9,
          "machinery": 1.2,
          "meds": 0.85,
          "luxury": 1.4
        }
      }
    ]
  },
  {
    "id": "sirgil",
    "name": "Sirgil",
    "sector": "Rebel Space",
    "x": 930.0,
    "y": 536.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Hunter is home to the famous Orion Trouser Snake.",
    "connectedSystemIds": [
      "pelagon",
      "virgo",
      "ngc_6762"
    ],
    "stellarObjects": [
      {
        "id": "sirgil_iii",
        "name": "Sirgil III",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Sirgil is a major industrial world, dotted with metropolitan cities and manufacturing centers.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10002.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.17,
          "ore": 0.73,
          "machinery": 1.06,
          "meds": 0.92,
          "luxury": 1.11
        }
      },
      {
        "id": "sirgil_starport",
        "name": "Sirgil Starport",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Sirgil Starport is an orbital market, established as a commodity exchange for the products produced by the planet below.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10026.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.9,
          "ore": 0.9,
          "machinery": 0.9,
          "meds": 1.15,
          "luxury": 1.4
        }
      }
    ]
  },
  {
    "id": "tiber",
    "name": "Tiber",
    "sector": "Rebel Space",
    "x": 392.1,
    "y": 648.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Atropos features some of the best hoverskiing in the galaxy. Just watch out for the perpetual avalanches.",
    "connectedSystemIds": [
      "mentos",
      "castor",
      "el_santo"
    ],
    "stellarObjects": [
      {
        "id": "tiber_ii",
        "name": "Tiber II",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Tiber II",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.95,
          "ore": 0.85,
          "machinery": 1.2,
          "meds": 0.9,
          "luxury": 1.05
        }
      },
      {
        "id": "port_oread",
        "name": "Port Oread",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Port Oread is a stopover point for passing freighters of many governments and corporations.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10024.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.08,
          "ore": 1.02,
          "machinery": 1.04,
          "meds": 1.13,
          "luxury": 1.34
        }
      }
    ]
  },
  {
    "id": "canopus",
    "name": "Canopus",
    "sector": "Frontier Void",
    "x": 326.1,
    "y": 598.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Propus VII",
    "connectedSystemIds": [
      "sauron",
      "olympus",
      "gamera"
    ],
    "stellarObjects": []
  },
  {
    "id": "agena",
    "name": "Agena",
    "sector": "Rebel Space",
    "x": 573.6,
    "y": 727.2,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "New Scotland\u2019s motto is \u201cIt\u2019s Our Bloody Moon, We Can Play The Bagpipes And Eat Haggis All We Want!\u201d",
    "connectedSystemIds": [
      "ursa",
      "ngc_9758",
      "alcyon",
      "ngc_0630"
    ],
    "stellarObjects": [
      {
        "id": "murphy_s_world",
        "name": "Murphy's World",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Murphy's World is a planet of terrible luck. Most of the islands on this ocean world are of volcanic origin, with many still active.  Forecasting the frequent eruptions is a huge task, and many people are caught off guard \u2014 in the wrong place at the wrong time \u2014 when one of the volcanoes unexpectedly erupts.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10007.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.07,
          "ore": 1.03,
          "machinery": 0.91,
          "meds": 1.02,
          "luxury": 1.21
        }
      }
    ]
  },
  {
    "id": "spica",
    "name": "Spica",
    "sector": "Rebel Space",
    "x": 718.8,
    "y": 189.6,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "New Scotland\u2019s sister moon, New Ireland, was terraformed during the Great Expansion. Now, its capital city of New Belfast is a model of industrial society.",
    "connectedSystemIds": [
      "kathoon",
      "vulcan",
      "ngc_5465"
    ],
    "stellarObjects": [
      {
        "id": "spica",
        "name": "Spica",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Spica is a world shrouded by toxic clouds and a choking atmosphere. The uridium miners who work here have the highest fatality rate of any in the galaxy, as even a brief accidental exposure to Spica\u2019s atmosphere is instantly fatal.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10014.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.01,
          "ore": 0.99,
          "machinery": 1.03,
          "meds": 1.16,
          "luxury": 1.23
        }
      }
    ]
  },
  {
    "id": "adhara",
    "name": "Adhara",
    "sector": "Rebel Space",
    "x": 715.5,
    "y": 730.0,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "New France was colonized during the Great Expansion as a center of culture, learning, and enlightenment. Now, it has the highest number of gift shops and burger bars per capita of any known planet.",
    "connectedSystemIds": [
      "alcyon",
      "ngc_0630"
    ],
    "stellarObjects": [
      {
        "id": "adhara",
        "name": "Adhara",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Much of the pre-War industry of Adhara was occupied with producing luxury goods for wealthy planets. As a result, the freedom-loving people of Adhara have been able to contribute substantial revenue to the Rebellion\u2019s war efforts.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.8,
          "ore": 0.7,
          "machinery": 1.1,
          "meds": 0.85,
          "luxury": 1.0
        }
      },
      {
        "id": "sentinel_station",
        "name": "Sentinel Station",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Sentinel Station used to serve as a base for the patrol ships that escorted bulk freighters full of luxury goods out of the Adhara system - now it functions as the Rebellion\u2019s primary staging platform in this region of space.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10025.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.93,
          "ore": 0.87,
          "machinery": 0.94,
          "meds": 1.08,
          "luxury": 1.29
        }
      }
    ]
  },
  {
    "id": "el_santo",
    "name": "El Santo",
    "sector": "Rebel Space",
    "x": 415.2,
    "y": 704.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Diphidia II is a major exporter of fish and ocean products. Diphidia seaweed, which grows only in Diphidia\u2019s oceans, is renowned for its remarkable strength and durability; no synthetic fiber has yet matched its tensile strength.",
    "connectedSystemIds": [
      "thanos",
      "tiber",
      "ngc_9758",
      "osiris"
    ],
    "stellarObjects": [
      {
        "id": "samson_s_planet",
        "name": "Samson's Planet",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Samson\u2019s Planet is a grim and uninteresting ball of dirty ice. However, underneath the glaciers are large deposits of valuable metal ore.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10013.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.83,
          "ore": 0.87,
          "machinery": 1.24,
          "meds": 1.18,
          "luxury": 1.29
        }
      }
    ]
  },
  {
    "id": "alkaid",
    "name": "Alkaid",
    "sector": "Rebel Space",
    "x": 349.2,
    "y": 251.2,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "New Columbia\u2019s rugged terrain forces its inhabitants to live mostly around the port city of New Seattle. Much of the planet is still unexplored.",
    "connectedSystemIds": [
      "zaphod",
      "persephone"
    ],
    "stellarObjects": [
      {
        "id": "alkaid",
        "name": "Alkaid",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Alkaid",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10021.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.06,
          "ore": 0.74,
          "machinery": 1.23,
          "meds": 0.91,
          "luxury": 1.48
        }
      },
      {
        "id": "alkaidion",
        "name": "Alkaidion",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Alkaidion is the second moon of Alkaid, and the only one capable of supporting life. Its businesses make a huge profit each year through the export of advanced quasiconductor devices constructed in the colony\u2019s high-tech factories - a very valuable source of funds for the Rebellion. However, the moon\u2019s soil has an extremely low concentration of nutrients, forcing the inhabitants of Alkaidion to import much of their food.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10030.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.19,
          "ore": 0.91,
          "machinery": 1.07,
          "meds": 1.14,
          "luxury": 1.27
        }
      }
    ]
  },
  {
    "id": "cygnus",
    "name": "Cygnus",
    "sector": "Rebel Space",
    "x": 600.0,
    "y": 175.6,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Quake is a world continually shaken by seismic tremors. Anyone who lands here immediately blasts off again and heads for Opal, Quake\u2019s sister world and a far more calming place. Of course, anyone with any sense at all wouldn\u2019t come to Quake in the first place.",
    "connectedSystemIds": [
      "turin",
      "ngc_1023"
    ],
    "stellarObjects": [
      {
        "id": "palomino",
        "name": "Palomino",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Many species of animals, both Terran and alien, range free on Palomino\u2019s open grasslands. Part of the planet is a huge nature preserve, and part is a vast breeding ground and stable for work animals, which are still useful on many worlds.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.82,
          "ore": 1.18,
          "machinery": 1.01,
          "meds": 1.07,
          "luxury": 1.26
        }
      }
    ]
  },
  {
    "id": "torgo",
    "name": "Torgo",
    "sector": "Independent Worlds",
    "x": 1022.4,
    "y": 360.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Armstrong has a large number of shipyards and repair facilities, and the planet also has the most extensive museum of space history in the galaxy.",
    "connectedSystemIds": [
      "manos"
    ],
    "stellarObjects": [
      {
        "id": "torgo_prime",
        "name": "Torgo Prime",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Many of the inhabitants of Torgo Prime are carriers of the awful Torgo virus, which causes extreme swelling of the joints and degradation of the speech centers of the brain. In its later stages, the Torgo virus renders its victims incapable of functioning in normal society. No cure is known, so the relief ships keep coming here, delivering medical supplies to fight off the disease.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10021.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.86,
          "ore": 0.84,
          "machinery": 0.93,
          "meds": 1.11,
          "luxury": 1.18
        }
      }
    ]
  },
  {
    "id": "manos",
    "name": "Manos",
    "sector": "Independent Worlds",
    "x": 949.8,
    "y": 326.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Persephone IX",
    "connectedSystemIds": [
      "torgo",
      "nemesis"
    ],
    "stellarObjects": [
      {
        "id": "master_s_planet",
        "name": "Master's Planet",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Master\u2019s Planet is a strange world with few known inhabitants. The occasional visitor has been known to disappear on Master\u2019s Planet, though so far no explanation has been found for these occurrances.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10015.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.13,
          "ore": 1.17,
          "machinery": 1.09,
          "meds": 0.88,
          "luxury": 1.39
        }
      }
    ]
  },
  {
    "id": "gamera",
    "name": "Gamera",
    "sector": "Frontier Void",
    "x": 237.0,
    "y": 553.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Rupert is a small moon that is home to a colony of religous fanatics, followers of the Order of the Holy Mac.",
    "connectedSystemIds": [
      "guiron",
      "zigra",
      "canopus",
      "farazon"
    ],
    "stellarObjects": []
  },
  {
    "id": "guiron",
    "name": "Guiron",
    "sector": "Rebel Space",
    "x": 174.3,
    "y": 500.4,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Darven",
    "connectedSystemIds": [
      "gamera"
    ],
    "stellarObjects": [
      {
        "id": "akio",
        "name": "Akio",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "The religion of the people of Akio is most peculiar - they believe that, some day, a giant turtle will descend from the heavens and deliver them from evil.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10013.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.81,
          "ore": 1.19,
          "machinery": 1.23,
          "meds": 0.96,
          "luxury": 1.13
        }
      }
    ]
  },
  {
    "id": "zigra",
    "name": "Zigra",
    "sector": "Rebel Space",
    "x": 187.5,
    "y": 609.6,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Blackthorne is an extremely dangerous place for a law-abiding citizen to hang out. If you don\u2019t actually get your cargo stolen, you\u2019ll at least get your pocket picked. Still, Blackthorne is the place to come if you\u2019re looking for any of the \u201cspecial\u201d items available here.",
    "connectedSystemIds": [
      "gamera"
    ],
    "stellarObjects": [
      {
        "id": "lauralee",
        "name": "Lauralee",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Lauralee is a beautiful world, with many exotic plant and animal species visible from the spaceport windows.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10002.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.94,
          "ore": 0.86,
          "machinery": 1.07,
          "meds": 1.19,
          "luxury": 1.42
        }
      }
    ]
  },
  {
    "id": "osiris",
    "name": "Osiris",
    "sector": "Rebel Space",
    "x": 303.0,
    "y": 704.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Pollux VI",
    "connectedSystemIds": [
      "olympus",
      "ngc_6564",
      "el_santo"
    ],
    "stellarObjects": [
      {
        "id": "osiris_ii",
        "name": "Osiris II",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Osiris II",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10021.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.92,
          "ore": 0.88,
          "machinery": 1.16,
          "meds": 0.97,
          "luxury": 1.16
        }
      },
      {
        "id": "endor",
        "name": "Endor",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Endor is a small moon with low gravity. As a result, the trees that cover this forest world grow to incredible heights.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10031.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.05,
          "ore": 1.05,
          "machinery": 1.0,
          "meds": 1.2,
          "luxury": 1.45
        }
      }
    ]
  },
  {
    "id": "perseus",
    "name": "Perseus",
    "sector": "Independent Worlds",
    "x": 243.6,
    "y": 450.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "New Japan is a peaceful island world, and a well-established colony.",
    "connectedSystemIds": [
      "darven",
      "farazon"
    ],
    "stellarObjects": [
      {
        "id": "perseus_ii",
        "name": "Perseus II",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Perseus II is a hot but pleasant world. Persean Bug Juice is distilled here, and exported to planets across the galaxy.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10011.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.97,
          "ore": 0.83,
          "machinery": 1.11,
          "meds": 1.12,
          "luxury": 1.31
        }
      },
      {
        "id": "pegasus",
        "name": "Pegasus",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Pegasus is a small mining and research colony on a moon orbiting Perseus II.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10028.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.1,
          "ore": 1.0,
          "machinery": 0.95,
          "meds": 0.95,
          "luxury": 1.1
        }
      }
    ]
  },
  {
    "id": "scorpio",
    "name": "Scorpio",
    "sector": "Rebel Space",
    "x": 920.1,
    "y": 632.0,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Thanos IV",
    "connectedSystemIds": [
      "tryvin",
      "ngc_0317"
    ],
    "stellarObjects": [
      {
        "id": "scorpio",
        "name": "Scorpio",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Scorpio has the largest number of crab species in the known galaxy.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10008.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.03,
          "ore": 1.07,
          "machinery": 1.09,
          "meds": 0.98,
          "luxury": 1.19
        }
      }
    ]
  },
  {
    "id": "persephone",
    "name": "Persephone",
    "sector": "Rebel Space",
    "x": 441.6,
    "y": 170.0,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "The Syntex Refinery makes most of the coolant fluids for the engines of the galaxy\u2019s starships. Crew members on this remote station lead a boring life, and welcome any diversion brought by passing ships.",
    "connectedSystemIds": [
      "alkaid",
      "turin",
      "satori",
      "ngc_2468"
    ],
    "stellarObjects": [
      {
        "id": "persephone_ix",
        "name": "Persephone IX",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Persephone IX",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10021.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.0,
          "ore": 0.8,
          "machinery": 1.15,
          "meds": 1.05,
          "luxury": 1.2
        }
      },
      {
        "id": "rupert",
        "name": "Rupert",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Rupert is a small moon that is home to a colony of religous fanatics, followers of the Order of the Holy Mac.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10030.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.13,
          "ore": 0.97,
          "machinery": 0.99,
          "meds": 0.88,
          "luxury": 1.49
        }
      }
    ]
  },
  {
    "id": "orion",
    "name": "Orion",
    "sector": "Rebel Space",
    "x": 276.6,
    "y": 346.4,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Ursa Minor Beta is a luxury world, full of tourists and wealthy citizens. Their membership in the Rebellion is more a matter of location than of political sympathies.",
    "connectedSystemIds": [
      "atropos",
      "curzon",
      "ngc_8457"
    ],
    "stellarObjects": [
      {
        "id": "orion",
        "name": "Orion",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Orion",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.17,
          "ore": 0.93,
          "machinery": 1.16,
          "meds": 0.92,
          "luxury": 1.01
        }
      },
      {
        "id": "hunter",
        "name": "Hunter",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Hunter is home to the famous Orion Trouser Snake.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10031.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.9,
          "ore": 1.1,
          "machinery": 1.0,
          "meds": 1.15,
          "luxury": 1.3
        }
      }
    ]
  },
  {
    "id": "apollo",
    "name": "Apollo",
    "sector": "Rebel Space",
    "x": 880.5,
    "y": 265.2,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Perseus II is a hot but pleasant world. Persean Bug Juice is distilled here, and exported to planets across the galaxy.",
    "connectedSystemIds": [
      "vulcan",
      "ngc_7665"
    ],
    "stellarObjects": [
      {
        "id": "armstrong",
        "name": "Armstrong",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Armstrong has a large number of shipyards and repair facilities, and the planet also has the most extensive museum of space history in the galaxy.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.87,
          "ore": 1.13,
          "machinery": 0.96,
          "meds": 1.22,
          "luxury": 1.41
        }
      }
    ]
  },
  {
    "id": "olympus",
    "name": "Olympus",
    "sector": "Independent Worlds",
    "x": 276.6,
    "y": 651.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Pegasus is a small mining and research colony on a moon orbiting Perseus II.",
    "connectedSystemIds": [
      "osiris",
      "canopus",
      "ngc_0551",
      "ngc_1325"
    ],
    "stellarObjects": [
      {
        "id": "zeus",
        "name": "Zeus",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Zeus is a large planet with high gravity. Violent thunderstorms jolt the desert bluffs with lightning during Zeus\u2019s monsoon season.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10011.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.06,
          "ore": 1.04,
          "machinery": 1.13,
          "meds": 0.91,
          "luxury": 1.08
        }
      },
      {
        "id": "hera",
        "name": "Hera",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "In sharp contrast with neighboring Zeus, Hera is a lush garden spot. The inhabitants of Hera are extremely involved in nature, and their forestry and conservation skills are legendary. Professional environmentalists and terraformers from Hera are in great demand throughout the galaxy. ",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.19,
          "ore": 0.71,
          "machinery": 0.97,
          "meds": 1.14,
          "luxury": 1.37
        }
      }
    ]
  },
  {
    "id": "atropos",
    "name": "Atropos",
    "sector": "Rebel Space",
    "x": 210.6,
    "y": 399.6,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Sauron is the only inhabited world in this small region of space, as it is convienently located to serve as a refuelling and outfitting base for passing ships.",
    "connectedSystemIds": [
      "orion",
      "darven",
      "ngc_6484"
    ],
    "stellarObjects": [
      {
        "id": "atropos",
        "name": "Atropos",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Atropos features some of the best hoverskiing in the galaxy. Just watch out for the perpetual avalanches.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10012.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.03,
          "ore": 0.77,
          "machinery": 1.19,
          "meds": 0.98,
          "luxury": 1.09
        }
      }
    ]
  },
  {
    "id": "clotho",
    "name": "Clotho",
    "sector": "Rebel Space",
    "x": 266.7,
    "y": 287.6,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Darkstar\u2019s sun, Nemesis, is a massive red giant - a star which has nearly exhausted its supply of nuclear fuel. At night on the planet, the beautiful Serpens Nebula can be seen drifting across the sky. The people of Darkstar are expert metalworkers, able to turn piles of raw sheet metal into a myriad of useful industrial equipment.",
    "connectedSystemIds": [
      "curzon",
      "satori",
      "ngc_5638"
    ],
    "stellarObjects": [
      {
        "id": "clotho_prime",
        "name": "Clotho Prime",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Clotho Prime is often visited by Rebel warships, as the Rebellion maintains a repair and refuelling base on the surface of the planet.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10011.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.91,
          "ore": 1.09,
          "machinery": 1.13,
          "meds": 0.86,
          "luxury": 1.43
        }
      },
      {
        "id": "clotho_ii",
        "name": "Clotho II",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Clotho II is a dismal world, wreathed by perpetual storm clouds. The planet was colonized so that the Delahanty plant, a spicy delicacy that grows only on this world, could be harvested.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10007.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.04,
          "ore": 0.76,
          "machinery": 0.97,
          "meds": 1.09,
          "luxury": 1.22
        }
      }
    ]
  },
  {
    "id": "lethe",
    "name": "Lethe",
    "sector": "Lethean Border",
    "x": 850.8,
    "y": 716.0,
    "faction": "Lethean",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "New Bavaria is a lovely planet, and its inhabitants are proud of their Germanic heritage. This is one of the few planets in the galaxy where Galactic Standard is not the first language.",
    "connectedSystemIds": [
      "aries",
      "alcyon",
      "ngc_8113"
    ],
    "stellarObjects": [
      {
        "id": "lethe_prime",
        "name": "Lethe Prime",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Lethe Prime\u2019s fields and forests feed much of this sector. The major exports are vegetables and processed grain products. Lethe is currently at war with New Cydonia over water rights.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.02,
          "ore": 1.08,
          "machinery": 0.96,
          "meds": 0.87,
          "luxury": 1.06
        }
      }
    ]
  },
  {
    "id": "virgo",
    "name": "Virgo",
    "sector": "Rebel Space",
    "x": 999.3,
    "y": 494.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Many species of animals, both Terran and alien, range free on Palomino\u2019s open grasslands. Part of the planet is a huge nature preserve, and part is a vast breeding ground and stable for work animals, which are still useful on many worlds.",
    "connectedSystemIds": [
      "sirgil",
      "topaz",
      "ngc_1357"
    ],
    "stellarObjects": [
      {
        "id": "virgo",
        "name": "Virgo",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Virgo is almost all swamp, so the inhabitants are forced to live in the sparsely-dotted mountain ranges. Virgo\u2019s main export is the Virgo Banderfrog, whose hide is highly valued for its toughness and beauty.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10003.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.04,
          "ore": 1.06,
          "machinery": 1.22,
          "meds": 1.09,
          "luxury": 1.32
        }
      }
    ]
  },
  {
    "id": "topaz",
    "name": "Topaz",
    "sector": "Rebel Space",
    "x": 996.0,
    "y": 430.4,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Tiber II",
    "connectedSystemIds": [
      "nemesis",
      "virgo",
      "ngc_9846",
      "nexus"
    ],
    "stellarObjects": [
      {
        "id": "topaz_ii",
        "name": "Topaz II",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "Topaz II",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.18,
          "ore": 0.72,
          "machinery": 1.19,
          "meds": 1.03,
          "luxury": 1.24
        }
      },
      {
        "id": "emerald",
        "name": "Emerald",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Emerald, the third and largest moon of Topaz II, is home to the Emerald buzzbird. These charming birds produce a sound that has a calming effect on humans, and many are exported to other, less relaxed, planets. During Emerald\u2019s spring, however, the inhabitants must stay indoors and refrain from operating heavy machinery, as the sound made by thousands of flocking buzzbirds can put anyone to sleep in an instant.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10029.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.91,
          "ore": 0.89,
          "machinery": 1.03,
          "meds": 0.86,
          "luxury": 1.03
        }
      }
    ]
  },
  {
    "id": "satori",
    "name": "Satori",
    "sector": "Rebel Space",
    "x": 322.8,
    "y": 186.8,
    "faction": "Rebellion",
    "techLevel": 3,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Port Oread is a stopover point for passing freighters of many governments and corporations.",
    "connectedSystemIds": [
      "clotho",
      "persephone",
      "thx_1138"
    ],
    "stellarObjects": [
      {
        "id": "palshife",
        "name": "Palshife",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Palshife is a beautiful world of rocky islands and gorgeous skies. It was one of the galaxy\u2019s more popular vacation spots, before the Great War. Now, it is home to the Rebel High Command and the Rebellion\u2019s main troop-training center and shipyard.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10008.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.93,
          "ore": 1.07,
          "machinery": 1.04,
          "meds": 1.08,
          "luxury": 1.19
        }
      }
    ]
  },
  {
    "id": "procyon",
    "name": "Procyon",
    "sector": "Confederation Core",
    "x": 659.4,
    "y": 517.2,
    "faction": "Confederation",
    "techLevel": 3,
    "security": "High",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "The religion of the people of Akio is most peculiar - they believe that, some day, a giant turtle will descend from the heavens and deliver them from evil.",
    "connectedSystemIds": [
      "eridani",
      "tau_ceti",
      "pollux"
    ],
    "stellarObjects": [
      {
        "id": "plateau",
        "name": "Plateau",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Plateau is a planet composed entirely of mesa-like islands. All the land is flat, and where it isn\u2019t, it\u2019s underwater. Plateau\u2019s inhabitants live in isolated island communities, claiming they find life on this planet peaceful.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.96,
          "ore": 1.04,
          "machinery": 1.08,
          "meds": 1.01,
          "luxury": 1.08
        }
      }
    ]
  },
  {
    "id": "gymkata",
    "name": "Gymkata",
    "sector": "Independent Worlds",
    "x": 837.6,
    "y": 206.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Lauralee is a beautiful world, with many exotic plant and animal species visible from the spaceport windows.",
    "connectedSystemIds": [
      "vulcan",
      "ngc_6849"
    ],
    "stellarObjects": [
      {
        "id": "hikeeba",
        "name": "Hikeeba",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "The colony on Hikeeba was founded by a group of Japanese Haikebo experts intent on establishing a place free of distraction where they could teach martial arts. Pity it\u2019s such a dump, though.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.09,
          "ore": 0.71,
          "machinery": 0.92,
          "meds": 1.24,
          "luxury": 1.37
        }
      }
    ]
  },
  {
    "id": "ngc_2468",
    "name": "NGC-2468",
    "sector": "Frontier Void",
    "x": 375.6,
    "y": 108.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Murphy's World is a planet of terrible luck. Most of the islands on this ocean world are of volcanic origin, with many still active.  Forecasting the frequent eruptions is a huge task, and many people are caught off guard \u2014 in the wrong place at the wrong time \u2014 when one of the volcanoes unexpectedly erupts.",
    "connectedSystemIds": [
      "persephone"
    ],
    "stellarObjects": []
  },
  {
    "id": "thx_1138",
    "name": "THX-1138",
    "sector": "Frontier Void",
    "x": 250.2,
    "y": 158.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Much of the pre-War industry of Adhara was occupied with producing luxury goods for wealthy planets. As a result, the freedom-loving people of Adhara have been able to contribute substantial revenue to the Rebellion\u2019s war efforts.",
    "connectedSystemIds": [
      "satori"
    ],
    "stellarObjects": [
      {
        "id": "george_s_world",
        "name": "George's World",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "George\u2019s World is perodically rocked by violent earthquakes, and a deep rumbling can be heard at all times, all over the planet. No one has yet postulated an explanation for this phenomenon, but settlers are reluctant to emigrate to George\u2019s World until the mystery is solved.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10001.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.81,
          "ore": 0.89,
          "machinery": 0.98,
          "meds": 0.96,
          "luxury": 1.03
        }
      }
    ]
  },
  {
    "id": "ngc_5638",
    "name": "NGC-5638",
    "sector": "Frontier Void",
    "x": 207.3,
    "y": 251.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Sentinel Station used to serve as a base for the patrol ships that escorted bulk freighters full of luxury goods out of the Adhara system - now it functions as the Rebellion\u2019s primary staging platform in this region of space.",
    "connectedSystemIds": [
      "clotho"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_8457",
    "name": "NGC-8457",
    "sector": "Frontier Void",
    "x": 147.9,
    "y": 326.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Zeus is a large planet with high gravity. Violent thunderstorms jolt the desert bluffs with lightning during Zeus\u2019s monsoon season.",
    "connectedSystemIds": [
      "orion"
    ],
    "stellarObjects": [
      {
        "id": "p_8457",
        "name": "P-8457",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "P-8457 is a Marslike desert world with a thin atmosphere and low temperatures. It is uninhabited.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.94,
          "ore": 1.06,
          "machinery": 1.17,
          "meds": 1.19,
          "luxury": 1.32
        }
      }
    ]
  },
  {
    "id": "ngc_6484",
    "name": "NGC-6484",
    "sector": "Frontier Void",
    "x": 101.7,
    "y": 424.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "In sharp contrast with neighboring Zeus, Hera is a lush garden spot. The inhabitants of Hera are extremely involved in nature, and their forestry and conservation skills are legendary. Professional environmentalists and terraformers from Hera are in great demand throughout the galaxy. ",
    "connectedSystemIds": [
      "atropos",
      "ngc_1718"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_1592",
    "name": "NGC-1592",
    "sector": "Frontier Void",
    "x": 39.0,
    "y": 542.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Osiris II",
    "connectedSystemIds": [
      "ngc_4812",
      "ngc_1718"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_4812",
    "name": "NGC-4812",
    "sector": "Pirate Badlands",
    "x": 101.7,
    "y": 578.8,
    "faction": "Pirates",
    "techLevel": 3,
    "security": "Anarchy",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Endor is a small moon with low gravity. As a result, the trees that cover this forest world grow to incredible heights.",
    "connectedSystemIds": [
      "ngc_1592"
    ],
    "stellarObjects": [
      {
        "id": "p_4812",
        "name": "P-4812",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "A strangely-lit and little-understood world.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10014.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.01,
          "ore": 1.09,
          "machinery": 1.18,
          "meds": 1.16,
          "luxury": 1.43
        }
      },
      {
        "id": "pirate_s_cove",
        "name": "Pirate's Cove",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Pirate\u2019s Cove is a haven for privateers, bucaneers, brigands, and others from the scum of the galaxy.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10026.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.14,
          "ore": 0.76,
          "machinery": 1.02,
          "meds": 0.99,
          "luxury": 1.22
        }
      }
    ]
  },
  {
    "id": "ngc_0551",
    "name": "NGC-0551",
    "sector": "Frontier Void",
    "x": 151.2,
    "y": 671.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Topaz II",
    "connectedSystemIds": [
      "olympus"
    ],
    "stellarObjects": [
      {
        "id": "astrodyne_outpost",
        "name": "Astrodyne Outpost",
        "type": "station",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 18,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "Astrodyne Outpost is an abandoned research base that was once used as a weapons testing facility by the Confederation. When a mysterious accident killed the entire crew of the station, the Confederation covered up the incident and left this station, stripped of all classified material, to drift through space.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10027.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.87,
          "ore": 0.93,
          "machinery": 1.21,
          "meds": 1.22,
          "luxury": 1.01
        }
      }
    ]
  },
  {
    "id": "ngc_1325",
    "name": "NGC-1325",
    "sector": "Frontier Void",
    "x": 197.4,
    "y": 738.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Emerald, the third and largest moon of Topaz II, is home to the Emerald buzzbird. These charming birds produce a sound that has a calming effect on humans, and many are exported to other, less relaxed, planets. During Emerald\u2019s spring, however, the inhabitants must stay indoors and refrain from operating heavy machinery, as the sound made by thousands of flocking buzzbirds can put anyone to sleep in an instant.",
    "connectedSystemIds": [
      "olympus"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_6564",
    "name": "NGC-6564",
    "sector": "Confederation Core",
    "x": 352.5,
    "y": 763.6,
    "faction": "Confederation",
    "techLevel": 4,
    "security": "Medium",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Virgo is almost all swamp, so the inhabitants are forced to live in the sparsely-dotted mountain ranges. Virgo\u2019s main export is the Virgo Banderfrog, whose hide is highly valued for its toughness and beauty.",
    "connectedSystemIds": [
      "osiris"
    ],
    "stellarObjects": [
      {
        "id": "p_6564",
        "name": "P-6564",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "P-6564 is a planet shrouded by a corrosive atmosphere. Better not stay too long, or your ship might melt.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10005.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.0,
          "ore": 1.1,
          "machinery": 1.05,
          "meds": 1.05,
          "luxury": 1.3
        }
      },
      {
        "id": "ruby",
        "name": "Ruby",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Ruby is completely red: red ground, red sky, red planet in the background. This moon is a testing ground for many new Confederation weapons.",
        "imageType": "cantina",
        "customImage": "/assets/original/landings/PICT_10028.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.13,
          "ore": 0.77,
          "machinery": 1.24,
          "meds": 0.88,
          "luxury": 1.09
        }
      }
    ]
  },
  {
    "id": "ngc_9758",
    "name": "NGC-9758",
    "sector": "Frontier Void",
    "x": 497.7,
    "y": 788.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Sirgil is a major industrial world, dotted with metropolitan cities and manufacturing centers.",
    "connectedSystemIds": [
      "ngc_1091",
      "agena",
      "el_santo"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_0630",
    "name": "NGC-0630",
    "sector": "Frontier Void",
    "x": 652.8,
    "y": 772.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Sirgil Starport is an orbital market, established as a commodity exchange for the products produced by the planet below.",
    "connectedSystemIds": [
      "ngc_1776",
      "adhara",
      "agena"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_8113",
    "name": "NGC-8113",
    "sector": "Frontier Void",
    "x": 834.3,
    "y": 769.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Scorpio has the largest number of crab species in the known galaxy.",
    "connectedSystemIds": [
      "ngc_1896",
      "lethe"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_0317",
    "name": "NGC-0317",
    "sector": "Frontier Void",
    "x": 976.2,
    "y": 730.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Deneb III is a major agricultural world, specializing in the production of grain and fruit.",
    "connectedSystemIds": [
      "scorpio"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_0805",
    "name": "NGC-0805",
    "sector": "Frontier Void",
    "x": 1002.6,
    "y": 674.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "New Cydonia was founded by natives of the Mars Colony, who claimed that Mars was too civilized and terraformed for their tastes. The Aries system is currently at war with its neighboring system, Lethe, over water rights.",
    "connectedSystemIds": [
      "ngc_2143"
    ],
    "stellarObjects": [
      {
        "id": "p_0805",
        "name": "P-0805",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "A depressingly dark and barren world.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.98,
          "ore": 1.12,
          "machinery": 1.14,
          "meds": 1.23,
          "luxury": 1.04
        }
      }
    ]
  },
  {
    "id": "ngc_2143",
    "name": "NGC-2143",
    "sector": "Frontier Void",
    "x": 1071.9,
    "y": 618.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Lethe Prime\u2019s fields and forests feed much of this sector. The major exports are vegetables and processed grain products. Lethe is currently at war with New Cydonia over water rights.",
    "connectedSystemIds": [
      "ngc_0805",
      "ngc_6762"
    ],
    "stellarObjects": [
      {
        "id": "p_2143",
        "name": "P-2143",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "A forbidding world of high winds and little else.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.11,
          "ore": 0.79,
          "machinery": 0.98,
          "meds": 1.06,
          "luxury": 1.33
        }
      }
    ]
  },
  {
    "id": "ngc_5528",
    "name": "NGC-5528",
    "sector": "Frontier Void",
    "x": 1045.5,
    "y": 550.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Opal is a tranquil island world, much preferable to neighboring Quake.",
    "connectedSystemIds": [
      "ngc_6762"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_1357",
    "name": "NGC-1357",
    "sector": "Frontier Void",
    "x": 1095.0,
    "y": 475.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "Nexus Outpost serves as a monitoring station for traffic passing through the Nexus system.",
    "connectedSystemIds": [
      "virgo"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_9846",
    "name": "NGC-9846",
    "sector": "Frontier Void",
    "x": 1081.8,
    "y": 396.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "A strangely-lit and little-understood world.",
    "connectedSystemIds": [
      "topaz"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_0595",
    "name": "NGC-0595",
    "sector": "Pirate Badlands",
    "x": 1128.0,
    "y": 343.6,
    "faction": "Pirates",
    "techLevel": 3,
    "security": "Anarchy",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Pirate\u2019s Cove is a haven for privateers, bucaneers, brigands, and others from the scum of the galaxy.",
    "connectedSystemIds": [
      "ngc_1249"
    ],
    "stellarObjects": [
      {
        "id": "p_0595",
        "name": "P-0595",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": true,
        "landingAllowed": false,
        "description": "A world choked by a sheath of sulphuric acid.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10022.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.84,
          "ore": 0.96,
          "machinery": 1.17,
          "meds": 0.89,
          "luxury": 1.12
        }
      },
      {
        "id": "evildrome",
        "name": "Evildrome",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Evildrome is a pirate\u2019s favorite stopover, not so much for the wide selection of illegal goods to be found here as for the Evildrome Boozarama, ostensibly the best bar in the galaxy.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10031.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.97,
          "ore": 1.13,
          "machinery": 1.01,
          "meds": 1.12,
          "luxury": 1.41
        }
      }
    ]
  },
  {
    "id": "ngc_1249",
    "name": "NGC-1249",
    "sector": "Frontier Void",
    "x": 1038.9,
    "y": 310.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Astrodyne Outpost is an abandoned research base that was once used as a weapons testing facility by the Confederation. When a mysterious accident killed the entire crew of the station, the Confederation covered up the incident and left this station, stripped of all classified material, to drift through space.",
    "connectedSystemIds": [
      "ngc_0595",
      "ngc_7665"
    ],
    "stellarObjects": [
      {
        "id": "p_1249",
        "name": "P-1249",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "A grim, snowy world.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10013.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.1,
          "ore": 0.8,
          "machinery": 1.2,
          "meds": 0.95,
          "luxury": 1.2
        }
      }
    ]
  },
  {
    "id": "ngc_7665",
    "name": "NGC-7665",
    "sector": "Frontier Void",
    "x": 1009.2,
    "y": 256.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "P-6564 is a planet shrouded by a corrosive atmosphere. Better not stay too long, or your ship might melt.",
    "connectedSystemIds": [
      "ngc_1249",
      "apollo",
      "ngc_8724"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_8724",
    "name": "NGC-8724",
    "sector": "Frontier Void",
    "x": 1128.0,
    "y": 282.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Ruby is completely red: red ground, red sky, red planet in the background. This moon is a testing ground for many new Confederation weapons.",
    "connectedSystemIds": [
      "ngc_7665"
    ],
    "stellarObjects": [
      {
        "id": "p_8724",
        "name": "P-8724",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "This planet is an arid wasteland.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10010.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.83,
          "ore": 0.97,
          "machinery": 1.04,
          "meds": 1.18,
          "luxury": 1.49
        }
      }
    ]
  },
  {
    "id": "ngc_6849",
    "name": "NGC-6849",
    "sector": "Frontier Void",
    "x": 887.1,
    "y": 156.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Listening Post 94 was set up to monitor communications traffic from pirates and suspected rebels.",
    "connectedSystemIds": [
      "gymkata"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_1027",
    "name": "NGC-1027",
    "sector": "Pirate Badlands",
    "x": 814.5,
    "y": 111.2,
    "faction": "Pirates",
    "techLevel": 3,
    "security": "Anarchy",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Listening Post 95 was set up to monitor communications traffic from pirates and suspected rebels.",
    "connectedSystemIds": [
      "ngc_5465"
    ],
    "stellarObjects": [
      {
        "id": "p_1027",
        "name": "P-1027",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "This strange-looking planet has some of the oddest plant life in the galaxy.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10009.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.96,
          "ore": 1.14,
          "machinery": 1.23,
          "meds": 1.01,
          "luxury": 1.28
        }
      },
      {
        "id": "new_antigua",
        "name": "New Antigua",
        "type": "planet",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 24,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "New Antigua was founded in the spirit of Earth\u2019s Caribbean islands. Like their predecessors, the islands of New Antigua are home to some of the most evil pirates around.",
        "imageType": "dock",
        "customImage": "/assets/original/landings/PICT_10032.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 1.09,
          "ore": 0.81,
          "machinery": 1.07,
          "meds": 1.24,
          "luxury": 1.07
        }
      }
    ]
  },
  {
    "id": "ngc_5465",
    "name": "NGC-5465",
    "sector": "Frontier Void",
    "x": 702.3,
    "y": 139.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "A cold, desolate, and unremarkable planet.",
    "connectedSystemIds": [
      "ngc_9517",
      "spica",
      "ngc_1027"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_9517",
    "name": "NGC-9517",
    "sector": "Frontier Void",
    "x": 659.4,
    "y": 86.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "A squalid and depressing station that hosts the worst evildoers in the galaxy. Truly a wretched hive of scum and villainy.",
    "connectedSystemIds": [
      "ngc_5465",
      "ngc_6548"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_6548",
    "name": "NGC-6548",
    "sector": "Frontier Void",
    "x": 596.7,
    "y": 46.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "A depressingly dark and barren world.",
    "connectedSystemIds": [
      "ngc_9517"
    ],
    "stellarObjects": [
      {
        "id": "listening_post_95",
        "name": "Listening Post 95",
        "type": "station",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 18,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "Listening Post 95 was set up to monitor communications traffic from pirates and suspected rebels.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10027.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.99,
          "ore": 1.11,
          "machinery": 0.92,
          "meds": 0.94,
          "luxury": 1.17
        }
      }
    ]
  },
  {
    "id": "ngc_1023",
    "name": "NGC-1023",
    "sector": "Frontier Void",
    "x": 537.3,
    "y": 114.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "A forbidding world of high winds and little else.",
    "connectedSystemIds": [
      "cygnus",
      "ngc_1701"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_6762",
    "name": "NGC-6762",
    "sector": "Frontier Void",
    "x": 976.2,
    "y": 587.2,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "A world choked by a sheath of sulphuric acid.",
    "connectedSystemIds": [
      "ngc_2143",
      "ngc_5528",
      "sirgil"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_1896",
    "name": "NGC-1896",
    "sector": "Pirate Badlands",
    "x": 778.2,
    "y": 814.0,
    "faction": "Pirates",
    "techLevel": 3,
    "security": "Anarchy",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "Evildrome is a pirate\u2019s favorite stopover, not so much for the wide selection of illegal goods to be found here as for the Evildrome Boozarama, ostensibly the best bar in the galaxy.",
    "connectedSystemIds": [
      "ngc_8113",
      "ngc_4561"
    ],
    "stellarObjects": [
      {
        "id": "p_1896",
        "name": "P-1896",
        "type": "planet",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 24,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "A cold, desolate, and unremarkable planet.",
        "imageType": "spire",
        "customImage": "/assets/original/landings/PICT_10021.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 1.12,
          "ore": 0.78,
          "machinery": 1.11,
          "meds": 1.17,
          "luxury": 1.46
        }
      },
      {
        "id": "privateer_s_haven",
        "name": "Privateer's Haven",
        "type": "station",
        "orbitRadius": 115,
        "orbitSpeed": 0.007,
        "initialAngle": 2.4,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "A squalid and depressing station that hosts the worst evildoers in the galaxy. Truly a wretched hive of scum and villainy.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10025.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": true,
          "outfitter": true,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.85,
          "ore": 0.95,
          "machinery": 0.95,
          "meds": 1.0,
          "luxury": 1.25
        }
      }
    ]
  },
  {
    "id": "ngc_1776",
    "name": "NGC-1776",
    "sector": "Independent Worlds",
    "x": 623.1,
    "y": 844.8,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "A grim, snowy world.",
    "connectedSystemIds": [
      "ngc_0630"
    ],
    "stellarObjects": [
      {
        "id": "liberty_station",
        "name": "Liberty Station",
        "type": "station",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Liberty Station was constructed to serve as an ore processing center and a refuelling base for the ships that mine valuable ores from the floating debris of the Trugati asteroid belt, a region of the galaxy thick with spaceborne rocks of all sizes.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10026.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.82,
          "ore": 0.98,
          "machinery": 0.91,
          "meds": 1.07,
          "luxury": 1.36
        }
      }
    ]
  },
  {
    "id": "ngc_1718",
    "name": "NGC-1718",
    "sector": "Frontier Void",
    "x": 35.7,
    "y": 472.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "This planet is an arid wasteland.",
    "connectedSystemIds": [
      "ngc_6484",
      "ngc_1592"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_1091",
    "name": "NGC-1091",
    "sector": "Frontier Void",
    "x": 517.5,
    "y": 864.4,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 20,
    "description": "This strange-looking planet has some of the oddest plant life in the galaxy.",
    "connectedSystemIds": [
      "ngc_9758"
    ],
    "stellarObjects": [
      {
        "id": "listening_post_94",
        "name": "Listening Post 94",
        "type": "station",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 18,
        "color": "#94a3b8",
        "habitable": false,
        "landingAllowed": true,
        "description": "Listening Post 94 was set up to monitor communications traffic from pirates and suspected rebels.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10026.png",
        "facilities": {
          "spaceportBar": false,
          "commodityExchange": false,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": false,
          "bank": false
        },
        "commodityPriceModifiers": {
          "food": 0.86,
          "ore": 0.94,
          "machinery": 1.08,
          "meds": 1.11,
          "luxury": 1.38
        }
      }
    ]
  },
  {
    "id": "ngc_1701",
    "name": "NGC-1701",
    "sector": "Frontier Void",
    "x": 474.6,
    "y": 63.6,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 22,
    "description": "New Antigua was founded in the spirit of Earth\u2019s Caribbean islands. Like their predecessors, the islands of New Antigua are home to some of the most evil pirates around.",
    "connectedSystemIds": [
      "ngc_1023"
    ],
    "stellarObjects": []
  },
  {
    "id": "ngc_4561",
    "name": "NGC-4561",
    "sector": "Frontier Void",
    "x": 817.8,
    "y": 884.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 24,
    "description": "Liberty Station was constructed to serve as an ore processing center and a refuelling base for the ships that mine valuable ores from the floating debris of the Trugati asteroid belt, a region of the galaxy thick with spaceborne rocks of all sizes.",
    "connectedSystemIds": [
      "ngc_1896"
    ],
    "stellarObjects": []
  },
  {
    "id": "nexus",
    "name": "Nexus",
    "sector": "Independent Worlds",
    "x": 870.6,
    "y": 408.0,
    "faction": "Independent",
    "techLevel": 3,
    "security": "Low",
    "stellarClass": "K2III Orange Giant",
    "starColor": "#fb923c",
    "starRadius": 26,
    "description": "Star system of Nexus.",
    "connectedSystemIds": [
      "nemesis",
      "pelagon",
      "jadzia",
      "topaz"
    ],
    "stellarObjects": [
      {
        "id": "nexus_outpost",
        "name": "Nexus Outpost",
        "type": "station",
        "orbitRadius": 70,
        "orbitSpeed": 0.005,
        "initialAngle": 1.2,
        "size": 18,
        "color": "#38bdf8",
        "habitable": true,
        "landingAllowed": true,
        "description": "Nexus Outpost serves as a monitoring station for traffic passing through the Nexus system.",
        "imageType": "station",
        "customImage": "/assets/original/landings/PICT_10024.png",
        "facilities": {
          "spaceportBar": true,
          "commodityExchange": true,
          "shipyard": false,
          "outfitter": false,
          "missionComputer": true,
          "bank": true
        },
        "commodityPriceModifiers": {
          "food": 0.88,
          "ore": 0.92,
          "machinery": 0.99,
          "meds": 0.93,
          "luxury": 1.14
        }
      }
    ]
  }
];

export const SPACEPORT_RUMORS: string[] = [
  "Keep your transponder clean when warping into Sol or Sirius. Confederation patrol ships scan every hull for illegal beam weapons and starlight narcotics.",
  "Word is the Rebels are offering top dollar for courier pilots willing to run medical shipments past the blockade in the rim systems.",
  "If you find yourself in the Antares asteroid belt without fuel, pray an independent merchant picks up your distress beacon before the pirates do.",
  "The shipyard at Stardock Alpha has naval-grade hull plating, but you need clean credentials with the Terran Admiralty before they even let you into the gantry.",
  "Don't cross Lars Magna or Redbeard in the Lethean badlands. Those pirates have modified Corvettes with afterburners that can run down a Shuttlecraft in seconds.",
  "Trading agricultural produce from Centauri to the core worlds pays the rent, but true fortune lies in rare isotopes and precision machinery out on the frontier.",
  "Ever seen an Atinoda Kestrel in action? Dual turret mounts, six forward gun ports, and enough shield regeneration to laugh off a Confederation battlecruiser.",
  "They say out past the Lethean border there are dormant alien derelicts drifting in silence. Anyone who gets close reports strange sensor anomalies.",
  "A Meizner Ramscoop is worth every credit if you travel through deep space. It harvests stellar ions from solar wind to keep your hyperdrive coils charged for free.",
  "Always keep at least 1,000 credits in your bank account for fuel and emergency repairs. Being stranded in an uninhabited system is a slow way to die."
];

export const ESCORT_WINGMEN: EscortWingman[] = [
  {
    id: 'escort_1',
    name: 'Kira "Cinder" Vance',
    callsign: 'Cinder-1',
    shipModel: 'Rapier Heavy Fighter',
    dailyWage: 450,
    combatRating: 8,
    dialogue: 'Veteran of the Rim Skirmishes. My dual particle blasters will keep pirates off your stern.'
  },
  {
    id: 'escort_2',
    name: 'Garrick "Rook" Stone',
    callsign: 'Rook-Lead',
    shipModel: 'Defender Interceptor',
    dailyWage: 320,
    combatRating: 6,
    dialogue: 'Former Confed patrol flyer. Clean record, steady trigger finger, and fast shields.'
  },
  {
    id: 'escort_3',
    name: 'Jax "Ghost" Tarsis',
    callsign: 'Specter-4',
    shipModel: 'Scoutship',
    dailyWage: 250,
    combatRating: 5,
    dialogue: 'My scout might look weathered, but my pulse lasers burn clean and I fly tight escort formation.'
  }
];

export const INITIAL_PLAYER_STATE: PlayerState = {
  pilotName: 'Captain Jonathan Corvus',
  shipName: 'SS Peregrine',
  currentShip: SHIPS[0], // Shuttlecraft
  credits: 2000,
  debt: 69420, // 69,420 credits in debt to the bank
  currentFuel: 4,
  currentShields: 180,
  currentArmor: 100,
  currentSystemId: 'levo',
  currentOrbitObjectId: 'levo',
  landedObjectId: 'levo',
  cargo: {},
  equippedOutfits: [
    OUTFITS[0], // Laser Cannon
  ],
  activeMissions: [
    {
      id: 'init_mission_levo_1',
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
      deadlineStardate: 14, // 14 days = Nov 15, 2279
      description: 'Deliver 4 tons of emergency medical supplies from Levo to Rigel Prime before the quarantine deadline.',
      riskLevel: 'Moderate',
      completed: false,
    }
  ],
  escorts: [],
  stardate: 0, // Day 0: November 1, 2279
  licenseActive: true,
  notes: 'Tabletop Campaign Dossier:\n- Starting vessel: Shuttlecraft docked at Levo Spaceport.\n- Outstanding Debt: 69,420 Cr owed to First Interstellar Bank (needs to be repaid!).\n- Mission: Ferry cargo and trade goods between Levo, Rigel, and Capella to pay off the bank.',
  visitedSystems: ['levo'],
};

// Variable loan interest rates based on system security
export function getSystemInterestRate(system: StarSystem): number {
  switch (system.security) {
    case 'High':
      return 0.05; // 5% prime rate
    case 'Medium':
      return 0.065; // 6.5% standard commercial rate
    case 'Low':
      return 0.085; // 8.5% frontier risk surcharge
    case 'Anarchy':
      return 0.10; // 10% loan shark rate
    default:
      return 0.07;
  }
}

// Generate comprehensive text dossier for tabletop RPG notes
export function generateSystemDossierText(system: StarSystem, activePlanet?: StellarObject): string {
  const activeSection = activePlanet ? `\nActive Landing Port: ${activePlanet.name} (${activePlanet.type.toUpperCase()})\nPort Lore: ${activePlanet.description}\n` : '';
  const objects = system.stellarObjects.map(o => {
    const facilities = [];
    if (o.facilities.shipyard) facilities.push('Shipyard');
    if (o.facilities.outfitter) facilities.push('Outfitter');
    if (o.facilities.commodityExchange) facilities.push('Commodity Exch');
    if (o.facilities.spaceportBar) facilities.push('Spaceport Bar');
    return `  - ${o.name} (${o.type.toUpperCase()}) | Facilities: ${facilities.join(', ') || 'None'}\n    ${o.description}`;
  }).join('\n');

  return `=== STAR SYSTEM DOSSIER: ${system.name.toUpperCase()} ===
Sector: ${system.sector}
Faction: ${system.faction} | Security: ${system.security}
Stellar Class: ${system.stellarClass}
Hyperlane Connections: ${system.connectedSystemIds.map(id => id.toUpperCase()).join(', ')}
${activeSection}
Celestial Bodies:
${objects}

Tactical Notes:
${system.description}
===================================================`;
}

// Generate fresh missions tailored to current origin planet
export function generateMissionsForPlanet(currentSystem: StarSystem, currentPlanetId: string, currentStardate: number): Mission[] {
  const destinations = STAR_SYSTEMS.filter(s => s.id !== currentSystem.id && s.stellarObjects.length > 0);
  const types: Mission['type'][] = ['cargo', 'rush', 'passenger', 'smuggling', 'bounty'];
  const results: Mission[] = [];

  destinations.slice(0, 5).forEach((destSys, idx) => {
    const targetObj = destSys.stellarObjects[0];
    if (!targetObj) return;

    const missionType = types[idx % types.length];
    const tons = missionType === 'cargo' ? 5 + (idx * 5) : missionType === 'rush' ? 3 + idx : undefined;
    const passengers = missionType === 'passenger' ? 2 + idx : undefined;
    const baseReward = 8000 + idx * 4000;
    const distanceMult = 1.2;

    results.push({
      id: `generated_mission_${currentPlanetId}_${idx}_${Date.now()}`,
      title: `${missionType.toUpperCase()}: Transit to ${targetObj.name} (${destSys.name})`,
      type: missionType,
      originSystemId: currentSystem.id,
      originObjectId: currentPlanetId,
      targetSystemId: destSys.id,
      targetObjectId: targetObj.id,
      targetPlanetName: targetObj.name,
      targetSystemName: destSys.name,
      cargoTons: tons,
      passengers: passengers,
      rewardCredits: Math.round(baseReward * distanceMult),
      deadlineStardate: Math.floor(currentStardate) + 8 + (idx * 5),
      description: `Transport contract bound for ${targetObj.name} in the ${destSys.name} system. Standard delivery terms apply upon docking.`,
      riskLevel: destSys.security === 'Anarchy' ? 'Dangerous' : destSys.security === 'Low' ? 'Moderate' : 'Safe',
      completed: false,
    });
  });

  return results;
}
