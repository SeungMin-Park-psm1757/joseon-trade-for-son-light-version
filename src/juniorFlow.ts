import type { JuniorBoat, JuniorCargoItem, JuniorCityId, JuniorEvent, JuniorGoodId, JuniorMarketPressure, JuniorReward, JuniorSave, JuniorStep, JuniorVehicle } from './juniorTypes';
import { DEFAULT_JUNIOR_SAVE, ENDING_COINS, JUNIOR_BOATS, JUNIOR_CITIES, JUNIOR_EVENTS, JUNIOR_GOODS, JUNIOR_ROUTES, JUNIOR_SAVE_KEY, JUNIOR_VEHICLES, getGood } from './juniorData';

function isStep(value: unknown): value is JuniorStep {
  return typeof value === 'string' && ['intro', 'pick', 'buy', 'city', 'map', 'travel', 'visitIntro', 'market', 'event', 'eventResult', 'shop', 'endingChoice', 'ending'].includes(value);
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

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
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
  if (!raw || typeof raw !== 'object') return DEFAULT_JUNIOR_SAVE;
  const value = raw as Partial<JuniorSave>;
  const vehicleId = JUNIOR_VEHICLES.some((vehicle) => vehicle.id === value.vehicleId) ? value.vehicleId as JuniorVehicle['id'] : DEFAULT_JUNIOR_SAVE.vehicleId;
  const boatId = JUNIOR_BOATS.some((boat) => boat.id === value.boatId) ? value.boatId as JuniorBoat['id'] : DEFAULT_JUNIOR_SAVE.boatId;
  const vehicle = JUNIOR_VEHICLES.find((item) => item.id === vehicleId) ?? JUNIOR_VEHICLES[0];
  return {
    currentStep: isStep(value.currentStep) ? value.currentStep : 'intro',
    currentCityId: isCity(value.currentCityId) ? value.currentCityId : 'busan',
    destinationCityId: isCity(value.destinationCityId) ? value.destinationCityId : undefined,
    selectedGoodId: isGood(value.selectedGoodId) ? value.selectedGoodId : undefined,
    selectedEventId: typeof value.selectedEventId === 'string' ? value.selectedEventId : undefined,
    eventResultText: typeof value.eventResultText === 'string' ? value.eventResultText : undefined,
    coins: numberOr(value.coins, DEFAULT_JUNIOR_SAVE.coins),
    stars: numberOr(value.stars, 0),
    cargo: normalizeCargo(value.cargo),
    cargoLimit: numberOr(value.cargoLimit, vehicle.cargoLimit),
    vehicleId,
    boatId,
    unlockedCities: cityArray(value.unlockedCities),
    visitedCityIds: cityArray(value.visitedCityIds, ['busan']),
    completedTutorial: Boolean(value.completedTutorial),
    tutorialStage: numberOr(value.tutorialStage, 0),
    seenEventIds: stringArray(value.seenEventIds),
    storyClues: numberOr(value.storyClues, 0),
    badges: stringArray(value.badges),
    completedEnding: Boolean(value.completedEnding),
    completedRuns: numberOr(value.completedRuns, 0),
    marketPressure: normalizePressure(value.marketPressure),
    message: typeof value.message === 'string' ? value.message : undefined
  };
}

export function loadJuniorSave(): JuniorSave {
  try {
    const raw = localStorage.getItem(JUNIOR_SAVE_KEY);
    return raw ? normalizeJuniorSave(JSON.parse(raw)) : DEFAULT_JUNIOR_SAVE;
  } catch {
    return DEFAULT_JUNIOR_SAVE;
  }
}

export function saveJuniorGame(save: JuniorSave) {
  localStorage.setItem(JUNIOR_SAVE_KEY, JSON.stringify(save));
}

