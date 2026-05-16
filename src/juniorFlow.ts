import type { JuniorBoat, JuniorCargoItem, JuniorCityId, JuniorEvent, JuniorGoodId, JuniorMarketPressure, JuniorNotebook, JuniorNotebookStatus, JuniorNotebookTopic, JuniorRegionalEvent, JuniorReward, JuniorSave, JuniorStarItem, JuniorStep, JuniorStoryEvent, JuniorVehicle } from './juniorTypes';
import { DEFAULT_JUNIOR_SAVE, DEFAULT_SEYEON_NOTEBOOK, ENDING_COINS, JUNIOR_BOATS, JUNIOR_CITIES, JUNIOR_EVENTS, JUNIOR_GOODS, JUNIOR_MAIN_STORY_EVENTS, JUNIOR_MOUNTAINS, JUNIOR_REGIONAL_EVENTS, JUNIOR_ROUTES, JUNIOR_SAVE_KEY, JUNIOR_SAVE_VERSION, JUNIOR_STAR_ITEMS, JUNIOR_STORY_EVENTS, JUNIOR_VEHICLES, STORY_ENDING_LEDGER_CLUES, STORY_ENDING_NOTEBOOK_COUNT, STORY_ENDING_STUDY_ROOM_LEVEL, getGood } from './juniorData';

function isStep(value: unknown): value is JuniorStep {
  return typeof value === 'string' && ['intro', 'pick', 'buy', 'city', 'map', 'travel', 'visitIntro', 'market', 'event', 'eventResult', 'storyEvent', 'storyReward', 'regionalEvent', 'shop', 'endingChoice', 'ending'].includes(value);
}

function isCity(value: unknown): value is JuniorCityId {
  return typeof value === 'string' && JUNIOR_CITIES.some((city) => city.id === value);
}

function isGood(value: unknown): value is JuniorGoodId {
  return typeof value === 'string' && JUNIOR_GOODS.some((good) => good.id === value);
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

let memorySave: JuniorSave | undefined;

function cloneSave(save: JuniorSave): JuniorSave {
  return {
    ...save,
    cargo: save.cargo.map((item) => ({ ...item })),
    unlockedCities: [...save.unlockedCities],
    visitedCityIds: [...save.visitedCityIds],
    seenEventIds: [...save.seenEventIds],
    seenRegionalEventIds: [...save.seenRegionalEventIds],
    storyArcProgress: { ...save.storyArcProgress },
    seyeonNotebook: { ...save.seyeonNotebook },
    storyFragments: [...save.storyFragments],
    completedStoryEventIds: [...save.completedStoryEventIds],
    heardStoryEventIds: [...save.heardStoryEventIds],
    unlockedStarItemIds: [...save.unlockedStarItemIds],
    rumorMarkers: { ...save.rumorMarkers },
    badges: [...save.badges],
    ownedStarItemIds: [...save.ownedStarItemIds],
    equippedStarItems: { ...save.equippedStarItems },
    consumableItems: { ...save.consumableItems },
    activeEffects: { ...save.activeEffects },
    marketPressure: {
      buy: { ...save.marketPressure.buy },
      sell: { ...save.marketPressure.sell }
    },
    lastResultChips: save.lastResultChips ? [...save.lastResultChips] : undefined
  };
}

function defaultSave() {
  return cloneSave(DEFAULT_JUNIOR_SAVE);
}

function lastSavedAtOr(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : undefined;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function starItemIds(value: unknown) {
  const ids = new Set(JUNIOR_STAR_ITEMS.map((item) => item.id));
  return stringArray(value).filter((id, index, array) => ids.has(id) && array.indexOf(id) === index);
}

function storyEventIds(value: unknown) {
  const ids = new Set(JUNIOR_STORY_EVENTS.map((event) => event.id));
  return stringArray(value).filter((id, index, array) => ids.has(id) && array.indexOf(id) === index);
}

function normalizeConsumableItems(value: unknown) {
  if (!value || typeof value !== 'object') return {};
  const consumables = new Set(JUNIOR_STAR_ITEMS.filter((item) => item.isConsumable).map((item) => item.id));
  const next: Record<string, number> = {};
  for (const [id, count] of Object.entries(value as Record<string, unknown>)) {
    if (!consumables.has(id)) continue;
    const item = JUNIOR_STAR_ITEMS.find((candidate) => candidate.id === id);
    const maxOwned = item?.maxOwned ?? 99;
    next[id] = Math.max(0, Math.min(maxOwned, Math.floor(numberOr(count, 0))));
  }
  return next;
}

function normalizeEquippedStarItems(value: unknown, ownedItemIds: string[]) {
  if (!value || typeof value !== 'object') return {};
  const owned = new Set(ownedItemIds);
  const next: JuniorSave['equippedStarItems'] = {};
  for (const [slot, itemId] of Object.entries(value as Record<string, unknown>)) {
    if (typeof itemId !== 'string' || !owned.has(itemId)) continue;
    const item = JUNIOR_STAR_ITEMS.find((candidate) => candidate.id === itemId);
    if (!item || item.isConsumable || item.slot === 'none' || item.slot !== slot) continue;
    next[item.slot] = item.id;
  }
  return next;
}

function normalizeActiveEffects(value: unknown): JuniorSave['activeEffects'] {
  if (!value || typeof value !== 'object') {
    return { fastTravelNextRoute: false, cargoProtectNextEvent: false, quizRetryAvailable: false };
  }
  const raw = value as Partial<JuniorSave['activeEffects']>;
  return {
    fastTravelNextRoute: Boolean(raw.fastTravelNextRoute),
    halfPriceNextGoodId: isGood(raw.halfPriceNextGoodId) ? raw.halfPriceNextGoodId : undefined,
    cargoProtectNextEvent: Boolean(raw.cargoProtectNextEvent),
    quizRetryAvailable: Boolean(raw.quizRetryAvailable),
    marketRecommendCityId: isCity(raw.marketRecommendCityId) ? raw.marketRecommendCityId : undefined
  };
}

function normalizeStoryArcProgress(value: unknown) {
  if (!value || typeof value !== 'object') return {};
  const next: Record<string, number> = {};
  for (const [key, progress] of Object.entries(value as Record<string, unknown>)) {
    if (typeof progress === 'number' && Number.isFinite(progress)) next[key] = progress;
  }
  return next;
}

function normalizeNotebookStatus(value: unknown): JuniorNotebookStatus {
  return value === 'started' || value === 'completed' ? value : 'locked';
}

function normalizeSeyeonNotebook(value: unknown): JuniorNotebook {
  if (!value || typeof value !== 'object') return { ...DEFAULT_SEYEON_NOTEBOOK };
  const raw = value as Partial<Record<JuniorNotebookTopic, unknown>>;
  return {
    writing: normalizeNotebookStatus(raw.writing),
    math: normalizeNotebookStatus(raw.math),
    map: normalizeNotebookStatus(raw.map),
    weather: normalizeNotebookStatus(raw.weather),
    trade: normalizeNotebookStatus(raw.trade)
  };
}

function normalizeRumorMarkers(value: unknown): JuniorSave['rumorMarkers'] {
  const fallback = { ...DEFAULT_JUNIOR_SAVE.rumorMarkers };
  if (!value || typeof value !== 'object') return fallback;
  const next = { ...fallback };
  for (const [key, status] of Object.entries(value as Record<string, unknown>)) {
    if (status === 'available' || status === 'active' || status === 'completed') next[key] = status;
  }
  return next;
}

function cityArray(value: unknown, fallback = DEFAULT_JUNIOR_SAVE.unlockedCities) {
  return Array.isArray(value) ? value.filter(isCity) : fallback;
}

function normalizeCargo(value: unknown): JuniorCargoItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is JuniorCargoItem => {
    if (!item || typeof item !== 'object') return false;
    const cargo = item as Partial<JuniorCargoItem>;
    return typeof cargo.id === 'string' && isGood(cargo.goodId) && isCity(cargo.fromCityId);
  }).map((item) => ({
    ...item,
    buyPrice: numberOr((item as Partial<JuniorCargoItem>).buyPrice, getBuyPrice(DEFAULT_JUNIOR_SAVE, item.fromCityId, item.goodId))
  }));
}

function normalizePressure(value: unknown): JuniorMarketPressure {
  if (!value || typeof value !== 'object') return { buy: {}, sell: {} };
  const raw = value as Partial<JuniorMarketPressure>;
  const clean = (record: unknown) => {
    if (!record || typeof record !== 'object') return {};
    const next: Record<string, number> = {};
    for (const [key, count] of Object.entries(record as Record<string, unknown>)) {
      if (typeof count === 'number' && Number.isFinite(count)) next[key] = count;
    }
    return next;
  };
  return { buy: clean(raw.buy), sell: clean(raw.sell) };
}

