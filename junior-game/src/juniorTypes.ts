export type JuniorStep =
  | 'intro'
  | 'pick'
  | 'buy'
  | 'city'
  | 'map'
  | 'travel'
  | 'visitIntro'
  | 'market'
  | 'event'
  | 'eventResult'
  | 'storyEvent'
  | 'storyReward'
  | 'regionalEvent'
  | 'shop'
  | 'endingChoice'
  | 'ending';

export type JuniorGoodId =
  | 'cotton_cloth'
  | 'dried_fish'
  | 'salt'
  | 'paper'
  | 'citrus'
  | 'fresh_fish'
  | 'herbs'
  | 'rice'
  | 'ginseng'
  | 'silk'
  | 'ceramics'
  | 'horse';

export type JuniorCityId =
  | 'seoul'
  | 'incheon'
  | 'gaeseong'
  | 'pyongyang'
  | 'nampo'
  | 'sinuiju'
  | 'chuncheon'
  | 'gangneung'
  | 'wonsan'
  | 'hamheung'
  | 'cheongjin'
  | 'andong'
  | 'daegu'
  | 'jeonju'
  | 'gwangju'
  | 'mokpo'
  | 'yeosu'
  | 'suncheon'
  | 'jinju'
  | 'tongyeong'
  | 'busan'
  | 'ulsan'
  | 'jeju'
  | 'tsushima'
  | 'china_port'
  | 'north_port';

export type JuniorRouteKind = 'land' | 'sea';
export type JuniorCityKind = 'inland_market' | 'east_port' | 'south_port' | 'west_port' | 'north_trade_port' | 'island';
export type JuniorEventType =
  | 'travel'
  | 'weather'
  | 'kindness'
  | 'quiz_bandit'
  | 'quiz_pirate'
  | 'quiz_animal'
  | 'quiz_merchant'
  | 'quiz_weather'
  | 'quiz_folktale'
  | 'growth'
  | 'story'
  | 'ending';

export type JuniorEventMood = 'bad' | 'good' | 'talk' | 'story';
export type JuniorRouteScenery = 'plain' | 'mountain' | 'river' | 'coast' | 'sea' | 'marketRoad' | 'north';
export type JuniorRegionalEventType = 'merchant_rumor' | 'dialect' | 'landmark' | 'season' | 'specialty_tip';
export type JuniorNotebookTopic = 'writing' | 'math' | 'map' | 'weather' | 'trade';
export type JuniorNotebookStatus = 'locked' | 'started' | 'completed';
export type JuniorRumorMarkerStatus = 'available' | 'active' | 'completed';
export type JuniorStoryCategory =
  | 'mountain_folktale'
  | 'sea_classic'
  | 'market_story'
  | 'historical'
  | 'regional_learning'
  | 'main_clue';
export type JuniorStoryTriggerType =
  | 'rumor'
  | 'first_visit'
  | 'route_travel'
  | 'city_visit'
  | 'market_enter'
  | 'chain_followup';
export type JuniorMountainId =
  | 'baekdu'
  | 'taebaek'
  | 'songni'
  | 'gyeryong'
  | 'deogyu'
  | 'naejang'
  | 'mudeung'
  | 'gaya'
  | 'chiak'
  | 'wolchul'
  | 'gwanak'
  | 'guwol'
  | 'jiri'
  | 'geumgang'
  | 'halla';

export interface JuniorGood {
  id: JuniorGoodId;
  name: string;
  image: string;
  baseBuyCoins: number;
  baseSellCoins: number;
}

export interface JuniorCity {
  id: JuniorCityId;
  name: string;
  region: string;
  kind?: JuniorCityKind;
  icon: string;
  x: number;
  y: number;
  buyGoodIds: JuniorGoodId[];
  sellGoodIds: JuniorGoodId[];
  scene: string;
  backgroundAsset?: string;
  note: string;
  introLines: string[];
}

