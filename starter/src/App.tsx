import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { ReactNode } from 'react';
import type {
  Cart,
  Companion,
  Discovery,
  DiscoveryNotice,
  EffectSet,
  EventChoice,
  EventResult,
  FishingRecord,
  GameData,
  GameEvent,
  GameState,
  Good,
  LedgerSeal,
  LedgerState,
  MonthlyEvent,
  Port,
  PortFlavor,
  Quest,
  QuestCompletionNotice,
  QuestProgress,
  Route,
  Ship,
  ToolItem,
  TutorialDialogue,
  TransactionRecord,
  TravelRecord
} from './types';
import { useGameAudio, type AudioSettings, type SfxKey } from './audio';
import {
  PROTAGONIST_ASSET,
  TITLE_HARBOR_ASSET,
  cartAssetForTier,
  goodIconAsset,
  guideSpiritAsset,
  hubIconAsset,
  npcAsset,
  resultIconAsset,
  sceneAssetForVisualType,
  shipAssetForTier
} from './artDirection';

type Tab = 'port' | 'market' | 'map' | 'cargo' | 'quests' | 'vehicles' | 'ledger';
type Toast = { tone: 'good' | 'warn' | 'plain'; text: string };
type StatePatch = Partial<Pick<GameState, 'questNotices' | 'discoveryNotices' | 'ledgerSealNotices' | 'lastEventResult' | 'lastMonthNews'>>;
type TravelAnimation = { routeId: string; fromPortId: string; toPortId: string; mode: Route['mode'] };
type TradeHint = {
  goodId: string;
  goodName: string;
  fromPortId: string;
  fromPortName: string;
  toPortId: string;
  toPortName: string;
  routeId: string;
  profitEach: number;
  buyPrice: number;
  sellPrice: number;
  quantity?: number;
  totalProfit?: number;
  reason?: string;
};
type MarketQuote = {
  marketPrice: number;
  buyPrice: number;
  sellPrice: number;
  averagePrice: number;
  averageDeltaPercent: number;
  spreadRate: number;
  taxRate: number;
  relation: 'origin' | 'demand' | 'balanced';
  reasons: string[];
};
type ObjectiveStatus = {
  done: boolean;
  current: number;
  target: number;
  label: string;
  iconGoodId?: string;
  iconAsset?: string;
  nextAction: string;
  targetPortId?: string;
  targetTab?: Tab;
};
type QuestRewardItem = {
  label: string;
  value: string;
  tone: 'money' | 'rep' | 'permit' | 'skill';
  goodId?: string;
  iconAsset?: string;
};
type NextQuestGoal = {
  title: string;
  text: string;
  action: string;
  tab: Tab;
  goodId?: string;
  iconAsset?: string;
};
const HUB_ICON = {
  market: hubIconAsset('market'),
  office: hubIconAsset('office'),
  tavern: hubIconAsset('tavern'),
  shipyard: hubIconAsset('shipyard'),
  map: hubIconAsset('map'),
  fish: hubIconAsset('fish')
} as const;
type HubAction = 'market' | 'office' | 'tavern' | 'shipyard';
type HotspotId = HubAction | 'routes' | 'fish';
type GrowthPathStep = { title: string; text: string; tab: Tab; done: boolean; iconGoodId?: string; iconAsset?: string; targetPortId?: string };
type EquipmentNotice = { title: string; text: string; next: string; tab: Tab; image?: string; tool?: ToolItem; companion?: Companion; detailLines?: string[] };
type FleetStats = { navigation: number; trade: number; fishing: number; guard: number; japanese: number; chinese: number };
type TutorialStoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  line: string;
  actionLabel: string;
  tab: Tab;
  mood: GuideMood;
  iconGoodId?: string;
  iconAsset?: string;
};
type FishingSpotId = 'harbor_shoal' | 'open_current' | 'reef_shadow';
type FishingTimingId = 'early' | 'rising' | 'sweet' | 'surge' | 'late';
type FishingHaulId = 'steady' | 'strong' | 'angle';
type FishingStage = 'prepare' | 'cast' | 'haul' | 'result';
type FishingOutcome = 'success' | 'normal' | 'failure';
type FishingSpot = {
  id: FishingSpotId;
  name: string;
  title: string;
  description: string;
  risk: number;
  yield: number;
  preferredTiming: FishingTimingId;
  bestHaul: FishingHaulId;
  goods: string[];
  hint: string;
};
type FishingTiming = { id: FishingTimingId; label: string; short: string; description: string };
type FishingHaul = { id: FishingHaulId; label: string; description: string };
type FishingResult = {
  outcome: FishingOutcome;
  quality: string;
  score: number;
  gained: Record<string, number>;
  estimatedValue: number;
  fatigue: number;
  shipDamage: number;
  morale: number;
  spotName: string;
  timingName: string;
  haulName: string;
  riskLine: string;
  fairyLine: string;
  mood: GuideMood;
  cargoOverflowed: boolean;
  bigCatch: boolean;
};
type FishingSession = {
  id: string;
  stage: FishingStage;
  spotId?: FishingSpotId;
  timingId?: FishingTimingId;
  haulId?: FishingHaulId;
  result?: FishingResult;
};

const PRICE_MODEL_VERSION = '2026-04-29-supply-demand-spread-v1';
const HOTSPOT_LAYOUTS: Record<string, Partial<Record<HotspotId, { x: number; y: number }>>> = {
  south_port: {
    market: { x: 18, y: 31 },
    tavern: { x: 32, y: 31 },
    office: { x: 47, y: 31 },
    shipyard: { x: 82, y: 74 },
    routes: { x: 77, y: 49 },
    fish: { x: 62, y: 85 }
  },
  west_mudflat: {
    market: { x: 18, y: 32 },
    tavern: { x: 32, y: 32 },
    office: { x: 47, y: 32 },
    shipyard: { x: 76, y: 76 },
    routes: { x: 77, y: 49 },
    fish: { x: 55, y: 84 }
  },
  inland_city: {
    market: { x: 18, y: 33 },
    tavern: { x: 32, y: 33 },
    office: { x: 47, y: 33 },
    shipyard: { x: 75, y: 75 },
    routes: { x: 77, y: 54 }
  },
  east_port: {
    market: { x: 18, y: 32 },
    tavern: { x: 32, y: 32 },
    office: { x: 47, y: 32 },
    shipyard: { x: 80, y: 75 },
    routes: { x: 77, y: 49 },
    fish: { x: 61, y: 85 }
  },
  jeju: {
    market: { x: 18, y: 33 },
    tavern: { x: 32, y: 33 },
    office: { x: 47, y: 33 },
    shipyard: { x: 79, y: 76 },
    routes: { x: 76, y: 50 },
    fish: { x: 58, y: 86 }
  },
  tsushima: {
    market: { x: 18, y: 33 },
    tavern: { x: 32, y: 33 },
    office: { x: 47, y: 33 },
    shipyard: { x: 79, y: 76 },
    routes: { x: 76, y: 49 },
    fish: { x: 58, y: 86 }
  }
};

const FACILITY_META: Record<HubAction, { title: string; npc: string; line: string; action: string; tab: Tab }> = {
  market: {
    title: '시장',
    npc: npcAsset('/assets/painted2d/npc/market-merchant.png'),
    line: '오늘 들어온 물건부터 아이콘으로 골라보세요.',
    action: '상품 보기',
    tab: 'market'
  },
  office: {
    title: '관청',
    npc: npcAsset('/assets/painted2d/npc/office-clerk.png'),
    line: '허가장과 납품 의뢰는 이곳에서 확인합니다.',
    action: '의뢰 보기',
    tab: 'quests'
  },
  tavern: {
    title: '술집',
    npc: npcAsset('/assets/painted2d/npc/tavern-keeper.png'),
    line: '상인들이 어느 항구에 값이 좋은지 속삭입니다.',
    action: '소문 보기',
    tab: 'port'
  },
  shipyard: {
    title: '조선소',
    npc: npcAsset('/assets/painted2d/npc/shipwright.png'),
    line: '더 큰 배와 수레가 다음 장사의 목표입니다.',
    action: '장비 보기',
    tab: 'vehicles'
  }
};

const DEFAULT_PORT_FLAVOR: PortFlavor = {
  id: 'default',
  title: '팔도 장터',
  line: '오늘 장터에는 길손과 상인이 오가고 있어요.',
  market: '아이콘으로 물건을 고르고 하나씩 사고팔아 보세요.',
  office: '관청에서는 납품과 허가를 확인합니다.',
  tavern: '술집에서는 가까운 길과 값 좋은 물건 소문을 들을 수 있어요.',
  yard: '장비를 손보면 더 멀리, 더 많이 움직일 수 있어요.',
  rumor: '이번 달에는 가까운 길부터 살펴보는 것이 좋겠어요.',
  goods: []
};

const FOUNDATION_QUEST_IDS = [
  'tutorial_first_trade',
  'salt_to_daegu',
  'fish_for_inland',
  'buy_handcart',
  'south_sea_route',
  'jeju_delivery',
  'waegwan_pass_intro'
];

const DATA_FILES = {
  ports: 'ports.json',
  goods: 'goods.json',
  ships: 'ships.json',
  carts: 'carts.json',
  tools: 'tools.json',
  companions: 'companions.json',
  routes: 'routes.json',
  events: 'events.json',
  quests: 'quests.json',
  monthlyEvents: 'monthly_events.json',
  portFlavors: 'port_flavors.json',
  discoveries: 'discoveries.json',
  ledgerSeals: 'ledger_seals.json',
  tutorialDialogues: 'tutorial_dialogues.json',
  assetManifest: 'asset_manifest.json',
  constants: 'game_constants.json'
} as const;

const makeById = <T extends { id: string }>(items: T[]) =>
  Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, T>;

const money = (value: number) => `${Math.round(value).toLocaleString('ko-KR')}냥`;
const dateText = (date: GameState['date']) => `${date.month}월 ${date.day}일`;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const MARKET_SIZE_BY_TIER: Record<Port['tier'], number> = { S: 8, A: 6, B: 5, C: 3 };