export function normalizeJuniorSave(raw: unknown): JuniorSave {
  if (!raw || typeof raw !== 'object') return defaultSave();
  const value = raw as Partial<JuniorSave>;
  const vehicleId = JUNIOR_VEHICLES.some((vehicle) => vehicle.id === value.vehicleId) ? value.vehicleId as JuniorVehicle['id'] : DEFAULT_JUNIOR_SAVE.vehicleId;
  const boatId = JUNIOR_BOATS.some((boat) => boat.id === value.boatId) ? value.boatId as JuniorBoat['id'] : DEFAULT_JUNIOR_SAVE.boatId;
  const vehicle = JUNIOR_VEHICLES.find((item) => item.id === vehicleId) ?? JUNIOR_VEHICLES[0];
  const legacyStars = Math.max(0, Math.floor(numberOr(value.stars, 0)));
  const totalStarsEarned = Math.max(legacyStars, Math.floor(numberOr(value.totalStarsEarned, legacyStars)));
  const starBalance = Math.max(0, Math.floor(numberOr(value.starBalance, legacyStars)));
  const ownedStarItemIds = starItemIds(value.ownedStarItemIds);
  return {
    saveVersion: JUNIOR_SAVE_VERSION,
    currentStep: isStep(value.currentStep) ? value.currentStep : 'intro',
    currentCityId: isCity(value.currentCityId) ? value.currentCityId : 'busan',
    destinationCityId: isCity(value.destinationCityId) ? value.destinationCityId : undefined,
    selectedGoodId: isGood(value.selectedGoodId) ? value.selectedGoodId : undefined,
    selectedEventId: typeof value.selectedEventId === 'string' ? value.selectedEventId : undefined,
    selectedRegionalEventId: typeof value.selectedRegionalEventId === 'string' ? value.selectedRegionalEventId : undefined,
    regionalReturnStep: isStep(value.regionalReturnStep) ? value.regionalReturnStep : undefined,
    eventResultText: typeof value.eventResultText === 'string' ? value.eventResultText : undefined,
    coins: numberOr(value.coins, DEFAULT_JUNIOR_SAVE.coins),
    stars: starBalance,
    totalStarsEarned,
    starBalance,
    ownedStarItemIds,
    equippedStarItems: normalizeEquippedStarItems(value.equippedStarItems, ownedStarItemIds),
    consumableItems: normalizeConsumableItems(value.consumableItems),
    activeEffects: normalizeActiveEffects(value.activeEffects),
    cargo: normalizeCargo(value.cargo),
    cargoLimit: numberOr(value.cargoLimit, vehicle.cargoLimit),
    vehicleId,
    boatId,
    unlockedCities: cityArray(value.unlockedCities),
    visitedCityIds: cityArray(value.visitedCityIds, ['busan']),
    completedTutorial: Boolean(value.completedTutorial),
    tutorialStage: numberOr(value.tutorialStage, 0),
    seenEventIds: stringArray(value.seenEventIds),
    seenRegionalEventIds: stringArray(value.seenRegionalEventIds),
    lastRegionalEventCityId: isCity(value.lastRegionalEventCityId) ? value.lastRegionalEventCityId : undefined,
    lastRegionalEventId: typeof value.lastRegionalEventId === 'string' ? value.lastRegionalEventId : undefined,
    storyArcProgress: normalizeStoryArcProgress(value.storyArcProgress),
    mainStoryStage: Math.max(0, Math.min(12, Math.floor(numberOr(value.mainStoryStage, 0)))),
    seyeonNotebook: normalizeSeyeonNotebook(value.seyeonNotebook),
    ledgerClues: Math.max(0, Math.min(STORY_ENDING_LEDGER_CLUES, Math.floor(numberOr(value.ledgerClues, numberOr(value.storyClues, 0))))),
    storyFragments: stringArray(value.storyFragments),
    completedStoryEventIds: stringArray(value.completedStoryEventIds),
    activeStoryEventId: typeof value.activeStoryEventId === 'string' && JUNIOR_MAIN_STORY_EVENTS.some((event) => event.id === value.activeStoryEventId) ? value.activeStoryEventId : undefined,
    selectedStoryEventId: typeof value.selectedStoryEventId === 'string' && JUNIOR_STORY_EVENTS.some((event) => event.id === value.selectedStoryEventId) ? value.selectedStoryEventId : undefined,
    pendingStoryRumorEventId: typeof value.pendingStoryRumorEventId === 'string' && JUNIOR_STORY_EVENTS.some((event) => event.id === value.pendingStoryRumorEventId) ? value.pendingStoryRumorEventId : undefined,
    storyReturnStep: isStep(value.storyReturnStep) ? value.storyReturnStep : undefined,
    heardStoryEventIds: storyEventIds(value.heardStoryEventIds),
    unlockedStarItemIds: starItemIds(value.unlockedStarItemIds),
    rumorMarkers: normalizeRumorMarkers(value.rumorMarkers),
    studyRoomLevel: Math.max(0, Math.min(STORY_ENDING_STUDY_ROOM_LEVEL, Math.floor(numberOr(value.studyRoomLevel, 0)))),
    quizWrongStreak: numberOr(value.quizWrongStreak, 0),
    storyClues: numberOr(value.storyClues, 0),
    badges: stringArray(value.badges),
    completedEnding: Boolean(value.completedEnding),
    completedRuns: numberOr(value.completedRuns, 0),
    marketPressure: normalizePressure(value.marketPressure),
    lastResultChips: stringArray(value.lastResultChips),
    lastSavedAt: lastSavedAtOr(value.lastSavedAt),
    message: typeof value.message === 'string' ? value.message : undefined
  };
}

export function loadJuniorSave(): JuniorSave {
  if (memorySave) return normalizeJuniorSave(memorySave);
  try {
    const raw = localStorage.getItem(JUNIOR_SAVE_KEY);
    return raw ? normalizeJuniorSave(JSON.parse(raw)) : defaultSave();
  } catch {
    try {
      localStorage.removeItem(JUNIOR_SAVE_KEY);
    } catch {
      // Local storage can be unavailable in private or locked-down browsers.
    }
    return defaultSave();
  }
}

export function saveJuniorGame(save: JuniorSave) {
  const stamped = normalizeJuniorSave({
    ...save,
    saveVersion: JUNIOR_SAVE_VERSION,
    lastSavedAt: new Date().toISOString()
  });
  memorySave = stamped;
  try {
    localStorage.setItem(JUNIOR_SAVE_KEY, JSON.stringify(stamped));
  } catch {
    // Keep the in-memory save so the current session survives storage errors.
  }
}

export function resetJuniorGame(): JuniorSave {
  return {
    ...DEFAULT_JUNIOR_SAVE,
    saveVersion: JUNIOR_SAVE_VERSION,
    lastSavedAt: undefined,
    cargo: [],
    stars: 0,
    starBalance: 0,
    totalStarsEarned: 0,
    ownedStarItemIds: [],
    equippedStarItems: {},
    consumableItems: {},
    activeEffects: {
      fastTravelNextRoute: false,
      cargoProtectNextEvent: false,
      quizRetryAvailable: false
    },
    unlockedCities: [...DEFAULT_JUNIOR_SAVE.unlockedCities],
    visitedCityIds: [...DEFAULT_JUNIOR_SAVE.visitedCityIds],
    badges: [],
    seenEventIds: [],
    seenRegionalEventIds: [],
    selectedRegionalEventId: undefined,
    regionalReturnStep: undefined,
    lastRegionalEventCityId: undefined,
    lastRegionalEventId: undefined,
    storyArcProgress: {},
    mainStoryStage: 0,
    seyeonNotebook: { ...DEFAULT_SEYEON_NOTEBOOK },
    ledgerClues: 0,
    storyFragments: [],
    completedStoryEventIds: [],
    activeStoryEventId: undefined,
    selectedStoryEventId: undefined,
    pendingStoryRumorEventId: undefined,
    storyReturnStep: undefined,
    heardStoryEventIds: [],
    unlockedStarItemIds: [],
    rumorMarkers: { ...DEFAULT_JUNIOR_SAVE.rumorMarkers },
    studyRoomLevel: 0,
    quizWrongStreak: 0,
    lastResultChips: undefined,
    marketPressure: { buy: {}, sell: {} }
  };
}

