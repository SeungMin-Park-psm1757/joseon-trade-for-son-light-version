export interface Port {
  id: string;
  name: string;
  kind: string;
  tier: 'S' | 'A' | 'B' | 'C';
  region: string;
  map: {
    x: number;
    y: number;
    labelSide?: 'top' | 'right' | 'bottom' | 'left';
    role?: 'capital' | 'port' | 'inland' | 'island' | 'foreign' | 'production' | 'trade';
  };
  geo?: {
    lat: number;
    lon: number;
    source?: string;
  };
  visualType?: string;
  sceneAsset?: string;
  description: string;
  facilities: string[];
  shipyardLevel: number;
  cartYardLevel: number;
  tideSensitive: boolean;
  draftLimitAtLowTide?: number;
  terrainTags: string[];
  hazards: string[];
  produces: string[];
  demands: string[];
  marketBias: Record<string, number>;
  permitRequired?: string;
  startAvailable: boolean;
}

export interface Good {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  volatility?: number;
  supplyLevel?: number;
  demandLevel?: number;
  originPorts?: string[];
  taxRate?: number;
  tier?: number;
  rarity?: 'common' | 'regional' | 'rare' | 'luxury' | 'restricted';
  weight: number;
  volume: number;
  perishableDays: number;
  legalRisk: number;
  description: string;
  tags: string[];
  seasonal: Record<string, number>;
  iconAsset?: string;
  fragile?: boolean;
}

export interface Ship {
  id: string;
  name: string;
  price: number;
  cargo: number;
  speed: number;
  durability: number;
  draft: number;
  crewMin: number;
  crewMax: number;
  cannonSlots: number;
  combat: number;
  fishingBonus: number;
  monthlyUpkeep: number;
  allowedWaters: string[];
  description: string;
}

export interface Cart {
  id: string;
  name: string;
  price: number;
  cargo: number;
  speed: number;
  durability: number;
  terrain: string[];
  monthlyUpkeep: number;
  combat?: number;
  description: string;
}

export interface ToolItem {
  id: string;
  name: string;
  kind: string;
  price: number;
  description: string;
  stats: Record<string, number>;
  tier?: number;
  requiresTool?: string;
  hint?: string;
}

export interface Companion {
  id: string;
  name: string;
  role: string;
  kind: 'crew' | 'family';
  recruitCost: number;
  line: string;
  portraitAsset?: string;
  stats: Record<string, number>;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  mode: 'land' | 'sea';
  days: number;
  risk: number;
  terrain?: string[];
  sea?: string[];
  hazards: string[];
  tideSensitive?: boolean;
  permitRequired?: string;
  description: string;
}

export interface EventChoice {
  label: string;
  effects?: EffectSet;
  requires?: Record<string, number>;
  requiresPermit?: string;
  skillCheck?: { skill: string; target: number };
  success?: EffectSet;
  failure?: EffectSet;
  random?: Array<{ chance: number; effects: EffectSet; resultText?: string }>;
  startCombat?: boolean;
}

export interface GameEvent {
  id: string;
  name: string;
  type: string;
  trigger: {
    routeHazard?: string;
    tide?: string;
    shipDraftMin?: number;
    months?: number[];
  };
  severity: number;
  text: string;
  enemy?: {
    name: string;
    durability: number;
    attack: number;
    morale: number;
    lootPotential: number;
  };
  choices: EventChoice[];
}

export interface Quest {
  id: string;
  name: string;
  chapter: number;
  giver: string;
  description: string;
  objectives: Array<{
    type: string;
    good?: string;
    amount?: number;
    at?: string;
    atAny?: string[];
    ports?: string[];
    cart?: string;
    ship?: string;
    goods?: Record<string, number>;
    count?: number;
    event?: string;
    enemyTag?: string;
    permit?: string;
  }>;
  rewards: {
    money?: number;
    merchantRep?: number;
    fisherRep?: number;
    officialRep?: number;
    navalRep?: number;
    foreignRep?: number;
    navigationXp?: number;
    xp?: number;
    permit?: string;
  };
}

export interface MonthlyEvent {
  month: number;
  name: string;
  summary: string;
  priceModifiers?: Record<string, number>;
  hazardModifiers?: Record<string, number>;
  fishingBonus?: number;
  trendGoods?: string[];
  officialDemandGoods?: string[];
  riskTags?: string[];
}