function hashNoise(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function addLog(state: GameState, line: string) {
  return [line, ...(state.log ?? [])].slice(0, 18);
}

function currentMonthEvent(data: GameData, month: number) {
  return data.monthlyEvents.find((event) => event.month === month);
}

const FISHING_SPOTS: FishingSpot[] = [
  {
    id: 'harbor_shoal',
    name: '항구 앞 여울',
    title: '안전한 얕은 어장',
    description: '항구에서 가까워 위험은 낮지만 큰 수확은 드뭅니다.',
    risk: 1,
    yield: 1,
    preferredTiming: 'rising',
    bestHaul: 'steady',
    goods: ['fresh_fish', 'seaweed'],
    hint: '잔물결이 들어올 때 천천히 던지면 빈 그물이 적어요.'
  },
  {
    id: 'open_current',
    name: '먼 물골',
    title: '물살 센 깊은 어장',
    description: '조류를 맞추면 큰 고기가 들지만 파도와 암초 부담이 있습니다.',
    risk: 3,
    yield: 3,
    preferredTiming: 'sweet',
    bestHaul: 'angle',
    goods: ['fresh_fish', 'skate', 'dried_fish'],
    hint: '물살이 잠깐 고요해지는 눈금에서 옆물살을 타야 해요.'
  },
  {
    id: 'reef_shadow',
    name: '암초 그늘',
    title: '흑산도식 깊은 그늘',
    description: '그물이 상하기 쉽지만 희귀한 생선이 걸릴 수 있습니다.',
    risk: 2,
    yield: 2,
    preferredTiming: 'late',
    bestHaul: 'strong',
    goods: ['fresh_fish', 'skate', 'seaweed'],
    hint: '끝물에 걸리면 힘껏 당겨야 암초에 그물이 쓸리지 않아요.'
  }
];

const FISHING_TIMINGS: FishingTiming[] = [
  { id: 'early', label: '이른 물', short: '이른', description: '파도가 오기 전 빠르게 던집니다.' },
  { id: 'rising', label: '들물', short: '들물', description: '물이 차오르는 순간에 그물을 펼칩니다.' },
  { id: 'sweet', label: '고요한 눈', short: '고요', description: '물살이 잠깐 멈춘 틈을 노립니다.' },
  { id: 'surge', label: '센 물살', short: '센물', description: '거친 물살에 멀리 던져 봅니다.' },
  { id: 'late', label: '끝물', short: '끝물', description: '물살이 빠지는 마지막 길목을 잡습니다.' }
];

const FISHING_HAULS: FishingHaul[] = [
  { id: 'steady', label: '천천히 감기', description: '그물을 오래 살피며 안정적으로 거둡니다.' },
  { id: 'strong', label: '힘껏 당기기', description: '큰 움직임이 보이면 한 번에 끌어올립니다.' },
  { id: 'angle', label: '옆물살 타기', description: '배를 살짝 틀어 물살을 타고 그물을 회수합니다.' }
];

function canFishAtPort(port: Port) {
  return port.facilities.includes('fish_market') || port.terrainTags.includes('fishing_ground');
}

function fishingSpotById(id?: FishingSpotId) {
  return FISHING_SPOTS.find((spot) => spot.id === id) ?? FISHING_SPOTS[0];
}

function fishingTimingById(id?: FishingTimingId) {
  return FISHING_TIMINGS.find((timing) => timing.id === id) ?? FISHING_TIMINGS[0];
}

function fishingHaulById(id?: FishingHaulId) {
  return FISHING_HAULS.find((haul) => haul.id === id) ?? FISHING_HAULS[0];
}

function timingDistance(a: FishingTimingId, b: FishingTimingId) {
  const left = FISHING_TIMINGS.findIndex((timing) => timing.id === a);
  const right = FISHING_TIMINGS.findIndex((timing) => timing.id === b);
  return Math.abs(left - right);
}

function tideLabel(tide: string) {
  if (tide === 'low') return '간조';
  if (tide === 'high') return '만조';
  return '보통 물때';
}

function fishingTideBonus(spot: FishingSpot, tide: string) {
  if (spot.id === 'harbor_shoal' && tide === 'low') return 8;
  if (spot.id === 'open_current' && tide === 'high') return 8;
  if (spot.id === 'reef_shadow' && tide === 'middle') return 6;
  if (tide === 'middle') return 2;
  return 0;
}

function fishingRiskMultiplier(monthly?: MonthlyEvent) {
  const risks = monthly?.riskTags ?? [];
  if (risks.includes('storm') || risks.includes('rough_sea')) return 1.35;
  if (risks.includes('fog')) return 1.15;
  return 1;
}

function fishingSeasonScore(monthly?: MonthlyEvent) {
  const bonus = monthly?.fishingBonus ?? 0;
  if (bonus > 1) return Math.round((bonus - 1) * 28);
  if (bonus > 0 && bonus < 1) return -Math.round((1 - bonus) * 18);
  return 0;
}

function trimFishingCatchToCapacity(data: GameData, state: GameState, gained: Record<string, number>) {
  const trimmed = { ...gained };
  let overflowed = false;
  const capacity = cargoCapacity(data, state);
  const order = ['fresh_fish', 'seaweed', 'dried_fish', 'skate'];
  while (cargoUsed(data, { ...state.cargo, ...Object.fromEntries(Object.entries(trimmed).map(([goodId, amount]) => [goodId, (state.cargo[goodId] ?? 0) + amount])) }) > capacity) {
    const removable = order.find((goodId) => (trimmed[goodId] ?? 0) > 0) ?? Object.keys(trimmed).find((goodId) => (trimmed[goodId] ?? 0) > 0);
    if (!removable) break;
    trimmed[removable] -= 1;
    if (trimmed[removable] <= 0) delete trimmed[removable];
    overflowed = true;
  }
  return { gained: normalizeRecord(trimmed), overflowed };
}

function fishingCatchValue(data: GameData, state: GameState, gained: Record<string, number>) {
  return Object.entries(gained).reduce((total, [goodId, amount]) => {
    const good = data.goodById[goodId];
    if (!good) return total;
    return total + marketQuote(data, state, state.currentPortId, good).sellPrice * amount;
  }, 0);
}

function calculateFishingResult(data: GameData, state: GameState, port: Port, session: FishingSession): FishingResult {
  const spot = fishingSpotById(session.spotId);
  const timing = fishingTimingById(session.timingId);
  const haul = fishingHaulById(session.haulId);
  const monthly = currentMonthEvent(data, state.date.month);
  const ship = data.shipById[state.shipId];
  const tide = tideFor(data, state.date.day);
  const skill = effectiveSkillValue(data, state, 'fishing');
  const distance = timingDistance(timing.id, spot.preferredTiming);
  const timingScore = distance === 0 ? 30 : distance === 1 ? 11 : -14;
  const haulScore = haul.id === spot.bestHaul ? 18 : haul.id === 'steady' && spot.risk >= 3 ? -8 : 6;
  const fatiguePenalty = Math.floor(state.crew.fatigue / 14);
  const seasonScore = fishingSeasonScore(monthly);
  const score = clamp(
    42 + skill * 5 + Math.round((ship?.fishingBonus ?? 0) * 36) + spot.yield * 8 + timingScore + haulScore + fishingTideBonus(spot, tide) + seasonScore - spot.risk * 4 - fatiguePenalty,
    0,
    120
  );
  const riskRoll = hashNoise(`${session.id}-${state.currentPortId}-${state.date.month}-${state.date.day}-${spot.id}-${timing.id}-${haul.id}`);
  const riskChance = clamp((spot.risk * 0.08 + Math.max(0, state.crew.fatigue - 45) * 0.002) * fishingRiskMultiplier(monthly), 0.04, 0.52);
  const hazard = riskRoll < riskChance;
  const bigCatch = score >= 92 && riskRoll > 0.22;
  const outcome: FishingOutcome = score >= 82 ? 'success' : score >= 54 ? 'normal' : 'failure';
  const gained: Record<string, number> = {};

  if (outcome === 'failure') {
    if (score >= 44 && !hazard) gained.fresh_fish = 1;
  } else {
    gained.fresh_fish = outcome === 'success' ? 2 + spot.yield : 1 + Math.max(0, spot.yield - 1);
    if (spot.goods.includes('seaweed') && (outcome === 'success' || tide === 'low')) gained.seaweed = (gained.seaweed ?? 0) + 1;
    if (spot.goods.includes('dried_fish') && outcome === 'success') gained.dried_fish = (gained.dried_fish ?? 0) + 1;
    if (spot.goods.includes('skate') && (bigCatch || (outcome === 'success' && spot.id !== 'harbor_shoal'))) gained.skate = (gained.skate ?? 0) + 1;
  }

  if (hazard && gained.fresh_fish) gained.fresh_fish = Math.max(0, gained.fresh_fish - 1);
  const trimmed = trimFishingCatchToCapacity(data, state, normalizeRecord(gained));
  const estimatedValue = fishingCatchValue(data, state, trimmed.gained);
  const shipDamage = hazard ? -(spot.risk + (monthly?.riskTags?.includes('storm') ? 2 : 0)) : 0;
  const fatigue = clamp(4 + spot.risk * 2 + (hazard ? 4 : 0), 3, 16);
  const quality = outcome === 'success' ? (bigCatch ? '대어 조짐 적중' : '좋은 수확') : outcome === 'normal' ? '보통 수확' : '빈 그물';
  const riskLine = hazard
    ? monthly?.riskTags?.includes('storm') || monthly?.riskTags?.includes('rough_sea')
      ? '거친 물살에 배와 그물이 조금 상했습니다.'
      : '암초와 파도 때문에 그물을 일부 놓쳤습니다.'
    : trimmed.overflowed
      ? '짐칸이 모자라 가장 값싼 수확 일부를 내려놓았습니다.'
      : '위험 없이 그물을 거두었습니다.';
  const fairyLine = outcome === 'success'
    ? bigCatch
      ? '좋아요! 큰 물고기 그림자가 그물 밑에서 반짝였어요.'
      : '타이밍이 맞았어요. 이 정도면 오늘 어장은 성공이에요.'
    : outcome === 'normal'
      ? '괜찮아요. 너무 욕심내지 않아서 그물은 무사해요.'
      : '잠깐, 물살을 놓쳤어요. 빈 그물일 때는 쉬어 가는 것도 판단이에요.';

  return {
    outcome,
    quality,
    score,
    gained: trimmed.gained,
    estimatedValue,
    fatigue,
    shipDamage,
    morale: outcome === 'success' ? 1 : outcome === 'failure' ? -1 : 0,
    spotName: spot.name,
    timingName: timing.label,
    haulName: haul.label,
    riskLine,
    fairyLine,
    mood: outcome === 'success' ? 'happy' : outcome === 'failure' || hazard ? 'warning' : 'default',
    cargoOverflowed: trimmed.overflowed,
    bigCatch
  };
}

function emptyLedger(): LedgerState {
  return { transactions: [], travels: [], fishing: [] };
}

function emptyQuestProgress(): QuestProgress {
  return {
    purchasedGoods: {},
    soldGoods: {},
    deliveredGoods: {},
    visitedPorts: {},
    ownedCarts: {},
    ownedShips: {},
    earnedMoney: 0,
    fishingCount: 0,
    eventResolved: {},
    repairedShips: 0,
    combatSurvived: {}
  };
}

function emptyFame() {
  return { merchant: 0, exploration: 0, guard: 0 };
}

function normalizeFame(raw: Partial<GameState> | undefined) {
  return {
    merchant: raw?.fame?.merchant ?? raw?.reputation?.merchant ?? 0,
    exploration: raw?.fame?.exploration ?? Math.max(raw?.reputation?.foreign ?? 0, 0),
    guard: raw?.fame?.guard ?? Math.max(raw?.reputation?.official ?? 0, raw?.reputation?.naval ?? 0, 0)
  };
}

function fameDeltaLines(delta: Partial<GameState['fame']> = {}) {
  const lines: string[] = [];
  if (delta.merchant) lines.push(`상인 이름값 +${delta.merchant}`);
  if (delta.exploration) lines.push(`탐방 이름값 +${delta.exploration}`);
  if (delta.guard) lines.push(`호위 이름값 +${delta.guard}`);
  return lines;
}

function applyFameDelta(state: GameState, delta: Partial<GameState['fame']> = {}) {
  if (!delta.merchant && !delta.exploration && !delta.guard) return state;
  return {
    ...state,
    fame: {
      merchant: Math.max(0, state.fame.merchant + (delta.merchant ?? 0)),
      exploration: Math.max(0, state.fame.exploration + (delta.exploration ?? 0)),
      guard: Math.max(0, state.fame.guard + (delta.guard ?? 0))
    }
  };
}

function bumpPortTrust(state: GameState, portId: string, amount: number) {
  if (!portId || amount === 0) return state;
  return {
    ...state,
    portTrust: {
      ...state.portTrust,
      [portId]: clamp((state.portTrust[portId] ?? 0) + amount, 0, 9)
    }
  };
}

function addNestedCount(table: Record<string, Record<string, number>>, key: string, item: string, amount: number) {
  return {
    ...table,
    [key]: {
      ...(table[key] ?? {}),
      [item]: (table[key]?.[item] ?? 0) + amount
    }
  };
}

function countGoodsAt(table: Record<string, Record<string, number>>, portIds: string[], goodId: string) {
  return portIds.reduce((total, portId) => total + (table[portId]?.[goodId] ?? 0), 0);
}

function goodTier(good: Good) {
  if (good.tier) return good.tier;
  if (good.basePrice >= 100) return 4;
  if (good.basePrice >= 70) return 3;
  if (good.basePrice >= 35) return 2;
  return 1;
}

function goodVolatility(good: Good) {
  return clamp(good.volatility ?? 0.18 + goodTier(good) * 0.12, 0.05, 1.2);
}

function originPortsForGood(data: GameData, good: Good) {
  return good.originPorts?.length
    ? good.originPorts
    : data.ports.filter((port) => port.produces.includes(good.id)).map((port) => port.id);
}

function priceContextFor(data: GameData, port: Port, good: Good, date: GameState['date']) {
  const monthly = currentMonthEvent(data, date.month);
  const tier = goodTier(good);
  const volatility = goodVolatility(good);
  const supplyLevel = clamp(good.supplyLevel ?? 0.55, 0.1, 1.3);
  const demandLevel = clamp(good.demandLevel ?? 0.55, 0.1, 1.3);
  const origins = originPortsForGood(data, good);
  const isOrigin = origins.includes(port.id) || port.produces.includes(good.id);
  const isDemand = port.demands.includes(good.id);
  const sourceDiscount = isOrigin ? 0.2 + supplyLevel * 0.08 + volatility * 0.04 : 0;
  const remoteScarcity = !isOrigin ? 0.02 + (1 - Math.min(supplyLevel, 1)) * 0.04 + tier * 0.014 : 0;
  const demandPremium = isDemand
    ? isOrigin ? 0.06 : 0.18 + demandLevel * 0.12 + volatility * 0.06 + tier * 0.02
    : 0;
  const supplyDemandModifier = clamp(1 - sourceDiscount + remoteScarcity + demandPremium, 0.55, 1.75);
  const regionModifier = port.marketBias[good.id] ?? port.marketBias[good.category] ?? 1;
  const eventModifier = monthly?.priceModifiers?.[good.id] ?? monthly?.priceModifiers?.[good.category] ?? 1;
  const seasonModifier = good.seasonal[String(date.month)] ?? 1;
  const officialDemandModifier = monthly?.officialDemandGoods?.includes(good.id)
    ? port.facilities.includes('office') ? 1.05 : 1.02
    : 1;
  const trendModifier = monthly?.trendGoods?.includes(good.id) ? 1.02 : 1;
  const riskTags = monthly?.riskTags ?? [];
  const seaRisk = riskTags.some((tag) => ['pirates', 'storm', 'rough_sea'].includes(tag));
  const inlandRisk = riskTags.some((tag) => ['bandits', 'flood', 'snow'].includes(tag));
  let riskModifier = 1;
  if (!isOrigin && seaRisk && port.terrainTags.some((tag) => ['island', 'open_sea', 'archipelago', 'foreign_gate', 'large_port'].includes(tag))) {
    riskModifier += 0.025 + volatility * 0.025 + tier * 0.008;
  }
  if (!isOrigin && inlandRisk && port.terrainTags.some((tag) => ['inland', 'inland_route', 'mountain', 'mountain_gate', 'trade_hub'].includes(tag))) {
    riskModifier += 0.02 + volatility * 0.02 + tier * 0.006;
  }
  let portTraitModifier = 1;
  if (port.terrainTags.includes('island') && !isOrigin && ['grain', 'salt', 'resource'].includes(good.category)) portTraitModifier += 0.06;
  if (port.facilities.includes('fish_market') && good.category === 'seafood' && isOrigin) portTraitModifier -= 0.04;
  if (port.shipyardLevel > 0 && ['resource', 'metal'].includes(good.category) && !isOrigin) portTraitModifier += 0.03;
  if (port.terrainTags.includes('capital') && ['luxury', 'craft', 'medicine'].includes(good.category)) portTraitModifier += 0.07;
  if (port.terrainTags.includes('foreign_gate') && good.category === 'foreign') portTraitModifier += 0.08;
  const noiseRange = data.constants.economy.monthlyNoiseRange;
  const rawNoise = noiseRange[0] + hashNoise(`${date.year}-${date.month}-${port.id}-${good.id}`) * (noiseRange[1] - noiseRange[0]);
  const noise = rawNoise * (0.65 + volatility * 0.65 + tier * 0.06);
  const multiplier = clamp(
    supplyDemandModifier * regionModifier * eventModifier * seasonModifier * officialDemandModifier * trendModifier * riskModifier * portTraitModifier * (1 + noise),
    data.constants.economy.minPriceMultiplier,
    data.constants.economy.maxPriceMultiplier
  );
  const reasons = [
    isOrigin ? '생산지 공급가' : isDemand ? '수요지 웃돈' : '일반 장세',
    regionModifier !== 1 ? '항구 성향' : '',
    eventModifier !== 1 || officialDemandModifier !== 1 || trendModifier !== 1 ? '월간 사건' : '',
    seasonModifier !== 1 ? '계절 영향' : '',
    riskModifier !== 1 ? '위험 할증' : '',
    portTraitModifier !== 1 ? '지역 특성' : '',
    tier >= 3 ? '고가품 변동폭' : ''
  ].filter(Boolean);
  return {
    multiplier,
    reasons,
    relation: (isOrigin ? 'origin' : isDemand ? 'demand' : 'balanced') as MarketQuote['relation']
  };
}

function priceFor(data: GameData, port: Port, good: Good, date: GameState['date']) {
  return Math.max(1, Math.round(good.basePrice * priceContextFor(data, port, good, date).multiplier));
}

function priceLabel(good: Good, price: number, referencePrice = good.basePrice) {
  const ratio = price / Math.max(1, referencePrice);
  if (ratio <= 0.94) return { label: '저렴', tone: 'cheap' };
  if (ratio <= 1.08) return { label: '보통', tone: 'normal' };
  return { label: '비쌈', tone: 'expensive' };
}

function marketGoodsForPort(data: GameData, port: Port) {
  const desired = MARKET_SIZE_BY_TIER[port.tier] ?? 4;
  const stapleGoods = ['rice', 'salt', 'dried_fish', 'cotton_cloth', 'lumber', 'paper', 'beans', 'barley'];
  const shipyardGoods = port.shipyardLevel > 0 ? ['lumber', 'pine_lumber', 'iron'] : [];
  const selected: string[] = [];

  function add(goodIds: string[]) {
    for (const goodId of goodIds) {
      if (selected.length >= desired) return;
      if (!data.goodById[goodId] || selected.includes(goodId)) continue;
      selected.push(goodId);
    }
  }

  add(port.produces);
  add(port.demands);
  add(shipyardGoods);
  add(stapleGoods);

  return selected.map((goodId) => data.goodById[goodId]);
}

function goodMarketRole(port: Port, good: Good) {
  if (port.produces.includes(good.id)) return '특산';
  if (port.demands.includes(good.id)) return '수요';
  return '일반';
}

function shipArtFor(data: GameData, ship: Ship) {
  const ordered = [...data.ships].sort((a, b) => a.price - b.price);
  const index = Math.max(0, ordered.findIndex((item) => item.id === ship.id));
  const tier = index <= 1 ? 1 : index <= 3 ? 2 : index <= 5 ? 3 : 4;
  return shipAssetForTier(tier);
}

function cartArtFor(data: GameData, cart: Cart) {
  const ordered = [...data.carts].sort((a, b) => a.price - b.price);
  const index = Math.max(0, ordered.findIndex((item) => item.id === cart.id));
  const tier = index <= 1 ? 1 : index <= 2 ? 2 : index <= 4 ? 3 : 4;
  return cartAssetForTier(tier);
}

function sceneAssetForPort(port: Port) {
  return sceneAssetForVisualType(port.visualType, port.sceneAsset);
}

function modernMapName(port: Port) {
  const names: Record<string, string> = {
    hanyang: '서울(한양)',
    ganghwa: '강화',
    chungju: '충주',
    jeonju: '전주',
    gunsan: '군산(군산포)',
    mokpo: '목포(목포진)',
    heuksando: '흑산도',
    yeosu: '여수',
    tongyeong: '통영(통제영)',
    jinhae_jepo: '진해(제포)',
    busanpo: '부산(부산포)',
    tsushima: '쓰시마(대마도)',
    ulsan: '울산',
    pohang: '포항(영일만)',
    gangneung: '강릉',
    daegu: '대구',
    andong: '안동',
    jeju: '제주',
    pyeongyang: '평양',
    nampo: '남포',
    sinuiju: '신의주(의주)',
    wonsan: '원산',
    hamhung: '함흥',
    chongjin: '청진(경흥)',
    kaesong: '개성',
    qing_yalu_market: '단둥 방면(책문 장시)',
    tumen_north_market: '두만강 북방(북방장)'
  };
  return names[port.id] ?? port.name;
}

function portKindLabel(port: Port) {
  if (port.kind.includes('foreign_border')) return '국경 장시';
  if (port.kind.includes('border')) return '변경 장시';
  if (port.kind.includes('foreign')) return '바깥 교역 거점';
  if (port.kind.includes('island')) return '섬 항구';
  if (port.kind.includes('port')) return '항구';
  if (port.kind.includes('city')) return '내륙 거점';
  return '교역 거점';
}

function isBorderTradeRoute(route: Route) {
  return [...(route.terrain ?? []), ...(route.sea ?? [])].includes('border_trade');
}

function permitLabel(permitId: string) {
  const labels: Record<string, string> = {
    waegwan_pass: '왜관 허가장',
    qing_border_pass: '청 교역 허가',
    tumen_trade_pass: '두만강 통행 허가'
  };
  return labels[permitId] ?? '허가장';
}

function routeModeLabel(route: Route) {
  if (isBorderTradeRoute(route)) return '국경 장시길';
  return route.mode === 'sea' ? '바닷길' : '땅길';
}

function routeRepairReadiness(data: GameData, state: GameState, route: Route) {
  const current = route.mode === 'sea' ? state.shipDurability : state.cartDurability;
  const max = route.mode === 'sea'
    ? data.shipById[state.shipId]?.durability ?? current
    : data.cartById[state.cartId]?.durability ?? current;
  const ratio = max > 0 ? current / max : 1;
  if (ratio < 0.45) return { label: '고쳐야 함', tone: 'bad' as const };
  if (ratio < 0.75) return { label: '점검 권장', tone: 'warn' as const };
  return { label: '양호', tone: 'ok' as const };
}

function nextShipFor(data: GameData, current: Ship) {
  return [...data.ships].sort((a, b) => a.price - b.price).find((item) => item.price > current.price);
}

function nextCartFor(data: GameData, current: Cart) {
  return [...data.carts].sort((a, b) => a.price - b.price).find((item) => item.price > current.price);
}

type PixelPalette = {
  bg: string;
  light: string;
  mid: string;
  dark: string;
  accent: string;
};

const GOOD_ICON_PALETTES: Record<string, PixelPalette> = {
  grain: { bg: '#f4df9f', light: '#fff2bf', mid: '#d6a94e', dark: '#6c4a25', accent: '#9f7a35' },
  salt: { bg: '#dfeff0', light: '#ffffff', mid: '#9ec7cb', dark: '#33566a', accent: '#6ea4af' },
  seafood: { bg: '#b7d7db', light: '#e6f7f2', mid: '#3d8a93', dark: '#1d4553', accent: '#d18a50' },
  textile: { bg: '#ead2e0', light: '#fff3f8', mid: '#8a4e7a', dark: '#3d263f', accent: '#d6a64d' },
  luxury: { bg: '#f0d583', light: '#fff0a8', mid: '#b6606c', dark: '#47273e', accent: '#d9b54a' },
  craft: { bg: '#eee0bc', light: '#fff8df', mid: '#8d6f4a', dark: '#3e3327', accent: '#2d718f' },
  resource: { bg: '#dfc29a', light: '#f5d8aa', mid: '#8a5b2f', dark: '#3d291a', accent: '#54734b' },
  metal: { bg: '#d7dce0', light: '#f7fbff', mid: '#818d96', dark: '#35404b', accent: '#bd8b3f' },
  foreign: { bg: '#d8d1ef', light: '#f7f1ff', mid: '#6f64a8', dark: '#2c284f', accent: '#d7a64d' },
  medicine: { bg: '#cfe3b8', light: '#e9f6cf', mid: '#4f8b4c', dark: '#263f2d', accent: '#b26b3e' },
  livestock: { bg: '#e7d4b7', light: '#fff0cc', mid: '#95643f', dark: '#3a261d', accent: '#2d718f' },
  food: { bg: '#f3d49c', light: '#fff0ae', mid: '#d27c34', dark: '#5b331d', accent: '#2f7d54' },
  restricted: { bg: '#dac1b7', light: '#ffe2d0', mid: '#a94436', dark: '#2b2324', accent: '#f0c34f' },
  fallback: { bg: '#e8dac5', light: '#fff9e6', mid: '#8a6338', dark: '#2c261f', accent: '#2d718f' }
};

function paletteForGood(good?: Good) {
  return GOOD_ICON_PALETTES[good?.category ?? ''] ?? GOOD_ICON_PALETTES.fallback;
}

function PixelIconFrame({ good, className, children }: { good?: Good; className: string; children: ReactNode }) {
  const palette = paletteForGood(good);
  const category = good?.category ?? 'fallback';
  return (
    <svg
      className={`good-icon pixel-good-icon pixel-good-${category} ${className}`}
      viewBox="0 0 48 48"
      role="img"
      aria-label={good?.name ?? '상품'}
      shapeRendering="geometricPrecision"
    >
      <rect x="2" y="2" width="44" height="44" rx="11" fill={palette.bg} />
      <rect x="5" y="5" width="38" height="38" rx="9" fill="rgba(255,255,255,0.22)" />
      <rect x="2" y="2" width="44" height="44" rx="11" fill="none" stroke={palette.dark} strokeWidth="2.6" />
      <path d="M9 10 C17 6 29 6 38 12" fill="none" stroke={palette.light} strokeWidth="2.4" strokeLinecap="round" opacity=".92" />
      <ellipse cx="33" cy="39" rx="8" ry="3" fill="rgba(0,0,0,0.16)" />
      <g>{children}</g>
    </svg>
  );
}

function GrainIcon({ kind, palette }: { kind: 'rice' | 'barley' | 'beans'; palette: PixelPalette }) {
  if (kind === 'beans') {
    return (
      <>
        <rect x="15" y="16" width="18" height="16" fill={palette.dark} />
        <rect x="17" y="14" width="17" height="16" fill={palette.mid} />
        <rect x="20" y="17" width="4" height="4" fill={palette.light} />
        <rect x="26" y="19" width="5" height="4" fill={palette.accent} />
        <rect x="13" y="31" width="22" height="5" fill={palette.dark} />
      </>
    );
  }
  if (kind === 'barley') {
    return (
      <>
        <rect x="23" y="12" width="3" height="25" fill={palette.dark} />
        {[13, 17, 21, 25].map((y) => (
          <g key={y}>
            <rect x="15" y={y} width="7" height="4" fill={palette.mid} />
            <rect x="26" y={y + 1} width="7" height="4" fill={palette.accent} />
          </g>
        ))}
        <rect x="16" y="37" width="17" height="4" fill={palette.dark} />
      </>
    );
  }
  return (
    <>
      <rect x="13" y="16" width="22" height="19" fill={palette.dark} />
      <rect x="15" y="13" width="19" height="20" fill={palette.light} />
      <rect x="18" y="17" width="3" height="3" fill={palette.mid} />
      <rect x="23" y="19" width="3" height="3" fill={palette.mid} />
      <rect x="28" y="17" width="3" height="3" fill={palette.mid} />
      <rect x="17" y="31" width="18" height="5" fill={palette.accent} />
    </>
  );
}

function FishIcon({ kind, palette }: { kind: 'fresh' | 'dried' | 'skate' | 'seaweed'; palette: PixelPalette }) {
  if (kind === 'seaweed') {
    return (
      <>
        {[14, 21, 28].map((x, index) => (
          <path key={x} d={`M${x} 36 L${x + 2} 28 L${x - 1} 21 L${x + 2} 13 L${x + 5} 13 L${x + 3} 21 L${x + 6} 28 L${x + 4} 36 Z`} fill={index === 1 ? palette.accent : palette.mid} stroke={palette.dark} strokeWidth="2" />
        ))}
      </>
    );
  }
  if (kind === 'skate') {
    return (
      <>
        <path d="M10 25 L24 13 L38 25 L24 35 Z" fill={palette.mid} stroke={palette.dark} strokeWidth="2" />
        <rect x="22" y="18" width="4" height="13" fill={palette.light} />
        <rect x="24" y="33" width="4" height="6" fill={palette.dark} />
      </>
    );
  }
  return (
    <>
      <rect x="12" y="20" width="22" height="11" fill={palette.dark} />
      <rect x="14" y="18" width="21" height="11" fill={kind === 'dried' ? palette.accent : palette.mid} />
      <path d="M35 18 L43 13 L43 34 L35 29 Z" fill={palette.dark} />
      <rect x="18" y="21" width="3" height="3" fill={kind === 'dried' ? '#4b2f20' : palette.light} />
      <rect x="25" y="28" width="8" height="2" fill={kind === 'dried' ? '#f0bd78' : palette.light} />
      {kind === 'dried' && <rect x="11" y="30" width="25" height="4" fill="rgba(81,48,29,0.35)" />}
    </>
  );
}

function TextileIcon({ kind, palette }: { kind: 'cotton' | 'hemp' | 'silk' | 'thread'; palette: PixelPalette }) {
  if (kind === 'thread') {
    return (
      <>
        <rect x="16" y="14" width="16" height="24" fill={palette.dark} />
        <rect x="18" y="13" width="14" height="23" fill={palette.accent} />
        <rect x="14" y="18" width="20" height="3" fill={palette.light} />
        <rect x="14" y="26" width="20" height="3" fill={palette.light} />
        <rect x="14" y="34" width="20" height="3" fill={palette.light} />
      </>
    );
  }
  return (
    <>
      <rect x="12" y="15" width="25" height="20" fill={palette.dark} />
      <rect x="14" y="13" width="23" height="20" fill={kind === 'cotton' ? palette.light : kind === 'hemp' ? '#c6b074' : palette.mid} />
      <rect x="18" y="13" width="3" height="20" fill={kind === 'silk' ? palette.accent : palette.mid} />
      <rect x="25" y="13" width="3" height="20" fill={kind === 'silk' ? palette.light : palette.accent} />
      <rect x="14" y="33" width="23" height="4" fill={palette.dark} />
    </>
  );
}

function PaperIcon({ kind, palette }: { kind: 'paper' | 'books' | 'fan' | 'ceramics' | 'japanese'; palette: PixelPalette }) {
  if (kind === 'books') {
    return (
      <>
        <rect x="13" y="14" width="9" height="24" fill={palette.dark} />
        <rect x="15" y="12" width="9" height="24" fill={palette.accent} />
        <rect x="25" y="16" width="10" height="20" fill={palette.dark} />
        <rect x="27" y="14" width="10" height="20" fill={palette.mid} />
        <rect x="17" y="17" width="5" height="2" fill={palette.light} />
        <rect x="29" y="19" width="5" height="2" fill={palette.light} />
      </>
    );
  }
  if (kind === 'fan') {
    return (
      <>
        <path d="M12 34 L24 13 L36 34 Z" fill={palette.light} stroke={palette.dark} strokeWidth="2" />
        <path d="M17 34 L24 13 L31 34" fill="none" stroke={palette.mid} strokeWidth="2" />
        <rect x="22" y="31" width="5" height="8" fill={palette.dark} />
      </>
    );
  }
  if (kind === 'ceramics') {
    return (
      <>
        <rect x="17" y="15" width="15" height="22" fill={palette.dark} />
        <rect x="18" y="13" width="14" height="22" fill={palette.light} />
        <rect x="20" y="18" width="10" height="4" fill={palette.accent} />
        <rect x="18" y="33" width="14" height="4" fill={palette.mid} />
      </>
    );
  }
  return (
    <>
      <rect x="14" y="12" width="21" height="27" fill={palette.dark} />
      <rect x="12" y="10" width="21" height="27" fill={kind === 'japanese' ? '#f3e0e7' : palette.light} />
      <rect x="17" y="17" width="11" height="2" fill={palette.mid} />
      <rect x="17" y="23" width="9" height="2" fill={palette.mid} />
      <rect x="17" y="29" width="13" height="2" fill={palette.mid} />
      {kind === 'japanese' && <rect x="12" y="10" width="4" height="27" fill={palette.accent} />}
    </>
  );
}

function PlantIcon({ kind, palette }: { kind: 'ginseng' | 'herbs' | 'tea' | 'citrus'; palette: PixelPalette }) {
  if (kind === 'citrus') {
    return (
      <>
        <rect x="16" y="18" width="20" height="18" fill={palette.dark} />
        <rect x="18" y="16" width="18" height="18" fill={palette.mid} />
        <rect x="22" y="12" width="8" height="5" fill={palette.accent} />
        <rect x="29" y="10" width="7" height="5" fill="#2f7d54" />
        <rect x="22" y="20" width="4" height="4" fill={palette.light} />
      </>
    );
  }
  return (
    <>
      <rect x="23" y="15" width="4" height="22" fill={palette.dark} />
      <rect x="16" y="17" width="9" height="8" fill={palette.mid} />
      <rect x="27" y="14" width="10" height="8" fill={palette.accent} />
      <rect x="12" y="27" width="12" height="7" fill={kind === 'ginseng' ? '#d7b084' : palette.mid} />
      <rect x="27" y="26" width="10" height="8" fill={kind === 'tea' ? '#6a8f47' : palette.light} />
      {kind === 'ginseng' && <rect x="21" y="35" width="9" height="4" fill="#d7b084" />}
    </>
  );
}

function TradeGoodIcon({ id, palette }: { id: string; palette: PixelPalette }) {
  switch (id) {
    case 'rice': return <GrainIcon kind="rice" palette={palette} />;
    case 'barley': return <GrainIcon kind="barley" palette={palette} />;
    case 'beans': return <GrainIcon kind="beans" palette={palette} />;
    case 'salt':
      return (
        <>
          <path d="M13 33 L20 19 L27 33 Z" fill={palette.light} stroke={palette.dark} strokeWidth="2" />
          <path d="M23 34 L31 15 L39 34 Z" fill={palette.mid} stroke={palette.dark} strokeWidth="2" />
          <rect x="15" y="35" width="24" height="4" fill={palette.dark} />
        </>
      );
    case 'dried_fish': return <FishIcon kind="dried" palette={palette} />;
    case 'fresh_fish': return <FishIcon kind="fresh" palette={palette} />;
    case 'skate': return <FishIcon kind="skate" palette={palette} />;
    case 'seaweed': return <FishIcon kind="seaweed" palette={palette} />;
    case 'cotton_cloth': return <TextileIcon kind="cotton" palette={palette} />;
    case 'hemp_cloth': return <TextileIcon kind="hemp" palette={palette} />;
    case 'silk': return <TextileIcon kind="silk" palette={palette} />;
    case 'silk_thread': return <TextileIcon kind="thread" palette={palette} />;
    case 'paper': return <PaperIcon kind="paper" palette={palette} />;
    case 'books': return <PaperIcon kind="books" palette={palette} />;
    case 'japanese_paper': return <PaperIcon kind="japanese" palette={palette} />;
    case 'fan': return <PaperIcon kind="fan" palette={palette} />;
    case 'ceramics': return <PaperIcon kind="ceramics" palette={palette} />;
    case 'lumber':
    case 'pine_lumber':
      return (
        <>
          <rect x="12" y="17" width="26" height="8" fill={palette.dark} />
          <rect x="14" y="14" width="26" height="8" fill={palette.mid} />
          <rect x="9" y="29" width="25" height="7" fill={palette.dark} />
          <rect x="11" y="26" width="25" height="7" fill={id === 'pine_lumber' ? '#6c8a4d' : palette.accent} />
          <rect x="17" y="16" width="5" height="3" fill={palette.light} />
          <rect x="15" y="28" width="4" height="2" fill={palette.light} />
        </>
      );
    case 'iron':
    case 'silver':
      return (
        <>
          <path d="M13 32 L20 17 L34 14 L39 31 L28 38 Z" fill={palette.dark} />
          <path d="M15 30 L22 17 L33 16 L36 29 L27 35 Z" fill={id === 'silver' ? palette.light : palette.mid} />
          <rect x="21" y="21" width="8" height="4" fill={id === 'silver' ? palette.mid : palette.light} />
        </>
      );
    case 'ginseng': return <PlantIcon kind="ginseng" palette={palette} />;
    case 'herbs': return <PlantIcon kind="herbs" palette={palette} />;
    case 'tea': return <PlantIcon kind="tea" palette={palette} />;
    case 'citrus': return <PlantIcon kind="citrus" palette={palette} />;
    case 'horse':
      return (
        <>
          <rect x="13" y="25" width="20" height="10" fill={palette.dark} />
          <rect x="16" y="20" width="19" height="11" fill={palette.mid} />
          <rect x="32" y="16" width="7" height="12" fill={palette.mid} />
          <rect x="35" y="19" width="3" height="3" fill={palette.light} />
          <rect x="17" y="33" width="4" height="7" fill={palette.dark} />
          <rect x="29" y="33" width="4" height="7" fill={palette.dark} />
        </>
      );
    case 'lacquerware':
      return (
        <>
          <rect x="14" y="17" width="22" height="18" fill={palette.dark} />
          <rect x="16" y="15" width="20" height="17" fill="#3b1f2e" />
          <rect x="19" y="20" width="14" height="4" fill={palette.accent} />
          <rect x="16" y="32" width="20" height="4" fill={palette.dark} />
        </>
      );
    case 'gunpowder':
      return (
        <>
          <rect x="16" y="15" width="16" height="22" fill={palette.dark} />
          <rect x="18" y="13" width="14" height="22" fill={palette.mid} />
          <rect x="20" y="18" width="10" height="4" fill={palette.light} />
          <rect x="29" y="10" width="5" height="8" fill={palette.accent} />
          <rect x="31" y="7" width="3" height="3" fill="#fff0a8" />
        </>
      );
    default:
      return (
        <>
          <rect x="15" y="15" width="19" height="20" fill={palette.dark} />
          <rect x="17" y="13" width="18" height="19" fill={palette.mid} />
          <rect x="20" y="18" width="10" height="3" fill={palette.light} />
          <rect x="20" y="25" width="8" height="3" fill={palette.accent} />
        </>
      );
  }
}

function GoodIcon({ good, className = '' }: { good?: Good; className?: string }) {
  return (
    <img
      className={`good-icon pixel-good-icon pixel-good-${good?.category ?? 'fallback'} ${className}`}
      src={good?.iconAsset ?? goodIconAsset(good?.id)}
      alt={good?.name ?? '상품'}
      onError={(event) => { event.currentTarget.src = goodIconAsset(); }}
    />
  );
}

function VehiclePixelToken({
  mode,
  className = '',
  style,
  testId
}: {
  mode: Route['mode'];
  className?: string;
  style?: CSSProperties;
  testId?: string;
}) {
  return (
    <svg className={`vehicle-token ${className}`} viewBox="0 0 56 40" style={style} data-testid={testId} aria-hidden="true" shapeRendering="crispEdges">
      {mode === 'sea' ? (
        <>
          <path d="M6 27 H45 C42 34 28 38 13 34 Z" fill="#8a5b2f" stroke="#26384d" strokeWidth="3" strokeLinejoin="round" />
          <path d="M14 22 H39 V28 H14 Z" fill="#c98238" stroke="#26384d" strokeWidth="2" />
          <path d="M27 8 V27" stroke="#26384d" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 10 L49 26 H30 Z" fill="#fff4d6" stroke="#26384d" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M25 14 L10 27 H25 Z" fill="#ffd75c" stroke="#26384d" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M7 36 C20 32 35 37 50 32" fill="none" stroke="#24b1cb" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M12 18 H41 V31 H12 Z" fill="#c98238" stroke="#26384d" strokeWidth="3" strokeLinejoin="round" />
          <path d="M17 12 H36 V19 H17 Z" fill="#ffd75c" stroke="#26384d" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M8 28 H48" stroke="#26384d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="17" cy="34" r="6" fill="#26384d" />
          <circle cx="39" cy="34" r="6" fill="#26384d" />
          <circle cx="17" cy="34" r="2.4" fill="#f2d99a" />
          <circle cx="39" cy="34" r="2.4" fill="#f2d99a" />
        </>
      )}
    </svg>
  );
}

function RouteToken({ data: _data, state: _state, mode }: { data: GameData; state: GameState; mode: Route['mode'] }) {
  return <VehiclePixelToken mode={mode} className={`route-token ${mode}`} />;
}

type GuideMood = 'default' | 'happy' | 'warning';

function GuideSpirit({ mood = 'default', className = '' }: { mood?: GuideMood; className?: string }) {
  return <img className={`guide-spirit mood-${mood} ${className}`} src={guideSpiritAsset(mood)} alt="" aria-hidden="true" />;
}

function portFlavor(data: GameData, port: Port) {
  return data.portFlavorById[port.id] ?? {
    ...DEFAULT_PORT_FLAVOR,
    id: port.id,
    goods: port.produces.slice(0, 3)
  };
}

function CargoSlotStrip({ data, state, route }: { data: GameData; state: GameState; route?: Route }) {
  const capacity = route ? routeCargoCapacity(data, state, route) : cargoCapacity(data, state);
  const used = cargoUsed(data, state.cargo);
  const carried: string[] = [];
  for (const [goodId, amount] of Object.entries(state.cargo)) {
    const good = data.goodById[goodId];
    const weight = Math.max(1, good?.weight ?? 1);
    for (let index = 0; index < amount * weight; index += 1) carried.push(goodId);
  }
  const displaySlots = Math.min(Math.max(capacity, used, 1), 16);
  const mode = route?.mode ?? (state.shipPortId === state.currentPortId ? 'sea' : 'land');
  return (
    <div className={`cargo-slot-strip ${used > capacity ? 'over' : ''}`} data-testid="cargo-slot-strip">
      <div className="cargo-slot-head">
        <RouteToken data={data} state={state} mode={mode} />
        <span>{route ? (route.mode === 'land' ? '수레 짐칸' : '배 창고') : '실은 짐'}</span>
        <strong>{used}/{capacity}</strong>
      </div>
      <div className="cargo-slots">
        {Array.from({ length: displaySlots }).map((_, index) => {
          const goodId = carried[index];
          return (
            <span key={`${goodId ?? 'empty'}-${index}`} className={goodId ? 'filled' : 'empty'}>
              {goodId ? <GoodIcon good={data.goodById[goodId]} /> : null}
            </span>
          );
        })}
      </div>
      {used > capacity && <p>수레에 다 안 실려요.</p>}
    </div>
  );
}

function generateMonthlyPrices(data: GameData, date: GameState['date']) {
  const prices: Record<string, Record<string, number>> = {};
  for (const port of data.ports) {
    prices[port.id] = {};
    for (const good of data.goods) {
      prices[port.id][good.id] = priceFor(data, port, good, date);
    }
  }
  return prices;
}

function cargoUsed(data: GameData, cargo: Record<string, number>) {
  return Object.entries(cargo).reduce((total, [goodId, amount]) => {
    const good = data.goodById[goodId];
    return total + (good?.weight ?? 1) * Math.max(0, amount);
  }, 0);
}

function cargoCapacity(data: GameData, state: GameState) {
  const shipCargo = state.shipPortId === state.currentPortId ? data.shipById[state.shipId]?.cargo ?? 0 : 0;
  const cartCargo = data.cartById[state.cartId]?.cargo ?? 0;
  return shipCargo + cartCargo;
}

function cartCargoCapacity(data: GameData, state: GameState) {
  return data.cartById[state.cartId]?.cargo ?? 0;
}

function seaCargoCapacity(data: GameData, state: GameState) {
  const shipCargo = data.shipById[state.shipId]?.cargo ?? 0;
  const cartLimit = Math.min(data.cartById[state.cartId]?.cargo ?? 0, Math.max(1, Math.floor(shipCargo * 0.5)));
  return shipCargo + cartLimit;
}

function routeCargoCapacity(data: GameData, state: GameState, route: Route) {
  return route.mode === 'land' ? cartCargoCapacity(data, state) : seaCargoCapacity(data, state);
}

function routeCargoLimitText(data: GameData, state: GameState, route: Route) {
  const cart = data.cartById[state.cartId];
  const ship = data.shipById[state.shipId];
  if (route.mode === 'land') return `땅길 짐칸 ${cart?.cargo ?? 0}칸`;
  const cartLimit = Math.min(cart?.cargo ?? 0, Math.max(1, Math.floor((ship?.cargo ?? 0) * 0.5)));
  return `배 창고 ${ship?.cargo ?? 0}칸 + 수레짐 ${cartLimit}칸`;
}

function shipCallEstimate(data: GameData, state: GameState) {
  const currentPort = data.portById[state.currentPortId];
  const berthPort = data.portById[state.shipPortId ?? ''];
  const hasSeaAccess = data.routes.some((route) => route.mode === 'sea' && (route.from === currentPort.id || route.to === currentPort.id));
  const seaRoute = data.routes.find((route) => route.mode === 'sea' && ((route.from === currentPort.id && route.to === berthPort?.id) || (route.to === currentPort.id && route.from === berthPort?.id)));
  const days = seaRoute?.days ?? 2;
  return {
    berthPort,
    hasSeaAccess,
    days,
    cost: 18 + days * 6
  };
}

function normalizeRecord(record: Record<string, number>) {
  return Object.fromEntries(Object.entries(record).filter(([, amount]) => amount > 0));
}

function advanceDays(data: GameData, state: GameState, days: number) {
  let date = { ...state.date, day: state.date.day + days };
  let monthlyPrices = state.monthlyPrices;
  let monthChanged = false;

  while (date.day > data.constants.calendar.daysPerMonth) {
    date = { ...date, day: date.day - data.constants.calendar.daysPerMonth, month: date.month + 1 };
    if (date.month > data.constants.calendar.monthsPerYear) {
      date = { ...date, month: 1, year: date.year + 1 };
    }
    monthChanged = true;
  }

  if (monthChanged) {
    monthlyPrices = generateMonthlyPrices(data, date);
  }

  return { date, monthlyPrices, monthChanged };
}

function monthNews(data: GameData, month: number) {
  const event = currentMonthEvent(data, month);
  return event ? { month, name: event.name, summary: event.summary } : undefined;
}

function saveKeyForSlot(data: GameData, slot: number) {
  return slot === 1 ? data.constants.save.key : `${data.constants.save.key}_slot_${slot}`;
}

function savedSlotState(data: GameData) {
  return {
    1: Boolean(localStorage.getItem(saveKeyForSlot(data, 1))),
    2: Boolean(localStorage.getItem(saveKeyForSlot(data, 2))),
    3: Boolean(localStorage.getItem(saveKeyForSlot(data, 3)))
  } as Record<number, boolean>;
}

function createInitialState(data: GameData): GameState {
  const start = data.constants.startingState;
  const date = { year: 1, month: start.month, day: start.day };
  const ship = data.shipById[start.shipId];
  const cart = data.cartById[start.cartId];
  return withPortDiscovery(data, normalizeState(data, {
    currentPortId: start.currentPortId ?? start.portId ?? 'busanpo',
    money: start.money,
    date,
    shipId: start.shipId,
    cartId: start.cartId,
    shipPortId: start.currentPortId ?? start.portId ?? 'busanpo',
    shipDurability: ship?.durability ?? 1,
    cartDurability: cart?.durability ?? 1,
    tools: {},
    companions: { park_seyeon: true, dad: true, mom: true },
    fleetName: '정우상단',
    permits: [...start.permits],
    cargo: { ...start.cargo },
    cargoCost: {},
    fame: emptyFame(),
    portTrust: {},
    discoveredIds: {},
    completedLedgerSeals: [],
    reputation: { ...start.reputation },
    skills: { ...start.skills },
    crew: { ...start.crew },
    completedQuests: [],
    activeQuestIds: FOUNDATION_QUEST_IDS,
    monthlyPrices: generateMonthlyPrices(data, date),
    economyVersion: PRICE_MODEL_VERSION,
    ledger: emptyLedger(),
    questProgress: {
      ...emptyQuestProgress(),
      visitedPorts: { [start.currentPortId ?? start.portId ?? 'busanpo']: true },
      ownedCarts: { [start.cartId]: true },
      ownedShips: { [start.shipId]: true }
    },
    questNotices: [],
    discoveryNotices: [],
    ledgerSealNotices: [],
    lastMonthNews: monthNews(data, date.month),
    log: ['먼저 시장에서 면포를 사보세요. 대구에 팔면 첫 장사를 배울 수 있습니다.'],
    lastAutosaveAt: new Date().toISOString(),
    tutorialStage: 'intro',
    completedTutorialSteps: [],
    activeTutorialDialogId: 'intro_001',
    isPausedForDialog: true,
    tutorialSkipped: false
  } as GameState), start.currentPortId ?? start.portId ?? 'busanpo');
}

function normalizeState(data: GameData, raw: GameState): GameState {
  const date = raw.date ?? { year: 1, month: data.constants.startingState.month, day: data.constants.startingState.day };
  const progress = raw.questProgress ?? emptyQuestProgress();
  const currentPortId = raw.currentPortId ?? data.constants.startingState.currentPortId ?? 'busanpo';
  const currentShipId = raw.shipId ?? data.constants.startingState.shipId;
  const currentCartId = raw.cartId ?? data.constants.startingState.cartId;
  const shouldRegeneratePrices = raw.economyVersion !== PRICE_MODEL_VERSION || !raw.monthlyPrices || Object.keys(raw.monthlyPrices).length === 0;
  const completedTutorialSteps = Array.isArray(raw.completedTutorialSteps) ? raw.completedTutorialSteps : [];
  const tutorialSkipped = Boolean(raw.tutorialSkipped);
  const activeTutorialDialogId = tutorialSkipped
    ? undefined
    : raw.activeTutorialDialogId ?? (completedTutorialSteps.length === 0 ? 'intro_001' : undefined);
  return {
    ...raw,
    currentPortId,
    date,
    shipId: currentShipId,
    cartId: currentCartId,
    shipPortId: raw.shipPortId && data.portById[raw.shipPortId] ? raw.shipPortId : currentPortId,
    shipDurability: raw.shipDurability ?? data.shipById[currentShipId]?.durability ?? 1,
    cartDurability: raw.cartDurability ?? data.cartById[currentCartId]?.durability ?? 1,
    tools: raw.tools ?? {},
    companions: raw.companions ?? {},
    fleetName: raw.fleetName ?? '정우상단',
    cargo: raw.cargo ?? {},
    cargoCost: raw.cargoCost ?? {},
    fame: normalizeFame(raw),
    portTrust: raw.portTrust ?? {},
    discoveredIds: raw.discoveredIds ?? {},
    completedLedgerSeals: raw.completedLedgerSeals ?? [],
    permits: raw.permits ?? [],
    completedQuests: raw.completedQuests ?? [],
    activeQuestIds: raw.activeQuestIds?.length ? [...new Set([...raw.activeQuestIds, ...FOUNDATION_QUEST_IDS])] : FOUNDATION_QUEST_IDS,
    monthlyPrices: shouldRegeneratePrices ? generateMonthlyPrices(data, date) : raw.monthlyPrices,
    economyVersion: PRICE_MODEL_VERSION,
    ledger: {
      transactions: raw.ledger?.transactions ?? [],
      travels: raw.ledger?.travels ?? [],
      fishing: raw.ledger?.fishing ?? []
    },
    questProgress: {
      purchasedGoods: progress.purchasedGoods ?? {},
      soldGoods: progress.soldGoods ?? {},
      deliveredGoods: progress.deliveredGoods ?? {},
      visitedPorts: { ...(progress.visitedPorts ?? {}), [currentPortId]: true },
      ownedCarts: { ...(progress.ownedCarts ?? {}), [currentCartId]: true },
      ownedShips: { ...(progress.ownedShips ?? {}), [currentShipId]: true },
      earnedMoney: progress.earnedMoney ?? 0,
      fishingCount: progress.fishingCount ?? 0,
      eventResolved: progress.eventResolved ?? {},
      repairedShips: progress.repairedShips ?? 0,
      combatSurvived: progress.combatSurvived ?? {}
    },
    questNotices: raw.questNotices ?? [],
    discoveryNotices: raw.discoveryNotices ?? [],
    ledgerSealNotices: raw.ledgerSealNotices ?? [],
    log: raw.log ?? [],
    lastMonthNews: raw.lastMonthNews ?? monthNews(data, date.month),
    tutorialStage: raw.tutorialStage ?? (tutorialSkipped ? 'skipped' : activeTutorialDialogId ? 'intro' : 'not_started'),
    completedTutorialSteps,
    activeTutorialDialogId,
    isPausedForDialog: Boolean(activeTutorialDialogId) && !tutorialSkipped && (raw.isPausedForDialog ?? true),
    tutorialSkipped
  };
}

function discoveryForPort(data: GameData, portId: string) {
  return data.discoveries.find((discovery) => discovery.portId === portId);
}

function withPortDiscovery(data: GameData, state: GameState, portId: string) {
  const discovery = discoveryForPort(data, portId);
  if (!discovery || state.discoveredIds[discovery.id]) return state;
  const reward = discovery.reward ?? {};
  const fameDelta = {
    merchant: reward.merchantFame ?? 0,
    exploration: reward.explorationFame ?? 0,
    guard: reward.guardFame ?? 0
  };
  const rewardLines = [
    ...(reward.money ? [`보상 ${money(reward.money)}`] : []),
    ...fameDeltaLines(fameDelta),
    ...(reward.portTrust ? [`${data.portById[portId]?.name ?? portId} 신뢰 +${reward.portTrust}`] : [])
  ];
  const notice: DiscoveryNotice = {
    id: uniqueId('discovery'),
    discoveryId: discovery.id,
    portId,
    name: discovery.name,
    description: discovery.description,
    iconAsset: discovery.iconAsset,
    rewardLines,
    hint: discovery.hint
  };
  let next = applyFameDelta({
    ...state,
    money: state.money + (reward.money ?? 0),
    discoveredIds: { ...state.discoveredIds, [discovery.id]: true },
    discoveryNotices: [...state.discoveryNotices, notice],
    log: addLog(state, `[발견] ${discovery.name}. ${rewardLines.join(', ')}`),
    lastAutosaveAt: new Date().toISOString()
  }, fameDelta);
  next = bumpPortTrust(next, portId, reward.portTrust ?? 1);
  return next;
}

async function loadGameData(): Promise<GameData> {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([key, file]) => {
      const response = await fetch(`/data/${file}`);
      if (!response.ok) throw new Error(`${file} 데이터를 불러오지 못했습니다.`);
      return [key, await response.json()] as const;
    })
  );
  const raw = Object.fromEntries(entries) as {
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
    assetManifest: GameData['assetManifest'];
    constants: GameData['constants'];
  };

  return {
    ...raw,
    portById: makeById(raw.ports),
    goodById: makeById(raw.goods),
    shipById: makeById(raw.ships),
    cartById: makeById(raw.carts),
    toolById: makeById(raw.tools),
    companionById: makeById(raw.companions),
    routeById: makeById(raw.routes),
    eventById: makeById(raw.events),
    portFlavorById: makeById(raw.portFlavors),
    discoveryById: makeById(raw.discoveries),
    ledgerSealById: makeById(raw.ledgerSeals),
    tutorialDialogueById: makeById(raw.tutorialDialogues)
  };
}

function availableRoutes(data: GameData, state: GameState) {
  return data.routes.filter((route) => route.from === state.currentPortId || route.to === state.currentPortId);
}

function routeDestination(route: Route, currentPortId: string) {
  return route.from === currentPortId ? route.to : route.from;
}

const FLEET_STAT_KEYS: Array<keyof FleetStats> = ['navigation', 'trade', 'fishing', 'guard', 'japanese', 'chinese'];

function emptyFleetStats(): FleetStats {
  return { navigation: 0, trade: 0, fishing: 0, guard: 0, japanese: 0, chinese: 0 };
}

function addStats(total: FleetStats, stats: Record<string, number> = {}) {
  for (const key of FLEET_STAT_KEYS) total[key] += stats[key] ?? 0;
}

function fleetStats(data: GameData, state: GameState): FleetStats {
  const total = emptyFleetStats();
  for (const [toolId, owned] of Object.entries(state.tools ?? {})) {
    if (owned) addStats(total, data.toolById[toolId]?.stats);
  }
  for (const [companionId, joined] of Object.entries(state.companions ?? {})) {
    if (joined) addStats(total, data.companionById[companionId]?.stats);
  }
  return total;
}

function companionSpeedBonus(data: GameData, state: GameState) {
  return Math.min(0.25, fleetStats(data, state).navigation * 0.04);
}

function effectiveRouteDays(data: GameData, state: GameState, route: Route) {
  return Math.max(1, Math.ceil(route.days * (1 - companionSpeedBonus(data, state))));
}

function tradeDealBonus(data: GameData, state: GameState) {
  return Math.min(0.08, (state.skills.trade ?? 0) * 0.005 + fleetStats(data, state).trade * 0.01);
}

function marketAveragePrice(data: GameData, state: GameState, good: Good) {
  const prices = data.ports.map((port) => state.monthlyPrices[port.id]?.[good.id] ?? good.basePrice);
  return Math.max(1, Math.round(prices.reduce((sum, price) => sum + price, 0) / Math.max(1, prices.length)));
}

function marketQuote(data: GameData, state: GameState, portId: string, good: Good): MarketQuote {
  const marketPrice = state.monthlyPrices[portId]?.[good.id] ?? good.basePrice;
  const taxRate = (good.taxRate ?? data.constants.economy.taxRateDefault ?? 0.03) + good.legalRisk * 0.01;
  const spreadRate = 0.105 + goodVolatility(good) * 0.025 + goodTier(good) * 0.008 + good.legalRisk * 0.008;
  const dealBonus = tradeDealBonus(data, state);
  const buyPrice = Math.max(1, Math.round(marketPrice * (1 + spreadRate + taxRate) * (1 - dealBonus)));
  const rawSellPrice = Math.max(1, Math.round(marketPrice * (1 - spreadRate - taxRate * 0.5) * (1 + dealBonus)));
  const minSamePortLoss = Math.max(1, Math.round(buyPrice * (0.035 + taxRate * 0.25)));
  const sellPrice = Math.min(rawSellPrice, Math.max(1, buyPrice - minSamePortLoss));
  const averagePrice = marketAveragePrice(data, state, good);
  const context = priceContextFor(data, data.portById[portId], good, state.date);
  return {
    marketPrice,
    buyPrice,
    sellPrice,
    averagePrice,
    averageDeltaPercent: Math.round(((marketPrice - averagePrice) / Math.max(1, averagePrice)) * 100),
    spreadRate,
    taxRate,
    relation: context.relation,
    reasons: context.reasons
  };
}

function guardRiskReduction(data: GameData, state: GameState) {
  return Math.min(2, Math.floor(fleetStats(data, state).guard / 2));
}

function displayedRouteRisk(data: GameData, state: GameState, route: Route) {
  return Math.max(1, route.risk - guardRiskReduction(data, state));
}