export interface JuniorRoute {
  from: JuniorCityId;
  to: JuniorCityId;
  kind: JuniorRouteKind;
  scenery: JuniorRouteScenery;
  needsBoat?: boolean;
  distance?: 1 | 2 | 3;
  routeType?: string;
  travelSceneAsset?: string;
  terrain?: string;
  eventCategories?: string[];
  fairyText?: string;
  arrivalHint?: string;
  storyArcIds?: string[];
}

export interface JuniorCargoItem {
  id: string;
  goodId: JuniorGoodId;
  fromCityId: JuniorCityId;
  buyPrice: number;
}

export interface JuniorVehicle {
  id: 'bundle' | 'handcart' | 'big_cart' | 'merchant_cart';
  name: string;
  cost: number;
  cargoLimit: number;
  text: string;
  image: string;
  kind?: 'cart';
  shortBenefit?: string;
  routeBenefit?: string;
  childDescription?: string;
}

export interface JuniorBoat {
  id: 'none' | 'small_ferry' | 'sailboat' | 'sturdy_sailboat' | 'merchant_ship';
  name: string;
  cost: number;
  cargoLimit: number;
  text: string;
  image: string;
  kind?: 'boat';
  shortBenefit?: string;
  routeBenefit?: string;
  childDescription?: string;
}

export interface JuniorReward {
  coins?: number;
  stars?: number;
  storyClues?: number;
  ledgerClues?: number;
  ledgerClue?: number;
  notebookTopic?: JuniorNotebookTopic;
  seyeonNotebookProgress?: JuniorNotebookTopic;
  cityStamp?: JuniorCityId;
  cosmeticItemUnlock?: string;
  rumorUnlock?: string[];
  studyRoomLevel?: number;
  storyFragment?: string;
  badge?: string;
  unlockCityId?: JuniorCityId;
  loseCargo?: number;
}

export interface JuniorStoryDialogueLine {
  speaker: '정우' | '세연이' | '바람이' | '장부';
  icon: 'jeongwoo' | 'seyeon' | 'fairy' | 'ledger';
  text: string;
}

export interface JuniorMainStoryEvent {
  id: string;
  title: string;
  summary: string;
  dialogue: JuniorStoryDialogueLine[];
  reward?: JuniorReward;
}

export interface JuniorStoryDialogueCut {
  type: 'rumor' | 'event' | 'solution';
  speaker: string;
  text: string;
}

export interface JuniorStoryMapMarker {
  label: string;
  status: 'rumor' | 'active' | 'completed';
}

export interface JuniorStoryEvent {
  id: string;
  title: string;
  storySource: string;
  category: JuniorStoryCategory;
  regionId: string;
  mountainId?: JuniorMountainId;
  routeId?: string;
  triggerType: JuniorStoryTriggerType;
  prerequisiteEventIds: string[];
  rumorCityIds: JuniorCityId[];
  mapMarker: JuniorStoryMapMarker;
  dialogueCuts: JuniorStoryDialogueCut[];
  choices: JuniorEventChoice[];
  quiz?: JuniorQuiz;
  requiredGoodId?: JuniorGoodId;
  reward: JuniorReward;
  childSafetyNotes: string;
  once: boolean;
  chainId?: string;
  chainStep?: number;
}

export interface JuniorMountainStoryLocation {
  id: JuniorMountainId;
  name: string;
  nearbyCityIds: JuniorCityId[];
  routeType: string;
  shortDescription: string;
  storyEventIds: string[];
}

export type JuniorStarItemCategory = 'skin' | 'decoration' | 'title' | 'consumable';
export type JuniorStarItemSlot = 'weapon' | 'armor' | 'tool' | 'hat' | 'badge' | 'fairy' | 'cartSkin' | 'boatSkin' | 'none';
export type JuniorConsumableEffectType =
  | 'fast_travel'
  | 'half_price_next_good'
  | 'protect_cargo'
  | 'quiz_retry'
  | 'market_recommendation'
  | 'force_rumor';

export interface JuniorConsumableEffect {
  type: JuniorConsumableEffectType;
  description: string;
}

