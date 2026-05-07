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
  | 'rice';

export type JuniorCityId =
  | 'seoul'
  | 'gaeseong'
  | 'pyongyang'
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
  | 'jeju';

export type JuniorRouteKind = 'land' | 'sea';
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
}

export interface JuniorBoat {
  id: 'none' | 'small_ferry' | 'sailboat' | 'sturdy_sailboat' | 'merchant_ship';
  name: string;
  cost: number;
  text: string;
  image: string;
}

export interface JuniorReward {
  coins?: number;
  stars?: number;
  storyClues?: number;
  badge?: string;
  unlockCityId?: JuniorCityId;
  loseCargo?: number;
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

export interface JuniorMarketPressure {
  buy: Record<string, number>;
  sell: Record<string, number>;
}

export interface JuniorSave {
  saveVersion: number;
  currentStep: JuniorStep;
  currentCityId: JuniorCityId;
  destinationCityId?: JuniorCityId;
  selectedGoodId?: JuniorGoodId;
  selectedEventId?: string;
  eventResultText?: string;
  coins: number;
  stars: number;
  cargo: JuniorCargoItem[];
  cargoLimit: number;
  vehicleId: JuniorVehicle['id'];
  boatId: JuniorBoat['id'];
  unlockedCities: JuniorCityId[];
  visitedCityIds: JuniorCityId[];
  completedTutorial: boolean;
  tutorialStage: number;
  seenEventIds: string[];
  storyArcProgress: Record<string, number>;
  quizWrongStreak: number;
  storyClues: number;
  badges: string[];
  completedEnding: boolean;
  completedRuns: number;
  marketPressure: JuniorMarketPressure;
  lastSavedAt?: string;
  message?: string;
}