function effectiveSkillValue(data: GameData, state: GameState, skill: string) {
  const stats = fleetStats(data, state);
  const mapped = skill === 'combat' ? stats.guard : stats[skill as keyof FleetStats] ?? 0;
  return (state.skills[skill] ?? 0) + mapped;
}

function skillLabel(skill: string) {
  const labels: Record<string, string> = {
    navigation: '항해',
    trade: '교역',
    fishing: '어업',
    guard: '호위',
    combat: '호위',
    japanese: '왜어',
    chinese: '한문'
  };
  return labels[skill] ?? skill;
}

function averageCargoCost(state: GameState, goodId: string) {
  const owned = state.cargo[goodId] ?? 0;
  if (owned <= 0) return 0;
  return Math.round((state.cargoCost[goodId] ?? 0) / Math.max(1, owned));
}

function toolIconClass(tool: ToolItem) {
  return `tool-pixel tool-${tool.kind}`;
}

function sortedMarketGoods(data: GameData, state: GameState, port: Port, goods: Good[], buyHints: TradeHint[], sellHints: TradeHint[]) {
  const buyRank = new Map(buyHints.map((hint, index) => [hint.goodId, index]));
  const sellRank = new Map(sellHints.map((hint, index) => [hint.goodId, index]));
  const monthly = currentMonthEvent(data, state.date.month);
  return [...goods].sort((a, b) => {
    const aQuote = marketQuote(data, state, port.id, a);
    const bQuote = marketQuote(data, state, port.id, b);
    const aScore =
      (buyRank.has(a.id) ? 0 : 100) +
      (monthly?.trendGoods?.includes(a.id) ? -8 : 0) +
      (monthly?.officialDemandGoods?.includes(a.id) ? -7 : 0) +
      (port.produces.includes(a.id) ? 4 : 20) +
      (priceLabel(a, aQuote.marketPrice, aQuote.averagePrice).label === '저렴' ? 0 : 8) +
      (sellRank.has(a.id) ? 2 : 0) +
      (buyRank.get(a.id) ?? 0);
    const bScore =
      (buyRank.has(b.id) ? 0 : 100) +
      (monthly?.trendGoods?.includes(b.id) ? -8 : 0) +
      (monthly?.officialDemandGoods?.includes(b.id) ? -7 : 0) +
      (port.produces.includes(b.id) ? 4 : 20) +
      (priceLabel(b, bQuote.marketPrice, bQuote.averagePrice).label === '저렴' ? 0 : 8) +
      (sellRank.has(b.id) ? 2 : 0) +
      (buyRank.get(b.id) ?? 0);
    return aScore - bScore || a.basePrice - b.basePrice;
  });
}

function potentialBuyHintsForCurrentPort(data: GameData, state: GameState, limit = 3): TradeHint[] {
  const port = data.portById[state.currentPortId];
  const routes = availableRoutes(data, state);
  const goodPool = [...new Set([...port.produces, ...port.demands])]
    .map((id) => data.goodById[id])
    .filter(Boolean);

  const hints: TradeHint[] = [];
  for (const route of routes) {
    const toPortId = routeDestination(route, state.currentPortId);
    const toPort = data.portById[toPortId];
    if (!toPort) continue;
    for (const good of goodPool) {
      const buyQuote = marketQuote(data, state, state.currentPortId, good);
      const sellQuote = marketQuote(data, state, toPortId, good);
      const buyPrice = buyQuote.buyPrice;
      const sellPrice = sellQuote.sellPrice;
      const profitEach = sellPrice - buyPrice;
      if (profitEach <= 0) continue;
      hints.push({
        goodId: good.id,
        goodName: good.name,
        fromPortId: port.id,
        fromPortName: port.name,
        toPortId,
        toPortName: toPort.name,
        routeId: route.id,
        profitEach,
        buyPrice,
        sellPrice,
        reason: `${buyQuote.reasons.slice(0, 2).join(', ')} → ${sellQuote.reasons.slice(0, 2).join(', ')}`
      });
    }
  }

  return hints
    .sort((a, b) => b.profitEach - a.profitEach || b.sellPrice - a.sellPrice)
    .slice(0, limit);
}

function cargoSaleHintsForCurrentPort(data: GameData, state: GameState, limit = 3): TradeHint[] {
  const port = data.portById[state.currentPortId];
  const routes = availableRoutes(data, state);
  const ownedGoods = Object.entries(state.cargo)
    .filter(([, quantity]) => quantity > 0)
    .map(([goodId, quantity]) => ({ good: data.goodById[goodId], quantity }))
    .filter((entry) => Boolean(entry.good));

  const hints: TradeHint[] = [];
  for (const route of routes) {
    const toPortId = routeDestination(route, state.currentPortId);
    const toPort = data.portById[toPortId];
    if (!toPort) continue;
    for (const { good, quantity } of ownedGoods) {
      const avgCost = averageCargoCost(state, good.id);
      const fallbackCost = marketQuote(data, state, state.currentPortId, good).buyPrice;
      const purchaseCost = avgCost || fallbackCost;
      const sellQuote = marketQuote(data, state, toPortId, good);
      const sellPrice = sellQuote.sellPrice;
      const profitEach = sellPrice - purchaseCost;
      if (profitEach <= 0) continue;
      hints.push({
        goodId: good.id,
        goodName: good.name,
        fromPortId: port.id,
        fromPortName: port.name,
        toPortId,
        toPortName: toPort.name,
        routeId: route.id,
        profitEach,
        buyPrice: purchaseCost,
        sellPrice,
        quantity,
        totalProfit: profitEach * quantity,
        reason: `내가 산 값 ${money(purchaseCost)} · ${sellQuote.reasons.slice(0, 2).join(', ')}`
      });
    }
  }

  return hints
    .sort((a, b) => (b.totalProfit ?? b.profitEach) - (a.totalProfit ?? a.profitEach))
    .slice(0, limit);
}

function routeBlockedReason(data: GameData, state: GameState, route: Route) {
  if (route.permitRequired && !state.permits.includes(route.permitRequired)) return `${routeModeLabel(route)}에는 ${permitLabel(route.permitRequired)}이 필요해요.`;
  if (route.mode === 'sea' && !state.shipId) return '배가 있어야 해로를 이동할 수 있어요.';
  if (route.mode === 'land' && !state.cartId) return '수레나 지게가 있어야 육로를 이동할 수 있어요.';
  if (route.mode === 'sea' && state.shipPortId !== state.currentPortId) {
    const berth = data.portById[state.shipPortId ?? '']?.name ?? '정박지';
    return `내 배는 ${berth}에 정박해 있어요. 항구에서 배를 불러오세요.`;
  }
  const used = cargoUsed(data, state.cargo);
  const capacity = routeCargoCapacity(data, state, route);
  if (used > capacity) {
    return `${routeModeLabel(route)} 짐칸 ${capacity}칸을 넘었습니다.`;
  }
  return '';
}

function tideFor(data: GameData, day: number) {
  return data.constants.tideCycle[day % data.constants.tideCycle.length] ?? 'middle';
}

function selectEvent(data: GameData, state: GameState, route: Route) {
  const monthly = currentMonthEvent(data, state.date.month);
  const chance = clamp(
    data.constants.risk.baseEventChancePerTravelDay * route.days + data.constants.risk.riskLevelMultiplier * route.risk,
    0.12,
    0.85
  );
  const seed = hashNoise(`${state.date.year}-${state.date.month}-${state.date.day}-${route.id}-${state.money}`);
  const matching = data.events.filter((event) => {
    const hazard = event.trigger.routeHazard;
    const monthOk = !event.trigger.months || event.trigger.months.includes(state.date.month);
    const tideOk = !event.trigger.tide || tideFor(data, state.date.day) === event.trigger.tide;
    const draftOk = !event.trigger.shipDraftMin || (data.shipById[state.shipId]?.draft ?? 0) >= event.trigger.shipDraftMin;
    return hazard && route.hazards.includes(hazard) && monthOk && tideOk && draftOk;
  });
  const pool = matching.length > 0 ? matching : data.events.filter((event) => event.type === 'good_luck' || event.id.includes('wind'));
  const modifier = Math.max(...route.hazards.map((hazard) => monthly?.hazardModifiers?.[hazard] ?? 1), 1);
  const guardFactor = Math.max(0.7, 1 - fleetStats(data, state).guard * 0.04);
  if (pool.length === 0 || seed > chance * modifier * guardFactor) return undefined;
  return pool[Math.floor(seed * 1000) % pool.length];
}

function eventSfxKey(event: GameEvent): SfxKey {
  const hazard = event.trigger.routeHazard ?? '';
  if (event.id.includes('pirate') || hazard.includes('pirate')) return 'pirate';
  if (event.id.includes('bandit') || hazard.includes('bandit') || hazard.includes('tiger')) return 'bandit';
  return event.severity >= 2 || event.type === 'combat' ? 'danger' : 'page';
}

function applyEffects(data: GameData, state: GameState, effects: EffectSet = {}, travelMode?: Route['mode']) {
  const shipDurabilityDelta = travelMode === 'land' ? 0 : effects.durability ?? 0;
  const cartDurabilityDelta = (effects.cartDurability ?? 0) + (travelMode === 'land' ? effects.durability ?? 0 : 0);
  let next: GameState = {
    ...state,
    money: Math.max(0, state.money + (effects.money ?? 0)),
    shipDurability: clamp(state.shipDurability + shipDurabilityDelta, 0, data.shipById[state.shipId]?.durability ?? 1),
    cartDurability: clamp(state.cartDurability + cartDurabilityDelta, 0, data.cartById[state.cartId]?.durability ?? 1),
    crew: {
      ...state.crew,
      morale: clamp(state.crew.morale + (effects.morale ?? 0), 0, 10),
      fatigue: clamp(state.crew.fatigue + (effects.crewFatigue ?? 0), 0, 100)
    },
    reputation: {
      ...state.reputation,
      official: state.reputation.official + (effects.officialRep ?? 0),
      merchant: state.reputation.merchant + (effects.merchantRep ?? 0),
      fisher: state.reputation.fisher + (effects.fisherRep ?? 0),
      naval: state.reputation.naval + (effects.navalRep ?? 0),
      foreign: state.reputation.foreign + (effects.foreignRep ?? 0)
    },
    cargo: { ...state.cargo },
    cargoCost: { ...state.cargoCost }
  };
  next = applyFameDelta(next, {
    merchant: effects.merchantRep ?? 0,
    exploration: (effects.foreignRep ?? 0) + Math.max(0, effects.fisherRep ?? 0),
    guard: (effects.officialRep ?? 0) + (effects.navalRep ?? 0)
  });

  if (effects.moneyPercent) next = { ...next, money: Math.max(0, Math.round(next.money + next.money * effects.moneyPercent)) };

  if (effects.cargo) {
    for (const [goodId, amount] of Object.entries(effects.cargo)) {
      next.cargo[goodId] = Math.max(0, (next.cargo[goodId] ?? 0) + amount);
      if (amount < 0) {
        const avgCost = (next.cargoCost[goodId] ?? 0) / Math.max(1, (state.cargo[goodId] ?? 0));
        next.cargoCost[goodId] = Math.max(0, (next.cargoCost[goodId] ?? 0) - avgCost * Math.abs(amount));
      }
    }
  }

  if (effects.randomCargoLoss) {
    let remaining = effects.randomCargoLoss;
    for (const goodId of Object.keys(next.cargo)) {
      if (remaining <= 0) break;
      const loss = Math.min(next.cargo[goodId], remaining);
      const avgCost = (next.cargoCost[goodId] ?? 0) / Math.max(1, next.cargo[goodId]);
      next.cargo[goodId] -= loss;
      next.cargoCost[goodId] = Math.max(0, (next.cargoCost[goodId] ?? 0) - avgCost * loss);
      remaining -= loss;
    }
  }

  if (effects.days) {
    const advanced = advanceDays(data, next, effects.days);
    next = { ...next, date: advanced.date, monthlyPrices: advanced.monthlyPrices, lastMonthNews: advanced.monthChanged ? monthNews(data, advanced.date.month) : next.lastMonthNews };
  }

  return { ...next, cargo: normalizeRecord(next.cargo), cargoCost: normalizeRecord(next.cargoCost) };
}

function effectLines(data: GameData, before: GameState, after: GameState, effects?: EffectSet, travelMode?: Route['mode']) {
  const lines: string[] = [];
  const moneyDelta = after.money - before.money;
  const durabilityDelta = after.shipDurability - before.shipDurability;
  const cartDurabilityDelta = after.cartDurability - before.cartDurability;
  const moraleDelta = after.crew.morale - before.crew.morale;
  const fatigueDelta = after.crew.fatigue - before.crew.fatigue;
  const fameDelta = {
    merchant: after.fame.merchant - before.fame.merchant,
    exploration: after.fame.exploration - before.fame.exploration,
    guard: after.fame.guard - before.fame.guard
  };
  if (moneyDelta !== 0) lines.push(`돈 ${moneyDelta > 0 ? '+' : ''}${money(moneyDelta)}`);
  if (durabilityDelta !== 0) lines.push(`배 튼튼함 ${durabilityDelta > 0 ? '+' : ''}${durabilityDelta}`);
  if (cartDurabilityDelta !== 0) lines.push(`수레 튼튼함 ${cartDurabilityDelta > 0 ? '+' : ''}${cartDurabilityDelta}`);
  if (travelMode === 'land' && effects?.durability) lines.push('배는 정박지에 있어 손상되지 않았습니다.');
  if (moraleDelta !== 0) lines.push(`선원 사기 ${moraleDelta > 0 ? '+' : ''}${moraleDelta}`);
  if (fatigueDelta !== 0) lines.push(`선원 피로 ${fatigueDelta > 0 ? '+' : ''}${fatigueDelta}`);
  if (effects?.cargo) {
    for (const [goodId, amount] of Object.entries(effects.cargo)) {
      if (amount !== 0) lines.push(`${data.goodById[goodId]?.name ?? goodId} ${amount > 0 ? '+' : ''}${amount}개`);
    }
  }
  if (effects?.randomCargoLoss) lines.push(`짐 최대 ${effects.randomCargoLoss}개 손실`);
  if (effects?.days) lines.push(`시간 ${effects.days}일 소모`);
  lines.push(...fameDeltaLines(fameDelta));
  return lines.length > 0 ? lines : ['큰 손실 없이 지나갔습니다.'];
}

function canUseChoice(state: GameState, choice: EventChoice) {
  if (choice.requiresPermit && !state.permits.includes(choice.requiresPermit)) return false;
  if (!choice.requires) return true;
  return Object.entries(choice.requires).every(([goodId, amount]) => (state.cargo[goodId] ?? 0) >= amount);
}

function resolveChoiceEffects(data: GameData, state: GameState, event: GameEvent, choice: EventChoice, travelMode?: Route['mode']) {
  if (choice.startCombat && event.enemy) {
    const ship = data.shipById[state.shipId];
    const cart = data.cartById[state.cartId];
    const vehiclePower = travelMode === 'land' ? cart?.combat ?? 0 : (ship?.combat ?? 0) + (cart?.combat ?? 0);
    const playerPower = vehiclePower + effectiveSkillValue(data, state, 'combat') + Math.round(state.crew.morale / 2);
    const enemyPower = event.enemy.attack + Math.round(event.enemy.morale / 2);
    const roll = hashNoise(`${event.id}-${state.date.day}-${state.money}`) * 6;
    if (playerPower + roll >= enemyPower) {
      return {
        effects: { money: Math.round(event.enemy.lootPotential * 0.35), morale: 1, navalRep: 1 },
        result: `${event.enemy.name}을 물리쳤습니다. 작은 전리품을 얻었어요.`
      };
    }
    return {
      effects: { money: -Math.round(event.enemy.lootPotential * 0.25), durability: -10, randomCargoLoss: 2, morale: -2 },
      result: `${event.enemy.name}에게 밀렸지만 가까스로 빠져나왔습니다.`
    };
  }

  if (choice.random) {
    const roll = hashNoise(`${event.id}-${choice.label}-${state.date.month}-${state.date.day}`);
    let accumulated = 0;
    for (const branch of choice.random) {
      accumulated += branch.chance;
      if (roll <= accumulated) return { effects: branch.effects, result: branch.resultText ?? '결과가 장부에 기록되었습니다.' };
    }
  }

  if (choice.skillCheck) {
    const skill = effectiveSkillValue(data, state, choice.skillCheck.skill);
    const roll = Math.floor(hashNoise(`${event.id}-${choice.label}-${state.money}`) * 8) + 1;
    const success = skill + roll >= choice.skillCheck.target;
    return {
      effects: success ? choice.success : choice.failure,
      result: success ? `${skillLabel(choice.skillCheck.skill)} 판정에 성공했습니다.` : `${skillLabel(choice.skillCheck.skill)} 판정에 실패했습니다.`
    };
  }

  return { effects: choice.effects, result: '선택 결과가 반영되었습니다.' };
}

function questObjectiveDone(progress: QuestProgress, objective: Quest['objectives'][number]) {
  if (objective.type === 'buy' && objective.good && objective.at) {
    return (progress.purchasedGoods[objective.at]?.[objective.good] ?? 0) >= (objective.amount ?? 1);
  }
  if (objective.type === 'sell' && objective.good) {
    const ports = objective.at ? [objective.at] : objective.atAny ?? [];
    return countGoodsAt(progress.soldGoods, ports, objective.good) >= (objective.amount ?? 1);
  }
  if (objective.type === 'visit' && objective.ports) {
    return objective.ports.every((portId) => progress.visitedPorts[portId]);
  }
  if (objective.type === 'ownCart' && objective.cart) {
    return Boolean(progress.ownedCarts[objective.cart]);
  }
  if (objective.type === 'ownShip' && objective.ship) {
    return Boolean(progress.ownedShips[objective.ship]);
  }
  if (objective.type === 'deliver' && objective.goods && objective.at) {
    return Object.entries(objective.goods).every(
      ([goodId, amount]) => (progress.deliveredGoods[objective.at!]?.[goodId] ?? 0) >= amount
    );
  }
  if (objective.type === 'repairShip') {
    return progress.repairedShips >= (objective.count ?? 1);
  }
  if (objective.type === 'surviveCombat') {
    return (progress.combatSurvived[objective.enemyTag ?? 'combat'] ?? 0) >= (objective.count ?? 1);
  }
  if (objective.type === 'resolveEvent' && objective.event) {
    return (progress.eventResolved[objective.event] ?? 0) >= (objective.count ?? 1);
  }
  if ((objective.type === 'fishingCount' || objective.type === 'fish')) {
    return progress.fishingCount >= (objective.count ?? objective.amount ?? 1);
  }
  return false;
}

function questProgressLine(data: GameData, progress: QuestProgress, objective: Quest['objectives'][number]) {
  if (objective.type === 'buy' && objective.good && objective.at) {
    const done = progress.purchasedGoods[objective.at]?.[objective.good] ?? 0;
    return `구매: ${data.goodById[objective.good]?.name ?? objective.good} ${Math.min(done, objective.amount ?? 1)}/${objective.amount ?? 1}개 · ${data.portById[objective.at]?.name ?? objective.at}`;
  }
  if (objective.type === 'sell' && objective.good) {
    const ports = objective.at ? [objective.at] : objective.atAny ?? [];
    const done = countGoodsAt(progress.soldGoods, ports, objective.good);
    const place = ports.map((portId) => data.portById[portId]?.name ?? portId).join('/');
    return `판매: ${data.goodById[objective.good]?.name ?? objective.good} ${Math.min(done, objective.amount ?? 1)}/${objective.amount ?? 1}개 · ${place}`;
  }
  if (objective.type === 'visit' && objective.ports) {
    const done = objective.ports.filter((portId) => progress.visitedPorts[portId]).length;
    return `방문: ${done}/${objective.ports.length}곳 · ${objective.ports.map((portId) => data.portById[portId]?.name ?? portId).join('/')}`;
  }
  if (objective.type === 'ownCart' && objective.cart) {
    return `장비: ${data.cartById[objective.cart]?.name ?? objective.cart} ${progress.ownedCarts[objective.cart] ? '보유' : '미보유'}`;
  }
  if (objective.type === 'ownShip' && objective.ship) {
    return `장비: ${data.shipById[objective.ship]?.name ?? objective.ship} ${progress.ownedShips[objective.ship] ? '보유' : '미보유'}`;
  }
  if (objective.type === 'deliver' && objective.goods && objective.at) {
    const place = data.portById[objective.at]?.name ?? objective.at;
    const parts = Object.entries(objective.goods).map(([goodId, amount]) => {
      const done = progress.deliveredGoods[objective.at!]?.[goodId] ?? 0;
      return `${data.goodById[goodId]?.name ?? goodId} ${Math.min(done, amount)}/${amount}개`;
    });
    return `납품: ${parts.join(', ')} · ${place}`;
  }
  if (objective.type === 'repairShip') {
    return `수리: 선박 수리 ${Math.min(progress.repairedShips, objective.count ?? 1)}/${objective.count ?? 1}회`;
  }
  if (objective.type === 'surviveCombat') {
    const key = objective.enemyTag ?? 'combat';
    return `전투: ${key} 조우 생존 ${Math.min(progress.combatSurvived[key] ?? 0, objective.count ?? 1)}/${objective.count ?? 1}회`;
  }
  if (objective.type === 'resolveEvent' && objective.event) {
    return `사건: ${data.eventById[objective.event]?.name ?? objective.event} 해결 ${Math.min(progress.eventResolved[objective.event] ?? 0, objective.count ?? 1)}/${objective.count ?? 1}회`;
  }
  return objective.type;
}

function objectivePrimaryGood(objective: Quest['objectives'][number]) {
  return objective.good ?? Object.keys(objective.goods ?? {})[0];
}

function objectiveStatus(data: GameData, state: GameState, objective: Quest['objectives'][number]): ObjectiveStatus {
  const progress = state.questProgress;
  const target = objective.amount ?? objective.count ?? 1;
  const goodId = objectivePrimaryGood(objective);
  const goodName = goodId ? data.goodById[goodId]?.name ?? goodId : '';

  if (objective.type === 'buy' && objective.good && objective.at) {
    const current = progress.purchasedGoods[objective.at]?.[objective.good] ?? 0;
    const portName = data.portById[objective.at]?.name ?? objective.at;
    return {
      done: current >= target,
      current: Math.min(current, target),
      target,
      label: `${goodName} ${Math.min(current, target)}/${target}개`,
      iconGoodId: objective.good,
      nextAction: `${portName} 시장`,
      targetPortId: objective.at,
      targetTab: 'market'
    };
  }

  if (objective.type === 'sell' && objective.good) {
    const ports = objective.at ? [objective.at] : objective.atAny ?? [];
    const current = countGoodsAt(progress.soldGoods, ports, objective.good);
    const place = ports.map((portId) => data.portById[portId]?.name ?? portId).join('/');
    return {
      done: current >= target,
      current: Math.min(current, target),
      target,
      label: `${goodName} 판매 ${Math.min(current, target)}/${target}`,
      iconGoodId: objective.good,
      nextAction: place ? `${place} 시장` : '시장 가기',
      targetPortId: objective.at ?? ports[0],
      targetTab: state.currentPortId === (objective.at ?? ports[0]) || ports.includes(state.currentPortId) ? 'market' : 'map'
    };
  }

  if (objective.type === 'visit' && objective.ports) {
    const current = objective.ports.filter((portId) => progress.visitedPorts[portId]).length;
    const nextPortId = objective.ports.find((portId) => !progress.visitedPorts[portId]);
    return {
      done: current >= objective.ports.length,
      current,
      target: objective.ports.length,
      label: `방문 ${current}/${objective.ports.length}`,
      iconAsset: HUB_ICON.map,
      nextAction: nextPortId ? `${data.portById[nextPortId]?.name ?? nextPortId}로` : '지도 보기',
      targetPortId: nextPortId,
      targetTab: 'map'
    };
  }

  if (objective.type === 'ownCart' && objective.cart) {
    const done = Boolean(progress.ownedCarts[objective.cart]);
    return {
      done,
      current: done ? 1 : 0,
      target: 1,
      label: data.cartById[objective.cart]?.name ?? objective.cart,
      iconAsset: cartArtFor(data, data.cartById[objective.cart]),
      nextAction: '장비 보기',
      targetTab: 'vehicles'
    };
  }

  if (objective.type === 'ownShip' && objective.ship) {
    const done = Boolean(progress.ownedShips[objective.ship]);
    return {
      done,
      current: done ? 1 : 0,
      target: 1,
      label: data.shipById[objective.ship]?.name ?? objective.ship,
      iconAsset: shipArtFor(data, data.shipById[objective.ship]),
      nextAction: '장비 보기',
      targetTab: 'vehicles'
    };
  }

  if (objective.type === 'deliver' && objective.goods && objective.at) {
    const entries = Object.entries(objective.goods);
    const current = entries.reduce((sum, [id, amount]) => sum + Math.min(progress.deliveredGoods[objective.at!]?.[id] ?? 0, amount), 0);
    const deliverTarget = entries.reduce((sum, [, amount]) => sum + amount, 0);
    return {
      done: current >= deliverTarget,
      current,
      target: deliverTarget,
      label: `${goodName || '물품'} 납품 ${current}/${deliverTarget}`,
      iconGoodId: goodId,
      nextAction: state.currentPortId === objective.at ? '납품하기' : `${data.portById[objective.at]?.name ?? objective.at}로`,
      targetPortId: objective.at,
      targetTab: state.currentPortId === objective.at ? 'quests' : 'map'
    };
  }

  if (objective.type === 'repairShip') {
    const current = progress.repairedShips;
    return {
      done: current >= target,
      current: Math.min(current, target),
      target,
      label: `배 수리 ${Math.min(current, target)}/${target}`,
      iconAsset: shipArtFor(data, data.shipById[state.shipId]),
      nextAction: '조선소 가기',
      targetTab: 'vehicles'
    };
  }

  if (objective.type === 'resolveEvent' && objective.event) {
    const current = progress.eventResolved[objective.event] ?? 0;
    return {
      done: current >= target,
      current: Math.min(current, target),
      target,
      label: `${data.eventById[objective.event]?.name ?? objective.event} ${Math.min(current, target)}/${target}`,
      iconAsset: HUB_ICON.map,
      nextAction: '지도 보기',
      targetTab: 'map'
    };
  }

  if (objective.type === 'surviveCombat') {
    const key = objective.enemyTag ?? 'combat';
    const current = progress.combatSurvived[key] ?? 0;
    return {
      done: current >= target,
      current: Math.min(current, target),
      target,
      label: `위험 생존 ${Math.min(current, target)}/${target}`,
      iconAsset: HUB_ICON.map,
      nextAction: '위험한 길 준비',
      targetTab: 'map'
    };
  }

  if (objective.type === 'fishingCount' || objective.type === 'fish') {
    const current = progress.fishingCount;
    return {
      done: current >= target,
      current: Math.min(current, target),
      target,
      label: `어업 ${Math.min(current, target)}/${target}회`,
      iconGoodId: 'fresh_fish',
      nextAction: '어업하기',
      targetTab: 'port'
    };
  }

  if ((objective.type === 'permit' || objective.type === 'ownPermit') && objective.permit) {
    const done = state.permits.includes(objective.permit);
    return {
      done,
      current: done ? 1 : 0,
      target: 1,
      label: '허가장',
      iconAsset: HUB_ICON.office,
      nextAction: '관청 가기',
      targetTab: 'quests'
    };
  }

  const done = questObjectiveDone(progress, objective);
  return {
    done,
    current: done ? 1 : 0,
    target: 1,
    label: objective.type,
    iconGoodId: goodId,
    nextAction: '확인하기',
    targetTab: 'quests'
  };
}

function openDeliveryObjective(state: GameState, quest: Quest) {
  return quest.objectives.find(
    (objective) => objective.type === 'deliver' && objective.at === state.currentPortId && !questObjectiveDone(state.questProgress, objective)
  );
}

function missingDeliveryGoods(state: GameState, objective?: Quest['objectives'][number]) {
  if (!objective?.goods || !objective.at) return [];
  return Object.entries(objective.goods)
    .map(([goodId, amount]) => {
      const delivered = state.questProgress.deliveredGoods[objective.at!]?.[goodId] ?? 0;
      const needed = Math.max(0, amount - delivered);
      const owned = state.cargo[goodId] ?? 0;
      return { goodId, needed, owned };
    })
    .filter((item) => item.needed > item.owned);
}

function ledgerSealRequirementStatus(data: GameData, state: GameState, requirement: LedgerSeal['requirements'][number]) {
  if (requirement.type === 'visit') {
    const ports = requirement.portIds ?? [];
    const current = ports.filter((portId) => state.questProgress.visitedPorts[portId]).length;
    return { done: current >= ports.length, current, target: ports.length, label: `방문 ${current}/${ports.length}` };
  }
  if (requirement.type === 'sell') {
    const target = requirement.quantity ?? 1;
    const goodIds = requirement.goodIds ?? [];
    const current = Object.values(state.questProgress.soldGoods).reduce((sum, goods) => (
      sum + goodIds.reduce((subtotal, goodId) => subtotal + (goods[goodId] ?? 0), 0)
    ), 0);
    return { done: current >= target, current: Math.min(current, target), target, label: `판매 ${Math.min(current, target)}/${target}` };
  }
  if (requirement.type === 'resolveEvent') {
    const target = requirement.count ?? 1;
    const tags = requirement.eventTags ?? [];
    const current = Object.entries(state.questProgress.eventResolved).reduce((sum, [eventId, amount]) => {
      const event = data.eventById[eventId];
      const text = `${eventId} ${event?.type ?? ''} ${event?.trigger.routeHazard ?? ''} ${event?.name ?? ''}`;
      return sum + (tags.some((tag) => text.includes(tag)) ? amount : 0);
    }, 0);
    return { done: current >= target, current: Math.min(current, target), target, label: `사건 ${Math.min(current, target)}/${target}` };
  }
  if (requirement.type === 'portTrust') {
    const ports = requirement.portIds ?? [];
    const target = requirement.minTrust ?? 1;
    const current = ports.length ? Math.min(...ports.map((portId) => state.portTrust[portId] ?? 0)) : 0;
    return { done: current >= target, current: Math.min(current, target), target, label: `항구 신뢰 ${Math.min(current, target)}/${target}` };
  }
  if (requirement.type === 'ownShip' && requirement.shipId) {
    const done = Boolean(state.questProgress.ownedShips[requirement.shipId] || state.shipId === requirement.shipId);
    return { done, current: done ? 1 : 0, target: 1, label: data.shipById[requirement.shipId]?.name ?? requirement.shipId };
  }
  if (requirement.type === 'ownTool' && requirement.toolId) {
    const done = Boolean(state.tools[requirement.toolId]);
    return { done, current: done ? 1 : 0, target: 1, label: data.toolById[requirement.toolId]?.name ?? requirement.toolId };
  }
  if (requirement.type === 'permit' && requirement.permit) {
    const done = state.permits.includes(requirement.permit);
    return { done, current: done ? 1 : 0, target: 1, label: '허가장' };
  }
  return { done: false, current: 0, target: 1, label: requirement.type };
}

function ledgerSealDone(data: GameData, state: GameState, seal: LedgerSeal) {
  return seal.requirements.every((requirement) => ledgerSealRequirementStatus(data, state, requirement).done);
}

function applyLedgerSealReward(state: GameState, seal: LedgerSeal) {
  return applyFameDelta({
    ...state,
    money: state.money + (seal.reward.money ?? 0)
  }, {
    merchant: seal.reward.merchantFame ?? 0,
    exploration: seal.reward.explorationFame ?? 0,
    guard: seal.reward.guardFame ?? 0
  });
}

function checkLedgerSealCompletion(data: GameData, state: GameState): GameState {
  let next = state;
  for (const seal of data.ledgerSeals) {
    if (next.completedLedgerSeals.includes(seal.id)) continue;
    if (!ledgerSealDone(data, next, seal)) continue;
    const rewardLines = [
      ...(seal.reward.money ? [`보상 ${money(seal.reward.money)}`] : []),
      ...fameDeltaLines({
        merchant: seal.reward.merchantFame ?? 0,
        exploration: seal.reward.explorationFame ?? 0,
        guard: seal.reward.guardFame ?? 0
      })
    ];
    const notice: QuestCompletionNotice = {
      id: uniqueId('seal'),
      questId: seal.id,
      questName: seal.name,
      summary: `${seal.name} 조각을 완성했습니다.`,
      rewardLines,
      nextHint: seal.nextHint
    };
    next = applyLedgerSealReward({
      ...next,
      completedLedgerSeals: [...next.completedLedgerSeals, seal.id],
      ledgerSealNotices: [...next.ledgerSealNotices, notice],
      log: addLog(next, `${seal.name} 완성. ${rewardLines.join(', ')}`)
    }, seal);
  }
  return next;
}

function nextHintForQuest(questId: string) {
  if (questId === 'tutorial_first_trade') return '다음 목표: 소금을 사서 대구 같은 내륙 도시에서 팔아보세요.';
  if (questId === 'salt_to_daegu') return '다음 목표: 손수레나 짐말을 사서 더 많은 짐을 실어보세요.';
  if (questId === 'fish_for_inland') return '다음 목표: 통영(통제영) 가는 길을 열고 제주로 갈 준비를 해보세요.';
  if (questId === 'buy_handcart') return '다음 목표: 손수레로 짐칸을 늘렸으니 남해 길을 살펴보세요.';
  if (questId === 'south_sea_route') return '다음 목표: 어선이나 더 튼튼한 배를 준비하고 제주 납품을 노려보세요.';
  if (questId === 'jeju_delivery') return '다음 목표: 인삼과 면포를 준비해 부산(부산포) 왜관 허가를 받아보세요.';
  if (questId === 'waegwan_pass_intro') return '다음 목표: 허가장이 생겼습니다. 부산(부산포)에서 쓰시마(대마도) 가는 길을 확인해보세요.';
  return '다음 목표: 지도에서 새 교역로를 골라보세요.';
}

function rewardLines(quest: Quest) {
  const lines: string[] = [];
  if (quest.rewards.money) lines.push(`보상: ${money(quest.rewards.money)}`);
  if (quest.rewards.merchantRep) lines.push(`상인 이름값 +${quest.rewards.merchantRep}`);
  if (quest.rewards.fisherRep) lines.push(`어민 평판 +${quest.rewards.fisherRep}`);
  if (quest.rewards.officialRep) lines.push(`관아 평판 +${quest.rewards.officialRep}`);
  if (quest.rewards.navalRep) lines.push(`수군 평판 +${quest.rewards.navalRep}`);
  if (quest.rewards.foreignRep) lines.push(`외국 교역 평판 +${quest.rewards.foreignRep}`);
  if (quest.rewards.permit) lines.push('허가장 획득');
  return lines;
}