export function resetJuniorGame(): JuniorSave {
  return {
    ...DEFAULT_JUNIOR_SAVE,
    cargo: [],
    unlockedCities: [...DEFAULT_JUNIOR_SAVE.unlockedCities],
    visitedCityIds: [...DEFAULT_JUNIOR_SAVE.visitedCityIds],
    badges: [],
    seenEventIds: [],
    marketPressure: { buy: {}, sell: {} }
  };
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

export function getSellPrice(save: JuniorSave, cityId: JuniorCityId, goodId: JuniorGoodId) {
  const city = getCity(cityId);
  const good = getGood(goodId);
  const wanted = city.sellGoodIds.includes(goodId) || city.id === 'seoul';
  const local = city.buyGoodIds.includes(goodId);
  const bonus = wanted ? 9 : local ? -2 : 2;
  const count = save.marketPressure.sell[pressureKey(cityId, goodId)] ?? 0;
  return Math.max(4, good.baseSellCoins + bonus + variation(cityId, goodId) - count * 2);
}

export function getSellPriceForCargo(save: JuniorSave, cityId: JuniorCityId, cargoItem: JuniorCargoItem) {
  const marketPrice = getSellPrice(save, cityId, cargoItem.goodId);
  if (cargoItem.fromCityId === cityId) return Math.min(marketPrice, cargoItem.buyPrice);
  return marketPrice;
}

export function getBestSellCityForGood(goodId: JuniorGoodId, fromCityId?: JuniorCityId) {
  return JUNIOR_CITIES.find((city) => city.id !== fromCityId && (city.sellGoodIds.includes(goodId) || city.id === 'seoul'));
}

export function startIntro(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'city', tutorialStage: Math.max(save.tutorialStage, 1), message: '먼저 부산 장터에 가보자.' };
}

export function chooseGood(save: JuniorSave, goodId: JuniorGoodId): JuniorSave {
  return { ...save, selectedGoodId: goodId, currentStep: 'buy', message: undefined };
}

export function buySelectedGood(save: JuniorSave): JuniorSave {
  if (!save.selectedGoodId) return { ...save, currentStep: 'market' };
  return buyGood(save, save.selectedGoodId);
}

export function buyGood(save: JuniorSave, goodId: JuniorGoodId): JuniorSave {
  const price = getBuyPrice(save, save.currentCityId, goodId);
  const good = getGood(goodId);
  if (save.cargo.length >= save.cargoLimit) return { ...save, currentStep: 'market', message: '짐칸이 꽉 찼어. 이제 팔러 가자.' };
  if (save.coins < price) return { ...save, currentStep: 'market', message: '돈이 조금 모자라.' };
  const cargoItem: JuniorCargoItem = {
    id: `${good.id}-${Date.now()}-${save.cargo.length}`,
    goodId: good.id,
    fromCityId: save.currentCityId,
    buyPrice: price
  };
  const key = pressureKey(save.currentCityId, goodId);
  const bestCity = getBestSellCityForGood(goodId, save.currentCityId);
  return {
    ...save,
    coins: save.coins - price,
    cargo: [...save.cargo, cargoItem],
    currentStep: 'market',
    tutorialStage: Math.max(save.tutorialStage, 3),
    marketPressure: {
      ...save.marketPressure,
      buy: { ...save.marketPressure.buy, [key]: (save.marketPressure.buy[key] ?? 0) + 1 }
    },
    message: bestCity ? `${good.name}을 샀어. ${bestCity.name}에 가면 잘 팔려.` : `${good.name}을 짐에 실었어.`
  };
}

export function goToMap(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'map', selectedGoodId: undefined, message: '갈 곳을 골라봐.' };
}

export function goToCity(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'city', selectedGoodId: undefined, message: undefined };
}

export function goToMarket(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'market', selectedGoodId: undefined, message: '사거나 팔 물건을 골라봐.' };
}

export function goToShop(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'shop', message: '탈것을 장만할 수 있어.' };
}

export function startTravel(save: JuniorSave, destinationCityId: JuniorCityId): JuniorSave {
  if (!canTravel(save, destinationCityId)) return { ...save, message: '아직 갈 수 없는 길이야.' };
  return {
    ...save,
    destinationCityId,
    currentStep: 'travel',
    tutorialStage: Math.max(save.tutorialStage, 5),
    message: `${getCity(destinationCityId).name}으로 출발!`
  };
}