export interface PortFlavor {
  id: string;
  title: string;
  line: string;
  market: string;
  office: string;
  tavern: string;
  yard: string;
  rumor: string;
  goods: string[];
  marketSlots?: string[];
  stallPositions?: Record<string, { x: number; y: number }>;
}

export type TutorialStage =
  | 'not_started'
  | 'intro'
  | 'port_intro'
  | 'go_market'
  | 'inspect_good'
  | 'buy_first_good'
  | 'open_map'
  | 'choose_first_destination'
  | 'travel_first_route'
  | 'sell_first_good'
  | 'first_profit'
  | 'cart_goal'
  | 'fishing_intro'
  | 'quest_intro'
  | 'equipment_intro'
  | 'completed'
  | 'skipped';

export interface TutorialRequiredAction {
  type:
    | 'openTab'
    | 'selectGood'
    | 'buyGood'
    | 'sellGood'
    | 'selectRoute'
    | 'travelRoute'
    | 'openFacility'
    | 'startFishing'
    | 'buyEquipment';
  tab?: string;
  goodId?: string;
  portId?: string;
  routeId?: string;
  facility?: string;
}

export interface TutorialDialogue {
  id: string;
  stage: TutorialStage;
  speaker: 'fairy' | 'jeongwoo';
  speakerName: string;
  portraitAsset?: string;
  emotion?: 'default' | 'happy' | 'surprised' | 'warning';
  text: string;
  pauseGame: boolean;
  nextId?: string;
  highlightTarget?: string;
  requiredAction?: TutorialRequiredAction;
  priority?: number;
  repeatable?: boolean;
  childFriendlyLevel?: string;
  relatedQuestId?: string;
  relatedGoodId?: string;
  relatedPortId?: string;
  actionLabel?: string;
}

export interface GameConstants {
  title: string;
  version: string;
  startingState: {
    portId?: string;
    currentPortId?: string;
    money: number;
    month: number;
    day: number;
    shipId: string;
    cartId: string;
    permits: string[];
    cargo: Record<string, number>;
    reputation: Reputation;
    skills: Record<string, number>;
    crew: CrewState;
    tutorialQuestId?: string;
  };
  calendar: { daysPerMonth: number; monthsPerYear: number; priceRefresh: string };
  tideCycle: string[];
  economy: {
    minPriceMultiplier: number;
    maxPriceMultiplier: number;
    monthlyNoiseRange: [number, number];
    taxRateDefault?: number;
  };
  risk: {
    baseEventChancePerTravelDay: number;
    riskLevelMultiplier: number;
  };
  save: { key: string };
}

export interface FameState {
  merchant: number;
  exploration: number;
  guard: number;
}

export interface Discovery {
  id: string;
  portId: string;
  name: string;
  category: string;
  iconAsset: string;
  description: string;
  reward: {
    explorationFame?: number;
    merchantFame?: number;
    guardFame?: number;
    money?: number;
    portTrust?: number;
  };
  hint: string;
}

export interface DiscoveryNotice {
  id: string;
  discoveryId: string;
  portId: string;
  name: string;
  description: string;
  iconAsset: string;
  rewardLines: string[];
  hint: string;
}

export interface LedgerSealRequirement {
  type: string;
  portIds?: string[];
  goodIds?: string[];
  quantity?: number;
  eventTags?: string[];
  count?: number;
  minTrust?: number;
  permit?: string;
  toolId?: string;
  shipId?: string;
}

export interface LedgerSeal {
  id: string;
  name: string;
  iconAsset: string;
  requirements: LedgerSealRequirement[];
  reward: {
    merchantFame?: number;
    explorationFame?: number;
    guardFame?: number;
    money?: number;
  };
  nextHint: string;
}

export interface AssetManifestItem {
  id: string;
  path: string;
  type: string;
  size?: string;
  style: string;
  source: string;
  license: string;
  notes?: string;
}

export interface EffectSet {
  days?: number;
  morale?: number;
  crewFatigue?: number;
  durability?: number;
  cartDurability?: number;
  money?: number;
  moneyPercent?: number;
  cargo?: Record<string, number>;
  randomCargoLoss?: number;
  officialRep?: number;
  merchantRep?: number;
  fisherRep?: number;
  navalRep?: number;
  foreignRep?: number;
  riskNext?: number;
}

export interface CrewState {
  count: number;
  morale: number;
  fatigue: number;
}

export interface Reputation {
  merchant: number;
  official: number;
  naval: number;
  fisher: number;
  foreign: number;
}