function rewardItemsForQuest(quest?: Quest): QuestRewardItem[] {
  if (!quest) return [];
  const items: QuestRewardItem[] = [];
  if (quest.rewards.money) items.push({ label: '돈', value: money(quest.rewards.money), tone: 'money', goodId: 'silver' });
  if (quest.rewards.merchantRep) items.push({ label: '상인 이름값', value: `+${quest.rewards.merchantRep}`, tone: 'rep', iconAsset: HUB_ICON.market });
  if (quest.rewards.fisherRep) items.push({ label: '어민 평판', value: `+${quest.rewards.fisherRep}`, tone: 'rep', goodId: 'fresh_fish' });
  if (quest.rewards.officialRep) items.push({ label: '관아 평판', value: `+${quest.rewards.officialRep}`, tone: 'rep', iconAsset: HUB_ICON.office });
  if (quest.rewards.navalRep) items.push({ label: '수군 평판', value: `+${quest.rewards.navalRep}`, tone: 'rep', iconAsset: HUB_ICON.map });
  if (quest.rewards.foreignRep) items.push({ label: '외국 평판', value: `+${quest.rewards.foreignRep}`, tone: 'rep', iconAsset: HUB_ICON.office });
  if (quest.rewards.navigationXp) items.push({ label: '항해술', value: `+${quest.rewards.navigationXp}`, tone: 'skill', iconAsset: HUB_ICON.map });
  if (quest.rewards.permit) items.push({ label: '허가장', value: '획득', tone: 'permit', iconAsset: HUB_ICON.office });
  return items;
}

function nextGoalForQuest(data: GameData, questId: string): NextQuestGoal {
  if (questId === 'tutorial_first_trade') {
    return { title: '소금 장사', text: '소금은 산길을 넘어 내륙에서 값이 좋아요.', action: '시장 보기', tab: 'market', goodId: 'salt' };
  }
  if (questId === 'salt_to_daegu') {
    return { title: '손수레 목표', text: '짐칸이 늘면 한 번에 더 많이 실을 수 있어요.', action: '장비 보기', tab: 'vehicles', iconAsset: cartArtFor(data, data.cartById.handcart) };
  }
  if (questId === 'fish_for_inland') {
    return { title: '통영(통제영) 가는 길', text: '남해 길을 열면 건어물 장사가 넓어져요.', action: '지도 보기', tab: 'map', iconAsset: HUB_ICON.map };
  }
  if (questId === 'buy_handcart') {
    return { title: '남해 방문', text: '늘어난 짐칸으로 통영(통제영)과 여수를 둘러보세요.', action: '지도 보기', tab: 'map', iconAsset: HUB_ICON.map };
  }
  if (questId === 'south_sea_route') {
    return { title: '어선 준비', text: '제주로 가기 전 배와 수리비를 챙기세요.', action: '장비 보기', tab: 'vehicles', iconAsset: shipArtFor(data, data.shipById.fishing_boat ?? data.ships[1]) };
  }
  if (questId === 'jeju_delivery') {
    return { title: '왜관 허가', text: '면포와 인삼을 준비해 쓰시마(대마도) 허가를 노려보세요.', action: '의뢰 보기', tab: 'quests', goodId: 'ginseng' };
  }
  if (questId === 'waegwan_pass_intro') {
    return { title: '쓰시마(대마도) 가는 길', text: '허가장을 들고 부산(부산포)에서 바깥 바닷길을 확인하세요.', action: '지도 보기', tab: 'map', iconAsset: HUB_ICON.map };
  }
  return { title: '새 교역로', text: '지도에서 다음 목적지를 골라보세요.', action: '지도 보기', tab: 'map', iconAsset: HUB_ICON.map };
}

function applyQuestRewards(state: GameState, quest: Quest) {
  const next = {
    ...state,
    money: state.money + (quest.rewards.money ?? 0),
    permits: quest.rewards.permit && !state.permits.includes(quest.rewards.permit)
      ? [...state.permits, quest.rewards.permit]
      : state.permits,
    skills: {
      ...state.skills,
      navigation: (state.skills.navigation ?? 0) + (quest.rewards.navigationXp ?? 0)
    },
    reputation: {
      ...state.reputation,
      merchant: state.reputation.merchant + (quest.rewards.merchantRep ?? 0),
      fisher: state.reputation.fisher + (quest.rewards.fisherRep ?? 0),
      official: state.reputation.official + (quest.rewards.officialRep ?? 0),
      naval: state.reputation.naval + (quest.rewards.navalRep ?? 0),
      foreign: state.reputation.foreign + (quest.rewards.foreignRep ?? 0)
    }
  };
  return applyFameDelta(next, {
    merchant: (quest.rewards.merchantRep ?? 0) + (quest.rewards.fisherRep ?? 0) + Math.max(0, quest.rewards.foreignRep ?? 0),
    exploration: Math.max(0, quest.rewards.foreignRep ?? 0) + (quest.rewards.navigationXp ?? 0),
    guard: (quest.rewards.officialRep ?? 0) + (quest.rewards.navalRep ?? 0)
  });
}

function checkQuestCompletion(data: GameData, state: GameState): GameState {
  let next = state;
  for (const questId of state.activeQuestIds) {
    if (next.completedQuests.includes(questId)) continue;
    const quest = data.quests.find((item) => item.id === questId);
    if (!quest) continue;
    const done = quest.objectives.every((objective) => objectiveStatus(data, next, objective).done);
    if (!done) continue;
    const notice: QuestCompletionNotice = {
      id: uniqueId('quest'),
      questId: quest.id,
      questName: quest.name,
      summary: `${quest.name} 완료! ${quest.description}`,
      rewardLines: rewardLines(quest),
      nextHint: nextHintForQuest(quest.id)
    };
    next = applyQuestRewards({
      ...next,
      completedQuests: [...next.completedQuests, quest.id],
      questNotices: [...next.questNotices, notice],
      log: addLog(next, `${quest.name} 의뢰 완료. ${notice.rewardLines.join(', ')}`)
    }, quest);
  }
  return next;
}

function recordBuy(data: GameData, state: GameState, good: Good, quantity: number, unitPrice: number) {
  const port = data.portById[state.currentPortId];
  const total = unitPrice * quantity;
  const record: TransactionRecord = {
    id: uniqueId('buy'),
    type: 'buy',
    goodId: good.id,
    goodName: good.name,
    portId: port.id,
    portName: port.name,
    quantity,
    unitPrice,
    total,
    date: state.date
  };
  return checkQuestCompletion(data, {
    ...state,
    money: state.money - total,
    cargo: { ...state.cargo, [good.id]: (state.cargo[good.id] ?? 0) + quantity },
    cargoCost: { ...state.cargoCost, [good.id]: (state.cargoCost[good.id] ?? 0) + total },
    ledger: { ...state.ledger, transactions: [record, ...state.ledger.transactions].slice(0, 60) },
    questProgress: {
      ...state.questProgress,
      purchasedGoods: addNestedCount(state.questProgress.purchasedGoods, port.id, good.id, quantity)
    },
    log: addLog(state, `${port.name}에서 ${good.name} ${quantity}개를 ${money(total)}에 샀습니다.`),
    lastAutosaveAt: new Date().toISOString()
  });
}

function recordSell(data: GameData, state: GameState, good: Good, quantity: number, unitPrice: number) {
  const port = data.portById[state.currentPortId];
  const total = unitPrice * quantity;
  const owned = state.cargo[good.id] ?? 0;
  const avgCost = (state.cargoCost[good.id] ?? 0) / Math.max(1, owned);
  const removedCost = avgCost * quantity;
  const profit = Math.round(total - removedCost);
  const record: TransactionRecord = {
    id: uniqueId('sell'),
    type: 'sell',
    goodId: good.id,
    goodName: good.name,
    portId: port.id,
    portName: port.name,
    quantity,
    unitPrice,
    total,
    profit,
    date: state.date
  };
  let nextState: GameState = {
    ...state,
    money: state.money + total,
    cargo: normalizeRecord({ ...state.cargo, [good.id]: owned - quantity }),
    cargoCost: normalizeRecord({ ...state.cargoCost, [good.id]: Math.max(0, (state.cargoCost[good.id] ?? 0) - removedCost) }),
    ledger: { ...state.ledger, transactions: [record, ...state.ledger.transactions].slice(0, 60) },
    questProgress: {
      ...state.questProgress,
      soldGoods: addNestedCount(state.questProgress.soldGoods, port.id, good.id, quantity),
      earnedMoney: state.questProgress.earnedMoney + Math.max(0, profit)
    },
    log: addLog(state, `${port.name}에서 ${good.name} ${quantity}개를 ${money(total)}에 팔았습니다. 손익 ${profit >= 0 ? '+' : ''}${money(profit)}.`),
    lastAutosaveAt: new Date().toISOString()
  };
  if (profit > 0) {
    nextState = applyFameDelta(nextState, { merchant: 1 });
    nextState = bumpPortTrust(nextState, port.id, 1);
  }
  return checkQuestCompletion(data, nextState);
}