function currentSeason(): JuniorRegionalEvent['season'] {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function regionalEventSeed(save: JuniorSave, cityId: JuniorCityId, salt = '') {
  const text = `${salt}:${cityId}:${save.coins}:${save.stars}:${save.seenRegionalEventIds.length}:${save.lastRegionalEventId ?? ''}:${save.cargo.length}`;
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function regionalEventFits(event: JuniorRegionalEvent, save: JuniorSave, cityId: JuniorCityId) {
  if (event.cityId !== cityId) return false;
  if (event.id === save.lastRegionalEventId) return false;
  if (event.once && save.seenRegionalEventIds.includes(event.id)) return false;
  if (event.season && event.season !== currentSeason()) return false;
  return true;
}

function selectRegionalEvent(save: JuniorSave, cityId: JuniorCityId, preferLandmark = false) {
  const candidates = JUNIOR_REGIONAL_EVENTS.filter((event) => regionalEventFits(event, save, cityId));
  if (!candidates.length) return undefined;
  const landmark = candidates.find((event) => preferLandmark && event.type === 'landmark');
  if (landmark) return landmark;
  const merchant = candidates.find((event) => event.type === 'merchant_rumor');
  const seed = regionalEventSeed(save, cityId, 'regional-pick');
  const pool = merchant && seed % 2 === 0 ? [merchant, ...candidates.filter((event) => event.id !== merchant.id)] : candidates;
  return pool[seed % pool.length];
}

export function getSelectedRegionalEvent(save: JuniorSave): JuniorRegionalEvent | undefined {
  return JUNIOR_REGIONAL_EVENTS.find((event) => event.id === save.selectedRegionalEventId);
}

export function getRegionalEventChanceSummary() {
  return {
    merchantRumor: 30,
    cityOrMarket: 'city visit or market entry',
    noImmediateRepeat: true
  };
}

export function maybeOpenRegionalEvent(save: JuniorSave, returnStep: JuniorStep = 'city', forcedRoll?: number, preferLandmark = false): JuniorSave {
  if (!save.completedTutorial) return save;
  if (save.currentStep === 'regionalEvent') return save;
  const roll = forcedRoll ?? ((regionalEventSeed(save, save.currentCityId, returnStep) % 100) / 100);
  if (!preferLandmark && roll >= 0.3) return save;
  const event = selectRegionalEvent(save, save.currentCityId, preferLandmark);
  if (!event) return save;
  return {
    ...save,
    currentStep: 'regionalEvent',
    selectedRegionalEventId: event.id,
    regionalReturnStep: returnStep,
    seenRegionalEventIds: save.seenRegionalEventIds.includes(event.id) ? save.seenRegionalEventIds : [...save.seenRegionalEventIds, event.id],
    lastRegionalEventCityId: save.currentCityId,
    lastRegionalEventId: event.id,
    message: undefined
  };
}

export function closeRegionalEvent(save: JuniorSave): JuniorSave {
  const event = getSelectedRegionalEvent(save);
  const returnStep = save.regionalReturnStep && save.regionalReturnStep !== 'regionalEvent' ? save.regionalReturnStep : 'city';
  const rewarded = applyReward(save, event?.reward);
  return applyMilestones({
    ...rewarded,
    currentStep: returnStep,
    selectedRegionalEventId: undefined,
    regionalReturnStep: undefined,
    lastResultChips: event?.reward ? rewardChips(event.reward) : rewarded.lastResultChips,
    message: event?.fairyText
  });
}

export function getCity(cityId: JuniorCityId) {
  return JUNIOR_CITIES.find((city) => city.id === cityId) ?? JUNIOR_CITIES[0];
}

export function getRoute(from: JuniorCityId, to: JuniorCityId) {
  return JUNIOR_ROUTES.find((route) => (route.from === from && route.to === to) || (route.from === to && route.to === from));
}

export function getConnectedCityIds(save: JuniorSave) {
  return JUNIOR_ROUTES
    .filter((route) => route.from === save.currentCityId || route.to === save.currentCityId)
    .map((route) => route.from === save.currentCityId ? route.to : route.from)
    .filter((cityId) => save.unlockedCities.includes(cityId));
}

export function canTravel(save: JuniorSave, cityId: JuniorCityId) {
  if (cityId === save.currentCityId) return false;
  if (!save.unlockedCities.includes(cityId)) return false;
  const route = getRoute(save.currentCityId, cityId);
  if (!route) return false;
  return !route.needsBoat || save.boatId !== 'none';
}

function pressureKey(cityId: JuniorCityId, goodId: JuniorGoodId) {
  return `${cityId}:${goodId}`;
}

function variation(cityId: JuniorCityId, goodId: JuniorGoodId) {
  const text = `${cityId}:${goodId}`;
  return (Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3) - 1;
}

export function getBuyPrice(save: JuniorSave, cityId: JuniorCityId, goodId: JuniorGoodId) {
  const city = getCity(cityId);
  const good = getGood(goodId);
  const local = city.buyGoodIds.includes(goodId) ? -3 : 4;
  const count = save.marketPressure.buy[pressureKey(cityId, goodId)] ?? 0;
  return Math.max(3, good.baseBuyCoins + local + variation(cityId, goodId) + count * 2);
}

export function getDiscountedBuyPrice(save: JuniorSave, cityId: JuniorCityId, goodId: JuniorGoodId) {
  const price = getBuyPrice(save, cityId, goodId);
  return save.activeEffects.halfPriceNextGoodId === goodId ? Math.max(1, Math.ceil(price / 2)) : price;
}

export function getSellPrice(save: JuniorSave, cityId: JuniorCityId, goodId: JuniorGoodId) {
  const city = getCity(cityId);
  const good = getGood(goodId);
  const wanted = city.sellGoodIds.includes(goodId) || city.id === 'seoul';
  const local = city.buyGoodIds.includes(goodId);
  const bonus = local ? -5 : wanted ? 6 : 1;
  const count = save.marketPressure.sell[pressureKey(cityId, goodId)] ?? 0;
  return Math.max(4, good.baseSellCoins + bonus + variation(cityId, goodId) - count * 2);
}

export function getSellPriceForCargo(save: JuniorSave, cityId: JuniorCityId, cargoItem: JuniorCargoItem) {
  const marketPrice = getSellPrice(save, cityId, cargoItem.goodId);
  const city = getCity(cityId);
  if (cargoItem.fromCityId === cityId) return Math.min(marketPrice, cargoItem.buyPrice);
  if (city.buyGoodIds.includes(cargoItem.goodId)) return Math.min(marketPrice, Math.max(4, cargoItem.buyPrice - 1));
  return marketPrice;
}

export function getBestSellCityForGood(goodId: JuniorGoodId, fromCityId?: JuniorCityId) {
  return JUNIOR_CITIES.find((city) => city.id !== fromCityId && (city.sellGoodIds.includes(goodId) || city.id === 'seoul'));
}

export function getRecommendedMarketGoodId(save: JuniorSave): JuniorGoodId | undefined {
  if (save.activeEffects.marketRecommendCityId !== save.currentCityId) return undefined;
  const city = getCity(save.currentCityId);
  return city.buyGoodIds[0] ?? JUNIOR_GOODS[0]?.id;
}

function storyNumber(eventId: string) {
  return Number(eventId.replace('M', '')) || 0;
}

function hasStory(save: JuniorSave, eventId: string) {
  return save.completedStoryEventIds.includes(eventId);
}

function addStoryFragment(save: JuniorSave, fragment?: string): JuniorSave {
  if (!fragment || save.storyFragments.includes(fragment)) return save;
  return { ...save, storyFragments: [...save.storyFragments, fragment] };
}

function startStoryEvent(save: JuniorSave, eventId?: string): JuniorSave {
  if (!eventId || save.activeStoryEventId || hasStory(save, eventId)) return save;
  return { ...save, activeStoryEventId: eventId };
}

function notebookOpenCount(save: JuniorSave) {
  return Object.values(save.seyeonNotebook).filter((status) => status !== 'locked').length;
}

function applyStoryReward(save: JuniorSave, reward?: JuniorReward): JuniorSave {
  if (!reward) return save;
  let next = addStoryFragment(save, reward.storyFragment);
  if (reward.notebookTopic) {
    next = {
      ...next,
      seyeonNotebook: {
        ...next.seyeonNotebook,
        [reward.notebookTopic]: next.seyeonNotebook[reward.notebookTopic] === 'completed' ? 'completed' : 'started'
      }
    };
  }
  if (reward.ledgerClues) {
    next = { ...next, ledgerClues: Math.max(next.ledgerClues, Math.min(STORY_ENDING_LEDGER_CLUES, reward.ledgerClues)) };
  }
  if (reward.studyRoomLevel) {
    next = { ...next, studyRoomLevel: Math.max(next.studyRoomLevel, Math.min(STORY_ENDING_STUDY_ROOM_LEVEL, reward.studyRoomLevel)) };
  }
  return next;
}

function updateStudyRoomProgress(save: JuniorSave): JuniorSave {
  const openCount = notebookOpenCount(save);
  const earnedLevel = openCount >= 5 && save.ledgerClues >= 2
    ? 2
    : openCount >= 3
      ? 1
      : save.studyRoomLevel;
  return earnedLevel > save.studyRoomLevel ? { ...save, studyRoomLevel: earnedLevel } : save;
}

export function getMainStoryEvent(eventId?: string) {
  return JUNIOR_MAIN_STORY_EVENTS.find((event) => event.id === eventId);
}

export function getStoryEvent(eventId?: string) {
  return JUNIOR_STORY_EVENTS.find((event) => event.id === eventId);
}

function hasCompletedStoryEvent(save: JuniorSave, eventId: string) {
  return save.completedStoryEventIds.includes(eventId);
}

function storyRumorSeed(save: JuniorSave, returnStep: JuniorStep, salt = '') {
  const text = `${salt}:${save.currentCityId}:${returnStep}:${save.coins}:${save.stars}:${save.heardStoryEventIds.length}:${save.completedStoryEventIds.length}:${save.cargo.length}`;
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function storyPrerequisitesMet(save: JuniorSave, event: JuniorStoryEvent) {
  return event.prerequisiteEventIds.every((eventId) => hasCompletedStoryEvent(save, eventId));
}

function storyRumorFits(event: JuniorStoryEvent, save: JuniorSave, cityId: JuniorCityId) {
  if (!event.rumorCityIds.includes(cityId)) return false;
  if (hasCompletedStoryEvent(save, event.id)) return false;
  if (save.heardStoryEventIds.includes(event.id)) return false;
  if (!storyPrerequisitesMet(save, event)) return false;
  return true;
}

function selectStoryRumor(save: JuniorSave, cityId: JuniorCityId) {
  const candidates = JUNIOR_STORY_EVENTS.filter((event) => storyRumorFits(event, save, cityId));
  if (!candidates.length) return undefined;
  const seed = storyRumorSeed(save, save.currentStep, 'story-rumor-pick');
  return candidates[seed % candidates.length];
}

function markStoryRumor(save: JuniorSave, event: JuniorStoryEvent): JuniorSave {
  const heardStoryEventIds = save.heardStoryEventIds.includes(event.id) ? save.heardStoryEventIds : [...save.heardStoryEventIds, event.id];
  return {
    ...save,
    heardStoryEventIds,
    pendingStoryRumorEventId: event.id,
    rumorMarkers: { ...save.rumorMarkers, [event.id]: 'available' },
    message: `${event.title} 소문을 들었어.`
  };
}

export function maybeOpenStoryRumor(save: JuniorSave, returnStep: JuniorStep = 'city', forcedRoll?: number): JuniorSave {
  if (!save.completedTutorial) return save;
  if (save.pendingStoryRumorEventId || save.selectedStoryEventId || save.currentStep === 'storyEvent' || save.currentStep === 'storyReward') return save;
  const roll = forcedRoll ?? ((storyRumorSeed(save, returnStep, 'story-rumor-roll') % 100) / 100);
  if (roll >= 0.3) return save;
  const event = selectStoryRumor(save, save.currentCityId);
  return event ? markStoryRumor(save, event) : save;
}

export function showStoryRumorOnMap(save: JuniorSave): JuniorSave {
  return {
    ...save,
    currentStep: 'map',
    pendingStoryRumorEventId: undefined,
    selectedGoodId: undefined,
    message: '지도에 이야기 표식을 붙였어.'
  };
}

export function getVisibleStoryEvents(save: JuniorSave) {
  const visibleIds = new Set([...save.heardStoryEventIds, ...save.completedStoryEventIds.filter((id) => id.startsWith('E'))]);
  return JUNIOR_STORY_EVENTS.filter((event) => visibleIds.has(event.id));
}

export function getStoryMarkerStatus(save: JuniorSave, eventId: string) {
  if (hasCompletedStoryEvent(save, eventId)) return 'completed' as const;
  if (save.selectedStoryEventId === eventId || save.rumorMarkers[eventId] === 'active') return 'active' as const;
  return 'available' as const;
}

export function getStoryEventLocationLabel(event: JuniorStoryEvent) {
  if (event.mountainId) {
    const mountain = JUNIOR_MOUNTAINS.find((item) => item.id === event.mountainId);
    if (mountain) return mountain.name;
  }
  const city = event.rumorCityIds[0] ? getCity(event.rumorCityIds[0]) : undefined;
  if (city) return city.name;
  return event.routeId ? '이야기 길' : '조선 이야기';
}

export function getStoryRewardHint(event: JuniorStoryEvent) {
  if (event.reward.ledgerClue || event.reward.ledgerClues || event.category === 'main_clue') return '장부 단서';
  if (event.reward.seyeonNotebookProgress || event.reward.notebookTopic) return '세연이 노트';
  if (event.reward.cosmeticItemUnlock) return '새 꾸미기';
  if (event.reward.stars) return `별 +${event.reward.stars}`;
  if (event.reward.coins) return `돈 +${event.reward.coins}`;
  return '이야기 조각';
}

export function startStoryEventFromMap(save: JuniorSave, eventId: string): JuniorSave {
  const event = getStoryEvent(eventId);
  if (!event || hasCompletedStoryEvent(save, event.id) || !save.heardStoryEventIds.includes(event.id)) return save;
  return {
    ...save,
    currentStep: 'storyEvent',
    selectedStoryEventId: event.id,
    storyReturnStep: 'city',
    pendingStoryRumorEventId: undefined,
    rumorMarkers: { ...save.rumorMarkers, [event.id]: 'active' },
    message: undefined
  };
}

function unlockNextStoryChainRumor(save: JuniorSave, event: JuniorStoryEvent): JuniorSave {
  if (!event.chainId) return save;
  const nextEvent = JUNIOR_STORY_EVENTS.find((candidate) => (
    candidate.chainId === event.chainId
    && (candidate.chainStep ?? 1) === (event.chainStep ?? 1) + 1
    && !hasCompletedStoryEvent(save, candidate.id)
    && !save.heardStoryEventIds.includes(candidate.id)
    && storyPrerequisitesMet(save, candidate)
  ));
  if (!nextEvent) return save;
  return {
    ...save,
    heardStoryEventIds: [...save.heardStoryEventIds, nextEvent.id],
    rumorMarkers: { ...save.rumorMarkers, [nextEvent.id]: 'available' },
    message: `${nextEvent.title} 소문이 이어졌어.`
  };
}

export function completeStoryEventChoice(save: JuniorSave, choiceIndex = 0): JuniorSave {
  const event = getStoryEvent(save.selectedStoryEventId);
  if (!event) return { ...save, currentStep: 'city', selectedStoryEventId: undefined };
  const choice = event.choices[choiceIndex] ?? event.choices[0];
  const reward = choice?.reward ?? event.reward;
  const completedStoryEventIds = hasCompletedStoryEvent(save, event.id) ? save.completedStoryEventIds : [...save.completedStoryEventIds, event.id];
  const rewarded = applyReward({
    ...save,
    completedStoryEventIds,
    currentStep: 'storyReward',
    rumorMarkers: { ...save.rumorMarkers, [event.id]: 'completed' },
    eventResultText: choice?.resultText ?? event.dialogueCuts[event.dialogueCuts.length - 1]?.text,
    lastResultChips: rewardChips(reward).slice(0, 2)
  }, reward);
  return maybeQueueMainStoryEvent(unlockNextStoryChainRumor(rewarded, event));
}

export function closeStoryReward(save: JuniorSave): JuniorSave {
  const returnStep = save.storyReturnStep && save.storyReturnStep !== 'storyEvent' && save.storyReturnStep !== 'storyReward'
    ? save.storyReturnStep
    : 'city';
  return maybeQueueMainStoryEvent({
    ...save,
    currentStep: returnStep,
    selectedStoryEventId: undefined,
    storyReturnStep: undefined,
    eventResultText: undefined,
    lastResultChips: undefined
  });
}

export function getSeyeonNotebookProgress(save: JuniorSave) {
  return notebookOpenCount(save);
}

export function canStartReturnDoorStory(save: JuniorSave) {
  return save.coins >= ENDING_COINS
    && getSeyeonNotebookProgress(save) >= STORY_ENDING_NOTEBOOK_COUNT
    && save.ledgerClues >= STORY_ENDING_LEDGER_CLUES
    && save.studyRoomLevel >= STORY_ENDING_STUDY_ROOM_LEVEL;
}

export function canOpenStoryEnding(save: JuniorSave) {
  return canStartReturnDoorStory(save) && hasStory(save, 'M12');
}

export function maybeQueueMainStoryEvent(save: JuniorSave): JuniorSave {
  const next = updateStudyRoomProgress(save);
  if (next.activeStoryEventId) return next;
  if (!hasStory(next, 'M01') && !next.completedTutorial && next.tutorialStage >= 1) return startStoryEvent(next, 'M01');
  if (hasStory(next, 'M01') && !hasStory(next, 'M02') && next.currentCityId === 'busan') return startStoryEvent(next, 'M02');
  if (hasStory(next, 'M02') && !hasStory(next, 'M03')) return startStoryEvent(next, 'M03');
  if (hasStory(next, 'M03') && !hasStory(next, 'M04') && next.storyFragments.includes('first_trade_ready')) return startStoryEvent(next, 'M04');
  if (hasStory(next, 'M04') && !hasStory(next, 'M05') && next.storyFragments.includes('paper_gift_ready')) return startStoryEvent(next, 'M05');
  if (hasStory(next, 'M05') && !hasStory(next, 'M06') && next.coins >= 60) return startStoryEvent(next, 'M06');
  if (hasStory(next, 'M06') && !hasStory(next, 'M07') && next.visitedCityIds.length >= 3) return startStoryEvent(next, 'M07');
  if (hasStory(next, 'M07') && !hasStory(next, 'M08') && (next.visitedCityIds.length >= 4 || next.seenEventIds.some((id) => id.includes('weather')))) return startStoryEvent(next, 'M08');
  if (hasStory(next, 'M08') && !hasStory(next, 'M09') && next.coins >= 100) return startStoryEvent(next, 'M09');
  if (hasStory(next, 'M09') && !hasStory(next, 'M10') && next.ledgerClues >= 1) return startStoryEvent(next, 'M10');
  if (hasStory(next, 'M10') && !hasStory(next, 'M11') && next.coins >= ENDING_COINS && notebookOpenCount(next) >= STORY_ENDING_NOTEBOOK_COUNT && next.ledgerClues >= STORY_ENDING_LEDGER_CLUES) return startStoryEvent(next, 'M11');
  return next;
}

export function completeMainStoryEvent(save: JuniorSave, eventId: string): JuniorSave {
  const event = getMainStoryEvent(eventId);
  if (!event) return { ...save, activeStoryEventId: undefined };
  const completedStoryEventIds = hasStory(save, eventId) ? save.completedStoryEventIds : [...save.completedStoryEventIds, eventId];
  const rewarded = applyStoryReward(addStars({
    ...save,
    activeStoryEventId: undefined,
    completedStoryEventIds,
    mainStoryStage: Math.max(save.mainStoryStage, storyNumber(eventId)),
    lastResultChips: rewardChips(event.reward),
    message: event.summary
  }, event.reward?.stars ?? 0), event.reward);
  if (eventId === 'M12') {
    return { ...rewarded, currentStep: 'endingChoice', message: '?꾨?濡??뚯븘媛??臾몄씠 ?대졇??' };
  }
  return maybeQueueMainStoryEvent(rewarded);
}

export function startIntro(save: JuniorSave): JuniorSave {
  return maybeQueueMainStoryEvent({ ...save, currentStep: 'city', tutorialStage: Math.max(save.tutorialStage, 1), message: '먼저 부산 장터에 가 보자.' });
}

export function chooseGood(save: JuniorSave, goodId: JuniorGoodId): JuniorSave {
  return { ...save, selectedGoodId: goodId, currentStep: 'buy', message: undefined };
}

export function buySelectedGood(save: JuniorSave): JuniorSave {
  if (!save.selectedGoodId) return { ...save, currentStep: 'market' };
  return buyGood(save, save.selectedGoodId);
}

export function buyGood(save: JuniorSave, goodId: JuniorGoodId): JuniorSave {
  const basePrice = getBuyPrice(save, save.currentCityId, goodId);
  const usesHalfPrice = save.activeEffects.halfPriceNextGoodId === goodId;
  const price = usesHalfPrice ? Math.max(1, Math.ceil(basePrice / 2)) : basePrice;
  const good = getGood(goodId);
  if (save.cargo.length >= save.cargoLimit) return { ...save, currentStep: 'market', message: '吏먯뭏??苑?李쇱뼱. ?댁젣 ?붾윭 媛??' };
  if (save.coins < price) return { ...save, currentStep: 'market', message: '?덉씠 議곌툑 紐⑥옄??' };
  const cargoItem: JuniorCargoItem = {
    id: `${good.id}-${Date.now()}-${save.cargo.length}`,
    goodId: good.id,
    fromCityId: save.currentCityId,
    buyPrice: price
  };
  const key = pressureKey(save.currentCityId, goodId);
  const bestCity = getBestSellCityForGood(goodId, save.currentCityId);
  const afterTicket = usesHalfPrice
    ? consumeConsumableItem({
      ...save,
      activeEffects: { ...save.activeEffects, halfPriceNextGoodId: undefined }
    }, 'ticket_half_price_good')
    : save;
  const storyReady = goodId === 'paper' && hasStory(afterTicket, 'M04')
    ? addStoryFragment(afterTicket, 'paper_gift_ready')
    : afterTicket;
  return maybeQueueMainStoryEvent({
    ...storyReady,
    coins: storyReady.coins - price,
    cargo: [...storyReady.cargo, cargoItem],
    currentStep: 'market',
    tutorialStage: Math.max(storyReady.tutorialStage, 3),
    marketPressure: {
      ...storyReady.marketPressure,
      buy: { ...storyReady.marketPressure.buy, [key]: (storyReady.marketPressure.buy[key] ?? 0) + 1 }
    },
    lastResultChips: [`-${price}냥`, ...(usesHalfPrice ? ['반값권 사용'] : []), '짐 +1'],
    message: usesHalfPrice
      ? `${good.name}을 싸게 샀어.`
      : bestCity ? `${good.name}은 ${bestCity.name}에서 좋아해.` : `${good.name}을 짐에 넣었어.`
  });
}

export function prepareHalfPriceTicket(save: JuniorSave, goodId: JuniorGoodId): JuniorSave {
  if (save.currentStep !== 'market') return { ...save, message: '諛섍컪沅뚯? ?ν꽣?먯꽌 ?????덉뼱.' };
  if (!save.completedTutorial) return { ...save, message: '泥??곗뒿???앸궃 ?ㅼ뿉 ?⑤낫??' };
  if ((save.consumableItems.ticket_half_price_good ?? 0) <= 0) return { ...save, message: '諛섍컪沅뚯씠 ?놁뼱.' };
  return {
    ...save,
    activeEffects: { ...save.activeEffects, halfPriceNextGoodId: goodId },
    message: '??臾쇨굔??諛섍컪沅뚯쓣 ?멸퉴? ?ㅼ떆 ?꾨Ⅴ硫??멸쾶 ??'
  };
}

export function goToMap(save: JuniorSave): JuniorSave {
  return maybeQueueMainStoryEvent({ ...save, currentStep: 'map', selectedGoodId: undefined, message: '媛?怨녹쓣 怨⑤씪遊?' });
}

export function goToCity(save: JuniorSave): JuniorSave {
  return maybeQueueMainStoryEvent({ ...save, currentStep: 'city', selectedGoodId: undefined, message: undefined });
}

export function goToMarket(save: JuniorSave): JuniorSave {
  const market = maybeQueueMainStoryEvent({ ...save, currentStep: 'market', selectedGoodId: undefined, message: '장터에서 물건을 골라보자.' });
  const withStoryRumor = maybeOpenStoryRumor(market, 'market');
  return withStoryRumor.pendingStoryRumorEventId ? withStoryRumor : maybeQueueMainStoryEvent(maybeOpenRegionalEvent(withStoryRumor, 'market'));
}

export function goToShop(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'shop', message: '?섎젅? 諛곕? ?λ쭔?????덉뼱.' };
}

export function startTravel(save: JuniorSave, destinationCityId: JuniorCityId): JuniorSave {
  if (!canTravel(save, destinationCityId)) return { ...save, message: '?꾩쭅 媛????녿뒗 湲몄씠??' };
  return {
    ...save,
    destinationCityId,
    currentStep: 'travel',
    tutorialStage: Math.max(save.tutorialStage, 5),
    lastResultChips: undefined,
    message: save.activeEffects.fastTravelNextRoute ? '바람길로 빨리 가자.' : `${getCity(destinationCityId).name}으로 출발!`
  };
}

export function startFastTravel(save: JuniorSave, destinationCityId: JuniorCityId): JuniorSave {
  if ((save.consumableItems.ticket_fast_travel ?? 0) <= 0) return { ...save, message: '?좎냽 ?대룞沅뚯씠 ?놁뼱.' };
  const prepared = consumeConsumableItem({
    ...save,
    activeEffects: { ...save.activeEffects, fastTravelNextRoute: true }
  }, 'ticket_fast_travel');
  const traveling = startTravel(prepared, destinationCityId);
  return { ...traveling, message: '바람길로 빨리 가자.' };
}

function eventSeed(save: JuniorSave, routeKind?: string, distance = 1, salt = '') {
  const text = `${salt}:${save.currentCityId}:${save.destinationCityId ?? ''}:${routeKind ?? 'land'}:${distance}:${save.coins}:${save.stars}:${save.seenEventIds.length}:${save.cargo.length}`;
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function eventFitsRoute(event: JuniorEvent, routeKind?: string, routeType?: string) {
  const kindFits = !event.routeKind || event.routeKind === 'any' || event.routeKind === routeKind;
  const typeFits = !event.routeTypes || (routeType ? event.routeTypes.includes(routeType) : false);
  return kindFits && typeFits;
}

function nextStoryArcEvent(save: JuniorSave, routeKind?: string, routeType?: string, storyArcIds: string[] = []) {
  for (const storyArcId of storyArcIds) {
    const nextStage = (save.storyArcProgress[storyArcId] ?? 0) + 1;
    const candidate = JUNIOR_EVENTS.find((event) => (
      event.storyArcId === storyArcId
      && event.storyStage === nextStage
      && eventFitsRoute(event, routeKind, routeType)
      && !save.seenEventIds.includes(event.id)
    ));
    if (candidate) return candidate;
  }
  return undefined;
}

function selectTravelEvent(save: JuniorSave, routeKind?: string, distance = 1, routeType?: string, storyArcIds: string[] = []) {
  const types = routeKind === 'sea'
    ? ['quiz_pirate', 'quiz_weather', 'quiz_merchant', 'quiz_folktale']
    : ['quiz_bandit', 'quiz_animal', 'quiz_merchant', 'quiz_weather', 'quiz_folktale'];
  const moods = [
    { mood: 'bad', chance: 3 },
    { mood: 'good', chance: 2 },
    { mood: 'talk', chance: 2 },
    { mood: 'story', chance: 1 }
  ] as const;
  for (const bucket of moods) {
    const roll = eventSeed(save, routeKind, distance, bucket.mood) % 100;
    if (roll >= bucket.chance) continue;
    if (bucket.mood === 'story' || bucket.mood === 'good') {
      const storyEvent = nextStoryArcEvent(save, routeKind, routeType, storyArcIds);
      if (storyEvent && storyEvent.mood === bucket.mood) return storyEvent;
    }
    const candidates = JUNIOR_EVENTS.filter((event) => (
      event.mood === bucket.mood
      && event.chancePercent <= bucket.chance
      && types.includes(event.type)
      && eventFitsRoute(event, routeKind, routeType)
      && !save.seenEventIds.includes(event.id)
    ));
    const earlyEasyIds = ['tutorial_spelling_1', 'merchant_spelling_1', 'merchant_spelling_4', 'animal_spelling_5', 'weather_spelling_1', 'pirate_spelling_3'];
    const pool = save.seenEventIds.length < 5 ? candidates.filter((event) => earlyEasyIds.includes(event.id)) : candidates;
    const finalCandidates = pool.length ? pool : candidates;
    if (finalCandidates.length) return finalCandidates[eventSeed(save, routeKind, distance, `${bucket.mood}:pick`) % finalCandidates.length];
  }
  return undefined;
}

export function getTravelEventChanceSummary() {
  return {
    bad: 3,
    good: 2,
    talk: 2,
    story: 1
  };
}

function shouldShowEvent(save: JuniorSave, routeKind?: string, distance = 1, routeType?: string, storyArcIds: string[] = []) {
  if (!save.completedTutorial && save.tutorialStage < 7) return true;
  return Boolean(selectTravelEvent(save, routeKind, distance, routeType, storyArcIds));
}

function getTravelEvent(save: JuniorSave, routeKind?: string, distance = 1, routeType?: string, storyArcIds: string[] = []) {
  if (!save.completedTutorial && save.tutorialStage < 7) {
    return JUNIOR_EVENTS.find((event) => event.id === 'tutorial_spelling_1');
  }
  return selectTravelEvent(save, routeKind, distance, routeType, storyArcIds);
}

export function getRouteScenery(from: JuniorCityId, to: JuniorCityId) {
  return getRoute(from, to)?.scenery ?? 'plain';
}

export function finishTravel(save: JuniorSave): JuniorSave {
  const destinationCityId = save.destinationCityId ?? save.currentCityId;
  const route = getRoute(save.currentCityId, destinationCityId);
  const firstVisit = !save.visitedCityIds.includes(destinationCityId);
  const moved = {
    ...save,
    currentCityId: destinationCityId,
    destinationCityId: undefined,
    activeEffects: { ...save.activeEffects, fastTravelNextRoute: false },
    visitedCityIds: firstVisit ? [...save.visitedCityIds, destinationCityId] : save.visitedCityIds,
    tutorialStage: Math.max(save.tutorialStage, 6)
  };
  if (shouldShowEvent(save, route?.kind, route?.distance, route?.routeType, route?.storyArcIds)) {
    const event = getTravelEvent(moved, route?.kind, route?.distance, route?.routeType, route?.storyArcIds);
    if (event) {
      const storyArcProgress = event.storyArcId
        ? {
          ...moved.storyArcProgress,
          [event.storyArcId]: Math.max(moved.storyArcProgress[event.storyArcId] ?? 0, event.storyStage ?? 1)
        }
        : moved.storyArcProgress;
      return {
        ...moved,
        currentStep: 'event',
        selectedEventId: event.id,
        seenEventIds: [...moved.seenEventIds, event.id],
        storyArcProgress,
        message: undefined
      };
    }
  }
  if (firstVisit) return { ...moved, currentStep: 'visitIntro', message: undefined };
  return { ...moved, currentStep: 'city', message: `${getCity(destinationCityId).name}에 도착했어.` };
}

function addStars(save: JuniorSave, amount = 0): JuniorSave {
  if (amount <= 0) return save;
  const nextBalance = Math.max(0, save.starBalance + amount);
  return {
    ...save,
    stars: nextBalance,
    starBalance: nextBalance,
    totalStarsEarned: Math.max(save.totalStarsEarned + amount, nextBalance)
  };
}

function spendStars(save: JuniorSave, amount: number): JuniorSave {
  const nextBalance = Math.max(0, save.starBalance - amount);
  return { ...save, stars: nextBalance, starBalance: nextBalance };
}

function consumeConsumableItem(save: JuniorSave, itemId: string): JuniorSave {
  const currentCount = save.consumableItems[itemId] ?? 0;
  if (currentCount <= 0) return save;
  const nextItems = { ...save.consumableItems, [itemId]: currentCount - 1 };
  if (nextItems[itemId] <= 0) delete nextItems[itemId];
  return {
    ...save,
    consumableItems: nextItems
  };
}

export function sellCargoItem(save: JuniorSave, cargoId: string): JuniorSave {
  const cargoItem = save.cargo.find((item) => item.id === cargoId);
  if (!cargoItem) return save;
  const good = getGood(cargoItem.goodId);
  const price = getSellPriceForCargo(save, save.currentCityId, cargoItem);
  const nextCargo = save.cargo.filter((item) => item.id !== cargoId);
  const key = pressureKey(save.currentCityId, cargoItem.goodId);
  const city = getCity(save.currentCityId);
  const localProduction = city.buyGoodIds.includes(cargoItem.goodId);
  const goodPlace = !localProduction && (city.sellGoodIds.includes(cargoItem.goodId) || city.id === 'seoul');
  const earnedStars = goodPlace ? 1 : 0;
  const storyBase = cargoItem.fromCityId === 'busan' && save.currentCityId !== 'busan'
    ? addStoryFragment(save, 'first_trade_ready')
    : save;
  const next = applyMilestones(addStars({
    ...storyBase,
    coins: storyBase.coins + price,
    cargo: nextCargo,
    completedTutorial: storyBase.completedTutorial || storyBase.tutorialStage >= 5,
    tutorialStage: Math.max(storyBase.tutorialStage, 9),
    currentStep: storyBase.coins + price >= ENDING_COINS ? 'city' : 'market',
    marketPressure: {
      ...storyBase.marketPressure,
      sell: { ...storyBase.marketPressure.sell, [key]: (storyBase.marketPressure.sell[key] ?? 0) + 1 }
    },
    lastResultChips: [`+${price}냥`, ...(earnedStars ? ['별 +1'] : []), '짐 -1'],
    message: `${good.name}을 팔았어.`
  }, earnedStars));
  return next;
}

function removeCargo(save: JuniorSave, count = 0) {
  if (count <= 0 || save.cargo.length === 0) return save;
  return { ...save, cargo: save.cargo.slice(0, Math.max(0, save.cargo.length - count)) };
}

function willProtectCargo(save: JuniorSave, reward?: JuniorReward) {
  return Boolean(reward?.loseCargo && save.activeEffects.cargoProtectNextEvent && save.cargo.length > 0);
}

function applyReward(save: JuniorSave, reward?: JuniorReward): JuniorSave {
  if (!reward) return save;
  const protectedCargo = willProtectCargo(save, reward);
  const protectionAdjusted = protectedCargo
    ? {
      ...save,
      activeEffects: { ...save.activeEffects, cargoProtectNextEvent: false }
    }
    : save;
  const afterCargo = removeCargo(protectionAdjusted, protectedCargo ? 0 : reward.loseCargo ?? 0);
  const badges = reward.badge && !afterCargo.badges.includes(reward.badge) ? [...afterCargo.badges, reward.badge] : afterCargo.badges;
  const unlockedCities = reward.unlockCityId && !afterCargo.unlockedCities.includes(reward.unlockCityId)
    ? [...afterCargo.unlockedCities, reward.unlockCityId]
    : afterCargo.unlockedCities;
  const storyClueGain = reward.storyClues ?? 0;
  const ledgerGain = storyClueGain + (reward.ledgerClues ?? 0) + (reward.ledgerClue ?? 0);
  const ledgerClues = Math.min(STORY_ENDING_LEDGER_CLUES, Math.max(afterCargo.ledgerClues, afterCargo.ledgerClues + ledgerGain));
  const rumorMarkers = {
    ...afterCargo.rumorMarkers,
    ...(storyClueGain > 0 || reward.ledgerClue ? { mountain: 'completed' as const } : {}),
    ...Object.fromEntries((reward.rumorUnlock ?? []).map((id) => [id, 'available' as const]))
  };
  const unlockedStarItemIds = reward.cosmeticItemUnlock && !afterCargo.unlockedStarItemIds.includes(reward.cosmeticItemUnlock)
    ? [...afterCargo.unlockedStarItemIds, reward.cosmeticItemUnlock]
    : afterCargo.unlockedStarItemIds;
  const visitedCityIds = reward.cityStamp && !afterCargo.visitedCityIds.includes(reward.cityStamp)
    ? [...afterCargo.visitedCityIds, reward.cityStamp]
    : afterCargo.visitedCityIds;
  let next = addStoryFragment({
    ...afterCargo,
    coins: Math.max(0, afterCargo.coins + (reward.coins ?? 0)),
    storyClues: afterCargo.storyClues + storyClueGain,
    ledgerClues,
    rumorMarkers,
    badges,
    unlockedCities,
    visitedCityIds,
    unlockedStarItemIds
  }, reward.storyFragment);
  const notebookTopic = reward.seyeonNotebookProgress ?? reward.notebookTopic;
  if (notebookTopic) {
    next = {
      ...next,
      seyeonNotebook: {
        ...next.seyeonNotebook,
        [notebookTopic]: next.seyeonNotebook[notebookTopic] === 'completed' ? 'completed' : 'started'
      }
    };
  }
  return addStars(next, reward.stars ?? 0);
}

function rewardChips(reward?: JuniorReward, protectedCargo = false): string[] {
  if (!reward) return [];
  const chips: string[] = [];
  if (reward.coins) chips.push(reward.coins > 0 ? `돈 +${reward.coins}` : `돈 ${reward.coins}`);
  if (reward.stars) chips.push(`별 +${reward.stars}`);
  if (reward.storyClues || reward.ledgerClue || reward.ledgerClues) chips.push(`장부 단서 +${reward.storyClues ?? reward.ledgerClue ?? reward.ledgerClues}`);
  if (reward.seyeonNotebookProgress || reward.notebookTopic) chips.push(`세연이 노트: ${reward.seyeonNotebookProgress ?? reward.notebookTopic}`);
  if (reward.cosmeticItemUnlock) chips.push('새 꾸미기 열림');
  if (reward.cityStamp) chips.push('도시 도장');
  if (reward.loseCargo) chips.push(protectedCargo ? '짐 보호' : '짐 -1');
  if (reward.badge) chips.push('배지');
  if (reward.unlockCityId) chips.push('새 도시');
  return chips;
}

export function getSelectedEvent(save: JuniorSave): JuniorEvent | undefined {
  return JUNIOR_EVENTS.find((event) => event.id === save.selectedEventId);
}

export function resolveSimpleEvent(save: JuniorSave): JuniorSave {
  const event = getSelectedEvent(save);
  const protectedCargo = willProtectCargo(save, event?.reward);
  const rewarded = applyReward(save, event?.reward);
  return applyMilestones({ ...rewarded, currentStep: 'eventResult', eventResultText: protectedCargo ? '遺?곸씠 吏먯쓣 吏耳쒖ㄼ??' : event?.reward ? '醫뗭? ?쇱씠 ?앷꼈??' : '臾댁궗??吏?섍컮??', lastResultChips: rewardChips(event?.reward, protectedCargo) });
}

export function resolveChoice(save: JuniorSave, choiceIndex: number): JuniorSave {
  const event = getSelectedEvent(save);
  const choice = event?.choices?.[choiceIndex];
  const protectedCargo = willProtectCargo(save, choice?.reward);
  const rewarded = applyReward(save, choice?.reward);
  return applyMilestones({ ...rewarded, currentStep: 'eventResult', eventResultText: protectedCargo ? '遺?곸씠 吏먯쓣 吏耳쒖ㄼ??' : choice?.resultText ?? '?섑뻽??', lastResultChips: rewardChips(choice?.reward, protectedCargo) });
}

export function answerQuiz(save: JuniorSave, option: string): JuniorSave {
  const event = getSelectedEvent(save);
  const quiz = event?.quiz;
  if (!quiz) return resolveSimpleEvent(save);
  const correct = option === quiz.answer;
  const nextWrongStreak = correct ? 0 : save.quizWrongStreak + 1;
  if (!correct && save.activeEffects.quizRetryAvailable) {
    return {
      ...save,
      activeEffects: { ...save.activeEffects, quizRetryAvailable: false },
      quizWrongStreak: nextWrongStreak,
      lastResultChips: ['?ㅼ떆?湲곌텒 ?ъ슜'],
      message: '??踰????대낵 ???덉뼱.'
    };
  }
  const reward = correct ? quiz.reward : quiz.wrongReward;
  const protectedCargo = willProtectCargo(save, reward);
  const rewarded = applyReward(save, reward);
  const hintText = nextWrongStreak >= 2 ? `${quiz.wrongText} 諛붾엺?닿? ?뚰듃瑜?以꾧쾶.` : quiz.wrongText;
  return applyMilestones({ ...rewarded, quizWrongStreak: nextWrongStreak, currentStep: 'eventResult', eventResultText: protectedCargo ? '遺?곸씠 吏먯쓣 吏耳쒖ㄼ??' : correct ? quiz.correctText : hintText, lastResultChips: rewardChips(reward, protectedCargo) });
}

export function closeEventResult(save: JuniorSave): JuniorSave {
  const firstVisit = !save.completedTutorial && save.tutorialStage < 8;
  return {
    ...save,
    currentStep: firstVisit ? 'visitIntro' : 'city',
    selectedEventId: undefined,
    eventResultText: undefined,
    tutorialStage: Math.max(save.tutorialStage, 7),
    lastResultChips: undefined,
    message: '?꾩갑?덉뼱. ?ν꽣瑜??댄렣蹂댁옄.'
  };
}

export function completeVisitIntro(save: JuniorSave): JuniorSave {
  const next: JuniorSave = {
    ...save,
    currentStep: 'city',
    tutorialStage: Math.max(save.tutorialStage, 8),
    message: `${getCity(save.currentCityId).name}???섎윭蹂댁옄.`
  };
  if (!save.completedTutorial) return maybeQueueMainStoryEvent(next);
  const withStoryRumor = maybeOpenStoryRumor(next, 'city');
  return maybeQueueMainStoryEvent(withStoryRumor.pendingStoryRumorEventId ? withStoryRumor : maybeOpenRegionalEvent(withStoryRumor, 'city', 0, true));
}

export function buyVehicle(save: JuniorSave, vehicleId: JuniorVehicle['id']): JuniorSave {
  const vehicle = JUNIOR_VEHICLES.find((item) => item.id === vehicleId);
  if (!vehicle || vehicle.id === save.vehicleId) return save;
  if (save.coins < vehicle.cost) return { ...save, message: '?덉쓣 議곌툑 ??紐⑥쑝??' };
  return applyMilestones({
    ...save,
    coins: save.coins - vehicle.cost,
    vehicleId: vehicle.id,
    cargoLimit: vehicle.cargoLimit,
    badges: save.badges.includes(vehicle.name) ? save.badges : [...save.badges, vehicle.name],
    lastResultChips: [`-${vehicle.cost}냥`, `짐 ${vehicle.cargoLimit}칸`],
    message: `${vehicle.name}를 장만했어!`
  });
}

export function buyBoat(save: JuniorSave, boatId: JuniorBoat['id']): JuniorSave {
  const boat = JUNIOR_BOATS.find((item) => item.id === boatId);
  if (!boat || boat.id === 'none' || boat.id === save.boatId) return save;
  if (save.coins < boat.cost) return { ...save, message: '?덉쓣 議곌툑 ??紐⑥쑝??' };
  return applyMilestones({
    ...save,
    coins: save.coins - boat.cost,
    boatId: boat.id,
    badges: save.badges.includes(boat.name) ? save.badges : [...save.badges, boat.name],
    lastResultChips: [`-${boat.cost}냥`, `바닷길 짐 ${boat.cargoLimit}칸`],
    message: `${boat.name}를 장만했어!`
  });
}

export function buyStarItem(save: JuniorSave, itemId: JuniorStarItem['id']): JuniorSave {
  const item = JUNIOR_STAR_ITEMS.find((candidate) => candidate.id === itemId);
  if (!item) return save;
  if (item.unlockCondition?.startsWith('story:') && !save.unlockedStarItemIds.includes(item.id) && !save.ownedStarItemIds.includes(item.id)) {
    return { ...save, message: '이야기를 끝내면 별 상점에 열려.' };
  }
  if (save.starBalance < item.starCost) return { ...save, message: '蹂꾩쓣 議곌툑 ??紐⑥쑝??' };

  if (item.isConsumable) {
    const currentCount = save.consumableItems[item.id] ?? 0;
    const maxOwned = item.maxOwned ?? 99;
    if (currentCount >= maxOwned) return { ...save, message: '?대? 異⑸텇??媛뽮퀬 ?덉뼱.' };
    const afterSpend = spendStars(save, item.starCost);
    return {
      ...afterSpend,
      consumableItems: { ...afterSpend.consumableItems, [item.id]: currentCount + 1 },
      lastResultChips: [`蹂?-${item.starCost}`, `${item.name} +1`],
      message: `${item.name}??諛쏆븯??`
    };
  }

  if (save.ownedStarItemIds.includes(item.id)) return equipStarItem(save, item.id);
  const afterSpend = spendStars(save, item.starCost);
  return {
    ...afterSpend,
    ownedStarItemIds: [...afterSpend.ownedStarItemIds, item.id],
    lastResultChips: [`蹂?-${item.starCost}`, '袁몃?湲?+1'],
    message: `${item.name}???살뿀??`
  };
}

export function equipStarItem(save: JuniorSave, itemId: JuniorStarItem['id']): JuniorSave {
  const item = JUNIOR_STAR_ITEMS.find((candidate) => candidate.id === itemId);
  if (!item || item.isConsumable || item.slot === 'none') return save;
  if (!save.ownedStarItemIds.includes(item.id)) return { ...save, message: '癒쇱? 蹂꾨줈 ?살뼱????' };
  return {
    ...save,
    equippedStarItems: { ...save.equippedStarItems, [item.slot]: item.id },
    lastResultChips: ['袁몃?湲?諛붽퓞'],
    message: item.equipText
  };
}

export function unequipStarItem(save: JuniorSave, slot: JuniorStarItem['slot']): JuniorSave {
  if (slot === 'none' || !save.equippedStarItems[slot]) return save;
  const nextEquipped = { ...save.equippedStarItems };
  delete nextEquipped[slot];
  return {
    ...save,
    equippedStarItems: nextEquipped,
    lastResultChips: ['袁몃?湲?類먯뼱'],
    message: '?μ떇???좎떆 鍮쇰몢?덉뼱.'
  };
}

export function useStarConsumable(save: JuniorSave, itemId: JuniorStarItem['id']): JuniorSave {
  const item = JUNIOR_STAR_ITEMS.find((candidate) => candidate.id === itemId && candidate.isConsumable);
  const currentCount = save.consumableItems[itemId] ?? 0;
  if (!item || currentCount <= 0) return save;
  if (itemId === 'ticket_fast_travel') {
    if (save.currentStep !== 'map') return { ...save, message: '吏?꾩뿉???????덉뼱.' };
    const consumed = consumeConsumableItem(save, itemId);
    return {
      ...consumed,
      activeEffects: { ...consumed.activeEffects, fastTravelNextRoute: true },
      lastResultChips: ['?좎냽 ?대룞沅?-1'],
      message: '諛붾엺湲몄쓣 以鍮꾪뻽?? 異쒕컻?대낫??'
    };
  }
  if (itemId === 'ticket_half_price_good') {
    return { ...save, message: save.currentStep === 'market' ? '??臾쇨굔???꾨Ⅴ硫?諛섍컪沅뚯쓣 ?????덉뼱.' : '?ν꽣?먯꽌 ?????덉뼱.' };
  }
  if (itemId === 'charm_cargo_guard') {
    if (save.activeEffects.cargoProtectNextEvent) return { ...save, message: '?대? 遺?곸씠 以鍮꾨릱??' };
    const consumed = consumeConsumableItem(save, itemId);
    return {
      ...consumed,
      activeEffects: { ...consumed.activeEffects, cargoProtectNextEvent: true },
      lastResultChips: ['吏?蹂댄샇 遺??-1'],
      message: '?ㅼ쓬 ?꾪뿕?먯꽌 吏먯쓣 吏耳쒖쨪 嫄곗빞.'
    };
  }
  if (itemId === 'ticket_quiz_retry') {
    const event = getSelectedEvent(save);
    if (save.currentStep !== 'event' || !event?.quiz) return { ...save, message: '?댁쫰?먯꽌 ?????덉뼱.' };
    if (save.activeEffects.quizRetryAvailable) return { ...save, message: '?대? ?ㅼ떆?湲곌텒??以鍮꾨릱??' };
    const consumed = consumeConsumableItem(save, itemId);
    return {
      ...consumed,
      activeEffects: { ...consumed.activeEffects, quizRetryAvailable: true },
      lastResultChips: ['?ㅼ떆?湲곌텒 -1'],
      message: '??ㅻ룄 ??踰????대낵 ???덉뼱.'
    };
  }
  if (itemId === 'ticket_market_tip') {
    if (save.currentStep !== 'market') return { ...save, message: '?ν꽣?먯꽌 ?????덉뼱.' };
    if (save.activeEffects.marketRecommendCityId === save.currentCityId) return { ...save, message: '?대? 異붿쿇??蹂댁씠怨??덉뼱.' };
    const consumed = consumeConsumableItem(save, itemId);
    return {
      ...consumed,
      activeEffects: { ...consumed.activeEffects, marketRecommendCityId: save.currentCityId },
      lastResultChips: ['?ν꽣 異붿쿇沅?-1'],
      message: '?붿젙??醫뗭? 臾쇨굔???뚮젮以ъ뼱.'
    };
  }
  if (itemId === 'ticket_extra_rumor') {
    if (save.currentStep !== 'city' && save.currentStep !== 'market') return { ...save, message: '?꾩떆???ν꽣?먯꽌 ?????덉뼱.' };
    const event = selectRegionalEvent(save, save.currentCityId);
    if (!event) return { ...save, message: '吏湲덉? ???뚮Ц???놁뼱.' };
    const consumed = consumeConsumableItem(save, itemId);
    return {
      ...consumed,
      currentStep: 'regionalEvent',
      selectedRegionalEventId: event.id,
      regionalReturnStep: save.currentStep,
      seenRegionalEventIds: consumed.seenRegionalEventIds.includes(event.id) ? consumed.seenRegionalEventIds : [...consumed.seenRegionalEventIds, event.id],
      lastRegionalEventCityId: save.currentCityId,
      lastRegionalEventId: event.id,
      lastResultChips: ['?뚮Ц ?ｊ린沅?-1'],
      message: '?곸씤???뚮Ц???ㅻ젮以ъ뼱.'
    };
  }
  return save;
}

export function applyMilestones(save: JuniorSave): JuniorSave {
  let next = save;
  if (next.coins >= 100 && !next.badges.includes('꼬마 상인')) next = { ...next, badges: [...next.badges, '꼬마 상인'] };
  if (next.visitedCityIds.length >= 3 && !next.badges.includes('도시 도장 3개')) next = { ...next, badges: [...next.badges, '도시 도장 3개'] };
  if (next.visitedCityIds.length >= 7 && !next.badges.includes('도시 도장 7개')) next = { ...next, badges: [...next.badges, '도시 도장 7개'] };
  if (next.visitedCityIds.length >= 14 && !next.badges.includes('도시 도장 14개')) next = { ...next, badges: [...next.badges, '도시 도장 14개'] };
  if (next.visitedCityIds.length >= JUNIOR_CITIES.length && !next.badges.includes('팔도 도장')) next = { ...next, badges: [...next.badges, '팔도 도장'] };
  if (next.visitedCityIds.includes('jeju') && !next.badges.includes('제주까지 다녀왔어')) next = { ...next, badges: [...next.badges, '제주까지 다녀왔어'] };
  if (next.totalStarsEarned >= 5 && !next.badges.includes('칭찬 별 배지')) next = { ...next, badges: [...next.badges, '칭찬 별 배지'] };
  if (next.totalStarsEarned >= 10 && !next.badges.includes('퀴즈 장인')) next = { ...next, badges: [...next.badges, '퀴즈 장인'] };
  if (next.coins >= 220 && next.storyClues < 3) next = { ...next, storyClues: Math.max(next.storyClues, 3) };
  if (next.storyClues >= 1 && next.ledgerClues < 1) next = { ...next, ledgerClues: 1 };
  return maybeQueueMainStoryEvent(next);
}

export function openEnding(save: JuniorSave): JuniorSave {
  if (canOpenStoryEnding(save)) return { ...save, currentStep: 'endingChoice', message: undefined };
  if (canStartReturnDoorStory(save)) return { ...save, activeStoryEventId: 'M12', message: undefined };
  return {
    ...save,
    currentStep: 'city',
    message: `돈 ${ENDING_COINS}냥, 세연이 노트 5개, 장부 단서 3개, 공부방이 필요해.`
  };
}

export function finishEnding(save: JuniorSave): JuniorSave {
  return {
    ...save,
    currentStep: 'ending',
    completedEnding: true,
    completedRuns: save.completedRuns + 1,
    badges: save.badges.includes('瑗щ쭏 嫄곗긽 ?뺤슦') ? save.badges : [...save.badges, '瑗щ쭏 嫄곗긽 ?뺤슦']
  };
}

export function continueAfterEnding(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'city', completedEnding: true };
}

export function getBuyGoodsForCity(cityId: JuniorCityId) {
  return getCity(cityId).buyGoodIds.map(getGood);
}

function marketSizeForCity(cityId: JuniorCityId) {
  const city = getCity(cityId);
  if (city.id === 'seoul' || city.id === 'china_port' || city.id === 'north_port') return 7;
  if (['busan', 'incheon', 'pyongyang', 'nampo', 'wonsan', 'daegu'].includes(city.id)) return 6;
  if (city.kind?.includes('port') || ['jeonju', 'andong', 'gaeseong'].includes(city.id)) return 5;
  if (city.kind === 'island' || ['chuncheon', 'suncheon', 'jinju'].includes(city.id)) return 4;
  return 3;
}

export function getMarketGoodsForCity(cityId: JuniorCityId) {
  const city = getCity(cityId);
  const desiredCount = marketSizeForCity(cityId);
  const seen = new Set<JuniorGoodId>();
  const ordered: JuniorGoodId[] = [];
  const push = (goodId: JuniorGoodId) => {
    if (!seen.has(goodId)) {
      seen.add(goodId);
      ordered.push(goodId);
    }
  };
  city.buyGoodIds.forEach(push);
  city.sellGoodIds.forEach(push);
  JUNIOR_GOODS.map((good) => good.id).forEach(push);
  return ordered.slice(0, Math.max(2, Math.min(7, desiredCount))).map(getGood);
}