function eventSeed(save: JuniorSave, routeKind?: string, distance = 1, salt = '') {
  const text = `${salt}:${save.currentCityId}:${save.destinationCityId ?? ''}:${routeKind ?? 'land'}:${distance}:${save.coins}:${save.stars}:${save.seenEventIds.length}:${save.cargo.length}`;
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function eventFitsRoute(event: JuniorEvent, routeKind?: string) {
  return !event.routeKind || event.routeKind === 'any' || event.routeKind === routeKind;
}

function selectTravelEvent(save: JuniorSave, routeKind?: string, distance = 1) {
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
    const candidates = JUNIOR_EVENTS.filter((event) => (
      event.mood === bucket.mood
      && event.chancePercent <= bucket.chance
      && types.includes(event.type)
      && eventFitsRoute(event, routeKind)
      && !save.seenEventIds.includes(event.id)
    ));
    if (candidates.length) return candidates[eventSeed(save, routeKind, distance, `${bucket.mood}:pick`) % candidates.length];
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

function shouldShowEvent(save: JuniorSave, routeKind?: string, distance = 1) {
  if (!save.completedTutorial && save.tutorialStage < 7) return true;
  return Boolean(selectTravelEvent(save, routeKind, distance));
}

function getTravelEvent(save: JuniorSave, routeKind?: string, distance = 1) {
  if (!save.completedTutorial && save.tutorialStage < 7) {
    return JUNIOR_EVENTS.find((event) => event.id === 'bandit_spelling_1');
  }
  return selectTravelEvent(save, routeKind, distance);
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
    visitedCityIds: firstVisit ? [...save.visitedCityIds, destinationCityId] : save.visitedCityIds,
    tutorialStage: Math.max(save.tutorialStage, 6)
  };
  if (shouldShowEvent(save, route?.kind, route?.distance)) {
    const event = getTravelEvent(moved, route?.kind, route?.distance);
    if (event) {
      return {
        ...moved,
        currentStep: 'event',
        selectedEventId: event.id,
        seenEventIds: [...moved.seenEventIds, event.id],
        message: undefined
      };
    }
  }
  if (firstVisit) return { ...moved, currentStep: 'visitIntro', message: undefined };
  return { ...moved, currentStep: 'city', message: `${getCity(destinationCityId).name}에 도착했어.` };
}

export function sellCargoItem(save: JuniorSave, cargoId: string): JuniorSave {
  const cargoItem = save.cargo.find((item) => item.id === cargoId);
  if (!cargoItem) return save;
  const good = getGood(cargoItem.goodId);
  const price = getSellPriceForCargo(save, save.currentCityId, cargoItem);
  const nextCargo = save.cargo.filter((item) => item.id !== cargoId);
  const key = pressureKey(save.currentCityId, cargoItem.goodId);
  const city = getCity(save.currentCityId);
  const goodPlace = city.sellGoodIds.includes(cargoItem.goodId) || city.id === 'seoul';
  const next = applyMilestones({
    ...save,
    coins: save.coins + price,
    stars: save.stars + (goodPlace ? 1 : 0),
    cargo: nextCargo,
    completedTutorial: save.completedTutorial || save.tutorialStage >= 5,
    tutorialStage: Math.max(save.tutorialStage, 9),
    currentStep: save.coins + price >= ENDING_COINS ? 'endingChoice' : 'market',
    marketPressure: {
      ...save.marketPressure,
      sell: { ...save.marketPressure.sell, [key]: (save.marketPressure.sell[key] ?? 0) + 1 }
    },
    message: `${good.name}을 팔았어. 돈이 늘고 짐칸이 비었어.`
  });
  return next;
}

function removeCargo(save: JuniorSave, count = 0) {
  if (count <= 0 || save.cargo.length === 0) return save;
  return { ...save, cargo: save.cargo.slice(0, Math.max(0, save.cargo.length - count)) };
}

function applyReward(save: JuniorSave, reward?: JuniorReward): JuniorSave {
  if (!reward) return save;
  const afterCargo = removeCargo(save, reward.loseCargo ?? 0);
  const badges = reward.badge && !afterCargo.badges.includes(reward.badge) ? [...afterCargo.badges, reward.badge] : afterCargo.badges;
  const unlockedCities = reward.unlockCityId && !afterCargo.unlockedCities.includes(reward.unlockCityId)
    ? [...afterCargo.unlockedCities, reward.unlockCityId]
    : afterCargo.unlockedCities;
  return {
    ...afterCargo,
    coins: Math.max(0, afterCargo.coins + (reward.coins ?? 0)),
    stars: Math.max(0, afterCargo.stars + (reward.stars ?? 0)),
    storyClues: afterCargo.storyClues + (reward.storyClues ?? 0),
    badges,
    unlockedCities
  };
}

export function getSelectedEvent(save: JuniorSave): JuniorEvent | undefined {
  return JUNIOR_EVENTS.find((event) => event.id === save.selectedEventId);
}

export function resolveSimpleEvent(save: JuniorSave): JuniorSave {
  const event = getSelectedEvent(save);
  const rewarded = applyReward(save, event?.reward);
  return applyMilestones({ ...rewarded, currentStep: 'eventResult', eventResultText: event?.reward ? '좋은 일이 생겼어!' : '무사히 지나갔어.' });
}

export function resolveChoice(save: JuniorSave, choiceIndex: number): JuniorSave {
  const event = getSelectedEvent(save);
  const choice = event?.choices?.[choiceIndex];
  const rewarded = applyReward(save, choice?.reward);
  return applyMilestones({ ...rewarded, currentStep: 'eventResult', eventResultText: choice?.resultText ?? '잘했어!' });
}

export function answerQuiz(save: JuniorSave, option: string): JuniorSave {
  const event = getSelectedEvent(save);
  const quiz = event?.quiz;
  if (!quiz) return resolveSimpleEvent(save);
  const correct = option === quiz.answer;
  const rewarded = applyReward(save, correct ? quiz.reward : quiz.wrongReward);
  return applyMilestones({ ...rewarded, currentStep: 'eventResult', eventResultText: correct ? quiz.correctText : quiz.wrongText });
}

export function closeEventResult(save: JuniorSave): JuniorSave {
  const firstVisit = !save.completedTutorial && save.tutorialStage < 8;
  return {
    ...save,
    currentStep: firstVisit ? 'visitIntro' : 'city',
    selectedEventId: undefined,
    eventResultText: undefined,
    tutorialStage: Math.max(save.tutorialStage, 7),
    message: '도착했어. 장터를 살펴보자.'
  };
}

export function completeVisitIntro(save: JuniorSave): JuniorSave {
  return {
    ...save,
    currentStep: 'city',
    tutorialStage: Math.max(save.tutorialStage, 8),
    message: `${getCity(save.currentCityId).name}을 둘러보자.`
  };
}

export function buyVehicle(save: JuniorSave, vehicleId: JuniorVehicle['id']): JuniorSave {
  const vehicle = JUNIOR_VEHICLES.find((item) => item.id === vehicleId);
  if (!vehicle || vehicle.id === save.vehicleId) return save;
  if (save.coins < vehicle.cost) return { ...save, message: '돈을 조금 더 모으자.' };
  return applyMilestones({
    ...save,
    coins: save.coins - vehicle.cost,
    vehicleId: vehicle.id,
    cargoLimit: vehicle.cargoLimit,
    badges: save.badges.includes(vehicle.name) ? save.badges : [...save.badges, vehicle.name],
    message: `${vehicle.name}를 장만했어!`
  });
}

export function buyBoat(save: JuniorSave, boatId: JuniorBoat['id']): JuniorSave {
  const boat = JUNIOR_BOATS.find((item) => item.id === boatId);
  if (!boat || boat.id === 'none' || boat.id === save.boatId) return save;
  if (save.coins < boat.cost) return { ...save, message: '돈을 조금 더 모으자.' };
  return applyMilestones({
    ...save,
    coins: save.coins - boat.cost,
    boatId: boat.id,
    badges: save.badges.includes(boat.name) ? save.badges : [...save.badges, boat.name],
    message: `${boat.name}를 장만했어!`
  });
}

export function applyMilestones(save: JuniorSave): JuniorSave {
  let next = save;
  if (next.coins >= 100 && !next.badges.includes('꼬마 장사꾼')) next = { ...next, badges: [...next.badges, '꼬마 장사꾼'] };
  if (next.coins >= 220 && next.storyClues < 3) next = { ...next, storyClues: Math.max(next.storyClues, 3) };
  return next;
}

export function openEnding(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'endingChoice', message: undefined };
}

export function finishEnding(save: JuniorSave): JuniorSave {
  return {
    ...save,
    currentStep: 'ending',
    completedEnding: true,
    completedRuns: save.completedRuns + 1,
    badges: save.badges.includes('꼬마 거상 정우') ? save.badges : [...save.badges, '꼬마 거상 정우']
  };
}

export function continueAfterEnding(save: JuniorSave): JuniorSave {
  return { ...save, currentStep: 'city', completedEnding: true };
}

export function getBuyGoodsForCity(cityId: JuniorCityId) {
  return getCity(cityId).buyGoodIds.map(getGood);
}