export default function App() {
  const [data, setData] = useState<GameData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<Tab>('port');
  const [toast, setToast] = useState<Toast | null>(null);
  const [savedAvailable, setSavedAvailable] = useState(false);
  const [saveSlot, setSaveSlot] = useState(1);
  const [savedSlots, setSavedSlots] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });
  const [travelAnimation, setTravelAnimation] = useState<TravelAnimation | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [marketFocusGoodId, setMarketFocusGoodId] = useState('');
  const [equipmentNotice, setEquipmentNotice] = useState<EquipmentNotice | null>(null);
  const [fishingSession, setFishingSession] = useState<FishingSession | null>(null);
  const audioScene = state?.pendingEventId || state?.lastEventResult
    ? 'danger'
    : tab === 'map'
      ? 'map'
      : tab === 'market'
        ? 'market'
        : tab === 'quests'
          ? 'office'
          : tab === 'vehicles'
            ? 'shipyard'
            : tab === 'cargo' || tab === 'ledger'
              ? 'tavern'
              : 'port';
  const audio = useGameAudio(audioScene);
  const tutorialDialog = data && state ? currentTutorialStoryStep(data, state) : undefined;
  const inputPaused = data && state ? tutorialIsPaused(data, state) : false;
  const activeTutorialHighlight = data && state ? tutorialHighlightTarget(data, state) : undefined;

  function blockForTutorial() {
    if (!inputPaused) return false;
    if (state && (fishingSession || state.pendingEventId || state.lastEventResult || state.discoveryNotices[0] || state.questNotices[0] || state.ledgerSealNotices[0] || equipmentNotice)) return false;
    showToast({ tone: 'plain', text: '바람이 이야기를 먼저 들어볼까요?' });
    return true;
  }

  useEffect(() => {
    loadGameData()
      .then((loaded) => {
        setData(loaded);
        const slots = savedSlotState(loaded);
        setSavedSlots(slots);
        setSavedAvailable(slots[1]);
      })
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : '데이터 로딩 오류'));
  }, []);

  useEffect(() => {
    if (!data || !state) return;
    localStorage.setItem(saveKeyForSlot(data, saveSlot), JSON.stringify(state));
    const slots = savedSlotState(data);
    setSavedSlots(slots);
    setSavedAvailable(slots[saveSlot]);
  }, [data, state, saveSlot]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!state?.questNotices[0]) return;
    audio.playSfx('quest');
  }, [state?.questNotices[0]?.id]);

  useEffect(() => {
    if (!state?.discoveryNotices[0]) return;
    audio.playSfx('reward');
  }, [state?.discoveryNotices[0]?.id]);

  const context = useMemo(() => {
    if (!data || !state) return null;
    const port = data.portById[state.currentPortId];
    return {
      port,
      monthly: currentMonthEvent(data, state.date.month),
      ship: data.shipById[state.shipId],
      cart: data.cartById[state.cartId],
      usedCargo: cargoUsed(data, state.cargo),
      capacity: cargoCapacity(data, state),
      routes: availableRoutes(data, state)
    };
  }, [data, state]);

  function showToast(nextToast: Toast) {
    if (nextToast.tone === 'warn') audio.playSfx('error');
    setToast(nextToast);
  }

  function navigate(nextTab: Tab) {
    if (blockForTutorial()) return;
    const tabSfx: Partial<Record<Tab, SfxKey>> = {
      port: 'arrive',
      market: 'door',
      map: 'page',
      cargo: 'page',
      quests: 'page',
      vehicles: 'repair',
      ledger: 'page'
    };
    audio.playSfx(tabSfx[nextTab] ?? 'click');
    setTab(nextTab);
    if (data) setState((previous) => previous ? tutorialAfterOpenTab(data, previous, nextTab) : previous);
  }

  function commit(next: GameState, toastMessage?: Toast) {
    setState(checkLedgerSealCompletion(data!, checkQuestCompletion(data!, next)));
    if (toastMessage) showToast(toastMessage);
  }

  function openSellHint(hint: TradeHint) {
    audio.playSfx('click');
    setSelectedRouteId(hint.routeId);
    setTab('map');
  }

  function openBuyHint(hint: TradeHint) {
    audio.playSfx('click');
    setMarketFocusGoodId(hint.goodId);
    setTab('market');
  }

  function startNewGame() {
    if (!data) return;
    if (savedSlots[saveSlot] && !window.confirm(`${saveSlot}번 저장에 장부가 있습니다. 새 장사를 시작할까요?`)) return;
    audio.playSfx('reward');
    setState(createInitialState(data));
    setTab('port');
    setSavedAvailable(true);
    setSavedSlots({ ...savedSlots, [saveSlot]: true });
    showToast({ tone: 'good', text: '새 장사를 시작했습니다.' });
  }

  function continueGame() {
    if (!data) return;
    audio.playSfx('click');
    const raw = localStorage.getItem(saveKeyForSlot(data, saveSlot));
    if (!raw) {
      showToast({ tone: 'warn', text: '저장된 장부가 없습니다.' });
      return;
    }
    try {
      setState(normalizeState(data, JSON.parse(raw) as GameState));
      setTab('port');
      showToast({ tone: 'good', text: '저장된 장부를 불러왔습니다.' });
    } catch {
      showToast({ tone: 'warn', text: '저장된 장부를 읽지 못했습니다.' });
    }
  }

  function advanceTutorialStory(dialog: TutorialDialogue) {
    if (!data || !state) return;
    audio.playSfx('page');
    setState(completeTutorialDialog(data, state, dialog));
  }

  function skipTutorialStory() {
    if (!state) return;
    audio.playSfx('click');
    setState(skipTutorial(state));
  }

  function buyGood(good: Good, quantity: number) {
    if (!data || !state) return;
    if (blockForTutorial()) return;
    const qty = Math.max(1, Math.floor(quantity));
    const price = marketQuote(data, state, state.currentPortId, good).buyPrice;
    const nextUsed = cargoUsed(data, state.cargo) + good.weight * qty;
    if (state.money < price * qty) return showToast({ tone: 'warn', text: '돈이 부족합니다.' });
    if (nextUsed > cargoCapacity(data, state)) return showToast({ tone: 'warn', text: '짐칸이 부족합니다.' });
    audio.playSfx('buy');
    const bought = recordBuy(data, state, good, qty, price);
    commit(good.id === 'cotton_cloth' ? queueTutorialDialog(data, bought, 'bought_first_001') : bought, { tone: 'good', text: `${good.name} ${qty}개를 샀습니다.` });
  }

  function sellGood(good: Good, quantity: number) {
    if (!data || !state) return;
    if (blockForTutorial()) return;
    const qty = Math.max(1, Math.floor(quantity));
    if ((state.cargo[good.id] ?? 0) < qty) return showToast({ tone: 'warn', text: '팔 수량이 부족합니다.' });
    const price = marketQuote(data, state, state.currentPortId, good).sellPrice;
    audio.playSfx('sell');
    const sold = recordSell(data, state, good, qty, price);
    commit(good.id === 'cotton_cloth' && state.currentPortId === 'daegu' ? queueTutorialDialog(data, sold, 'profit_first_001') : sold, { tone: 'good', text: `${good.name} ${qty}개를 팔았습니다.` });
  }

  function inspectMarketGood(good: Good) {
    if (!data || !state || state.tutorialSkipped || state.activeTutorialDialogId) return;
    if (good.id === 'cotton_cloth' && state.tutorialStage === 'inspect_good') {
      setState(queueTutorialDialog(data, state, 'buy_first_001'));
    }
  }

  function travel(route: Route) {
    if (!data || !state) return;
    if (blockForTutorial()) return;
    if (travelAnimation) return showToast({ tone: 'plain', text: '이미 이동 중입니다.' });
    const blocked = routeBlockedReason(data, state, route);
    if (blocked) return showToast({ tone: 'warn', text: blocked });
    const fromPort = data.portById[state.currentPortId];
    const destinationId = routeDestination(route, state.currentPortId);
    const destination = data.portById[destinationId];
    audio.playSfx(route.mode === 'land' ? 'cart' : 'depart');
    setTab('map');
    setSelectedRouteId(route.id);
    setTravelAnimation({ routeId: route.id, fromPortId: fromPort.id, toPortId: destination.id, mode: route.mode });
    window.setTimeout(() => {
      completeTravel(route, fromPort.id);
      setTravelAnimation(null);
    }, 1000);
  }

  function completeTravel(route: Route, expectedFromPortId: string) {
    if (!data || !state) return;
    if (state.currentPortId !== expectedFromPortId) return;
    const fromPort = data.portById[state.currentPortId];
    const destinationId = routeDestination(route, state.currentPortId);
    const destination = data.portById[destinationId];
    const travelDays = effectiveRouteDays(data, state, route);
    const advanced = advanceDays(data, state, travelDays);
    const temp: GameState = withPortDiscovery(data, {
      ...state,
      currentPortId: destinationId,
      shipPortId: route.mode === 'sea' ? destinationId : state.shipPortId,
      date: advanced.date,
      monthlyPrices: advanced.monthlyPrices,
      crew: { ...state.crew, fatigue: clamp(state.crew.fatigue + route.risk, 0, 100) },
      questProgress: {
        ...state.questProgress,
        visitedPorts: { ...state.questProgress.visitedPorts, [destinationId]: true }
      }
    }, destinationId);
    const event = selectEvent(data, temp, route);
    const travelRecord: TravelRecord = {
      id: uniqueId('travel'),
      fromPortId: fromPort.id,
      fromPortName: fromPort.name,
      toPortId: destination.id,
      toPortName: destination.name,
      routeId: route.id,
      mode: route.mode,
      days: travelDays,
      risk: route.risk,
      eventId: event?.id,
      eventName: event?.name,
      date: advanced.date
    };
    let next: GameState = {
      ...temp,
      pendingEventId: event?.id,
      lastTravelRouteId: route.id,
      lastMonthNews: advanced.monthChanged ? monthNews(data, advanced.date.month) : state.lastMonthNews,
      ledger: { ...state.ledger, travels: [travelRecord, ...state.ledger.travels].slice(0, 40) },
      log: addLog(state, `${destination.name}에 도착했습니다. ${travelDays}일이 지났습니다.${event ? ` ${event.name} 발생.` : ''}`),
      lastAutosaveAt: new Date().toISOString()
    };
    if (destination.id === 'daegu') next = queueTutorialDialog(data, next, 'arrived_first_001');
    audio.playSfx(event ? eventSfxKey(event) : 'arrive');
    commit(next, { tone: event ? 'warn' : 'good', text: event ? `${event.name}이 발생했습니다.` : '무사히 도착했습니다.' });
  }

  function resolveEvent(choice: EventChoice) {
    if (!data || !state?.pendingEventId) return;
    if (blockForTutorial()) return;
    const event = data.eventById[state.pendingEventId];
    const travelMode = state.lastTravelRouteId ? data.routeById[state.lastTravelRouteId]?.mode : undefined;
    if (!canUseChoice(state, choice)) return showToast({ tone: 'warn', text: '필요한 물품이 부족합니다.' });
    audio.playSfx(event.type === 'combat' || event.severity >= 2 ? eventSfxKey(event) : 'click');
    const before = state;
    const resolved = resolveChoiceEffects(data, state, event, choice, travelMode);
    const eventFameDelta = event.type === 'combat' || event.severity >= 2 ? { guard: 1 } : {};
    const after = applyFameDelta(applyEffects(data, state, resolved.effects, travelMode), eventFameDelta);
    const combatTag = event.type === 'combat'
      ? event.id.includes('pirate') || event.enemy?.name.includes('해적') ? 'pirate' : 'combat'
      : '';
    const next: GameState = {
      ...after,
      pendingEventId: undefined,
      lastEventResult: {
        title: event.name,
        description: event.text,
        result: resolved.result,
        lines: effectLines(data, before, after, resolved.effects, travelMode),
        fameDelta: eventFameDelta,
        portTrustDelta: event.severity >= 2 ? { [after.currentPortId]: 1 } : undefined,
        companionReaction: companionEventResult(data, state, event)
      },
      questProgress: {
        ...after.questProgress,
        eventResolved: {
          ...after.questProgress.eventResolved,
          [event.id]: (after.questProgress.eventResolved[event.id] ?? 0) + 1
        },
        combatSurvived: combatTag
          ? {
              ...after.questProgress.combatSurvived,
              [combatTag]: (after.questProgress.combatSurvived[combatTag] ?? 0) + 1,
              combat: (after.questProgress.combatSurvived.combat ?? 0) + 1
            }
          : after.questProgress.combatSurvived
      },
      log: addLog(after, `${event.name}: ${resolved.result}`),
      lastAutosaveAt: new Date().toISOString()
    };
    commit(event.severity >= 2 ? bumpPortTrust(next, after.currentPortId, 1) : next, { tone: 'plain', text: resolved.result });
  }

  function goFishing() {
    if (!data || !state || !context) return;
    if (blockForTutorial()) return;
    const canFish = canFishAtPort(context.port);
    if (!canFish) return showToast({ tone: 'warn', text: '이곳에서는 어업을 하기 어렵습니다.' });
    audio.playSfx('page');
    setFishingSession({ id: uniqueId('fishing'), stage: 'prepare' });
  }

  function chooseFishingSpot(spotId: FishingSpotId) {
    audio.playSfx('click');
    setFishingSession((session) => session ? { ...session, spotId, stage: 'cast' } : session);
  }

  function chooseFishingTiming(timingId: FishingTimingId) {
    audio.playSfx('fishCast');
    setFishingSession((session) => session ? { ...session, timingId, stage: 'haul' } : session);
  }

  function chooseFishingHaul(haulId: FishingHaulId) {
    if (!data || !state || !context || !fishingSession) return;
    const session = { ...fishingSession, haulId };
    const result = calculateFishingResult(data, state, context.port, session);
    audio.playSfx('fishHaul');
    setFishingSession({ ...session, result, stage: 'result' });
  }

  function acceptFishingResult() {
    if (!data || !state || !context || !fishingSession?.result) return;
    const result = fishingSession.result;
    const advanced = advanceDays(data, state, 1);
    const beforeEffects: GameState = { ...state, date: advanced.date, monthlyPrices: advanced.monthlyPrices };
    const next = applyEffects(data, beforeEffects, {
      cargo: result.gained,
      crewFatigue: result.fatigue,
      durability: result.shipDamage,
      morale: result.morale
    });
    const record: FishingRecord = {
      id: uniqueId('fish'),
      portId: context.port.id,
      portName: context.port.name,
      gained: result.gained,
      estimatedValue: result.estimatedValue,
      outcome: result.outcome,
      quality: result.quality,
      spotName: result.spotName,
      riskLine: result.riskLine,
      date: advanced.date
    };
    const catchLine = Object.keys(result.gained).length
      ? Object.entries(result.gained).map(([id, amount]) => `${data.goodById[id]?.name ?? id} ${amount}개`).join(', ')
      : '빈 그물';
    const nextState: GameState = {
      ...next,
      ledger: { ...next.ledger, fishing: [record, ...next.ledger.fishing].slice(0, 30) },
      questProgress: { ...next.questProgress, fishingCount: next.questProgress.fishingCount + 1 },
      lastMonthNews: advanced.monthChanged ? monthNews(data, advanced.date.month) : next.lastMonthNews,
      log: addLog(next, `어업(${result.spotName}/${result.quality})으로 ${catchLine}. ${result.riskLine}`),
      lastAutosaveAt: new Date().toISOString()
    };
    audio.playSfx(result.outcome === 'success' ? 'fishSuccess' : result.outcome === 'failure' ? 'fishFail' : 'fish');
    setFishingSession(null);
    commit(nextState, {
      tone: result.outcome === 'failure' ? 'warn' : 'good',
      text: result.outcome === 'failure' ? '어업을 마쳤지만 수확이 적었습니다.' : `어업 성공: ${catchLine}`
    });
  }

  function closeFishing() {
    audio.playSfx('click');
    setFishingSession(null);
  }

  function buyShip(ship: Ship) {
    if (!data || !state || state.shipId === ship.id) return;
    if (blockForTutorial()) return;
    if (state.money < ship.price) return showToast({ tone: 'warn', text: '배를 살 돈이 부족합니다.' });
    audio.playSfx('reward');
    setEquipmentNotice({
      title: `${ship.name} 구입!`,
      text: ship.id === 'fishing_boat' ? '이제 어업과 남해 바닷길 준비가 쉬워졌어요.' : ship.id === 'coastal_merchant' ? '더 많은 짐을 싣고 제주 길을 준비할 수 있어요.' : '새 배가 정박지에 들어왔어요.',
      image: shipArtFor(data, ship),
      next: ship.id === 'fishing_boat' ? '항구에서 어업하기' : '지도에서 새 길 보기',
      tab: ship.id === 'fishing_boat' ? 'port' : 'map',
      detailLines: equipmentNoticeDetails(data, state, ship)
    });
    commit({
      ...state,
      money: state.money - ship.price,
      shipId: ship.id,
      shipPortId: state.currentPortId,
      shipDurability: ship.durability,
      questProgress: {
        ...state.questProgress,
        ownedShips: { ...state.questProgress.ownedShips, [ship.id]: true }
      },
      log: addLog(state, `${ship.name}을 구입했습니다.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: `${ship.name}을 샀습니다.` });
  }

  function buyCart(cart: Cart) {
    if (!data || !state || state.cartId === cart.id) return;
    if (blockForTutorial()) return;
    if (state.money < cart.price) return showToast({ tone: 'warn', text: '수레를 살 돈이 부족합니다.' });
    audio.playSfx('companion');
    setEquipmentNotice({
      title: `${cart.name} 구입!`,
      text: cart.id === 'handcart' ? '소금과 건어물을 더 실을 수 있어요.' : '내륙길 짐칸이 넓어졌어요.',
      image: cartArtFor(data, cart),
      next: '시장으로 가기',
      tab: 'market',
      detailLines: equipmentNoticeDetails(data, state, cart)
    });
    commit({
      ...state,
      money: state.money - cart.price,
      cartId: cart.id,
      cartDurability: cart.durability,
      questProgress: {
        ...state.questProgress,
        ownedCarts: { ...state.questProgress.ownedCarts, [cart.id]: true }
      },
      log: addLog(state, `${cart.name}을 구입했습니다.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: `${cart.name}을 샀습니다.` });
  }

  function repairShip() {
    if (!data || !state || !context) return;
    if (blockForTutorial()) return;
    if (state.shipPortId !== state.currentPortId) return showToast({ tone: 'warn', text: '배가 이 항구에 정박해 있지 않습니다.' });
    const maxDurability = context.ship.durability;
    const damage = maxDurability - state.shipDurability;
    if (damage <= 0) return showToast({ tone: 'plain', text: '이미 배가 멀쩡합니다.' });
    if (context.port.shipyardLevel <= 0) return showToast({ tone: 'warn', text: '이 항구에는 배를 고칠 조선소가 없습니다.' });
    const lumberUsed = Math.min(state.cargo.lumber ?? 0, Math.ceil(damage / 12));
    const cost = Math.max(8, damage * 2 - lumberUsed * 10);
    if (state.money < cost) return showToast({ tone: 'warn', text: '수리비가 부족합니다.' });
    audio.playSfx('repair');
    const avgLumberCost = (state.cargoCost.lumber ?? 0) / Math.max(1, state.cargo.lumber ?? 0);
    commit({
      ...state,
      money: state.money - cost,
      shipDurability: maxDurability,
      cargo: normalizeRecord({ ...state.cargo, lumber: (state.cargo.lumber ?? 0) - lumberUsed }),
      cargoCost: normalizeRecord({ ...state.cargoCost, lumber: Math.max(0, (state.cargoCost.lumber ?? 0) - avgLumberCost * lumberUsed) }),
      questProgress: {
        ...state.questProgress,
        repairedShips: state.questProgress.repairedShips + 1
      },
      log: addLog(state, `${context.port.name}에서 배를 수리했습니다. 비용 ${money(cost)}${lumberUsed ? `, 목재 ${lumberUsed}개 사용` : ''}.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: '배를 수리했습니다.' });
  }

  function callShipToPort() {
    if (!data || !state || state.shipPortId === state.currentPortId) return;
    if (blockForTutorial()) return;
    const currentPort = data.portById[state.currentPortId];
    const { berthPort, hasSeaAccess, days, cost } = shipCallEstimate(data, state);
    if (!hasSeaAccess) return showToast({ tone: 'warn', text: '내륙 도시에서는 배를 부를 수 없습니다. 항구로 이동하세요.' });
    if (state.money < cost) return showToast({ tone: 'warn', text: `배를 부르려면 ${money(cost)}이 필요합니다.` });
    audio.playSfx('ship');
    setEquipmentNotice({
      title: '배가 도착했습니다',
      text: `${berthPort?.name ?? '정박지'}에 있던 배가 ${currentPort.name} 포구에 닿았어요.`,
      image: shipArtFor(data, data.shipById[state.shipId]),
      next: '출항 준비',
      tab: 'map'
    });
    const advanced = advanceDays(data, state, days);
    commit({
      ...state,
      money: state.money - cost,
      date: advanced.date,
      monthlyPrices: advanced.monthlyPrices,
      shipPortId: currentPort.id,
      lastMonthNews: advanced.monthChanged ? monthNews(data, advanced.date.month) : state.lastMonthNews,
      log: addLog(state, `${berthPort?.name ?? '정박지'}에 있던 배를 ${currentPort.name}으로 불러왔습니다. 비용 ${money(cost)}.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: `${currentPort.name}에 배가 도착했습니다.` });
  }

  function buyTool(tool: ToolItem) {
    if (!data || !state || state.tools?.[tool.id]) return;
    if (blockForTutorial()) return;
    if (!toolRequirementMet(state, tool)) return showToast({ tone: 'warn', text: '먼저 이전 단계 장비가 필요합니다.' });
    if (state.money < tool.price) return showToast({ tone: 'warn', text: `${tool.name}을 사려면 ${money(tool.price)}이 필요합니다.` });
    audio.playSfx('reward');
    setEquipmentNotice({
      title: `${tool.name} 장비!`,
      text: toolNoticeText(tool),
      tool,
      next: tool.kind === 'guard' || tool.kind === 'navigation' ? '지도에서 길 보기' : tool.kind === 'fishing' ? '항구에서 어업하기' : '시장 보기',
      tab: tool.kind === 'guard' || tool.kind === 'navigation' ? 'map' : tool.kind === 'fishing' ? 'port' : 'market',
      detailLines: equipmentNoticeDetails(data, state, tool)
    });
    commit({
      ...state,
      money: state.money - tool.price,
      tools: { ...(state.tools ?? {}), [tool.id]: true },
      log: addLog(state, `${tool.name} 장비를 마련했습니다.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: `${tool.name}을 장비했습니다.` });
  }

  function recruitCompanion(companion: Companion) {
    if (!data || !state || state.companions?.[companion.id]) return;
    if (blockForTutorial()) return;
    if (state.money < companion.recruitCost) return showToast({ tone: 'warn', text: `${companion.name}을 동료로 맞으려면 ${money(companion.recruitCost)}이 필요합니다.` });
    audio.playSfx('reward');
    setEquipmentNotice({
      title: `${companion.name} 합류!`,
      text: companion.line,
      companion,
      next: companion.stats.navigation || companion.stats.guard ? '지도에서 길 보기' : companion.stats.trade ? '시장 보기' : '장비 보기',
      tab: companion.stats.navigation || companion.stats.guard ? 'map' : companion.stats.trade ? 'market' : 'vehicles',
      detailLines: [companion.role, statLine(companion.stats)]
    });
    commit({
      ...state,
      money: state.money - companion.recruitCost,
      companions: { ...(state.companions ?? {}), [companion.id]: true },
      log: addLog(state, `${companion.name}이 ${state.fleetName ?? '정우상단'}의 동료가 되었습니다.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: `${companion.name}이 동료가 되었습니다.` });
  }

  function renameFleet(name: string) {
    if (!state) return;
    if (blockForTutorial()) return;
    const cleanName = name.trim().slice(0, 12) || '정우상단';
    commit({
      ...state,
      fleetName: cleanName,
      log: addLog(state, `상단 이름을 ${cleanName}(으)로 정했습니다.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'plain', text: `함대 이름: ${cleanName}` });
  }

  function deliverQuestGoods(quest: Quest) {
    if (!data || !state) return;
    if (blockForTutorial()) return;
    const objective = openDeliveryObjective(state, quest);
    if (!objective?.goods || !objective.at) return showToast({ tone: 'warn', text: '이 항구에서 납품할 물건이 없습니다.' });
    const missing = missingDeliveryGoods(state, objective);
    if (missing.length > 0) {
      const line = missing.map((item) => `${data.goodById[item.goodId]?.name ?? item.goodId} ${item.needed - item.owned}개`).join(', ');
      return showToast({ tone: 'warn', text: `납품 물품이 부족합니다: ${line}` });
    }

    let cargo = { ...state.cargo };
    let cargoCost = { ...state.cargoCost };
    let deliveredGoods = state.questProgress.deliveredGoods;
    for (const [goodId, amount] of Object.entries(objective.goods)) {
      const delivered = state.questProgress.deliveredGoods[objective.at]?.[goodId] ?? 0;
      const needed = Math.max(0, amount - delivered);
      if (needed <= 0) continue;
      const avgCost = (cargoCost[goodId] ?? 0) / Math.max(1, cargo[goodId] ?? 0);
      cargo[goodId] = (cargo[goodId] ?? 0) - needed;
      cargoCost[goodId] = Math.max(0, (cargoCost[goodId] ?? 0) - avgCost * needed);
      deliveredGoods = addNestedCount(deliveredGoods, objective.at, goodId, needed);
    }

    commit({
      ...state,
      cargo: normalizeRecord(cargo),
      cargoCost: normalizeRecord(cargoCost),
      questProgress: {
        ...state.questProgress,
        deliveredGoods
      },
      log: addLog(state, `${quest.name} 의뢰 물품을 ${data.portById[objective.at].name}에 납품했습니다.`),
      lastAutosaveAt: new Date().toISOString()
    }, { tone: 'good', text: '의뢰 물품을 납품했습니다.' });
  }

  function patchState(patch: StatePatch) {
    if (!state) return;
    setState({ ...state, ...patch });
  }

  if (loadError) return <main className="app-shell center"><p className="notice warn">{loadError}</p></main>;
  if (!data) return <main className="app-shell center"><p className="notice">장터 데이터를 불러오는 중입니다...</p></main>;

  if (!state || !context) {
    return (
      <main className="app-shell start-shell">
        <img className="start-art" src={TITLE_HARBOR_ASSET} alt="" />
        <section className="start-panel">
          <img className="start-portrait" src={PROTAGONIST_ASSET} alt="" />
          <p className="eyebrow">그림으로 떠나는 모바일 교역 RPG</p>
          <h1>팔도상단: 조선의 바람</h1>
          <p>현대의 정우가 갑자기 조선 부산(부산포)에 도착했습니다. 요정과 함께 첫 장사를 배우고 조선의 거상을 향해 떠나 보세요.</p>
          <div className="save-slot-picker" aria-label="저장 슬롯">
            {[1, 2, 3].map((slot) => (
              <button key={slot} className={saveSlot === slot ? 'active' : ''} onClick={() => { setSaveSlot(slot); setSavedAvailable(savedSlots[slot]); }}>
                {slot}번 {savedSlots[slot] ? '저장됨' : '빈칸'}
              </button>
            ))}
          </div>
          <div className="start-actions">
            <button className="primary" data-testid="new-game-button" onClick={startNewGame}>새 게임</button>
            <button data-testid="continue-button" onClick={continueGame} disabled={!savedAvailable}>이어하기</button>
          </div>
          <p className="micro">데이터 {data.constants.version} · 저장은 이 브라우저에 자동으로 남습니다.</p>
        </section>
      </main>
    );
  }

  const pendingEvent = state.pendingEventId ? data.eventById[state.pendingEventId] : undefined;
  const questNotice = state.questNotices[0];
  const discoveryNotice = state.discoveryNotices[0];
  const ledgerSealNotice = state.ledgerSealNotices[0];
  const modalBusy = Boolean(fishingSession || pendingEvent || state.lastEventResult || discoveryNotice || questNotice || ledgerSealNotice || equipmentNotice);
  const tutorialStoryStep = !modalBusy ? tutorialDialog : undefined;

  return (
    <main className={`app-shell game-shell tab-${tab} ${inputPaused ? 'game-paused' : ''}`}>
      <div className="rotate-notice">이 게임은 가로화면에 최적화되어 있습니다. 기기를 가로로 돌려주세요.</div>
      <StatusBar data={data} state={state} context={context} audioSettings={audio.settings} audioUnlocked={audio.unlocked} onPrimeAudio={audio.primeAudio} onToggleMusic={audio.toggleMusic} onToggleSfx={audio.toggleSfx} onVolume={audio.setVolume} />
      {toast && <div className={`toast ${toast.tone}`}>{toast.text}</div>}
      <BottomTabs active={tab} onChange={navigate} highlightTarget={activeTutorialHighlight} />
      <TutorialCoachCard data={data} state={state} onNavigate={navigate} onSelectRoute={setSelectedRouteId} />
      <section className={`content-surface content-${tab}`}>
        {tab === 'port' && <PortView data={data} state={state} onFish={goFishing} onNavigate={navigate} onSellHint={openSellHint} onBuyHint={openBuyHint} onCallShip={callShipToPort} onSfx={audio.playSfx} highlightTarget={activeTutorialHighlight} />}
        {tab === 'map' && <MapView data={data} state={state} routes={context.routes} selectedRouteId={selectedRouteId} onSelectRoute={setSelectedRouteId} travelAnimation={travelAnimation} onTravel={travel} disabled={inputPaused} highlightTarget={activeTutorialHighlight} />}
        {tab === 'market' && <MarketView data={data} state={state} used={context.usedCargo} capacity={context.capacity} focusGoodId={marketFocusGoodId} onBuy={buyGood} onSell={sellGood} onInspectGood={inspectMarketGood} onNavigate={navigate} onSellHint={openSellHint} onBuyHint={openBuyHint} onSfx={audio.playSfx} disabled={inputPaused} highlightTarget={activeTutorialHighlight} />}
        {tab === 'cargo' && <CargoLedger data={data} state={state} used={context.usedCargo} capacity={context.capacity} onSellHint={openSellHint} onNavigate={navigate} />}
        {tab === 'ledger' && <CargoLedger data={data} state={state} used={context.usedCargo} capacity={context.capacity} onSellHint={openSellHint} onNavigate={navigate} />}
        {tab === 'vehicles' && <VehicleView data={data} state={state} ship={context.ship} cart={context.cart} port={context.port} onBuyShip={buyShip} onBuyCart={buyCart} onBuyTool={buyTool} onRecruitCompanion={recruitCompanion} onRenameFleet={renameFleet} onRepairShip={repairShip} onNavigate={navigate} />}
        {tab === 'quests' && <QuestView data={data} state={state} onDeliver={deliverQuestGoods} onNavigate={navigate} onSelectRoute={setSelectedRouteId} />}
      </section>
      {fishingSession && (
        <FishingMiniGameModal
          data={data}
          state={state}
          session={fishingSession}
          onClose={closeFishing}
          onChooseSpot={chooseFishingSpot}
          onChooseTiming={chooseFishingTiming}
          onChooseHaul={chooseFishingHaul}
          onAccept={acceptFishingResult}
        />
      )}
      {pendingEvent && <EventChoiceModal data={data} state={state} event={pendingEvent} onResolve={resolveEvent} />}
      {state.lastEventResult && <EventResultModal result={state.lastEventResult} onClose={() => patchState({ lastEventResult: undefined })} />}
      {discoveryNotice && <DiscoveryModal notice={discoveryNotice} onClose={() => patchState({ discoveryNotices: state.discoveryNotices.slice(1) })} />}
      {questNotice && (
        <QuestCompleteModal
          data={data}
          notice={questNotice}
          onClose={() => patchState({ questNotices: state.questNotices.slice(1) })}
          onNavigate={(nextTab) => {
            patchState({ questNotices: state.questNotices.slice(1) });
            navigate(nextTab);
          }}
        />
      )}
      {ledgerSealNotice && (
        <QuestCompleteModal
          data={data}
          notice={ledgerSealNotice}
          onClose={() => patchState({ ledgerSealNotices: state.ledgerSealNotices.slice(1) })}
          onNavigate={(nextTab) => {
            patchState({ ledgerSealNotices: state.ledgerSealNotices.slice(1) });
            navigate(nextTab);
          }}
        />
      )}
      {equipmentNotice && <EquipmentNoticeModal notice={equipmentNotice} onClose={() => setEquipmentNotice(null)} onNavigate={(nextTab) => { setEquipmentNotice(null); navigate(nextTab); }} />}
      {tutorialStoryStep && (
        <TutorialStoryModal
          data={data}
          dialog={tutorialStoryStep}
          onContinue={() => advanceTutorialStory(tutorialStoryStep)}
          onSkip={skipTutorialStory}
        />
      )}
    </main>
  );
}

function StatusBar({
  data,
  state,
  context,
  audioSettings,
  audioUnlocked,
  onPrimeAudio,
  onToggleMusic,
  onToggleSfx,
  onVolume
}: {
  data: GameData;
  state: GameState;
  context: { port: Port; monthly?: MonthlyEvent; usedCargo: number; capacity: number; ship: Ship; cart: Cart };
  audioSettings: AudioSettings;
  audioUnlocked: boolean;
  onPrimeAudio: () => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onVolume: (volume: number) => void;
}) {
  return (
    <header className="status-bar">
      <div data-testid="status-current-port"><span className="label">위치</span><strong>{context.port.name}</strong></div>
      <div data-testid="status-money"><span className="label">돈</span><strong>{money(state.money)}</strong></div>
      <div data-testid="status-month"><span className="label">날짜</span><strong>{state.date.month}월 {state.date.day}일</strong></div>
      <div className="wide"><span className="label">월간 사건</span><strong>{context.monthly?.name ?? '평온한 달'}</strong></div>
      <div className="wide"><span className="label">짐칸</span><strong>{context.usedCargo}/{context.capacity}</strong></div>
      <div className="fame-status-strip" aria-label="3대 명성">
        <span data-testid="fame-merchant" title="상인 이름값: 돈이 되는 거래와 부탁 보상으로 오릅니다.">상인 {state.fame.merchant}</span>
        <span data-testid="fame-exploration" title="탐방 이름값: 새 항구 발견과 먼 길 개척으로 오릅니다.">탐방 {state.fame.exploration}</span>
        <span data-testid="fame-guard" title="호위 이름값: 위험 사건 해결과 수군·관아 부탁으로 오릅니다.">호위 {state.fame.guard}</span>
      </div>
      <AudioControls settings={audioSettings} unlocked={audioUnlocked} onPrimeAudio={onPrimeAudio} onToggleMusic={onToggleMusic} onToggleSfx={onToggleSfx} onVolume={onVolume} />
      <div className="autosave" data-testid="autosave-indicator">자동 저장</div>
      <span className="sr-only">{data.constants.title}</span>
    </header>
  );
}

function AudioControls({
  settings,
  unlocked,
  onPrimeAudio,
  onToggleMusic,
  onToggleSfx,
  onVolume
}: {
  settings: AudioSettings;
  unlocked: boolean;
  onPrimeAudio: () => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onVolume: (volume: number) => void;
}) {
  return (
    <div className={`audio-controls ${unlocked ? 'ready' : 'locked'}`} data-testid="audio-controls" aria-label="소리 설정">
      <button
        type="button"
        className={`audio-prime ${unlocked ? 'ready' : ''}`}
        data-testid="audio-prime-button"
        onClick={onPrimeAudio}
        aria-label={unlocked ? '소리 준비됨' : '소리 시작'}
      >
        {unlocked ? '소리' : '시작'}
      </button>
      <button type="button" className={settings.music ? 'active' : ''} onClick={onToggleMusic} aria-label={settings.music ? '배경음악 끄기' : '배경음악 켜기'}>
        {settings.music ? '♪' : '♪×'}
      </button>
      <button type="button" className={settings.sfx ? 'active' : ''} onClick={onToggleSfx} aria-label={settings.sfx ? '효과음 끄기' : '효과음 켜기'}>
        {settings.sfx ? '⚑' : '⚑×'}
      </button>
      <input
        aria-label="소리 크기"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={settings.volume}
        onChange={(event) => onVolume(Number(event.currentTarget.value))}
      />
    </div>
  );
}

function fishingFairyDialogue(data: GameData, state: GameState, session: FishingSession) {
  const port = data.portById[state.currentPortId];
  const monthly = currentMonthEvent(data, state.date.month);
  const spot = fishingSpotById(session.spotId);
  const timing = fishingTimingById(session.timingId);
  const result = session.result;
  if (result) return { mood: result.mood, line: result.fairyLine };
  if (state.questProgress.fishingCount === 0 && session.stage === 'prepare') {
    return { mood: 'default' as GuideMood, line: '첫 어업이네요. 오늘은 욕심내기보다 어장, 물때, 회수법을 차례대로 읽어봐요.' };
  }
  if ((monthly?.riskTags ?? []).some((tag) => tag === 'storm' || tag === 'rough_sea')) {
    return { mood: 'warning' as GuideMood, line: '바람이 거칠어요. 먼 물골은 수확도 크지만 배와 그물이 상할 수 있어요.' };
  }
  if (session.stage === 'prepare' && canFishAtPort(port)) {
    return { mood: 'happy' as GuideMood, line: `${port.name}은 어장 소문이 있는 곳이에요. 안전한 여울과 깊은 물골 중 오늘 리듬을 골라요.` };
  }
  if (session.stage === 'cast') {
    return { mood: spot.risk >= 3 ? 'warning' as GuideMood : 'default' as GuideMood, line: `${spot.name}: ${spot.hint}` };
  }
  if (session.stage === 'haul') {
    const timingMatched = timing.id === spot.preferredTiming;
    return {
      mood: timingMatched ? 'happy' as GuideMood : 'warning' as GuideMood,
      line: timingMatched
        ? '좋아요, 그물이 물살을 제대로 탔어요. 이제 회수법만 틀리지 않으면 수확이 커져요.'
        : '조류가 조금 빗나갔어요. 무리해서 당길지, 안전하게 거둘지 판단해야 해요.'
    };
  }
  return { mood: 'default' as GuideMood, line: '조류를 보고 천천히 골라요. 어업은 서두르는 버튼이 아니라 작은 항해예요.' };
}

function FishingMiniGameModal({
  data,
  state,
  session,
  onClose,
  onChooseSpot,
  onChooseTiming,
  onChooseHaul,
  onAccept
}: {
  data: GameData;
  state: GameState;
  session: FishingSession;
  onClose: () => void;
  onChooseSpot: (spotId: FishingSpotId) => void;
  onChooseTiming: (timingId: FishingTimingId) => void;
  onChooseHaul: (haulId: FishingHaulId) => void;
  onAccept: () => void;
}) {
  const port = data.portById[state.currentPortId];
  const monthly = currentMonthEvent(data, state.date.month);
  const ship = data.shipById[state.shipId];
  const tide = tideFor(data, state.date.day);
  const stats = fleetStats(data, state);
  const selectedSpot = fishingSpotById(session.spotId);
  const selectedTiming = fishingTimingById(session.timingId);
  const selectedHaul = fishingHaulById(session.haulId);
  const fairy = fishingFairyDialogue(data, state, session);
  const skill = effectiveSkillValue(data, state, 'fishing');
  const stormRisk = (monthly?.riskTags ?? []).some((tag) => tag === 'storm' || tag === 'rough_sea');
  const stageIndex = session.stage === 'prepare' ? 1 : session.stage === 'cast' ? 2 : session.stage === 'haul' ? 3 : 4;
  const resultGoods = Object.entries(session.result?.gained ?? {});

  return (
    <div className="modal-backdrop fishing-backdrop" role="dialog" aria-modal="true" aria-label="어업 미니게임">
      <section className={`fishing-modal stage-${session.stage}`} data-testid="fishing-modal">
        <div className="fishing-header">
          <GuideSpirit mood={fairy.mood} className="fishing-guide" />
          <div>
            <p className="eyebrow">시간여행 요정 · 어장 길잡이</p>
            <h2>{port.name} 어업 준비</h2>
            <p>{fairy.line}</p>
          </div>
          <button type="button" className="popover-close fishing-close" onClick={onClose} aria-label="어업 닫기" disabled={session.stage === 'result'}>×</button>
        </div>

        <div className="fishing-step-strip" aria-label="어업 단계">
          {['준비', '조류', '회수', '결과'].map((label, index) => (
            <span key={label} className={stageIndex === index + 1 ? 'active' : stageIndex > index + 1 ? 'done' : ''}>{label}</span>
          ))}
        </div>

        <div className="fishing-brief-grid">
          <span><b>물때</b>{tideLabel(tide)}</span>
          <span><b>월간</b>{monthly?.name ?? '평온'}</span>
          <span><b>어업 실력</b>{skill} <small>장비/동료 {stats.fishing}</small></span>
          <span><b>배</b>{ship?.name ?? '없음'} <small>보정 {Math.round((ship?.fishingBonus ?? 0) * 100)}%</small></span>
          <span className={state.crew.fatigue >= 55 ? 'warn' : ''}><b>피로</b>{state.crew.fatigue}/100</span>
          <span className={stormRisk ? 'warn' : ''}><b>위험</b>{stormRisk ? '거친 바다' : '보통'}</span>
        </div>

        {session.stage === 'prepare' && (
          <div className="fishing-choice-grid fishing-spots">
            {FISHING_SPOTS.map((spot) => (
              <button type="button" key={spot.id} data-testid={`fishing-spot-${spot.id}`} onClick={() => onChooseSpot(spot.id)} className={`fishing-choice-card risk-${spot.risk}`}>
                <span className="fishing-card-icon"><GoodIcon good={data.goodById[spot.goods[0]]} /></span>
                <strong>{spot.name}</strong>
                <small>{spot.title}</small>
                <p>{spot.description}</p>
                <em>수확 {spot.yield}/3 · 위험 {spot.risk}/3 · 추천 {fishingTimingById(spot.preferredTiming).short}</em>
              </button>
            ))}
          </div>
        )}

        {session.stage === 'cast' && (
          <div className="fishing-cast-panel">
            <div className="fishing-current-gauge" data-testid="fishing-current-gauge">
              {FISHING_TIMINGS.map((timing) => (
                <span key={timing.id} className={timing.id === selectedSpot.preferredTiming ? 'target' : ''}>{timing.short}</span>
              ))}
              <i className={`current-needle target-${selectedSpot.preferredTiming}`} />
            </div>
            <div className="fishing-choice-grid timing-grid">
              {FISHING_TIMINGS.map((timing) => (
                <button type="button" key={timing.id} data-testid={`fishing-timing-${timing.id}`} onClick={() => onChooseTiming(timing.id)} className={timing.id === selectedSpot.preferredTiming ? 'recommended' : ''}>
                  <strong>{timing.label}</strong>
                  <small>{timing.description}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {session.stage === 'haul' && (
          <div className="fishing-haul-panel">
            <div className="net-preview" data-testid="fishing-net-preview">
              <div className="net-pixel-water">
                <span className={selectedTiming.id === selectedSpot.preferredTiming ? 'fish-shadow big' : 'fish-shadow'} />
                <span className="net-line a" />
                <span className="net-line b" />
                <span className="net-line c" />
              </div>
              <div>
                <p className="eyebrow">그물 반응</p>
                <h3>{selectedTiming.id === selectedSpot.preferredTiming ? '큰 물고기 조짐' : '물살이 비켜남'}</h3>
                <p>{selectedTiming.id === selectedSpot.preferredTiming ? '그물이 묵직합니다. 회수법이 맞으면 수확이 크게 오릅니다.' : '그물이 흔들립니다. 안전하게 거두면 적어도 손실을 줄일 수 있어요.'}</p>
              </div>
            </div>
            <div className="fishing-choice-grid haul-grid">
              {FISHING_HAULS.map((haul) => (
                <button type="button" key={haul.id} data-testid={`fishing-haul-${haul.id}`} onClick={() => onChooseHaul(haul.id)} className={haul.id === selectedSpot.bestHaul ? 'recommended' : ''}>
                  <strong>{haul.label}</strong>
                  <small>{haul.description}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {session.stage === 'result' && session.result && (
          <div className={`fishing-result-panel outcome-${session.result.outcome}`} data-testid="fishing-result-panel">
            <div className="fishing-result-head">
              <GuideSpirit mood={session.result.mood} />
              <div>
                <p className="eyebrow">{session.result.outcome === 'success' ? '성공' : session.result.outcome === 'normal' ? '보통' : '실패'}</p>
                <h3>{session.result.quality}</h3>
                <p>{session.result.spotName} · {session.result.timingName} · {session.result.haulName}</p>
              </div>
              <strong>{session.result.score}점</strong>
            </div>
            <div className="fishing-reward-grid">
              {resultGoods.length === 0 ? <span className="empty-net">빈 그물</span> : resultGoods.map(([goodId, amount]) => (
                <span key={goodId}><GoodIcon good={data.goodById[goodId]} />{data.goodById[goodId]?.name ?? goodId} {amount}개</span>
              ))}
              <span><b>대략 값</b>{money(session.result.estimatedValue)}</span>
              <span className={session.result.shipDamage < 0 ? 'warn' : ''}><b>배</b>{session.result.shipDamage < 0 ? `${session.result.shipDamage}` : '손상 없음'}</span>
              <span><b>피로</b>+{session.result.fatigue}</span>
            </div>
            <p className="fishing-risk-line">{session.result.riskLine}</p>
            <button className="primary wide-action" data-testid="fishing-accept-result" onClick={onAccept}>장부에 기록</button>
          </div>
        )}
      </section>
    </div>
  );
}

function seasonKind(month: number) {
  if ([3, 4, 5].includes(month)) return 'spring';
  if ([6, 7, 8].includes(month)) return 'summer';
  if ([9, 10, 11].includes(month)) return 'autumn';
  return 'winter';
}

function goodsLabel(data: GameData, ids: string[] = []) {
  return ids.map((id) => data.goodById[id]?.name ?? id).join(', ');
}

function MonthNewsCard({ data, monthly }: { data: GameData; monthly?: MonthlyEvent }) {
  if (!monthly) return null;
  const trendNames = goodsLabel(data, monthly.trendGoods ?? Object.keys(monthly.priceModifiers ?? {}).slice(0, 3));
  const demandNames = goodsLabel(data, monthly.officialDemandGoods ?? []);
  const hazards = (monthly.riskTags ?? Object.keys(monthly.hazardModifiers ?? {}).slice(0, 3)).join(', ');
  return (
    <section className={`panel month-news signboard season-${seasonKind(monthly.month)}`}>
      <div className="season-art" aria-hidden="true"><span /></div>
      <div>
        <p className="eyebrow">{monthly.month}월 시장 소식</p>
        <h2>{monthly.name}</h2>
        <p>{monthly.summary}</p>
        <div className="monthly-chip-row">
          {trendNames && <span data-testid="monthly-trend-goods">유행 {trendNames}</span>}
          {demandNames && <span data-testid="official-demand-goods">관청 {demandNames}</span>}
          {hazards && <span>위험 {hazards}</span>}
        </div>
      </div>
    </section>
  );
}

function RouteHintPanel({ hints }: { hints: TradeHint[] }) {
  if (hints.length === 0) return null;
  return (
    <section className="panel route-hints signboard">
      <p className="eyebrow">상단 추천 루트</p>
      <div className="hint-strip">
        {hints.map((hint) => (
          <article key={`${hint.routeId}-${hint.goodId}`} className="hint-card">
            <strong>{hint.goodName}</strong>
            <p>{hint.fromPortName} {money(hint.buyPrice)} → {hint.toPortName} {money(hint.sellPrice)}</p>
            <span>개당 +{money(hint.profitEach)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function TradeAdvicePanel({
  data,
  sellHints,
  buyHints,
  onSellHint,
  onBuyHint
}: {
  data: GameData;
  sellHints: TradeHint[];
  buyHints: TradeHint[];
  onSellHint?: (hint: TradeHint) => void;
  onBuyHint?: (hint: TradeHint) => void;
}) {
  return (
    <section className="panel trade-advice ledger-popover recommendation-panel">
      <p className="eyebrow">상단 추천</p>
      <div className="advice-columns">
        <div>
          <h2>지금 팔 곳</h2>
          {sellHints.length === 0 ? <p className="empty-state">팔 물건이 없거나 가까운 항구 차익이 작아요. 시장에서 추천 상품을 먼저 골라보세요.</p> : sellHints.map((hint) => (
            <button className="advice-card sell" data-testid={`advice-sell-${hint.goodId}`} key={`sell-${hint.routeId}-${hint.goodId}`} onClick={() => onSellHint?.(hint)}>
              <GoodIcon good={data.goodById[hint.goodId]} />
              <strong>{hint.goodName} {hint.quantity}개</strong>
              <p>{hint.toPortName} · 살 때 {money(hint.buyPrice)} → 팔 때 {money(hint.sellPrice)}</p>
              <small>{hint.reason}</small>
              <span>대략 +{money(hint.totalProfit ?? hint.profitEach)}</span>
            </button>
          ))}
        </div>
        <div>
          <h2>다음에 살 것</h2>
          {buyHints.length === 0 ? <p className="empty-state">이번 달 확실한 사기 추천이 없어요. 월간 소식이나 특산품을 확인하세요.</p> : buyHints.map((hint) => (
            <button className="advice-card buy" data-testid={`advice-buy-${hint.goodId}`} key={`buy-${hint.routeId}-${hint.goodId}`} onClick={() => onBuyHint?.(hint)}>
              <GoodIcon good={data.goodById[hint.goodId]} />
              <strong>{hint.goodName}</strong>
              <p>{hint.fromPortName} {money(hint.buyPrice)} → {hint.toPortName} {money(hint.sellPrice)}</p>
              <small>{hint.reason}</small>
              <span>개당 +{money(hint.profitEach)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TavernRumorPanel({ data, state, sellHints, buyHints }: { data: GameData; state: GameState; sellHints: TradeHint[]; buyHints: TradeHint[] }) {
  const port = data.portById[state.currentPortId];
  const bestSell = sellHints[0];
  const bestBuy = buyHints[0];
  return (
    <section className="panel tavern-panel speech-bubble">
      <p className="eyebrow">{port.name} 술집 소문</p>
      <h2>상인들이 주고받는 말</h2>
      <p>{bestSell ? `${bestSell.goodName}은 ${bestSell.toPortName} 쪽에서 더 값을 쳐준답니다.` : '오늘은 실은 짐에 대한 뚜렷한 판매 소문이 없어요.'}</p>
      <p>{bestBuy ? `${bestBuy.goodName}은 여기서 사서 ${bestBuy.toPortName}에 가져가면 괜찮은 장사가 될 수 있어요.` : '새 물건을 사기 전에는 월별 소식을 한 번 더 살펴보세요.'}</p>
      <div className="chips"><span>사기 {state.crew.morale}/10</span><span>피로 {state.crew.fatigue}/100</span><span>{state.date.month}월 소문</span></div>
    </section>
  );
}

function PortHub({
  port,
  canFish,
  selected,
  onSelect,
  onNavigate,
  onFish,
  onSfx
}: {
  port: Port;
  canFish: boolean;
  selected: HubAction | 'routes';
  onSelect: (action: HubAction | 'routes') => void;
  onNavigate: (tab: Tab) => void;
  onFish: () => void;
  onSfx: (key: SfxKey) => void;
}) {
  const hasYard = port.shipyardLevel > 0 || port.cartYardLevel > 0 || port.facilities.includes('repair_hut');
  const yardTitle = port.shipyardLevel > 0 ? '조선소' : port.cartYardLevel > 0 ? '수레방' : '수리소';
  const yardDesc = port.shipyardLevel > 0 ? '배와 수리' : port.cartYardLevel > 0 ? '수레 손질' : '응급 수리';
  const hasSeaAccess = port.kind.includes('port') || port.terrainTags.some((tag) => tag.includes('sea') || tag === 'island');
  const allActions: Array<{ id: HubAction; title: string; desc: string; image: string; tab?: Tab; disabled?: boolean; className: string }> = [
    { id: 'market', title: '시장', desc: '사고팔기', image: HUB_ICON.market, tab: 'market', className: 'hotspot-market' },
    { id: 'office', title: '관청', desc: '의뢰 확인', image: HUB_ICON.office, tab: 'quests', className: 'hotspot-office' },
    { id: 'tavern', title: '술집', desc: '소문 듣기', image: HUB_ICON.tavern, className: 'hotspot-tavern' },
    { id: 'shipyard', title: yardTitle, desc: yardDesc, image: HUB_ICON.shipyard, tab: 'vehicles', disabled: !hasYard, className: 'hotspot-shipyard' }
  ];
  const actions = allActions.filter((action) => !action.disabled);
  const layout = HOTSPOT_LAYOUTS[port.visualType ?? 'south_port'] ?? HOTSPOT_LAYOUTS.south_port;
  function hotspotStyle(id: HotspotId): CSSProperties {
    const position = layout[id] ?? HOTSPOT_LAYOUTS.south_port[id] ?? { x: 50, y: 50 };
    return { left: `${position.x}%`, top: `${position.y}%`, right: 'auto', bottom: 'auto' };
  }
  return (
    <div className="port-hotspots" aria-label={`${port.name} 시설`}>
      {actions.map((action) => (
        <button
          key={action.id}
          className={`hub-hotspot ${action.className} ${selected === action.id ? 'active' : ''}`}
          data-testid={`hub-button-${action.id}`}
          style={hotspotStyle(action.id)}
          disabled={action.disabled}
          onClick={() => {
            if (!action.tab) onSfx(action.id === 'tavern' ? 'door' : 'click');
            onSelect(action.id);
            if (action.tab) onNavigate(action.tab);
          }}
        >
          <img src={action.image} alt="" />
          <strong>{action.title}</strong>
          <span>{action.desc}</span>
        </button>
      ))}
      {canFish && <button className="hub-hotspot hotspot-fish" data-testid="hub-button-fish" style={hotspotStyle('fish')} onClick={onFish}><img src={HUB_ICON.fish} alt="" /><strong>어업</strong><span>미니게임</span></button>}
      <button className={`hub-hotspot hotspot-routes ${selected === 'routes' ? 'active' : ''}`} style={hotspotStyle('routes')} onClick={() => { onSfx('page'); onSelect('routes'); onNavigate('map'); }}>
        <img src={HUB_ICON.map} alt="" />
        <strong>{hasSeaAccess ? '출항' : '이동'}</strong>
        <span>{hasSeaAccess ? '바닷길' : '길목'}</span>
      </button>
    </div>
  );
}

function growthPathSteps(data: GameData, state: GameState): GrowthPathStep[] {
  const first = data.quests.find((quest) => quest.id === 'tutorial_first_trade');
  const buyDone = first ? objectiveStatus(data, state, first.objectives[0]).done : false;
  const visitDone = state.questProgress.visitedPorts.daegu || state.currentPortId === 'daegu';
  const firstSellObjective = first?.objectives.find((objective) => objective.type === 'sell');
  const sellDone = firstSellObjective ? objectiveStatus(data, state, firstSellObjective).done : false;
  const saltDone = state.completedQuests.includes('salt_to_daegu') || (state.questProgress.soldGoods.daegu?.salt ?? 0) >= 5;
  const cartDone = Boolean(state.questProgress.ownedCarts.handcart);
  const fishingDone = state.questProgress.fishingCount > 0 || state.completedQuests.includes('fish_for_inland');
  const fishingBoatDone = Boolean(state.questProgress.ownedShips.fishing_boat) || state.shipId === 'fishing_boat';
  const jejuPrepDone = Boolean(state.questProgress.visitedPorts.mokpo || state.questProgress.visitedPorts.yeosu || state.questProgress.visitedPorts.jeju);
  return [
    { title: '면포 2개', text: '부산(부산포) 시장', tab: 'market', done: buyDone, iconGoodId: 'cotton_cloth' },
    { title: '대구 이동', text: '지도에서 출발', tab: 'map', done: visitDone, iconAsset: HUB_ICON.map, targetPortId: 'daegu' },
    { title: '면포 팔기', text: '대구 시장', tab: 'market', done: sellDone, iconGoodId: 'cotton_cloth' },
    { title: '소금 장사', text: '내륙 수요', tab: state.currentPortId === 'daegu' ? 'market' : 'map', done: saltDone, iconGoodId: 'salt' },
    { title: '손수레', text: '짐칸 늘리기', tab: 'vehicles', done: cartDone, iconAsset: cartArtFor(data, data.cartById.handcart) },
    { title: '어업', text: '항구 물고기', tab: 'port', done: fishingDone, iconGoodId: 'fresh_fish' },
    { title: '어선', text: '남해 준비', tab: 'vehicles', done: fishingBoatDone, iconAsset: shipArtFor(data, data.shipById.fishing_boat) },
    { title: '제주 준비', text: '먼 길 준비', tab: 'map', done: jejuPrepDone, iconAsset: HUB_ICON.map, targetPortId: 'mokpo' }
  ];
}

function tutorialStorySteps(data: GameData, state: GameState): TutorialStoryStep[] {
  const firstSteps = growthPathSteps(data, state);
  const nextStep = firstSteps.find((step) => !step.done) ?? firstSteps[0];
  const nextIconGood = nextStep?.iconGoodId;
  const firstBuyDone = firstSteps[0]?.done ?? false;
  const movedToDaegu = firstSteps[1]?.done ?? false;
  const firstSellDone = firstSteps[2]?.done ?? false;
  const handcartDone = firstSteps[4]?.done ?? false;
  const storySteps: TutorialStoryStep[] = [
    {
      id: 'intro-time-slip',
      eyebrow: '시간여행 안내',
      title: '정우야, 조선 부산(부산포)에 도착했어!',
      line: '눈을 떠 보니 네가 조선 항구에 와 있어. 겁먹지 마. 나는 장사길을 알려 주는 작은 요정이야. 작은 면포 장사부터 시작해 언젠가 큰 상단을 만들자.',
      actionLabel: '항구 둘러보기',
      tab: 'port',
      mood: 'default',
      iconAsset: PROTAGONIST_ASSET
    },
    {
      id: 'intro-big-goal',
      eyebrow: '큰 목표',
      title: '작은 장사부터 거상까지',
      line: '처음에는 면포 몇 개로 시작하지만, 돈을 모으면 수레와 배를 마련해 더 먼 곳까지 갈 수 있어.',
      actionLabel: '첫 목표 보기',
      tab: 'quests',
      mood: 'happy',
      iconAsset: shipArtFor(data, data.shipById['small_sailboat'])
    },
    {
      id: 'buy-cotton',
      eyebrow: '첫 행동',
      title: '먼저 시장에서 면포 2개를 사자',
    line: '정우야, 부산(부산포)은 면포가 유명해. 물건 그림을 누르고 사기 버튼을 두 번 눌러 보자.',
      actionLabel: '시장 가기',
      tab: 'market',
      mood: 'happy',
      iconGoodId: 'cotton_cloth'
    },
    {
      id: 'go-daegu',
      eyebrow: '팔 곳 찾기',
      title: '같은 곳에서 바로 팔면 손해일 수 있어',
      line: '면포를 샀다면 대구로 가 보자. 지도에서 대구 길을 고르면 더 좋은 값에 팔 수 있어.',
      actionLabel: '지도 보기',
      tab: 'map',
      mood: 'warning',
      iconAsset: HUB_ICON.map
    },
    {
      id: 'sell-cotton',
      eyebrow: '첫 이익',
      title: '대구 시장에서 면포를 팔아 보자',
      line: '도착하면 다시 시장으로 가. 팔기 버튼을 누르면 산 값과 파는 값 차이로 돈을 벌 수 있어.',
      actionLabel: '시장 가기',
      tab: 'market',
      mood: 'happy',
      iconGoodId: 'cotton_cloth'
    },
    {
      id: 'next-growth',
      eyebrow: '다음 성장',
      title: '돈을 모아 손수레를 목표로 하자',
      line: '짐칸이 늘면 소금과 건어물을 더 많이 옮길 수 있어. 큰 배는 아직 먼 목표니까 차근차근 가자.',
      actionLabel: '장비 보기',
      tab: 'vehicles',
      mood: 'default',
      iconAsset: cartArtFor(data, data.cartById['handcart'])
    }
  ];
  return storySteps.filter((step) => {
    if (step.id === 'go-daegu') return firstBuyDone;
    if (step.id === 'sell-cotton') return movedToDaegu;
    if (step.id === 'next-growth') return firstSellDone && !handcartDone;
    if (step.id === 'buy-cotton') return !firstBuyDone;
    return true;
  }).map((step) => {
    if (step.id === 'buy-cotton' && nextIconGood) return { ...step, iconGoodId: nextIconGood };
    return step;
  });
}

function currentTutorialStoryStep(data: GameData, state: GameState) {
  if (state.tutorialSkipped || !state.activeTutorialDialogId) return undefined;
  return data.tutorialDialogueById[state.activeTutorialDialogId];
}

function tutorialDialogueMood(dialog?: TutorialDialogue): GuideMood {
  if (!dialog) return 'default';
  if (dialog.emotion === 'happy') return 'happy';
  if (dialog.emotion === 'warning' || dialog.emotion === 'surprised') return 'warning';
  return 'default';
}

function tutorialHighlightTarget(data: GameData, state: GameState) {
  const active = currentTutorialStoryStep(data, state);
  if (active?.highlightTarget) return active.highlightTarget;
  if (state.tutorialSkipped) return undefined;
  if (state.tutorialStage === 'go_market') return 'tab-market';
  if (state.tutorialStage === 'inspect_good') return 'market-good-cotton_cloth';
  if (state.tutorialStage === 'buy_first_good') return 'buy-button-cotton_cloth';
  if (state.tutorialStage === 'open_map') return 'tab-map';
  if (state.tutorialStage === 'choose_first_destination') return 'travel-button-busanpo-daegu';
  if (state.tutorialStage === 'sell_first_good') return state.currentPortId === 'daegu' ? 'sell-button-cotton_cloth' : 'tab-market';
  if (state.tutorialStage === 'cart_goal' || state.tutorialStage === 'equipment_intro') return 'tab-vehicles';
  if (state.tutorialStage === 'quest_intro') return 'tab-quests';
  if (state.tutorialStage === 'fishing_intro') return 'fishing-open-hero';
  return undefined;
}

function tutorialIsPaused(data: GameData, state: GameState) {
  const dialog = currentTutorialStoryStep(data, state);
  return Boolean(dialog && state.isPausedForDialog && dialog.pauseGame);
}

function completeTutorialDialog(data: GameData, state: GameState, dialog: TutorialDialogue): GameState {
  const completedTutorialSteps = [...new Set([...(state.completedTutorialSteps ?? []), dialog.id])];
  const nextDialog = dialog.nextId ? data.tutorialDialogueById[dialog.nextId] : undefined;
  if (nextDialog) {
    return {
      ...state,
      completedTutorialSteps,
      activeTutorialDialogId: nextDialog.id,
      isPausedForDialog: nextDialog.pauseGame,
      tutorialStage: nextDialog.stage
    };
  }
  return {
    ...state,
    completedTutorialSteps,
    activeTutorialDialogId: undefined,
    isPausedForDialog: false,
    tutorialStage: dialog.stage
  };
}

function skipTutorial(state: GameState): GameState {
  return {
    ...state,
    tutorialSkipped: true,
    tutorialStage: 'skipped',
    activeTutorialDialogId: undefined,
    isPausedForDialog: false,
    completedTutorialSteps: [...new Set([...(state.completedTutorialSteps ?? []), 'skipped'])]
  };
}

function queueTutorialDialog(data: GameData, state: GameState, dialogId: string): GameState {
  if (state.tutorialSkipped || state.activeTutorialDialogId) return state;
  if (state.completedTutorialSteps?.includes(dialogId)) return state;
  const dialog = data.tutorialDialogueById[dialogId];
  if (!dialog) return state;
  return {
    ...state,
    activeTutorialDialogId: dialog.id,
    isPausedForDialog: dialog.pauseGame,
    tutorialStage: dialog.stage
  };
}

function tutorialAfterOpenTab(data: GameData, state: GameState, tab: Tab): GameState {
  if (tab === 'market') {
    if (state.tutorialStage === 'go_market') return queueTutorialDialog(data, state, 'market_first_001');
    if (state.tutorialStage === 'sell_first_good' && state.currentPortId === 'daegu' && (state.cargo.cotton_cloth ?? 0) > 0) {
      return queueTutorialDialog(data, state, 'sell_first_001');
    }
  }
  if (tab === 'map' && state.tutorialStage === 'open_map') return queueTutorialDialog(data, state, 'map_first_001');
  return state;
}

function longGrowthPathSteps(data: GameData, state: GameState): GrowthPathStep[] {
  const base = growthPathSteps(data, state);
  const handcartDone = Boolean(state.questProgress.ownedCarts.handcart);
  const fishingDone = state.questProgress.fishingCount > 0 || state.completedQuests.includes('fish_for_inland');
  const fishingBoatDone = Boolean(state.questProgress.ownedShips.fishing_boat) || state.shipId === 'fishing_boat';
  const southSeaDone = Boolean(state.questProgress.visitedPorts.mokpo || state.questProgress.visitedPorts.yeosu || state.questProgress.visitedPorts.tongyeong);
  const jejuReady = southSeaDone && (fishingBoatDone || state.questProgress.ownedShips.coastal_merchant || state.shipId === 'coastal_merchant');
  const jejuDone = Boolean(state.questProgress.visitedPorts.jeju);
  const coastalDone = Boolean(state.questProgress.ownedShips.coastal_merchant || state.shipId === 'coastal_merchant');
  const permitDone = state.permits.includes('waegwan_pass');
  const tsushimaDone = Boolean(state.questProgress.visitedPorts.tsushima);
  const steps: GrowthPathStep[] = [
    ...base.slice(0, 5),
    { title: '어업 시작', text: '항구 어장', tab: 'port', done: fishingDone, iconGoodId: 'fresh_fish' },
    { title: '어선 장만', text: '남해 준비', tab: 'vehicles', done: fishingBoatDone, iconAsset: shipArtFor(data, data.shipById.fishing_boat) },
    { title: '남해 거점', text: '목포(목포진)/여수', tab: 'map', done: southSeaDone, iconAsset: HUB_ICON.map, targetPortId: state.currentPortId === 'busanpo' ? 'tongyeong' : 'mokpo' },
    { title: '제주 준비', text: '배와 수리비', tab: 'vehicles', done: jejuReady, iconAsset: shipArtFor(data, data.shipById.coastal_merchant) },
    { title: '제주 도착', text: '말과 감귤', tab: 'map', done: jejuDone, iconGoodId: 'horse', targetPortId: 'jeju' },
    { title: '연안 상선', text: '큰 짐칸', tab: 'vehicles', done: coastalDone, iconAsset: shipArtFor(data, data.shipById.coastal_merchant) },
    { title: '왜관 허가', text: '관청 의뢰', tab: 'quests', done: permitDone, iconGoodId: 'japanese_paper' },
    { title: '쓰시마(대마도)', text: '바깥 교역', tab: 'map', done: tsushimaDone, iconGoodId: 'silver', targetPortId: 'tsushima' }
  ];
  return steps.map((step, index, allSteps) => ({
    ...step,
    done: index > 0 && !handcartDone && step.title !== '면포 2개' && step.title !== '대구 이동' && step.title !== '면포 팔기' && step.title !== '소금 장사'
      ? step.done && allSteps[index - 1].done
      : step.done
  }));
}

function navigateGrowthStep(data: GameData, state: GameState, step: GrowthPathStep, onNavigate: (tab: Tab) => void, onSelectRoute?: (routeId: string) => void) {
  if (step.tab === 'map' && step.targetPortId && onSelectRoute) {
    const route = availableRoutes(data, state).find((item) => routeDestination(item, state.currentPortId) === step.targetPortId);
    if (route) onSelectRoute(route.id);
  }
  onNavigate(step.tab);
}

function TutorialCoachCard({
  data,
  state,
  onNavigate,
  onSelectRoute
}: {
  data: GameData;
  state: GameState;
  onNavigate: (tab: Tab) => void;
  onSelectRoute: (routeId: string) => void;
}) {
  const steps = growthPathSteps(data, state);
  const activeIndex = steps.findIndex((step) => !step.done);
  if (activeIndex === -1) return null;
  const active = steps[activeIndex];
  const goStep = (step: GrowthPathStep) => navigateGrowthStep(data, state, step, onNavigate, onSelectRoute);
  const activeGood = active.iconGoodId ? data.goodById[active.iconGoodId] : undefined;
  const currentPort = data.portById[state.currentPortId];
  const currentIsOrigin = activeGood
    ? originPortsForGood(data, activeGood).includes(currentPort.id) || currentPort.produces.includes(activeGood.id)
    : false;
  const fairyMood: GuideMood = active.title.includes('팔기') || active.title.includes('손수레') || active.title.includes('제주') ? 'warning' : active.done ? 'happy' : 'default';
  const fairyLine = (() => {
    if (active.title === '면포 2개' && currentIsOrigin) return '정우야, 여긴 면포를 만드는 항구야. 사는 값이 좋아서 첫 물건으로 딱 맞아.';
    if (active.title === '대구 이동') return '대구는 면포를 비싸게 사는 내륙 장터야. 지도에서 대구로 가는 길을 골라봐.';
    if (active.title === '면포 팔기') return '도착했어. 면포를 누르면 산 값보다 얼마나 더 받을 수 있는지 바로 보여.';
    if (active.title === '소금 장사') return '소금은 바닷가에서 싸고 내륙에서 비싸요. 생산지와 수요지를 같이 보세요.';
    if (active.title === '어업') return '오늘은 조류가 좋아 보여요. 어업은 느리지만 다시 일어설 수 있는 길이에요.';
    if (active.tab === 'map') return `시간여행 상단은 길을 고르는 눈이 중요해요. ${active.text}로 가보자.`;
    if (active.tab === 'vehicles') return `더 멀리 가려면 장비와 동료를 챙겨야 해요. ${active.text}를 확인하자.`;
    return `정우야, 조선 장터에서는 물건 그림을 눌러 하나씩 사고팔면 돼. ${active.text}부터 해보자.`;
  })();
  return (
    <section className="tutorial-coach tutorial-path-panel" data-testid="tutorial-coach">
      <div className="fairy-companion-frame" aria-hidden="true">
        <GuideSpirit mood={fairyMood} className="coach-portrait" />
        <span>요정</span>
      </div>
      <div className="tutorial-path-copy">
        <p className="eyebrow">시간여행 요정의 안내</p>
        <strong>{active.title}</strong>
        <p>{fairyLine}</p>
      </div>
      <div className="tutorial-path first-30-path" data-testid="tutorial-path">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isLocked = index > activeIndex;
          return (
            <button
              key={step.title}
              className={`tutorial-step-card ${step.done ? 'done' : ''} ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
              data-testid={isActive ? 'tutorial-step-active' : undefined}
              onClick={() => !isLocked && goStep(step)}
            >
              <span className="tutorial-step-icon">
                {step.iconGoodId ? <GoodIcon good={data.goodById[step.iconGoodId]} /> : <img src={step.iconAsset} alt="" />}
              </span>
              <strong>{step.title}</strong>
              <small>{step.done ? '완료' : isActive ? '다음' : step.text}</small>
            </button>
          );
        })}
      </div>
      <button className="primary coach-action" onClick={() => goStep(active)}>{active.tab === 'map' ? '지도 보기' : active.tab === 'vehicles' ? '장비 보기' : '시장 가기'}</button>
    </section>
  );
}

function FacilityPanel({
  data,
  state,
  facility,
  onNavigate,
  onFish
}: {
  data: GameData;
  state: GameState;
  facility: HubAction;
  onNavigate: (tab: Tab) => void;
  onFish?: () => void;
}) {
  const port = data.portById[state.currentPortId];
  const meta = FACILITY_META[facility];
  const flavor = portFlavor(data, port);
  const featuredGoods = marketGoodsForPort(data, port).slice(0, 4);
  const activeQuests = data.quests.filter((quest) => state.activeQuestIds.includes(quest.id) && !state.completedQuests.includes(quest.id)).slice(0, 2);
  const nextShip = nextShipFor(data, data.shipById[state.shipId]);
  const nextCart = nextCartFor(data, data.cartById[state.cartId]);
  const sellHints = cargoSaleHintsForCurrentPort(data, state, 2);
  const buyHints = potentialBuyHintsForCurrentPort(data, state, 2);
  const companionLine = companionFacilityLine(data, state, facility);
  return (
    <section className={`facility-panel facility-${facility}`} data-testid={`facility-${facility}`}>
      <div className="facility-scene" style={{ backgroundImage: `url("${sceneAssetForPort(port)}")` }}>
          <img className="facility-npc" src={npcAsset(meta.npc)} alt="" onError={(event) => { event.currentTarget.src = npcAsset('/assets/painted2d/npc/fallback-npc.png'); }} />
      </div>
      <div className="facility-copy">
        <p className="eyebrow">{port.name} · {meta.title}</p>
        <h2>{meta.title}</h2>
        <p>{facility === 'market' ? flavor.market : facility === 'office' ? flavor.office : facility === 'tavern' ? flavor.tavern : flavor.yard}</p>
        {companionLine && <p className="companion-advice" data-testid="facility-companion-line">{companionLine}</p>}
        {facility === 'market' && (
          <div className="icon-strip">
            {(flavor.goods.length ? flavor.goods.map((id) => data.goodById[id]).filter(Boolean) : featuredGoods).slice(0, 4).map((good) => <GoodIcon key={good.id} good={good} />)}
          </div>
        )}
        {facility === 'office' && (
          <div className="mini-list">
            {activeQuests.length === 0 ? <span>새 의뢰 대기</span> : activeQuests.map((quest) => <span key={quest.id}>{quest.name}</span>)}
          </div>
        )}
        {facility === 'tavern' && (
          <div className="mini-list">
            <span>{sellHints[0] ? `${sellHints[0].goodName} → ${sellHints[0].toPortName}` : '실은 짐 소문 없음'}</span>
            <span>{buyHints[0] ? `${buyHints[0].goodName} 사기 좋음` : flavor.rumor}</span>
          </div>
        )}
        {facility === 'shipyard' && (
          <div className="mini-list">
            <span>{nextShip ? `다음 배 ${nextShip.name}` : '최고 배 보유'}</span>
            <span>{nextCart ? `다음 수레 ${nextCart.name}` : '최고 수레 보유'}</span>
          </div>
        )}
        <div className="facility-actions">
          <button className="primary" onClick={() => onNavigate(meta.tab)}>{meta.action}</button>
          {facility === 'market' && onFish && canFishAtPort(port) && <button data-testid="facility-fishing-button" onClick={onFish}>어업 준비</button>}
          {facility === 'tavern' && <button onClick={() => onNavigate('map')}>지도 보기</button>}
        </div>
      </div>
    </section>
  );
}

function ShipBerthPanel({ data, state, onCallShip }: { data: GameData; state: GameState; onCallShip: () => void }) {
  const berth = data.portById[state.shipPortId ?? state.currentPortId];
  const ship = data.shipById[state.shipId];
  const { hasSeaAccess, days, cost } = shipCallEstimate(data, state);
  const shipHere = (state.shipPortId ?? state.currentPortId) === state.currentPortId;
  return (
    <section className="panel ship-berth-panel ship-caller-panel" data-testid="ship-berth-panel">
      <img className="ship-caller-npc" src={npcAsset('/assets/painted2d/npc/fallback-npc.png')} alt="" />
      <div className="speech-bubble compact">
        <p className="eyebrow">항구 사공</p>
        <h2>{shipHere ? `${ship?.name ?? '배'} 정박 중` : `${berth?.name ?? '정박지'}에 배가 있어요`}</h2>
        <p>{shipHere ? `바닷길 짐칸: ${routeCargoLimitText(data, state, { mode: 'sea' } as Route)}` : hasSeaAccess ? `${money(cost)} · ${days}일이면 불러올 수 있어요.` : '내륙에서는 배를 부를 수 없어요.'}</p>
      </div>
      <div className="berth-mini-map" aria-label="배 정박 위치">
        <img src={shipArtFor(data, ship)} alt="" />
        <span>{berth?.name ?? '정박지'}</span>
      </div>
      <CargoSlotStrip data={data} state={state} />
      {!shipHere && <button onClick={onCallShip} disabled={!hasSeaAccess}>{hasSeaAccess ? '배 불러오기' : '항구 필요'}</button>}
    </section>
  );
}

function PortFlavorPanel({ data, state, port }: { data: GameData; state: GameState; port: Port }) {
  const flavor = portFlavor(data, port);
  const monthly = currentMonthEvent(data, state.date.month);
  const sellHint = cargoSaleHintsForCurrentPort(data, state, 1)[0];
  const buyHint = potentialBuyHintsForCurrentPort(data, state, 1)[0];
  const cargoText = Object.entries(state.cargo)
    .filter(([, amount]) => amount > 0)
    .slice(0, 2)
    .map(([goodId, amount]) => `${data.goodById[goodId]?.name ?? goodId} ${amount}`)
    .join(' · ');
  const goods = (flavor.goods.length ? flavor.goods : port.produces.slice(0, 3))
    .map((id) => data.goodById[id])
    .filter(Boolean);
  return (
    <section className="panel port-flavor-panel signboard" data-testid="port-flavor-card">
      <p className="eyebrow">오늘의 항구</p>
      <div className="port-flavor-head">
        <h2>{flavor.title}</h2>
        <span className="port-trust-chip" data-testid="port-trust-chip">신뢰 {state.portTrust[port.id] ?? 0}</span>
      </div>
      <p>{flavor.line}</p>
      <div className="port-flavor-goods">
        {goods.map((good) => (
          <span key={good.id}>
            <GoodIcon good={good} />
            {good.name}
          </span>
        ))}
      </div>
      <div className="today-port-brief">
        <span><b>시장 소식</b>{monthly?.name ?? '평온'}</span>
        <span><b>추천 행동</b>{sellHint ? `${sellHint.goodName} 팔기` : buyHint ? `${buyHint.goodName} 사기` : '시장 둘러보기'}</span>
        <span><b>실은 짐</b>{cargoText || '빈 짐칸 · 면포부터 사보세요'}</span>
      </div>
    </section>
  );
}

function PortView({
  data,
  state,
  onFish,
  onNavigate,
  onSellHint,
  onBuyHint,
  onCallShip,
  onSfx,
  highlightTarget
}: {
  data: GameData;
  state: GameState;
  onFish: () => void;
  onNavigate: (tab: Tab) => void;
  onSellHint: (hint: TradeHint) => void;
  onBuyHint: (hint: TradeHint) => void;
  onCallShip: () => void;
  onSfx: (key: SfxKey) => void;
  highlightTarget?: string;
}) {
  const port = data.portById[state.currentPortId];
  const monthly = currentMonthEvent(data, state.date.month);
  const canFish = canFishAtPort(port);
  const [hubView, setHubView] = useState<HubAction | 'routes'>('market');
  const sellHints = cargoSaleHintsForCurrentPort(data, state, 3);
  const buyHints = potentialBuyHintsForCurrentPort(data, state, 3);
  return (
    <div className="landscape-layout port-layout">
      <div className="main-panel">
        <section className="scene-card port-scene landscape-hero port-scene-stage">
          <img src={sceneAssetForPort(port)} alt="" />
          <div className="scene-copy">
            <p className="eyebrow">{port.region} · {port.tier}급 거점</p>
            <h2>{port.name}</h2>
            <p>{port.description}</p>
            <div className="port-hero-ctas">
              <button className={`primary ${highlightTarget === 'tab-market' ? 'tutorial-highlight' : ''}`} onClick={() => onNavigate('market')}>시장 가기</button>
              <button className={`secondary ${highlightTarget === 'tab-map' ? 'tutorial-highlight' : ''}`} onClick={() => onNavigate('map')}>출항</button>
              <button className="ghost-light" onClick={() => onNavigate('quests')}>의뢰</button>
              {canFish && <button className={`small-action ${highlightTarget === 'fishing-open-hero' ? 'tutorial-highlight' : ''}`} data-testid="fishing-open-hero" onClick={onFish}>어업 준비</button>}
            </div>
          </div>
          <PortHub port={port} canFish={canFish} selected={hubView} onSelect={setHubView} onNavigate={onNavigate} onFish={onFish} onSfx={onSfx} />
        </section>
      </div>
      <aside className="side-panel">
        <PortFlavorPanel data={data} state={state} port={port} />
        <div className="side-quick-ctas" aria-label="우선 행동">
          <button className="primary" onClick={() => onNavigate('market')}>시장 가기</button>
          <button className="secondary" onClick={() => onNavigate('map')}>{canFish ? '출항/이동' : '길 찾기'}</button>
          <button className="ghost-light" onClick={() => onNavigate('quests')}>의뢰 3개</button>
        </div>
        {hubView === 'routes' ? <button className="primary wide-action" onClick={() => onNavigate('map')}>전체 지도 열기</button> : <FacilityPanel data={data} state={state} facility={hubView} onNavigate={onNavigate} onFish={onFish} />}
        <ShipBerthPanel data={data} state={state} onCallShip={onCallShip} />
        {hubView === 'tavern' && <TavernRumorPanel data={data} state={state} sellHints={sellHints} buyHints={buyHints} />}
        <MonthNewsCard data={data} monthly={monthly} />
        <TradeAdvicePanel data={data} sellHints={sellHints} buyHints={buyHints} onSellHint={onSellHint} onBuyHint={onBuyHint} />
      </aside>
    </div>
  );
}

function WorldMapBoard({
  data,
  state,
  routes,
  selectedRouteId,
  travelAnimation,
  saleGuide,
  onSelectRoute
}: {
  data: GameData;
  state: GameState;
  routes: Route[];
  selectedRouteId: string;
  travelAnimation: TravelAnimation | null;
  saleGuide?: TradeHint;
  onSelectRoute?: (routeId: string) => void;
}) {
  const connectedPortIds = new Set(routes.map((route) => routeDestination(route, state.currentPortId)));
  const selectedRoute = routes.find((route) => route.id === selectedRouteId);
  const selectedDestinationId = selectedRoute
    ? routeDestination(selectedRoute, state.currentPortId)
    : '';
  const tokenStyle = (() => {
    if (!travelAnimation) return undefined;
    const from = data.portById[travelAnimation.fromPortId];
    const to = data.portById[travelAnimation.toPortId];
    return {
      '--from-x': `${from.map.x}%`,
      '--from-y': `${from.map.y}%`,
      '--to-x': `${to.map.x}%`,
      '--to-y': `${to.map.y}%`
    } as CSSProperties;
  })();
  return (
    <section className="map-board landscape-map-board" aria-label="전체 지도">
      <KoreaRouteMapLayer />
      <svg className="map-route-lines normalized-map-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {data.routes.map((route) => {
          const from = data.portById[route.from];
          const to = data.portById[route.to];
          const available = route.from === state.currentPortId || route.to === state.currentPortId;
          return <line key={route.id} className={`map-route-line ${route.mode} ${isBorderTradeRoute(route) ? 'border-trade' : ''} ${available ? 'available' : 'locked'} ${route.id === selectedRouteId ? 'selected' : ''} ${route.id === saleGuide?.routeId ? 'sale-guide-line' : ''}`} x1={from.map.x} y1={from.map.y} x2={to.map.x} y2={to.map.y} />;
        })}
      </svg>
      <div className="map-border-label map-border-yalu">압록강</div>
      <div className="map-border-label map-border-tumen">두만강</div>
      {data.ports.map((mapPort) => (
        <button
          key={mapPort.id}
          type="button"
          data-testid={`map-port-${mapPort.id}`}
          className={`port-dot port-${mapPort.id} kind-${mapPort.kind} tier-${mapPort.tier.toLowerCase()} label-${mapPort.map.labelSide ?? 'bottom'} role-${mapPort.map.role ?? mapPort.kind} ${mapPort.id === state.currentPortId ? 'current' : ''} ${mapPort.id === (state.shipPortId ?? state.currentPortId) ? 'ship-berth' : ''} ${mapPort.id === selectedDestinationId ? 'selected-destination' : ''} ${mapPort.id === saleGuide?.toPortId ? 'sale-target' : ''} ${connectedPortIds.has(mapPort.id) ? 'reachable' : 'locked'}`}
          style={{ left: `${mapPort.map.x}%`, top: `${mapPort.map.y}%` }}
          title={modernMapName(mapPort)}
          aria-label={`${modernMapName(mapPort)} ${connectedPortIds.has(mapPort.id) ? '이동 후보' : '아직 먼 도시'}`}
          onClick={() => {
            const route = routes.find((item) => routeDestination(item, state.currentPortId) === mapPort.id);
            if (route) onSelectRoute?.(route.id);
          }}
        >
          <span>{modernMapName(mapPort)}</span>
        </button>
      ))}
      {saleGuide && data.portById[saleGuide.toPortId] && (
        <div
          className="map-sale-guide-pop"
          style={{ left: `${data.portById[saleGuide.toPortId].map.x}%`, top: `${data.portById[saleGuide.toPortId].map.y}%` }}
          aria-label={`${saleGuide.goodName} 판매 추천`}
        >
          <GoodIcon good={data.goodById[saleGuide.goodId]} />
          <strong>{modernMapName(data.portById[saleGuide.toPortId])}</strong>
          <small>+{money(saleGuide.totalProfit ?? saleGuide.profitEach)}</small>
        </div>
      )}
      {travelAnimation && tokenStyle && (
        <VehiclePixelToken
          mode={travelAnimation.mode}
          className={`traveler-token ${travelAnimation.mode}`}
          style={tokenStyle}
          testId="travel-animation-token"
        />
      )}
    </section>
  );
}