export interface JuniorStarItem {
  id: string;
  name: string;
  category: JuniorStarItemCategory;
  slot: JuniorStarItemSlot;
  starCost: number;
  iconAsset: string;
  description: string;
  childDescription: string;
  ownedText: string;
  equipText: string;
  useText: string;
  consumableEffect?: JuniorConsumableEffect;
  maxOwned?: number;
  unlockCondition?: string;
  isConsumable: boolean;
}

export interface JuniorEventChoice {
  label: string;
  resultText: string;
  reward?: JuniorReward;
}

export interface JuniorQuiz {
  question: string;
  options: string[];
  answer: string;
  correctText: string;
  wrongText: string;
  reward?: JuniorReward;
  wrongReward?: JuniorReward;
}

export interface JuniorEvent {
  id: string;
  type: JuniorEventType;
  mood: JuniorEventMood;
  chancePercent: 1 | 2 | 3;
  title: string;
  scene: string;
  fairyText: string;
  routeKind?: JuniorRouteKind | 'any';
  routeTypes?: string[];
  storyArcId?: string;
  storyStage?: number;
  choices?: JuniorEventChoice[];
  quiz?: JuniorQuiz;
  reward?: JuniorReward;
}

export interface JuniorRegionalEvent {
  id: string;
  cityId: JuniorCityId;
  type: JuniorRegionalEventType;
  title: string;
  speaker: string;
  text: string;
  fairyText: string;
  hintGoodId?: JuniorGoodId;
  relatedCityId?: JuniorCityId;
  chance: number;
  once?: boolean;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  reward?: JuniorReward;
}

export interface JuniorMarketPressure {
  buy: Record<string, number>;
  sell: Record<string, number>;
}

export interface JuniorActiveEffects {
  fastTravelNextRoute: boolean;
  halfPriceNextGoodId?: JuniorGoodId;
  cargoProtectNextEvent: boolean;
  quizRetryAvailable: boolean;
  marketRecommendCityId?: JuniorCityId;
}

export type JuniorNotebook = Record<JuniorNotebookTopic, JuniorNotebookStatus>;

export interface JuniorSave {
  saveVersion: number;
  currentStep: JuniorStep;
  currentCityId: JuniorCityId;
  destinationCityId?: JuniorCityId;
  selectedGoodId?: JuniorGoodId;
  selectedEventId?: string;
  selectedRegionalEventId?: string;
  regionalReturnStep?: JuniorStep;
  eventResultText?: string;
  coins: number;
  stars: number;
  totalStarsEarned: number;
  starBalance: number;
  ownedStarItemIds: string[];
  equippedStarItems: Partial<Record<JuniorStarItemSlot, string>>;
  consumableItems: Record<string, number>;
  activeEffects: JuniorActiveEffects;
  cargo: JuniorCargoItem[];
  cargoLimit: number;
  vehicleId: JuniorVehicle['id'];
  boatId: JuniorBoat['id'];
  unlockedCities: JuniorCityId[];
  visitedCityIds: JuniorCityId[];
  completedTutorial: boolean;
  tutorialStage: number;
  seenEventIds: string[];
  seenRegionalEventIds: string[];
  lastRegionalEventCityId?: JuniorCityId;
  lastRegionalEventId?: string;
  storyArcProgress: Record<string, number>;
  mainStoryStage: number;
  seyeonNotebook: JuniorNotebook;
  ledgerClues: number;
  storyFragments: string[];
  completedStoryEventIds: string[];
  activeStoryEventId?: string;
  selectedStoryEventId?: string;
  pendingStoryRumorEventId?: string;
  storyReturnStep?: JuniorStep;
  heardStoryEventIds: string[];
  unlockedStarItemIds: string[];
  rumorMarkers: Record<string, JuniorRumorMarkerStatus>;
  studyRoomLevel: number;
  quizWrongStreak: number;
  storyClues: number;
  badges: string[];
  completedEnding: boolean;
  completedRuns: number;
  marketPressure: JuniorMarketPressure;
  lastResultChips?: string[];
  lastSavedAt?: string;
  message?: string;
}