export interface TransactionRecord {
  id: string;
  type: 'buy' | 'sell';
  goodId: string;
  goodName: string;
  portId: string;
  portName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  profit?: number;
  date: { year: number; month: number; day: number };
}

export interface TravelRecord {
  id: string;
  fromPortId: string;
  fromPortName: string;
  toPortId: string;
  toPortName: string;
  routeId: string;
  mode: 'land' | 'sea';
  days: number;
  risk: number;
  eventId?: string;
  eventName?: string;
  date: { year: number; month: number; day: number };
}

export interface FishingRecord {
  id: string;
  portId: string;
  portName: string;
  gained: Record<string, number>;
  estimatedValue: number;
  outcome?: 'success' | 'normal' | 'failure';
  quality?: string;
  spotName?: string;
  riskLine?: string;
  date: { year: number; month: number; day: number };
}

export interface EventResult {
  title: string;
  description: string;
  result: string;
  lines: string[];
  fameDelta?: Partial<FameState>;
  portTrustDelta?: Record<string, number>;
  companionReaction?: {
    name: string;
    line: string;
    portraitAsset?: string;
  };
}

export interface QuestProgress {
  purchasedGoods: Record<string, Record<string, number>>;
  soldGoods: Record<string, Record<string, number>>;
  deliveredGoods: Record<string, Record<string, number>>;
  visitedPorts: Record<string, boolean>;
  ownedCarts: Record<string, boolean>;
  ownedShips: Record<string, boolean>;
  earnedMoney: number;
  fishingCount: number;
  eventResolved: Record<string, number>;
  repairedShips: number;
  combatSurvived: Record<string, number>;
}

export interface QuestCompletionNotice {
  id: string;
  questId: string;
  questName: string;
  summary: string;
  rewardLines: string[];
  nextHint: string;
}

export interface LedgerState {
  transactions: TransactionRecord[];
  travels: TravelRecord[];
  fishing: FishingRecord[];
}

export interface GameState {
  currentPortId: string;
  money: number;
  date: { year: number; month: number; day: number };
  shipId: string;
  cartId: string;
  shipPortId?: string;
  shipDurability: number;
  cartDurability: number;
  permits: string[];
  cargo: Record<string, number>;
  cargoCost: Record<string, number>;
  tools: Record<string, boolean>;
  companions: Record<string, boolean>;
  fleetName: string;
  reputation: Reputation;
  fame: FameState;
  portTrust: Record<string, number>;
  discoveredIds: Record<string, boolean>;
  completedLedgerSeals: string[];
  skills: Record<string, number>;
  crew: CrewState;
  completedQuests: string[];
  activeQuestIds: string[];
  monthlyPrices: Record<string, Record<string, number>>;
  economyVersion?: string;
  ledger: LedgerState;
  questProgress: QuestProgress;
  questNotices: QuestCompletionNotice[];
  discoveryNotices: DiscoveryNotice[];
  ledgerSealNotices: QuestCompletionNotice[];
  lastMonthNews?: { month: number; name: string; summary: string };
  lastEventResult?: EventResult;
  log: string[];
  lastAutosaveAt?: string;
  pendingEventId?: string;
  lastTravelRouteId?: string;
  tutorialStage: TutorialStage;
  completedTutorialSteps: string[];
  activeTutorialDialogId?: string;
  isPausedForDialog: boolean;
  tutorialSkipped: boolean;
}

export interface GameData {
  ports: Port[];
  goods: Good[];
  ships: Ship[];
  carts: Cart[];
  tools: ToolItem[];
  companions: Companion[];
  routes: Route[];
  events: GameEvent[];
  quests: Quest[];
  monthlyEvents: MonthlyEvent[];
  portFlavors: PortFlavor[];
  discoveries: Discovery[];
  ledgerSeals: LedgerSeal[];
  tutorialDialogues: TutorialDialogue[];
  assetManifest: AssetManifestItem[];
  constants: GameConstants;
  portById: Record<string, Port>;
  goodById: Record<string, Good>;
  shipById: Record<string, Ship>;
  cartById: Record<string, Cart>;
  toolById: Record<string, ToolItem>;
  companionById: Record<string, Companion>;
  routeById: Record<string, Route>;
  eventById: Record<string, GameEvent>;
  portFlavorById: Record<string, PortFlavor>;
  discoveryById: Record<string, Discovery>;
  ledgerSealById: Record<string, LedgerSeal>;
  tutorialDialogueById: Record<string, TutorialDialogue>;
}