function KoreaRouteMapLayer() {
  return (
    <svg className="korea-map-layer clean-korea-map normalized-map-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <rect className="map-sea west-sea" x="0" y="0" width="31" height="100" />
      <rect className="map-sea central-sea" x="31" y="0" width="44" height="100" />
      <rect className="map-sea east-sea" x="75" y="0" width="25" height="100" />
      <rect className="map-sea south-sea" x="24" y="81" width="60" height="19" />
      <text className="sea-label west-label" x="10" y="49">서해</text>
      <text className="sea-label south-label" x="52" y="88">남해</text>
      <text className="sea-label east-label" x="87" y="41">동해</text>
      <path
        className="korea-land-shadow"
        d="M35 5 C42 2 52 3 60 6 C66 8 71 7 76 11 C73 17 74 23 72 30 C69 37 64 41 63 48 C62 55 67 61 70 68 C70 75 65 80 58 82 C54 83 51 79 48 80 C44 82 43 85 39 83 C34 80 33 75 34 68 C36 62 32 58 34 52 C37 46 33 42 35 36 C38 30 34 27 36 22 C31 17 30 10 35 5 Z"
      />
      <path
        className="korea-land-main"
        d="M35 4 C42 2 52 3 60 6 C66 8 71 7 75 11 C72 17 73 23 71 30 C68 37 63 41 62 48 C61 55 66 61 69 68 C69 74 64 78 57 80 C53 81 51 78 48 79 C44 81 43 84 39 82 C34 79 33 74 34 68 C36 62 32 58 34 52 C36 46 33 42 35 36 C37 30 34 27 36 23 C32 17 30 10 35 4 Z"
      />
      <path className="korea-north-region" d="M35 4 C42 2 52 3 60 6 C66 8 71 7 75 11 C72 17 73 23 71 30 C68 35 62 38 56 37 C49 36 44 34 39 35 C37 35 35 35 35 36 C37 30 34 27 36 23 C32 17 30 10 35 4 Z" />
      <path className="korea-coast-highlight" d="M35 4 C42 2 52 3 60 6 M75 11 C72 17 73 23 71 30 M62 48 C61 55 66 61 69 68 M69 68 C69 74 64 78 57 80 M39 82 C34 79 33 74 34 68 M34 52 C36 46 33 42 35 36 M36 23 C32 17 30 10 35 4" />
      <path className="dmz-line" d="M33 36 C43 34 52 37 62 36 C66 36 69 36 72 35" />
      <path className="korea-mountain spine" d="M57 9 C60 20 60 31 63 43 C61 55 65 67 67 76" />
      <path className="korea-mountain north-ridge" d="M44 10 C49 18 52 26 55 34" />
      <path className="korea-mountain west-ridge" d="M38 23 C43 34 40 48 44 60 C46 70 48 78 51 82" />
      <path className="river-line yalu" d="M34 11 C38 12 42 12 46 15" />
      <text className="border-river-label yalu-label" x="30" y="10">압록강</text>
      <path className="river-line tumen border-river" d="M58 7 C64 8 70 8 77 10" />
      <text className="border-river-label tumen-label" x="67" y="7">두만강</text>
      <path className="river-line daedong" d="M36 25 C41 23 46 25 51 27" />
      <path className="river-line han" d="M38 40 C45 38 52 42 58 43" />
      <path className="river-line nakdong" d="M59 58 C63 64 64 72 70 76" />
      <ellipse className="korea-island jeju-island" cx="39.7" cy="90.2" rx="11" ry="4.1" />
      <ellipse className="korea-island tsushima-island" cx="81.2" cy="85.6" rx="4.1" ry="8.4" />
      <ellipse className="korea-island ulleungdo-island" cx="83.8" cy="50.5" rx="2.8" ry="2.2" />
      <path className="southern-islets" d="M50 82 L52 82 M56 81 L58 81 M62 79 L64 79 M34 80 L36 80 M28 78 L30 78" />
      <path className="sea-route-hint" d="M69 79 C73 81 77 83 81 86" />
      <path className="sea-route-hint east-chain" d="M69 48 C75 47 80 48 84 51" />
      <text className="island-label" x="82" y="55">울릉</text>
    </svg>
  );
}

function MapView({
  data,
  state,
  routes,
  selectedRouteId,
  onSelectRoute,
  travelAnimation,
  onTravel,
  disabled = false,
  highlightTarget
}: {
  data: GameData;
  state: GameState;
  routes: Route[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  travelAnimation: TravelAnimation | null;
  onTravel: (route: Route) => void;
  disabled?: boolean;
  highlightTarget?: string;
}) {
  const port = data.portById[state.currentPortId];
  const sellHints = cargoSaleHintsForCurrentPort(data, state, 3);
  const buyHints = potentialBuyHintsForCurrentPort(data, state, 3);
  const bestSaleGuide = sellHints[0];
  const selectedRoute = routes.find((route) => route.id === selectedRouteId) ?? routes.find((route) => route.id === bestSaleGuide?.routeId) ?? routes[0];
  const selectedRouteHint = selectedRoute
    ? sellHints.find((hint) => hint.routeId === selectedRoute.id) ?? buyHints.find((hint) => hint.routeId === selectedRoute.id)
    : undefined;
  const selectedRouteDays = selectedRoute ? effectiveRouteDays(data, state, selectedRoute) : 0;
  return (
    <div className="landscape-layout map-layout">
      <div className="main-panel">
        <WorldMapBoard data={data} state={state} routes={routes} selectedRouteId={selectedRoute?.id ?? ''} travelAnimation={travelAnimation} saleGuide={bestSaleGuide} onSelectRoute={onSelectRoute} />
      </div>
      <aside className="side-panel map-side">
        <section className="panel map-command">
          <p className="eyebrow">출발지</p>
          <h2>{port.name}</h2>
          <p>밝은 점은 지금 갈 수 있는 목적지입니다.</p>
        </section>
        {selectedRoute && (
          <section className="panel route-preview" data-testid="route-preview">
            {(() => {
              const destination = data.portById[routeDestination(selectedRoute, state.currentPortId)];
              const blocked = routeBlockedReason(data, state, selectedRoute);
              const repair = routeRepairReadiness(data, state, selectedRoute);
              const usedCargo = cargoUsed(data, state.cargo);
              const routeCapacity = routeCargoCapacity(data, state, selectedRoute);
              const expectedProfit = selectedRouteHint ? `+${money(selectedRouteHint.totalProfit ?? selectedRouteHint.profitEach)}` : '추천 없음';
              return (
                <>
                  <img className="route-destination-scene" src={sceneAssetForPort(destination)} alt="" />
                  <div className="route-preview-head">
                    <RouteToken data={data} state={state} mode={selectedRoute.mode} />
                    <div>
                      <p className="eyebrow">{routeModeLabel(selectedRoute)} · {selectedRouteDays}일</p>
                      <h2>{destination.name}</h2>
                    </div>
                  </div>
                  <div className="route-risk-row">
                    <span className="icon-chip">위험 {displayedRouteRisk(data, state, selectedRoute)}/5</span>
                    <span className="icon-chip">{isBorderTradeRoute(selectedRoute) ? '국경 장시' : selectedRoute.mode === 'sea' ? '배로 가요' : '수레로 가요'}</span>
                    <span className="icon-chip">{selectedRouteDays}일</span>
                  </div>
                  <div className="route-overview-grid" data-testid="route-overview-grid">
                    <span><b>위치 타입</b>{portKindLabel(destination)}</span>
                    <span><b>수리</b><em className={repair.tone}>{repair.label}</em></span>
                    <span><b>짐칸</b>{usedCargo}/{routeCapacity}칸</span>
                    <span><b>벌 돈</b>{expectedProfit}</span>
                  </div>
                  <CargoSlotStrip data={data} state={state} route={selectedRoute} />
                  <div className="route-prep-board" data-testid="route-prep-board">
                    <span className={blocked ? 'bad' : 'ok'}>{blocked ? '준비 필요' : '출발 가능'}</span>
                    <span>{selectedRoute.mode === 'sea' && state.shipPortId !== state.currentPortId ? '배가 다른 항구에 있어요' : '이동 수단 확인'}</span>
                    <span>{cargoUsed(data, state.cargo) > routeCargoCapacity(data, state, selectedRoute) ? '수레에 다 안 실려요' : '짐칸 확인'}</span>
                  </div>
                  {companionSpeedBonus(data, state) > 0 && <span className="icon-chip speed-chip">동료 속도 +{Math.round(companionSpeedBonus(data, state) * 100)}%</span>}
                  {guardRiskReduction(data, state) > 0 && <span className="icon-chip speed-chip">호위 위험 -{guardRiskReduction(data, state)}</span>}
                  {selectedRouteHint && (
                    <div className="route-profit-box" data-testid="selected-route-profit">
                      <GoodIcon good={data.goodById[selectedRouteHint.goodId]} />
                      <strong>{selectedRouteHint.goodName}</strong>
                      <span>{money(selectedRouteHint.buyPrice)} → {money(selectedRouteHint.sellPrice)} · +{money(selectedRouteHint.totalProfit ?? selectedRouteHint.profitEach)}</span>
                    </div>
                  )}
                  <div className="chips hazard-chips">{selectedRoute.hazards.slice(0, 4).map((hazard) => <span className={`route-danger-chip hazard-${hazard}`} data-testid="route-danger-chip" key={hazard}>{hazard}</span>)}</div>
                  {blocked && <p className="danger-text">{blocked}</p>}
                  <button className={`primary wide-action ${highlightTarget === `travel-button-${selectedRoute.id}` || (highlightTarget === 'travel-button-busanpo-daegu' && destination.id === 'daegu') ? 'tutorial-highlight' : ''}`} data-testid={`travel-button-${selectedRoute.id}`} disabled={disabled || Boolean(blocked) || Boolean(travelAnimation)} onClick={() => onTravel(selectedRoute)}>
                    {travelAnimation ? '이동 중' : '출발'}
                  </button>
                </>
              );
            })()}
          </section>
        )}
        <section className="panel sale-guide-panel" data-testid="map-sale-guide-panel">
          <h2>지금 팔 곳</h2>
          {sellHints.length === 0 ? (
            <p className="hint-text">실은 짐 중 가까운 판매처가 아직 없어요.</p>
          ) : (
            <div className="sale-guide-list">
              {sellHints.map((hint) => (
                <button key={`${hint.routeId}-${hint.goodId}`} className={hint.routeId === selectedRoute?.id ? 'active' : ''} onClick={() => onSelectRoute(hint.routeId)}>
                  <GoodIcon good={data.goodById[hint.goodId]} />
                  <span><strong>{hint.goodName}</strong><small>{hint.toPortName} · {money(hint.buyPrice)}→{money(hint.sellPrice)}</small></span>
                  <em>+{money(hint.totalProfit ?? hint.profitEach)}</em>
                </button>
              ))}
            </div>
          )}
        </section>
        <section className="panel route-list-panel">
          <h2>다음에 살 것</h2>
          <div className="route-list compact-route-list">
            {routes.map((route) => {
              const destination = data.portById[routeDestination(route, state.currentPortId)];
              const blocked = routeBlockedReason(data, state, route);
              const sellRouteHint = sellHints.find((hint) => hint.routeId === route.id);
              const buyRouteHint = buyHints.find((hint) => hint.routeId === route.id);
              return (
                <button className={`route-option ${selectedRoute?.id === route.id ? 'active' : ''}`} key={route.id} onClick={() => onSelectRoute(route.id)} disabled={Boolean(blocked)}>
                  <RouteToken data={data} state={state} mode={route.mode} />
                  <span><strong>{destination.name}</strong><small>{effectiveRouteDays(data, state, route)}일 · 위험 {displayedRouteRisk(data, state, route)}/5</small></span>
                  {sellRouteHint && <em>팔기 +{money(sellRouteHint.totalProfit ?? sellRouteHint.profitEach)}</em>}
                  {!sellRouteHint && buyRouteHint && <em>사기 +{money(buyRouteHint.profitEach)}</em>}
                </button>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}

function MarketView({
  data,
  state,
  used,
  capacity,
  focusGoodId,
  onBuy,
  onSell,
  onInspectGood,
  onNavigate,
  onSellHint,
  onBuyHint,
  onSfx,
  disabled = false,
  highlightTarget
}: {
  data: GameData;
  state: GameState;
  used: number;
  capacity: number;
  focusGoodId: string;
  onBuy: (good: Good, quantity: number) => void;
  onSell: (good: Good, quantity: number) => void;
  onInspectGood: (good: Good) => void;
  onNavigate: (tab: Tab) => void;
  onSellHint: (hint: TradeHint) => void;
  onBuyHint: (hint: TradeHint) => void;
  onSfx: (key: SfxKey) => void;
  disabled?: boolean;
  highlightTarget?: string;
}) {
  const [tradeFloat, setTradeFloat] = useState('');
  const port = data.portById[state.currentPortId];
  const monthly = currentMonthEvent(data, state.date.month);
  const flavor = portFlavor(data, port);
  const baseFeatured = marketGoodsForPort(data, port);
  const hints = potentialBuyHintsForCurrentPort(data, state, 4);
  const sellHints = cargoSaleHintsForCurrentPort(data, state, 4);
  const carriedGoods = Object.entries(state.cargo)
    .filter(([, quantity]) => quantity > 0)
    .map(([goodId]) => data.goodById[goodId])
    .filter((good): good is Good => Boolean(good));
  const priorityGoods = [
    ...sellHints.map((hint) => data.goodById[hint.goodId]),
    ...carriedGoods,
    focusGoodId ? data.goodById[focusGoodId] : undefined
  ].filter((good): good is Good => Boolean(good));
  const marketPool = [
    ...baseFeatured,
    ...priorityGoods.filter((good) => !baseFeatured.some((item) => item.id === good.id))
  ];
  const unsortedFeatured = flavor.marketSlots?.length
    ? [
        ...flavor.marketSlots
          .map((id) => data.goodById[id])
          .filter((good): good is Good => Boolean(good) && marketPool.some((item) => item.id === good.id)),
        ...marketPool.filter((good) => !flavor.marketSlots?.includes(good.id))
      ]
    : marketPool;
  const featured = sortedMarketGoods(data, state, port, unsortedFeatured, hints, sellHints);
  const hasStallPositions = false;
  const [selectedGoodId, setSelectedGoodId] = useState(focusGoodId);

  function flashTrade(text: string) {
    setTradeFloat(text);
    window.setTimeout(() => setTradeFloat(''), 900);
  }

  const selectedGood = featured.find((good) => good.id === selectedGoodId);

  useEffect(() => {
    if (focusGoodId) setSelectedGoodId(focusGoodId);
  }, [focusGoodId]);

  return (
    <div className="landscape-layout market-layout visual-market-layout">
      <div className="main-panel market-scene-main">
        <section className="market-scene-stage" style={{ backgroundImage: `url("${sceneAssetForPort(port)}")` }}>
          <div className="market-scene-sign">
            <p className="eyebrow">{port.name}</p>
            <h2>시장</h2>
            <span>아이콘을 고르고 사기/팔기를 눌러요</span>
          </div>
      <img className="market-npc" src={npcAsset('/assets/painted2d/npc/market-merchant.png')} alt="" onError={(event) => { event.currentTarget.src = npcAsset('/assets/painted2d/npc/fallback-npc.png'); }} />
          <div className={`market-stall-shelf ${hasStallPositions ? 'free-stall-shelf' : ''}`} aria-label="시장 상품">
            {featured.map((good) => {
              const quote = marketQuote(data, state, state.currentPortId, good);
              const label = priceLabel(good, quote.marketPrice, quote.averagePrice);
              const owned = state.cargo[good.id] ?? 0;
              const tag = goodMarketRole(port, good);
              const buyHint = hints.find((hint) => hint.goodId === good.id);
              const sellHint = sellHints.find((hint) => hint.goodId === good.id);
              const isTrend = monthly?.trendGoods?.includes(good.id);
              const isOfficialDemand = monthly?.officialDemandGoods?.includes(good.id);
              const stallPosition = hasStallPositions ? flavor.stallPositions?.[good.id] : undefined;
              return (
                <button
                  key={good.id}
                  className={`good-stall-token ${selectedGoodId === good.id ? 'active' : ''} ${buyHint ? 'recommended-buy' : ''} ${sellHint ? 'recommended-sell' : ''} ${highlightTarget === `market-good-${good.id}` ? 'tutorial-highlight' : ''}`}
                  data-testid={`market-good-${good.id}`}
                  style={stallPosition ? { left: `${stallPosition.x}%`, top: `${stallPosition.y}%` } : undefined}
                  onClick={() => {
                    onSfx('click');
                    setSelectedGoodId(good.id);
                    onInspectGood(good);
                  }}
                >
                  <span className="stall-badge-row">
                    <small className={`role-badge role-${tag === '특산' ? 'produce' : tag === '수요' ? 'demand' : 'normal'}`}>{tag}</small>
                    {isTrend && <small className="role-badge role-trend">유행</small>}
                    {isOfficialDemand && <small className="role-badge role-office">관청</small>}
                    {(buyHint || sellHint) && <b className={`recommend-badge ${buyHint ? 'buy' : 'sell'}`}>{buyHint ? '사기' : '팔기'}</b>}
                  </span>
                  <GoodIcon good={good} className="market-good-icon" />
                  <strong>{good.name}</strong>
                  <small className={`price-label ${label.tone}`} data-testid={`price-label-${good.id}`}>{label.label}</small>
                  <em>{owned ? `보유 ${owned}` : '보유 0'}</em>
                </button>
              );
            })}
          </div>
          {selectedGood && (() => {
            const quote = marketQuote(data, state, state.currentPortId, selectedGood);
            const buyPrice = quote.buyPrice;
            const sellPrice = quote.sellPrice;
            const total = buyPrice;
            const owned = state.cargo[selectedGood.id] ?? 0;
            const label = priceLabel(selectedGood, quote.marketPrice, quote.averagePrice);
            const buyBlocked = state.money < total || used + selectedGood.weight > capacity;
            const sellBlocked = owned < 1;
            const buyHint = hints.find((hint) => hint.goodId === selectedGood.id);
            const sellHint = sellHints.find((hint) => hint.goodId === selectedGood.id);
            const bestHint = sellHint ?? buyHint;
            const isTrend = monthly?.trendGoods?.includes(selectedGood.id);
            const isOfficialDemand = monthly?.officialDemandGoods?.includes(selectedGood.id);
            const avgCost = averageCargoCost(state, selectedGood.id);
            const currentProfit = avgCost ? sellPrice - avgCost : 0;
            const dealBonus = tradeDealBonus(data, state);
            const samePortRoundTrip = sellPrice - buyPrice;
            const tradeGuideMood: GuideMood = owned > 0 && currentProfit < 0 ? 'warning' : quote.relation === 'origin' ? 'happy' : quote.relation === 'demand' ? 'default' : 'warning';
            const tradeGuideLine = owned > 0 && currentProfit < 0
              ? '정우야, 지금 팔면 손해예요. 더 비싸게 사는 항구를 찾아봐요.'
              : quote.relation === 'origin'
                ? '여긴 생산지예요. 사는 값이 좋아요. 다른 곳으로 가져가면 돈을 벌기 쉬워요.'
                : quote.relation === 'demand'
                  ? '찾는 사람이 많은 장터예요. 가진 물건은 먼저 팔아도 되는지 확인해요.'
                  : '같은 항구에서 바로 되팔면 손해예요. 가는 길을 보고 움직여요.';
            return (
              <div className="trade-popover" data-testid="trade-popover">
                <button className="popover-close" type="button" onClick={() => { onSfx('click'); setSelectedGoodId(''); }} aria-label="거래창 닫기">×</button>
                <GoodIcon good={selectedGood} className="trade-popover-icon" />
                <div className="trade-popover-main">
                  <strong>{selectedGood.name}</strong>
                  <span>사는 값 {money(buyPrice)} · 파는 값 {money(sellPrice)} · 가진 수 {owned}개</span>
                  {owned > 0 && <span>내가 산 값 {money(avgCost || buyPrice)} · 지금 팔면 {currentProfit >= 0 ? '+' : ''}{money(currentProfit)}</span>}
                  <div className="trade-detail-grid">
                    <span><b>보통 값과 비교</b>{quote.averageDeltaPercent >= 0 ? '+' : ''}{quote.averageDeltaPercent}%</span>
                    <span><b>생산지</b>{quote.relation === 'origin' ? '예' : '아니오'}</span>
                    <span><b>수요</b>{quote.relation === 'demand' ? '높음' : '보통'}</span>
                    <span><b>팔기 좋은 곳</b>{bestHint ? bestHint.toPortName : '근처 없음'}</span>
                    <span><b>벌 돈</b>{bestHint ? `+${money(bestHint.profitEach)}` : '없음'}</span>
                    <span><b>바로 다시 팔면</b>{money(samePortRoundTrip)}</span>
                  </div>
                  <div className="market-flags">
                    <span className={`price-label ${label.tone}`}>{label.label}</span>
                    {buyHint && <span className="recommend-badge buy">사기 좋음</span>}
                    {sellHint && <span className="recommend-badge sell">팔 곳 있음</span>}
                    {isTrend && <span className="role-badge role-trend">유행</span>}
                    {isOfficialDemand && <span className="role-badge role-office">관청 수요</span>}
                    {dealBonus > 0 && <span className="market-status-chip">교역 +{Math.round(dealBonus * 100)}%</span>}
                    {buyBlocked && <span className="market-status-chip danger">{state.money < total ? '돈 부족' : '칸 부족'}</span>}
                    <span data-testid={`trade-estimate-${selectedGood.id}`}>{money(total)}</span>
                  </div>
                  <div className="price-reason-line">{quote.reasons.join(' · ')}</div>
                  <div className={`fairy-trade-note ${tradeGuideMood}`} data-testid="fairy-trade-note">
                    <GuideSpirit mood={tradeGuideMood} />
                    <span>{tradeGuideLine}</span>
                  </div>
                  <div className="sell-destination-chip">
                    {bestHint
                      ? `${bestHint.fromPortName} ${money(bestHint.buyPrice)} → ${bestHint.toPortName} ${money(bestHint.sellPrice)} · 개당 +${money(bestHint.profitEach)}`
                      : `같은 항구에서 바로 다시 팔면 ${money(samePortRoundTrip)}입니다.`}
                  </div>
                  {tradeFloat && <b className="trade-float">{tradeFloat}</b>}
                </div>
                <div className="trade-popover-actions">
                  <button
                    aria-label={`${selectedGood.name} 팔기`}
                    data-testid={`sell-button-${selectedGood.id}`}
                    className={`trade-icon sell ${highlightTarget === `sell-button-${selectedGood.id}` ? 'tutorial-highlight' : ''}`}
                    onClick={() => {
                      onSell(selectedGood, 1);
                      flashTrade(`-${selectedGood.name}  +${money(sellPrice)}`);
                    }}
                    disabled={disabled || sellBlocked}
                  >
                    <span>팔기</span>
                    <small>+{money(sellPrice)}</small>
                  </button>
                  <button
                    className={`trade-icon buy ${highlightTarget === `buy-button-${selectedGood.id}` ? 'tutorial-highlight' : ''}`}
                    aria-label={`${selectedGood.name} 사기`}
                    data-testid={`buy-button-${selectedGood.id}`}
                    onClick={() => {
                      onBuy(selectedGood, 1);
                      flashTrade(`+${selectedGood.name}  -${money(buyPrice)}`);
                    }}
                    disabled={disabled || buyBlocked}
                  >
                    <span>사기</span>
                    <small>-{money(buyPrice)}</small>
                  </button>
                </div>
              </div>
            );
          })()}
        </section>
      </div>
      <aside className="side-panel market-quick-panel">
        <section className="panel market-summary">
          <strong>남은 칸 {Math.max(0, capacity - used)}</strong>
          <span>돈 {money(state.money)}</span>
          <span>{port.produces.slice(0, 3).map((id) => data.goodById[id]?.name ?? id).join(' · ')}</span>
        </section>
        <MonthNewsCard data={data} monthly={currentMonthEvent(data, state.date.month)} />
        <TradeAdvicePanel data={data} sellHints={sellHints} buyHints={hints} onSellHint={onSellHint} onBuyHint={onBuyHint} />
      </aside>
    </div>
  );
}

function CargoLedger({
  data,
  state,
  used,
  capacity,
  onSellHint,
  onNavigate
}: {
  data: GameData;
  state: GameState;
  used: number;
  capacity: number;
  onSellHint?: (hint: TradeHint) => void;
  onNavigate?: (tab: Tab) => void;
}) {
  const visitedPorts = data.ports.filter((port) => state.questProgress.visitedPorts[port.id]);
  const sellHints = cargoSaleHintsForCurrentPort(data, state, 5);
  const tradedGoodIds = [...new Set([
    ...state.ledger.transactions.map((entry) => entry.goodId),
    ...Object.keys(state.cargo)
  ])];
  const discoveredCount = data.discoveries.filter((discovery) => state.discoveredIds[discovery.id]).length;
  const completedSealCount = state.completedLedgerSeals.length;
  const totalProfit = state.ledger.transactions.reduce((sum, entry) => sum + (entry.profit ?? 0), 0);
  const metNpcIds = ['market', 'office', 'tavern', 'shipyard'].filter((facility) => {
    const port = data.portById[state.currentPortId];
    return facility === 'shipyard' ? port.shipyardLevel > 0 || port.cartYardLevel > 0 : port.facilities.includes(facility) || facility === 'tavern';
  });
  const nextDiscovery = data.discoveries.find((discovery) => !state.discoveredIds[discovery.id]);
  const nextSeal = data.ledgerSeals
    .filter((seal) => !state.completedLedgerSeals.includes(seal.id))
    .map((seal) => {
      const statuses = seal.requirements.map((requirement) => ledgerSealRequirementStatus(data, state, requirement));
      return { seal, doneCount: statuses.filter((status) => status.done).length, total: statuses.length, next: statuses.find((status) => !status.done)?.label ?? seal.nextHint };
    })
    .sort((a, b) => b.doneCount - a.doneCount)[0];
  return (
    <div className="achievement-layout">
      <section className="panel achievement-hero">
        <div>
          <p className="eyebrow">정우상단 성취 장부</p>
          <h2>{state.fleetName ?? '정우상단'}의 길</h2>
          <p>방문, 거래, 발견, 장부 조각이 한눈에 보이는 상단 기록입니다.</p>
        </div>
        <div className="achievement-stamp-grid">
          <span><strong>{visitedPorts.length}/{data.ports.length}</strong><small>방문 항구</small></span>
          <span><strong>{tradedGoodIds.length}/{data.goods.length}</strong><small>거래 상품</small></span>
          <span><strong>{state.completedQuests.length}</strong><small>완료 의뢰</small></span>
          <span><strong>{totalProfit >= 0 ? '+' : ''}{money(totalProfit)}</strong><small>총 손익</small></span>
          <span><strong>{joinedCompanions(data, state).length + metNpcIds.length}</strong><small>만난 사람</small></span>
        </div>
      </section>

      <section className="panel cargo-achievement-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">지금 짐칸</p>
            <h2>짐칸 {used}/{capacity}</h2>
          </div>
          <button className="primary" onClick={() => onNavigate?.('market')}>시장 보기</button>
        </div>
        <CargoSlotStrip data={data} state={state} />
        {Object.keys(state.cargo).length === 0 ? <p className="empty-collection">빈 짐칸입니다.</p> : (
          <div className="cargo-grid cargo-sale-grid achievement-cargo-grid">
            {Object.entries(state.cargo).map(([goodId, amount]) => {
              const hint = sellHints.find((item) => item.goodId === goodId);
              return (
                <button
                  className={`cargo-sale-chip ${hint ? 'has-route' : ''}`}
                  data-testid={`cargo-sale-hint-${goodId}`}
                  key={goodId}
                  onClick={() => hint && onSellHint?.(hint)}
                  disabled={!hint}
                >
                  <GoodIcon good={data.goodById[goodId]} />
                  <span><strong>{data.goodById[goodId]?.name ?? goodId} {amount}개</strong><small>{hint ? `${hint.toPortName} ${money(hint.buyPrice)}→${money(hint.sellPrice)}` : '근처 차익 없음'}</small></span>
                  {hint && <em>+{money(hint.totalProfit ?? hint.profitEach)}</em>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel collection-panel achievement-collection">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">도감 진행</p>
            <h2>팔도 탐방과 물건 도감</h2>
          </div>
          <button onClick={() => onNavigate?.('map')}>지도에서 보기</button>
        </div>
        <div className="collection-stats achievement-bars">
          <span style={{ '--progress': `${Math.round((visitedPorts.length / data.ports.length) * 100)}%` } as CSSProperties}>항구 {visitedPorts.length}/{data.ports.length}</span>
          <span style={{ '--progress': `${Math.round((tradedGoodIds.length / data.goods.length) * 100)}%` } as CSSProperties}>상품 {tradedGoodIds.length}/{data.goods.length}</span>
          <span style={{ '--progress': `${Math.round((discoveredCount / Math.max(1, data.discoveries.length)) * 100)}%` } as CSSProperties}>발견 {discoveredCount}/{data.discoveries.length}</span>
          <span style={{ '--progress': `${Math.round((completedSealCount / Math.max(1, data.ledgerSeals.length)) * 100)}%` } as CSSProperties}>장부 {completedSealCount}/{data.ledgerSeals.length}</span>
        </div>
        <div className="collection-icons">
          {tradedGoodIds.length === 0 ? <span className="empty-collection">아직 모은 상품이 없어요</span> : tradedGoodIds.slice(0, 12).map((goodId) => <GoodIcon key={goodId} good={data.goodById[goodId]} />)}
        </div>
      </section>

      <LedgerSealSection data={data} state={state} />
      <DiscoveryLog data={data} state={state} />

      <section className="panel ledger-popover achievement-ledger">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">최근 장사</p>
            <h2>거래 장부</h2>
          </div>
          <button onClick={() => onNavigate?.('market')}>다음 거래</button>
        </div>
        <div className="ledger-list achievement-ledger-list">
          {state.ledger.transactions.length === 0 ? <p className="empty-collection">첫 거래를 기다리는 빈 장부입니다.</p> : state.ledger.transactions.slice(0, 8).map((entry) => (
            <article className="ledger-entry" data-testid="ledger-entry" key={entry.id}>
              <GoodIcon good={data.goodById[entry.goodId]} className="ledger-good-icon" />
              <div>
                <strong>{entry.type === 'buy' ? '샀음' : '팔았음'} · {entry.goodName} {entry.quantity}개</strong>
                <p>{entry.portName} · 단가 {money(entry.unitPrice)} · 합계 {money(entry.total)}</p>
              </div>
              {typeof entry.profit === 'number' && <p className={entry.profit >= 0 ? 'profit-text' : 'danger-text'}>{entry.profit >= 0 ? '+' : ''}{money(entry.profit)}</p>}
            </article>
          ))}
        </div>
      </section>

      <aside className="panel achievement-next-panel">
        <p className="eyebrow">다음 성취</p>
        <h2>{nextSeal?.seal.name ?? nextDiscovery?.name ?? '새 장사길'}</h2>
        <p>{nextSeal ? `${nextSeal.doneCount}/${nextSeal.total} · ${nextSeal.next}` : nextDiscovery ? `${data.portById[nextDiscovery.portId]?.name ?? '새 항구'}에 가면 발견 카드가 열립니다.` : '새로운 항구와 상품을 더 모아보세요.'}</p>
        <div className="achievement-next-actions">
          <button className="primary" onClick={() => onNavigate?.('map')}>지도 보기</button>
          <button onClick={() => onNavigate?.('quests')}>의뢰 보기</button>
        </div>
      </aside>

      <section className="panel ledger-popover achievement-travel">
        <h2>길과 어장 기록</h2>
        <div className="ledger-list">
          {state.ledger.travels.slice(0, 4).map((entry) => (
            <article className="ledger-entry" data-testid="ledger-entry" key={entry.id}>
              <strong>{entry.fromPortName} → {entry.toPortName}</strong>
              <p>{entry.mode === 'sea' ? '해로' : '육로'} · {entry.days}일 · 위험 {entry.risk}/5{entry.eventName ? ` · ${entry.eventName}` : ''}</p>
            </article>
          ))}
          {state.ledger.fishing.slice(0, 3).map((entry) => (
            <article className="ledger-entry" data-testid="ledger-entry" key={entry.id}>
              <strong>어업 · {entry.portName}{entry.quality ? ` · ${entry.quality}` : ''}</strong>
              <div className="mini-icon-row">{Object.entries(entry.gained).map(([id, amount]) => <span key={id}><GoodIcon good={data.goodById[id]} />{data.goodById[id]?.name ?? id} {amount}</span>)}</div>
              <p>{entry.spotName ? `${entry.spotName} · ` : ''}대략 값 {money(entry.estimatedValue)}{entry.riskLine ? ` · ${entry.riskLine}` : ''}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function DiscoveryLog({ data, state }: { data: GameData; state: GameState }) {
  return (
    <section className="panel discovery-log-panel ledger-popover" data-testid="discovery-log">
      <h2>팔도 탐방 도감</h2>
      <div className="discovery-grid">
        {data.discoveries.map((discovery) => {
          const found = Boolean(state.discoveredIds[discovery.id]);
          return (
            <article className={found ? 'discovery-tile found' : 'discovery-tile locked'} key={discovery.id}>
              <img src={discovery.iconAsset} alt="" onError={(event) => { event.currentTarget.src = goodIconAsset(); }} />
              <strong>{found ? discovery.name : '미발견'}</strong>
              <small>{data.portById[discovery.portId]?.name ?? discovery.portId}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LedgerSealSection({ data, state }: { data: GameData; state: GameState }) {
  return (
    <section className="panel ledger-seal-panel signboard">
      <h2>상단 장부 조각</h2>
      <div className="ledger-seal-grid">
        {data.ledgerSeals.map((seal) => {
          const statuses = seal.requirements.map((requirement) => ledgerSealRequirementStatus(data, state, requirement));
          const doneCount = statuses.filter((status) => status.done).length;
          const complete = state.completedLedgerSeals.includes(seal.id);
          return (
            <article className={complete ? 'ledger-seal-card done' : 'ledger-seal-card'} data-testid="ledger-seal-card" key={seal.id}>
              <img src={seal.iconAsset} alt="" onError={(event) => { event.currentTarget.src = goodIconAsset(); }} />
              <div>
                <strong>{seal.name}</strong>
                <span>{doneCount}/{statuses.length}</span>
                <small>{complete ? seal.nextHint : statuses.find((status) => !status.done)?.label ?? '완료 준비'}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ToolIcon({ tool }: { tool: ToolItem }) {
  return <span className={toolIconClass(tool)} aria-hidden="true" />;
}

function toolRequirementMet(state: GameState, tool: ToolItem) {
  return !tool.requiresTool || Boolean(state.tools?.[tool.requiresTool]);
}

function statLine(stats: Record<string, number>) {
  const labels: Record<string, string> = {
    navigation: '항해',
    trade: '교역',
    fishing: '어업',
    guard: '호위',
    japanese: '왜어',
    chinese: '한문'
  };
  return Object.entries(stats)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${labels[key] ?? key} +${value}`)
    .join(' · ');
}

function joinedCompanions(data: GameData, state: GameState, kind?: Companion['kind']) {
  return data.companions.filter((companion) => state.companions?.[companion.id] && (!kind || companion.kind === kind));
}

function strongestCompanionFor(data: GameData, state: GameState, skills: string[]) {
  return joinedCompanions(data, state)
    .map((companion) => ({
      companion,
      score: skills.reduce((sum, skill) => sum + (companion.stats[skill] ?? 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.companion;
}

function companionFacilityLine(data: GameData, state: GameState, facility: HubAction) {
  const companion = facility === 'market'
    ? strongestCompanionFor(data, state, ['trade', 'chinese'])
    : facility === 'tavern'
      ? strongestCompanionFor(data, state, ['trade', 'japanese', 'navigation'])
      : facility === 'office'
        ? strongestCompanionFor(data, state, ['chinese', 'japanese', 'trade'])
        : strongestCompanionFor(data, state, ['navigation', 'guard', 'fishing']);
  if (!companion) return '';
  const lines: Record<HubAction, string> = {
    market: `${companion.name}: 값을 보기 전에 팔 곳부터 정하면 덜 헤매요.`,
    office: `${companion.name}: 허가와 납품은 장부에 바로 표시해 둘게요.`,
    tavern: `${companion.name}: 소문은 길과 물건을 같이 보면 쓸모가 커져요.`,
    shipyard: `${companion.name}: 멀리 갈수록 배와 수레 상태가 먼저예요.`
  };
  return lines[facility];
}

function companionEventLine(data: GameData, state: GameState, event: GameEvent) {
  const skill = event.type === 'combat' ? 'guard' : event.choices.find((choice) => choice.skillCheck)?.skillCheck?.skill ?? 'navigation';
  const companion = strongestCompanionFor(data, state, [skill === 'combat' ? 'guard' : skill, 'guard']);
  if (!companion) return '';
  if (event.type === 'combat') return `${companion.name}: 내가 앞에서 막아볼게. 짐은 뒤로 물려!`;
  if (skill === 'navigation') return `${companion.name}: 길을 천천히 보면 피할 수 있는 위험이 보여.`;
  if (skill === 'trade') return `${companion.name}: 돈으로 해결할 때도 너무 많이 내면 손해야.`;
  return `${companion.name}: 준비한 장비를 쓰면 더 안전해질 거야.`;
}

function companionEventResult(data: GameData, state: GameState, event: GameEvent) {
  const skill = event.type === 'combat' ? 'guard' : event.choices.find((choice) => choice.skillCheck)?.skillCheck?.skill ?? 'navigation';
  const companion = strongestCompanionFor(data, state, [skill === 'combat' ? 'guard' : skill, 'trade', 'navigation']);
  if (!companion) return undefined;
  const combatLines: Record<string, string> = {
    naraon: '나라온이 바람을 보며 물러날 길을 잡아 큰 혼란을 줄였습니다.',
    jo_yeonseo: '조연서가 잃은 짐과 값을 바로 적어 다음 거래 손해를 줄이자고 했습니다.',
    lee_sihyeong: '이시형이 뒤쪽 길을 살펴 상단이 흩어지지 않게 이끌었습니다.',
    kim_sora: '김소라가 사람들을 진정시키고 남은 물건을 다시 묶었습니다.',
    lee_doyun: '이도윤이 낯선 말과 표식을 살펴 다음 검문에 대비하자고 했습니다.',
    park_siwoo: '박시우가 앞에서 버텨 수레와 짐을 지키는 데 큰 도움이 됐습니다.',
    park_seyeon: '세연이의 응원 덕분에 정우가 겁먹지 않고 다시 길을 잡았습니다.',
    dad: '아빠가 침착하게 피해를 살피고 복구 순서를 정했습니다.',
    mom: '엄마가 남은 돈과 짐을 세어 다음 장사를 망치지 않게 챙겼습니다.'
  };
  const travelLines: Record<string, string> = {
    naraon: '나라온이 바람과 구름을 보며 다음 길은 조금 늦게 잡자고 했습니다.',
    jo_yeonseo: '조연서가 이번 손익을 장부에 표시하고 더 나은 판매처를 찾자고 했습니다.',
    lee_sihyeong: '이시형이 지도에 위험한 길목을 표시해 다음 이동을 준비했습니다.',
    kim_sora: '김소라가 물때와 어장 소문을 엮어 다음 항구 정보를 알려줬습니다.',
    lee_doyun: '이도윤이 표식과 문서를 다시 확인해 허가가 필요한 길을 짚었습니다.',
    park_siwoo: '박시우가 짐끈과 바퀴를 다시 조여 다음 길을 준비했습니다.',
    park_seyeon: '세연이가 작은 목소리로 괜찮다고 해 정우가 다시 힘을 냈습니다.',
    dad: '아빠가 장비 상태를 확인하고 무리하지 말자고 조언했습니다.',
    mom: '엄마가 남은 물건을 먼저 팔 곳부터 정하자고 알려줬습니다.'
  };
  return {
    name: companion.name,
    line: (event.type === 'combat' ? combatLines : travelLines)[companion.id] ?? `${companion.name}이 상단을 도와 사건을 정리했습니다.`,
    portraitAsset: companion.portraitAsset
  };
}

function toolNoticeText(tool: ToolItem) {
  if (tool.kind === 'guard') return '도적이나 위험한 길에서 호위 선택지가 더 든든해졌어요.';
  if (tool.kind === 'navigation') return '지도와 길눈이 좋아져 이동일과 위험을 더 잘 읽을 수 있어요.';
  if (tool.kind === 'trade') return '사고팔 때 값을 더 잘 살펴 작은 이익이 쌓입니다.';
  if (tool.kind === 'fishing') return '어업 보상이 조금 더 좋아져 남해 준비가 쉬워져요.';
  if (tool.kind === 'language') return '쓰시마(대마도)와 먼 교역을 준비하는 말과 문서 실력이 올랐어요.';
  return '상단의 새 장비가 준비되었습니다.';
}

function equipmentNoticeDetails(data: GameData, state: GameState, item: Ship | Cart | ToolItem) {
  const lines: string[] = [];
  if ('allowedWaters' in item) {
    lines.push(`짐칸 ${item.cargo}칸 · 빠르기 ${item.speed} · 튼튼함 ${item.durability}`);
    const routes = availableRoutes(data, { ...state, shipId: item.id, shipPortId: state.currentPortId }).filter((route) => route.mode === 'sea').slice(0, 2);
    if (routes.length) lines.push(`추천 길: ${routes.map((route) => data.portById[routeDestination(route, state.currentPortId)].name).join(' · ')}`);
  } else if ('terrain' in item) {
    lines.push(`땅길 짐칸 ${item.cargo}칸 · 빠르기 ${item.speed} · 튼튼함 ${item.durability}`);
    const routes = availableRoutes(data, { ...state, cartId: item.id }).filter((route) => route.mode === 'land').slice(0, 2);
    if (routes.length) lines.push(`가까운 육로: ${routes.map((route) => data.portById[routeDestination(route, state.currentPortId)].name).join(' · ')}`);
  } else {
    lines.push(statLine(item.stats));
    if (item.tier) lines.push(`${item.tier}단계 개인 장비`);
  }
  return lines;
}

function CompanionAvatar({ companion }: { companion: Companion }) {
  return (
    <span className={`companion-avatar avatar-${companion.kind}`} aria-hidden="true">
      {companion.portraitAsset ? <img src={companion.portraitAsset} alt="" /> : <i>{companion.name.slice(0, 1)}</i>}
    </span>
  );
}

function ToolCabinet({ data, state, onBuyTool }: { data: GameData; state: GameState; onBuyTool: (tool: ToolItem) => void }) {
  const kindLabels: Record<string, string> = { guard: '호위', fishing: '어업', navigation: '항해', trade: '교역', language: '통역' };
  const toolKinds = ['guard', 'fishing', 'navigation', 'trade', 'language'];
  return (
    <section className="panel tool-cabinet">
      <p className="eyebrow">개인 장비</p>
      <h2>칼 · 어업도구 · 측량도구</h2>
      <div className="kit-path-strip" data-testid="personal-kit-path">
        {toolKinds.map((kind) => {
          const chain = data.tools.filter((tool) => tool.kind === kind).sort((a, b) => (a.tier ?? 1) - (b.tier ?? 1) || a.price - b.price);
          const owned = [...chain].reverse().find((tool) => state.tools?.[tool.id]);
          const next = chain.find((tool) => !state.tools?.[tool.id] && toolRequirementMet(state, tool));
          const display = owned ?? next ?? chain[0];
          if (!display) return null;
          return (
            <article className={`kit-path-node ${owned ? 'owned' : next ? 'next' : 'locked'}`} key={kind}>
              <ToolIcon tool={display} />
              <strong>{kindLabels[kind] ?? kind}</strong>
              <small>{owned ? `${display.name} 보유` : next ? `${next.name} 목표` : '잠김'}</small>
            </article>
          );
        })}
      </div>
      <div className="tool-grid">
        {data.tools.map((tool) => {
          const owned = Boolean(state.tools?.[tool.id]);
          const requirementMet = toolRequirementMet(state, tool);
          return (
            <article className={`tool-card ${owned ? 'owned' : ''} ${!requirementMet ? 'locked' : ''}`} key={tool.id}>
              <ToolIcon tool={tool} />
              <div>
                <strong>{tool.name}</strong>
                <span>{statLine(tool.stats)}</span>
                <small>{!requirementMet ? `${data.toolById[tool.requiresTool!]?.name ?? '이전 장비'} 필요` : tool.hint ?? tool.description}</small>
              </div>
              <button data-testid={`buy-tool-${tool.id}`} onClick={() => onBuyTool(tool)} disabled={owned || !requirementMet || state.money < tool.price}>{owned ? '보유' : !requirementMet ? '잠김' : money(tool.price)}</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FleetPanel({
  data,
  state,
  onRecruitCompanion,
  onRenameFleet
}: {
  data: GameData;
  state: GameState;
  onRecruitCompanion: (companion: Companion) => void;
  onRenameFleet: (name: string) => void;
}) {
  const [draftName, setDraftName] = useState(state.fleetName ?? '정우상단');
  useEffect(() => setDraftName(state.fleetName ?? '정우상단'), [state.fleetName]);
  const stats = fleetStats(data, state);
  const crew = data.companions.filter((companion) => companion.kind === 'crew');
  const family = data.companions.filter((companion) => companion.kind === 'family');
  const joinedCount = crew.filter((companion) => state.companions?.[companion.id]).length;
  const leadCompanion = joinedCompanions(data, state, 'crew')[0];
  return (
    <section className="panel fleet-panel" data-testid="fleet-panel">
      <div className="fleet-name-row">
        <div>
          <p className="eyebrow">함대 이름</p>
          <h2>{state.fleetName ?? '정우상단'}</h2>
        </div>
        <label className="fleet-name-input">
          <span className="sr-only">함대 이름</span>
          <input value={draftName} maxLength={12} onChange={(event) => setDraftName(event.target.value)} />
          <button onClick={() => onRenameFleet(draftName)}>이름 정하기</button>
        </label>
      </div>
      <div className="fleet-stat-strip">
        <span>동료 {joinedCount}/{crew.length}</span>
        <span>속도 +{Math.round(companionSpeedBonus(data, state) * 100)}%</span>
        <span>항해 {stats.navigation}</span>
        <span>교역 {stats.trade}</span>
        <span>어업 {stats.fishing}</span>
        <span>호위 {stats.guard}</span>
        <span>왜어 {stats.japanese}</span>
        <span>한문 {stats.chinese}</span>
      </div>
      {leadCompanion && (
        <div className="fleet-companion-advice" data-testid="fleet-companion-advice">
          <CompanionAvatar companion={leadCompanion} />
          <span><strong>{leadCompanion.name}</strong><small>{leadCompanion.line}</small></span>
        </div>
      )}
      <div className="companion-grid">
        {crew.map((companion) => {
          const joined = Boolean(state.companions?.[companion.id]);
          return (
            <article className={`companion-card ${joined ? 'joined' : ''}`} key={companion.id}>
              <CompanionAvatar companion={companion} />
              <div>
                <strong>{companion.name}</strong>
                <span>{companion.role}</span>
                <small>{statLine(companion.stats)}</small>
              </div>
              <button data-testid={`recruit-companion-${companion.id}`} onClick={() => onRecruitCompanion(companion)} disabled={joined || state.money < companion.recruitCost}>{joined ? '동료' : money(companion.recruitCost)}</button>
            </article>
          );
        })}
      </div>
      <div className="family-helper-row">
        {family.map((helper) => (
          <span key={helper.id} className={state.companions?.[helper.id] ? 'active' : ''}>
            <CompanionAvatar companion={helper} />
            <b>{helper.name}</b>
            <small>{helper.line}</small>
          </span>
        ))}
      </div>
    </section>
  );
}

function VehicleView({
  data,
  state,
  ship,
  cart,
  port,
  onBuyShip,
  onBuyCart,
  onBuyTool,
  onRecruitCompanion,
  onRenameFleet,
  onRepairShip,
  onNavigate
}: {
  data: GameData;
  state: GameState;
  ship: Ship;
  cart: Cart;
  port: Port;
  onBuyShip: (ship: Ship) => void;
  onBuyCart: (cart: Cart) => void;
  onBuyTool: (tool: ToolItem) => void;
  onRecruitCompanion: (companion: Companion) => void;
  onRenameFleet: (name: string) => void;
  onRepairShip: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const handcart = data.cartById.handcart;
  const fishingBoat = data.shipById.fishing_boat;
  const nextShip = nextShipFor(data, ship);
  const nextCart = nextCartFor(data, cart);
  const jejuReady = Boolean(state.questProgress.visitedPorts.mokpo || state.questProgress.visitedPorts.yeosu) && ship.durability >= 10;
  const stats = fleetStats(data, state);
  const nextTool = data.tools.find((tool) => !state.tools?.[tool.id] && toolRequirementMet(state, tool));
  const strongestRoute = availableRoutes(data, state)
    .map((route) => ({ route, blocked: routeBlockedReason(data, state, route), destination: data.portById[routeDestination(route, state.currentPortId)] }))
    .filter((item) => !item.blocked)
    .slice(0, 3);
  return (
    <div className="landscape-layout equipment-layout scene-equipment-layout">
      <div className="main-panel">
        <section className="panel equipment-growth-hero">
          <div className="equipment-hero-current">
            <p className="eyebrow">현재 상단 장비</p>
            <h2>{state.fleetName ?? '정우상단'}</h2>
            <div className="equipment-hero-vehicles">
              <span><img className="pixel-vehicle" src={shipArtFor(data, ship)} alt="" /><b>{ship.name}</b><small>배 {ship.cargo}칸</small></span>
              <span><img className="pixel-vehicle" src={cartArtFor(data, cart)} alt="" /><b>{cart.name}</b><small>수레 {cart.cargo}칸</small></span>
            </div>
            <div className="fleet-stat-strip equipment-stat-strip">
              <span>항해 {stats.navigation}</span>
              <span>교역 {stats.trade}</span>
              <span>어업 {stats.fishing}</span>
              <span>호위 {stats.guard}</span>
            </div>
          </div>
          <div className="equipment-next-focus">
            <p className="eyebrow">다음 추천 성장</p>
            <h2>{nextCart && state.money < nextCart.price ? nextCart.name : nextShip?.name ?? nextTool?.name ?? '새 장사길'}</h2>
            <p>{nextCart && state.money < nextCart.price ? `${money(nextCart.price - state.money)} 더 모으면 땅길 장사가 커져요.` : nextShip ? `${money(Math.max(0, nextShip.price - state.money))} 남으면 새 바닷길 준비가 쉬워져요.` : nextTool ? toolNoticeText(nextTool) : '지도에서 더 먼 장사길을 확인하세요.'}</p>
            <div className="equipment-unlock-chips">
              {strongestRoute.map(({ route, destination }) => <span key={route.id}>{destination.name} · {route.mode === 'sea' ? '바닷길' : '땅길'}</span>)}
            </div>
            <button className="primary" onClick={() => onNavigate('map')}>열린 길 보기</button>
          </div>
        </section>
        <ToolCabinet data={data} state={state} onBuyTool={onBuyTool} />
        <FacilityPanel data={data} state={state} facility="shipyard" onNavigate={onNavigate} />
        <section className="panel equipment-panel">
          <p className="eyebrow">탈것</p>
          <div className="equipment-current split-equipment">
            <div className="current-vehicle-card">
              <img className="pixel-vehicle" src={shipArtFor(data, ship)} alt="" />
              <strong>{ship.name}</strong>
              <span>짐칸 {ship.cargo} · 빠르기 {ship.speed} · 튼튼함 {state.shipDurability}/{ship.durability}</span>
            </div>
            <div className="current-vehicle-card">
              <img className="pixel-vehicle" src={cartArtFor(data, cart)} alt="" />
              <strong>{cart.name}</strong>
              <span>짐칸 {cart.cargo} · 빠르기 {cart.speed} · 튼튼함 {state.cartDurability}/{cart.durability}</span>
            </div>
          </div>
          <button className="primary" onClick={onRepairShip} disabled={state.shipDurability >= ship.durability}>배 수리</button>
        </section>
        <FleetPanel data={data} state={state} onRecruitCompanion={onRecruitCompanion} onRenameFleet={onRenameFleet} />
        <section className="panel next-equipment-panel">
          <p className="eyebrow">다음 추천 탈것</p>
          <div className="next-equipment-grid">
            {nextShip && (
              <article className="next-equipment-card">
                <img className="pixel-vehicle" src={shipArtFor(data, nextShip)} alt="" />
                <strong>{nextShip.name}</strong>
                <span>{money(nextShip.price)}</span>
                <p>{state.money >= nextShip.price ? '구매 가능' : `${money(nextShip.price - state.money)} 부족`}</p>
              </article>
            )}
            {nextCart && (
              <article className="next-equipment-card">
                <img className="pixel-vehicle" src={cartArtFor(data, nextCart)} alt="" />
                <strong>{nextCart.name}</strong>
                <span>{money(nextCart.price)}</span>
                <p>{state.money >= nextCart.price ? '구매 가능' : `${money(nextCart.price - state.money)} 부족`}</p>
              </article>
            )}
          </div>
        </section>
        <section className="panel unlocked-routes-panel" data-testid="equipment-unlocked-routes">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">장비로 가까워진 길</p>
              <h2>새로 유리한 루트</h2>
            </div>
            <button onClick={() => onNavigate('map')}>지도 확인</button>
          </div>
          <div className="route-unlock-list">
            {availableRoutes(data, state).slice(0, 4).map((route) => {
              const blocked = routeBlockedReason(data, state, route);
              const destination = data.portById[routeDestination(route, state.currentPortId)];
              return (
                <span className={blocked ? 'locked' : 'open'} key={route.id}>
                  {destination.name} · {blocked || (route.mode === 'sea' ? '배 준비됨' : '수레 준비됨')}
                </span>
              );
            })}
          </div>
        </section>
        <section className="panel growth-panel">
          <p className="eyebrow">성장 목표</p>
          <div className="growth-list">
            <article className={state.questProgress.ownedCarts.handcart ? 'growth-card done' : 'growth-card'}>
              <strong>손수레 장만</strong>
              <p>소금 납품이 쉬워집니다.</p>
              <span>{state.questProgress.ownedCarts.handcart ? '완료' : `${money(handcart.price)} 필요`}</span>
            </article>
            <article className={state.shipId === 'fishing_boat' || state.questProgress.ownedShips.fishing_boat ? 'growth-card done' : 'growth-card'}>
              <strong>어선 준비</strong>
              <p>남해 어업 보너스가 올라갑니다.</p>
              <span>{state.questProgress.ownedShips.fishing_boat ? '완료' : `${money(fishingBoat.price)} 필요`}</span>
            </article>
            <article className={state.questProgress.ownedShips.coastal_merchant ? 'growth-card done' : 'growth-card'}>
              <strong>연안 상선</strong>
              <p>부산(부산포)와 남해 물량을 더 크게 실어요.</p>
              <span>{state.questProgress.ownedShips.coastal_merchant ? '완료' : `${money(data.shipById.coastal_merchant.price)} 필요`}</span>
            </article>
            <article className={jejuReady ? 'growth-card done' : 'growth-card locked'}>
              <strong>제주 준비</strong>
              <p>권장 배와 수리비를 챙기세요.</p>
              <span>{jejuReady ? '준비됨' : '남해 거점 방문 필요'}</span>
            </article>
            <article className={state.permits.includes('waegwan_pass') ? 'growth-card done' : 'growth-card locked'}>
              <strong>쓰시마(대마도) 허가</strong>
              <p>관청 의뢰로 왜관 허가장을 얻습니다.</p>
              <span>{state.permits.includes('waegwan_pass') ? '허가 완료' : '의뢰 완료 필요'}</span>
            </article>
          </div>
        </section>
      </div>
      <aside className="side-panel equipment-shop-panel">
        <section className="panel"><h2>배 구입</h2>{data.ships.map((item) => <article className="shop-row visual-shop-row" key={item.id}><img className="pixel-vehicle" src={shipArtFor(data, item)} alt="" /><div><strong>{item.name}</strong><p>{money(item.price)} · 짐칸 {item.cargo} · 싸움 {item.combat} · 어업 {Math.round(item.fishingBonus * 100)}%</p></div><button onClick={() => onBuyShip(item)} disabled={state.shipId === item.id}>{state.shipId === item.id ? '보유' : '구입'}</button></article>)}</section>
        <section className="panel"><h2>수레 구입</h2>{data.carts.map((item) => <article className="shop-row visual-shop-row" key={item.id}><img className="pixel-vehicle" src={cartArtFor(data, item)} alt="" /><div><strong>{item.name}</strong><p>{money(item.price)} · 짐칸 {item.cargo} · 빠르기 {item.speed}</p></div><button onClick={() => onBuyCart(item)} disabled={state.cartId === item.id}>{state.cartId === item.id ? '보유' : '구입'}</button></article>)}</section>
      </aside>
    </div>
  );
}

function GrowthJourneyMap({ data, state, onNavigate }: { data: GameData; state: GameState; onNavigate: (tab: Tab) => void }) {
  const steps = longGrowthPathSteps(data, state);
  const activeIndex = steps.findIndex((step) => !step.done);
  const currentIndex = activeIndex === -1 ? steps.length - 1 : activeIndex;
  return (
    <section className="growth-journey-map" data-testid="growth-journey-map">
      <div className="growth-map-sky" aria-hidden="true" />
      <div className="growth-map-track" aria-label="첫 30분 성장길">
        {steps.map((step, index) => {
          const locked = activeIndex !== -1 && index > activeIndex;
          const active = index === activeIndex;
          return (
            <button
              key={step.title}
              className={`growth-map-node ${step.done ? 'done' : ''} ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
              type="button"
              onClick={() => !locked && navigateGrowthStep(data, state, step, onNavigate)}
              disabled={locked}
            >
              <span className="growth-map-icon">
                {step.iconGoodId ? <GoodIcon good={data.goodById[step.iconGoodId]} /> : <img src={step.iconAsset} alt="" />}
              </span>
              <strong>{step.title}</strong>
              <small>{step.done ? '완료' : active ? '다음' : step.text}</small>
            </button>
          );
        })}
      </div>
      <div className="growth-map-caption">
        <strong>{steps[currentIndex]?.title ?? '성장길'}</strong>
        <span>{steps[currentIndex]?.text ?? '다음 목표를 확인하세요.'}</span>
      </div>
    </section>
  );
}

function QuestView({
  data,
  state,
  onDeliver,
  onNavigate,
  onSelectRoute
}: {
  data: GameData;
  state: GameState;
  onDeliver: (quest: Quest) => void;
  onNavigate: (tab: Tab) => void;
  onSelectRoute?: (routeId: string) => void;
}) {
  const activeQuests = data.quests.filter((quest) => state.activeQuestIds.includes(quest.id) && !state.completedQuests.includes(quest.id));
  const completedQuests = data.quests.filter((quest) => state.completedQuests.includes(quest.id)).reverse();
  const lockedQuests = data.quests.filter((quest) => !state.activeQuestIds.includes(quest.id) && !state.completedQuests.includes(quest.id)).slice(0, 3);
  const visibleQuests = [...activeQuests, ...completedQuests].slice(0, 3);
  const mainQuest = activeQuests[0] ?? completedQuests[0] ?? data.quests[0];
  const mainStatuses = mainQuest ? mainQuest.objectives.map((objective) => objectiveStatus(data, state, objective)) : [];
  const mainOpen = mainStatuses.find((status) => !status.done);
  const mainProgress = mainStatuses.length ? Math.round((mainStatuses.filter((status) => status.done).length / mainStatuses.length) * 100) : 0;
  const goObjective = (status?: ObjectiveStatus) => {
    if (!status?.targetTab) return;
    if (status.targetTab === 'map' && status.targetPortId && onSelectRoute) {
      const route = availableRoutes(data, state).find((item) => routeDestination(item, state.currentPortId) === status.targetPortId);
      if (route) onSelectRoute(route.id);
    }
    onNavigate(status.targetTab);
  };

  return (
    <div className="landscape-layout quest-layout scene-progression-layout">
      <div className="main-panel">
        <section className="panel quest-current-goal">
          <div className="quest-current-copy">
            <p className="eyebrow">현재 메인 목표</p>
            <h2>{mainQuest?.name ?? '새 의뢰 준비'}</h2>
            <p>{mainOpen?.nextAction ?? nextHintForQuest(mainQuest?.id ?? '')}</p>
            <div className="quest-progress-bar" style={{ '--progress': `${mainProgress}%` } as CSSProperties}><span>{mainProgress}%</span></div>
          </div>
          <div className="quest-current-steps">
            {mainStatuses.map((status, index) => (
              <span className={status.done ? 'done' : index === mainStatuses.findIndex((item) => !item.done) ? 'active' : ''} key={`${mainQuest?.id}-${index}`}>
                {status.iconGoodId ? <GoodIcon good={data.goodById[status.iconGoodId]} /> : status.iconAsset ? <img src={status.iconAsset} alt="" /> : <i>목표</i>}
                <small>{status.done ? '완료' : `${status.current}/${status.target}`}</small>
              </span>
            ))}
          </div>
          <button className="primary quest-hero-cta" onClick={() => goObjective(mainOpen)} disabled={!mainOpen?.targetTab}>{mainOpen?.nextAction ?? '완료 확인'}</button>
        </section>

        <GrowthJourneyMap data={data} state={state} onNavigate={onNavigate} />

        <section className="panel quest-board-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">의뢰 게시판</p>
              <h2>진행 중인 의뢰 3개</h2>
            </div>
            <button onClick={() => onNavigate('market')}>시장으로</button>
          </div>
          <div className="quest-card-grid">
            {visibleQuests.map((quest) => {
              const delivery = openDeliveryObjective(state, quest);
              const missing = missingDeliveryGoods(state, delivery);
              const canDeliver = Boolean(delivery) && missing.length === 0;
              const statuses = quest.objectives.map((objective) => objectiveStatus(data, state, objective));
              const activeStatus = statuses.find((status) => !status.done);
              const complete = state.completedQuests.includes(quest.id);
              return (
                <article className={`quest-row quest-route-card ${complete ? 'complete' : ''}`} data-testid={`quest-card-${quest.id}`} key={quest.id}>
                  <div className="quest-head">
                    <span className="quest-giver-icon"><img src={quest.giver.includes('관') ? HUB_ICON.office : quest.giver.includes('통영(통제영)') || quest.giver.includes('어') ? HUB_ICON.fish : HUB_ICON.market} alt="" /></span>
                    <div>
                      <strong>{quest.name}</strong>
                      <small>{quest.giver}</small>
                    </div>
                    <span className={complete ? 'tag demand' : 'tag'}>{complete ? '완료 도장' : '진행 중'}</span>
                  </div>
                  <div className="quest-progress icon-quest-progress" data-testid={`quest-progress-${quest.id}`}>
                    {statuses.map((status, index) => (
                      <div key={`${quest.id}-${index}`} className={status.done ? 'quest-step done' : 'quest-step'}>
                        {status.iconGoodId ? <GoodIcon good={data.goodById[status.iconGoodId]} /> : status.iconAsset ? <img src={status.iconAsset} alt="" /> : <span className="quest-step-symbol">목표</span>}
                        <p>{status.label}</p>
                        <small>{status.current}/{status.target}</small>
                      </div>
                    ))}
                  </div>
                  <div className="quest-reward-mini">
                    {rewardItemsForQuest(quest).slice(0, 3).map((item) => (
                      <span key={`${quest.id}-${item.label}`}>{item.goodId ? <GoodIcon good={data.goodById[item.goodId]} /> : item.iconAsset ? <img src={item.iconAsset} alt="" /> : null}{item.value}</span>
                    ))}
                  </div>
                  {delivery && <button className="primary quest-action" onClick={() => onDeliver(quest)} disabled={!canDeliver}>{canDeliver ? '납품하기' : `부족 ${missing.length}`}</button>}
                  {activeStatus?.targetTab && !delivery && !complete && (
                    <button className="quest-next-action" onClick={() => goObjective(activeStatus)}>{activeStatus.nextAction}</button>
                  )}
                  {!complete && <p className="hint-text">{questHint(data, state, quest)}</p>}
                </article>
              );
            })}
          </div>
        </section>
      </div>
      <aside className="side-panel quest-side-panel">
        <FacilityPanel data={data} state={state} facility="office" onNavigate={onNavigate} />
        <section className="panel quest-next-board">
          <p className="eyebrow">다음에 열릴 의뢰</p>
          <div className="locked-quest-list">
            {lockedQuests.map((quest) => (
              <article className="locked-quest-card" key={quest.id}>
                <strong>{quest.name}</strong>
                <small>{quest.chapter >= 3 ? '허가/장비 필요' : quest.chapter >= 2 ? '초반 의뢰 완료 필요' : '진행 준비 중'}</small>
              </article>
            ))}
          </div>
        </section>
        <section className="panel quest-compass-card">
          <p className="eyebrow">목표 연결</p>
          <h2>다음 행동</h2>
          <button onClick={() => onNavigate('market')}>필요 물건 사기</button>
          <button onClick={() => onNavigate('map')}>목적지 보기</button>
          <button onClick={() => onNavigate('vehicles')}>장비 목표</button>
        </section>
      </aside>
    </div>
  );
}

function questHint(data: GameData, state: GameState, quest: Quest) {
  const firstOpenObjective = quest.objectives.find((objective) => !objectiveStatus(data, state, objective).done);
  const firstOpen = firstOpenObjective ? objectiveStatus(data, state, firstOpenObjective) : undefined;
  if (!firstOpen) return '보상을 정리하는 중입니다.';
  if (quest.id === 'tutorial_first_trade' && firstOpenObjective?.type === 'buy') return '먼저 시장에서 면포를 사보세요.';
  if (quest.id === 'tutorial_first_trade' && firstOpenObjective?.type === 'sell') return '이제 대구로 이동해 면포를 팔아보세요.';
  if (quest.id === 'salt_to_daegu') return '소금은 항구에서 사서 대구에서 비싸게 팔 수 있어요.';
  if (quest.id === 'fish_for_inland') return '부산(부산포)나 통영(통제영)에서 건어물을 사서 대구에 팔아보세요.';
  return firstOpen.nextAction || data.constants.title;
}

function eventSceneKind(title: string, description = '') {
  const text = `${title} ${description}`;
  if (text.includes('도적') || text.includes('산적') || text.includes('호랑이대')) return 'bandits';
  if (text.includes('해적')) return 'pirates';
  if (text.includes('갯벌') || text.includes('좌초')) return 'mudflat';
  if (text.includes('태풍') || text.includes('먹구름') || text.includes('풍랑')) return 'storm';
  if (text.includes('검문') || text.includes('허가')) return 'inspection';
  if (text.includes('순풍') || text.includes('바람')) return 'wind';
  if (text.includes('수리') || text.includes('누수') || text.includes('바퀴')) return 'repair';
  return 'road';
}

function EventSceneArt({ title, description = '' }: { title: string; description?: string }) {
  const kind = eventSceneKind(title, description);
  return (
    <div className={`event-scene-art event-scene-${kind}`} aria-hidden="true">
      <span className="event-sky" />
      <span className="event-ground" />
      <span className="event-symbol" />
    </div>
  );
}

function choiceVisualKind(choice: EventChoice) {
  const label = choice.label;
  if (choice.startCombat || label.includes('맞선') || label.includes('싸')) return 'fight';
  if (label.includes('도주') || label.includes('회피') || label.includes('우회') || label.includes('피항')) return 'avoid';
  if (label.includes('수리') || label.includes('목재') || label.includes('받친')) return 'repair';
  if (label.includes('돈') || label.includes('세금') || label.includes('통행세') || choice.effects?.money || choice.effects?.moneyPercent) return 'money';
  if (label.includes('짐') || choice.effects?.randomCargoLoss || choice.effects?.cargo) return 'cargo';
  if (label.includes('기다') || label.includes('쉰')) return 'rest';
  if (label.includes('허가') || label.includes('제시')) return 'permit';
  return 'action';
}

function choiceHint(choice: EventChoice) {
  if (choice.startCombat) return '위험';
  if (choice.effects?.days) return `${choice.effects.days > 0 ? '+' : ''}${choice.effects.days}일`;
  if (choice.effects?.money) return `${choice.effects.money > 0 ? '+' : ''}${money(choice.effects.money)}`;
  if (choice.effects?.moneyPercent) return '돈 변화';
  if (choice.effects?.durability || choice.effects?.cartDurability) return '튼튼함 변화';
  if (choice.effects?.randomCargoLoss) return '짐 손실';
  if (choice.skillCheck) return '기술 판정';
  if (choice.random) return '운 시험';
  return '선택';
}

function choiceSupportHint(data: GameData, state: GameState, choice: EventChoice) {
  if (choice.requiresPermit && !state.permits.includes(choice.requiresPermit)) return '허가장 필요';
  if (choice.requires) {
    const missing = Object.entries(choice.requires).find(([goodId, amount]) => (state.cargo[goodId] ?? 0) < amount);
    if (missing) return `필요: ${data.goodById[missing[0]]?.name ?? missing[0]} ${missing[1]}개`;
    const [goodId, amount] = Object.entries(choice.requires)[0] ?? [];
    if (goodId) return `준비됨: ${data.goodById[goodId]?.name ?? goodId} ${amount}개`;
  }
  if (choice.skillCheck) {
    const current = effectiveSkillValue(data, state, choice.skillCheck.skill);
    return `${skillLabel(choice.skillCheck.skill)} ${current}/목표 ${choice.skillCheck.target}`;
  }
  if (choice.startCombat) {
    const guard = effectiveSkillValue(data, state, 'combat');
    return guard > 0 ? `호위 +${guard}` : '호위 없음';
  }
  const stats = fleetStats(data, state);
  if (choice.random && stats.guard > 0) return `호위 +${stats.guard}`;
  return '';
}

function EventChoiceModal({ data, state, event, onResolve }: { data: GameData; state: GameState; event: GameEvent; onResolve: (choice: EventChoice) => void }) {
  const companionLine = companionEventLine(data, state, event);
  return (
    <div className="modal-backdrop">
      <section className="event-modal event-scene-card" data-testid="event-modal">
        <EventSceneArt title={event.name} description={event.text} />
        <div className="speech-bubble event-copy">
          <p className="eyebrow">{event.type === 'combat' ? '위험 전투' : '이동 사건'}</p>
          <h2>{event.name}</h2>
          <p>{event.text}</p>
          {event.enemy && <p className="danger-text">상대: {event.enemy.name} · 공격 {event.enemy.attack}</p>}
          {companionLine && <p className="companion-advice" data-testid="event-companion-line">{companionLine}</p>}
        </div>
        <div className="event-actions event-choice-grid">
          {event.choices.map((choice) => {
            const kind = choiceVisualKind(choice);
            const support = choiceSupportHint(data, state, choice);
            return (
              <button
                key={choice.label}
                className={`event-choice-button choice-${kind}`}
                data-testid="event-choice-visual"
                onClick={() => onResolve(choice)}
                disabled={!canUseChoice(state, choice)}
              >
                <span className="choice-icon" aria-hidden="true" />
                <strong>{choice.label}</strong>
                <small>{choiceHint(choice)}</small>
                {support && <em>{support}</em>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function resultLineKind(line: string) {
  if (line.includes('배는 정박지') || line.includes('정박')) return 'safe';
  if (line.includes('돈') || line.includes('냥')) return 'money';
  if (line.includes('선박') || line.includes('배')) return 'ship';
  if (line.includes('수레') || line.includes('바퀴')) return 'cart';
  if (line.includes('짐') || line.includes('손실')) return 'cargo';
  if (line.includes('명성') || line.includes('신용')) return 'fame';
  if (line.includes('사기') || line.includes('피로') || line.includes('선원')) return 'crew';
  if (line.includes('내구') || line.includes('튼튼') || line.includes('수리')) return 'repair';
  if (line.includes('일')) return 'time';
  return 'plain';
}

function resultIconFor(kind: string) {
  return resultIconAsset(kind);
}

function EventResultModal({ result, onClose }: { result: EventResult; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="event-modal result-modal event-scene-card" data-testid="event-modal">
        <EventSceneArt title={result.title} description={result.description} />
        <div className="speech-bubble event-copy">
          <p className="eyebrow">사건 결과</p>
          <h2>{result.title}</h2>
          <p>{result.description}</p>
          <p><strong>{result.result}</strong></p>
        </div>
        {result.companionReaction && (
          <div className="event-companion-result" data-testid="event-companion-result">
            {result.companionReaction.portraitAsset && <img src={result.companionReaction.portraitAsset} alt="" />}
            <span><strong>{result.companionReaction.name}</strong><small>{result.companionReaction.line}</small></span>
          </div>
        )}
        <div className="result-chip-list">{result.lines.map((line) => {
          const kind = resultLineKind(line);
          return <span className={`result-chip result-${kind}`} key={line}><img src={resultIconFor(kind)} alt="" />{line}</span>;
        })}</div>
        <button className="primary" onClick={onClose}>확인</button>
      </section>
    </div>
  );
}

function DiscoveryModal({ notice, onClose }: { notice: DiscoveryNotice; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="event-modal discovery-modal" data-testid="discovery-modal">
        <div className="discovery-card" data-testid="discovery-card">
          <img src={notice.iconAsset} alt="" onError={(event) => { event.currentTarget.src = goodIconAsset(); }} />
          <div>
            <p className="eyebrow">팔도 발견</p>
            <h2>{notice.name}</h2>
            <p>{notice.description}</p>
          </div>
        </div>
        <div className="discovery-rewards">
          {notice.rewardLines.map((line) => <span key={line}>{line}</span>)}
        </div>
        <p className="hint-text">{notice.hint}</p>
        <button className="primary" onClick={onClose}>장부에 기록</button>
      </section>
    </div>
  );
}

function QuestCompleteModal({
  data,
  notice,
  onClose,
  onNavigate
}: {
  data: GameData;
  notice: QuestCompletionNotice;
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const quest = data.quests.find((item) => item.id === notice.questId);
  const rewards = rewardItemsForQuest(quest);
  const nextGoal = nextGoalForQuest(data, notice.questId);
  return (
    <div className="modal-backdrop">
      <section className="event-modal quest-complete" data-testid="quest-complete-modal">
        <div className="quest-complete-hero">
          <img src={PROTAGONIST_ASSET} alt="" />
          <div>
            <p className="eyebrow">의뢰 완료</p>
            <h2>{notice.questName}</h2>
            <p>{notice.summary}</p>
          </div>
        </div>
        <div className="quest-reward-grid" aria-label="보상">
          {(rewards.length > 0 ? rewards : notice.rewardLines.map((line): QuestRewardItem => ({ label: '보상', value: line, tone: 'money', goodId: 'silver' }))).map((item) => (
            <div className={`quest-reward-chip ${item.tone}`} key={`${item.label}-${item.value}`}>
              {item.goodId ? <GoodIcon good={data.goodById[item.goodId]} /> : item.iconAsset ? <img src={item.iconAsset} alt="" /> : <span className="quest-step-symbol">상</span>}
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        <button className="next-goal-card" data-testid="quest-next-goal" onClick={() => onNavigate(nextGoal.tab)}>
          <span className="next-goal-icon">
            {nextGoal.goodId ? <GoodIcon good={data.goodById[nextGoal.goodId]} /> : <img src={nextGoal.iconAsset ?? HUB_ICON.map} alt="" />}
          </span>
          <span>
            <small>다음 목표</small>
            <strong>{nextGoal.title}</strong>
            <em>{nextGoal.text}</em>
          </span>
          <b>{nextGoal.action}</b>
        </button>
        <button onClick={onClose}>닫기</button>
      </section>
    </div>
  );
}

function TutorialStoryModal({
  data,
  dialog,
  onContinue,
  onSkip
}: {
  data: GameData;
  dialog: TutorialDialogue;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const mood = tutorialDialogueMood(dialog);
  const relatedGood = dialog.relatedGoodId ? data.goodById[dialog.relatedGoodId] : undefined;
  const relatedPort = dialog.relatedPortId ? data.portById[dialog.relatedPortId] : undefined;
  const targetLabel = (() => {
    if (dialog.requiredAction?.type === 'openTab') {
      if (dialog.requiredAction.tab === 'market') return '시장으로 가기';
      if (dialog.requiredAction.tab === 'map') return '지도 열기';
      if (dialog.requiredAction.tab === 'vehicles') return '장비 보기';
      if (dialog.requiredAction.tab === 'quests') return '부탁 보기';
    }
    if (dialog.requiredAction?.type === 'buyGood') return `${relatedGood?.name ?? '물건'} 사기`;
    if (dialog.requiredAction?.type === 'sellGood') return `${relatedGood?.name ?? '물건'} 팔기`;
    if (dialog.requiredAction?.type === 'travelRoute') return `${relatedPort?.name ?? '목적지'}로 출발`;
    if (dialog.requiredAction?.type === 'selectGood') return `${relatedGood?.name ?? '상품'} 그림 누르기`;
    return dialog.nextId ? '이야기 계속' : '다음 행동';
  })();
  return (
    <div className="modal-backdrop tutorial-story-backdrop" data-testid="tutorial-dialog" role="presentation">
      <section className="tutorial-story-modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-story-title">
        <div className="tutorial-story-portrait">
          {dialog.speaker === 'fairy'
            ? <GuideSpirit mood={mood} className="tutorial-story-fairy" />
            : <img className="tutorial-story-fairy protagonist-portrait" src={PROTAGONIST_ASSET} alt="" />}
          <span>{dialog.speakerName}</span>
        </div>
        <div className="tutorial-story-copy">
          <p className="eyebrow">{dialog.stage === 'intro' ? '시간여행 이야기' : '바람이의 장사길 안내'}</p>
          <h2 id="tutorial-story-title">{dialog.speaker === 'fairy' ? '정우야, 들어봐!' : '정우의 생각'}</h2>
          <p>{dialog.text}</p>
          <div className="tutorial-story-target">
            <span className="tutorial-story-icon">
              {relatedGood ? <GoodIcon good={relatedGood} /> : <img src={dialog.portraitAsset ?? HUB_ICON.map} alt="" />}
            </span>
            <span>
              <small>다음에 할 일</small>
              <strong>{targetLabel}</strong>
            </span>
          </div>
        </div>
        <div className="tutorial-story-actions">
          <button className="primary tutorial-story-continue" onClick={onContinue}>{dialog.actionLabel ?? (dialog.nextId ? '다음' : '알겠어')}</button>
          <button className="tutorial-story-skip" onClick={onSkip}>건너뛰기</button>
        </div>
      </section>
    </div>
  );
}

function EquipmentNoticeModal({ notice, onClose, onNavigate }: { notice: EquipmentNotice; onClose: () => void; onNavigate: (tab: Tab) => void }) {
  return (
    <div className="modal-backdrop">
      <section className="event-modal equipment-notice-modal" data-testid="equipment-notice-modal">
        <div className="equipment-notice-hero">
          {notice.tool ? (
            <span className="notice-avatar-wrap"><ToolIcon tool={notice.tool} /></span>
          ) : notice.companion ? (
            <span className="notice-avatar-wrap"><CompanionAvatar companion={notice.companion} /></span>
          ) : (
            <img className="pixel-vehicle" src={notice.image} alt="" />
          )}
          <div>
            <p className="eyebrow">새 목표가 열렸어요</p>
            <h2>{notice.title}</h2>
            <p>{notice.text}</p>
          </div>
        </div>
        {notice.detailLines && notice.detailLines.length > 0 && (
          <div className="notice-detail-list">
            {notice.detailLines.map((line) => <span key={line}>{line}</span>)}
          </div>
        )}
        <div className="new-route-strip">
          <span>다음 행동</span>
          <strong>{notice.next}</strong>
        </div>
        <div className="modal-actions-row">
          <button onClick={onClose}>닫기</button>
          <button className="primary" onClick={() => onNavigate(notice.tab)}>{notice.next}</button>
        </div>
      </section>
    </div>
  );
}

function BottomTabs({ active, onChange, highlightTarget }: { active: Tab; onChange: (tab: Tab) => void; highlightTarget?: string }) {
  const tabs: Array<[Tab, string, string]> = [
    ['port', '항구', 'tab-port'],
    ['market', '시장', 'tab-market'],
    ['map', '지도', 'tab-map'],
    ['cargo', '짐칸', 'tab-cargo'],
    ['quests', '의뢰', 'tab-quests'],
    ['vehicles', '장비', 'tab-vehicles'],
    ['ledger', '장부', 'tab-ledger']
  ];
  return <nav className="bottom-tabs" aria-label="하단 탭">{tabs.map(([tab, label, testId]) => <button key={tab} data-testid={testId} className={`${active === tab ? 'active' : ''} ${highlightTarget === testId ? 'tutorial-highlight' : ''}`} onClick={() => onChange(tab)}>{label}</button>)}</nav>;
}



