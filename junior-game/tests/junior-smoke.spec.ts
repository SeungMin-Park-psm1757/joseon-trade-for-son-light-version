import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { JUNIOR_STAR_ITEMS } from '../src/juniorData';
import { answerQuiz, buyGood, buyStarItem, normalizeJuniorSave, prepareHalfPriceTicket, startFastTravel, useStarConsumable } from '../src/juniorFlow';

const saveKey = 'joseon_trade_junior_save_v1';
const allCities = [
  'seoul', 'incheon', 'gaeseong', 'pyongyang', 'nampo', 'sinuiju', 'chuncheon', 'gangneung', 'wonsan',
  'hamheung', 'cheongjin', 'andong', 'daegu', 'jeonju', 'gwangju', 'mokpo',
  'yeosu', 'suncheon', 'jinju', 'tongyeong', 'busan', 'ulsan', 'jeju',
  'tsushima', 'china_port', 'north_port'
];

function baseSave(overrides = {}) {
  return {
    saveVersion: 2,
    currentStep: 'city',
    currentCityId: 'busan',
    coins: 30,
    stars: 0,
    totalStarsEarned: 0,
    starBalance: 0,
    ownedStarItemIds: [],
    equippedStarItems: {},
    consumableItems: {},
    activeEffects: {
      fastTravelNextRoute: false,
      cargoProtectNextEvent: false,
      quizRetryAvailable: false
    },
    cargo: [],
    cargoLimit: 2,
    vehicleId: 'bundle',
    boatId: 'none',
    unlockedCities: allCities,
    visitedCityIds: ['busan'],
    completedTutorial: true,
    tutorialStage: 9,
    seenEventIds: [],
    seenRegionalEventIds: [],
    storyArcProgress: {},
    quizWrongStreak: 0,
    storyClues: 0,
    badges: [],
    completedEnding: false,
    completedRuns: 0,
    marketPressure: { buy: {}, sell: {} },
    lastSavedAt: '2026-05-08T09:00:00.000Z',
    ...overrides
  };
}

async function seed(page, save) {
  await page.goto('/');
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [saveKey, save]);
  await page.reload();
}

async function departTo(page, cityId: string) {
  await page.getByTestId(`city-${cityId}`).click();
  await expect(page.getByTestId('map-selection-panel')).toBeVisible();
  await page.getByTestId('depart-city').click();
}

async function chooseVisibleCorrectSpelling(page) {
  const correctWords = ['맞춤법', '괜찮아', '어떻게', '가르치다', '며칠', '안 돼', '바닷길', '돛단배', '도착', '물결', '괜히', '금세', '멧돼지', '까치', '토끼', '헤엄', '강아지', '장터', '보따리', '왼쪽', '팔기', '고마워', '우산', '바람', '햇살'];
  const options = await page.locator('[data-testid^="quiz-option-"]').allTextContents();
  const answer = options.find((option) => correctWords.includes(option.trim())) ?? (options.length === 2 ? options[0].trim() : undefined);
  expect(answer).toBeTruthy();
  await page.getByTestId(`quiz-option-${answer}`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('pwa-shell: manifest, icons, service worker and offline page exist', async ({ page }) => {
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', './manifest.json');
  const manifestResponse = await page.request.get('/manifest.json');
  expect(manifestResponse.ok()).toBeTruthy();
  const manifest = await manifestResponse.json();
  expect(manifest.name).toBe('정우의 꼬마 거상 모험');
  expect(manifest.short_name).toBe('꼬마 거상');
  expect(manifest.display).toBe('standalone');
  expect(manifest.orientation).toBe('portrait');
  expect(manifest.icons.map((icon) => icon.sizes)).toContain('192x192');
  expect(manifest.icons.map((icon) => icon.sizes)).toContain('512x512');
  expect((await page.request.get('/service-worker.js')).ok()).toBeTruthy();
  expect((await page.request.get('/offline.html')).ok()).toBeTruthy();
});

test('save-flow: corrupted save falls back to a playable start', async ({ page }) => {
  await page.evaluate(([key]) => localStorage.setItem(key, '{bad json'), [saveKey]);
  await page.reload();
  await expect(page.getByTestId('screen-intro')).toBeVisible();
  await expect(page.getByTestId('start-play')).toContainText('시작하기');
});

test('save-flow: continue data includes version and last saved time', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'intro', completedTutorial: true, coins: 84, stars: 2, starBalance: 2, totalStarsEarned: 2, cargoLimit: 3 }));
  await expect(page.getByTestId('continue-card')).toBeVisible();
  await expect(page.getByTestId('continue-card')).toContainText('부산');
  await expect(page.getByTestId('continue-card')).toContainText('돈 84');
  await expect(page.getByTestId('continue-card')).toContainText('별 2');
  await page.getByTestId('start-play').click();
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.saveVersion).toBe(2);
  expect(typeof saved.lastSavedAt).toBe('string');
});

test('legacy-stars-migrate: old stars become balance and total', () => {
  const migrated = normalizeJuniorSave({
    ...baseSave(),
    starBalance: undefined,
    totalStarsEarned: undefined,
    ownedStarItemIds: undefined,
    equippedStarItems: undefined,
    consumableItems: undefined,
    stars: 7
  });
  expect(migrated.stars).toBe(7);
  expect(migrated.starBalance).toBe(7);
  expect(migrated.totalStarsEarned).toBe(7);
  expect(migrated.ownedStarItemIds).toEqual([]);
  expect(migrated.consumableItems).toEqual({});
});

test('star-balance-increases-on-reward: reward stars update balance and total', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'event', selectedEventId: 'bandit_spelling_1', starBalance: 2, totalStarsEarned: 4, stars: 2 }));
  const next = answerQuiz(save, '맞춤법');
  expect(next.starBalance).toBe(3);
  expect(next.stars).toBe(3);
  expect(next.totalStarsEarned).toBe(5);
  expect(next.badges).toContain('착한 일 배지');
});

test('total-stars-not-decrease-on-spend: buying star item spends only balance', () => {
  const save = normalizeJuniorSave(baseSave({ starBalance: 10, totalStarsEarned: 12, stars: 10 }));
  const next = buyStarItem(save, 'decor_market_staff');
  expect(next.starBalance).toBe(6);
  expect(next.stars).toBe(6);
  expect(next.totalStarsEarned).toBe(12);
  expect(next.ownedStarItemIds).toContain('decor_market_staff');
});

test('star-item-data-valid: required star shop data is present', () => {
  expect(JUNIOR_STAR_ITEMS).toHaveLength(18);
  for (const item of JUNIOR_STAR_ITEMS) {
    expect(item.id).toBeTruthy();
    expect(item.name).toBeTruthy();
    expect(item.starCost).toBeGreaterThan(0);
    expect(item.iconAsset).toBeTruthy();
    expect(item.iconAsset).toContain('/assets/star-items/');
    expect(item.childDescription.length).toBeGreaterThan(0);
  }
});

test('star-item-assets-exist: all star item icons are registered files', () => {
  for (const item of JUNIOR_STAR_ITEMS) {
    const assetPath = item.iconAsset.replace(/^\//, '');
    expect(existsSync(path.resolve('public', assetPath)), `${item.id} uses ${item.iconAsset}`).toBeTruthy();
  }
});

test('consumable-items-have-effect-type: every consumable has a convenience effect', () => {
  const consumables = JUNIOR_STAR_ITEMS.filter((item) => item.isConsumable);
  expect(consumables.map((item) => item.id)).toEqual([
    'ticket_fast_travel',
    'ticket_half_price_good',
    'charm_cargo_guard',
    'ticket_quiz_retry',
    'ticket_market_tip',
    'ticket_extra_rumor'
  ]);
  for (const item of consumables) {
    expect(item.category).toBe('consumable');
    expect(item.slot).toBe('none');
    expect(item.consumableEffect?.type).toBeTruthy();
  }
});

test('skin-items-have-no-stat-effect: skins and decorations are cosmetic only', () => {
  const cosmetics = JUNIOR_STAR_ITEMS.filter((item) => !item.isConsumable);
  for (const item of cosmetics) {
    expect(item.category === 'skin' || item.category === 'decoration' || item.category === 'title').toBeTruthy();
    expect(item.consumableEffect).toBeUndefined();
    expect((item as unknown as { cargoLimit?: number; attack?: number; priceBonus?: number }).cargoLimit).toBeUndefined();
    expect((item as unknown as { cargoLimit?: number; attack?: number; priceBonus?: number }).attack).toBeUndefined();
    expect((item as unknown as { cargoLimit?: number; attack?: number; priceBonus?: number }).priceBonus).toBeUndefined();
  }
});

test('save-active-effects: active consumable effects migrate and persist shape', () => {
  const save = normalizeJuniorSave(baseSave({
    activeEffects: {
      fastTravelNextRoute: true,
      halfPriceNextGoodId: 'dried_fish',
      cargoProtectNextEvent: true,
      quizRetryAvailable: true,
      marketRecommendCityId: 'busan'
    }
  }));
  expect(save.activeEffects.fastTravelNextRoute).toBe(true);
  expect(save.activeEffects.halfPriceNextGoodId).toBe('dried_fish');
  expect(save.activeEffects.cargoProtectNextEvent).toBe(true);
  expect(save.activeEffects.quizRetryAvailable).toBe(true);
  expect(save.activeEffects.marketRecommendCityId).toBe('busan');
});

test('use-fast-travel-ticket: ticket marks the next route and decreases count', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'map', consumableItems: { ticket_fast_travel: 1 } }));
  const next = startFastTravel(save, 'daegu');
  expect(next.currentStep).toBe('travel');
  expect(next.activeEffects.fastTravelNextRoute).toBe(true);
  expect(next.consumableItems.ticket_fast_travel).toBeUndefined();
});

test('use-half-price-ticket: preparing a ticket marks one good', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'market', coins: 50, consumableItems: { ticket_half_price_good: 1 } }));
  const prepared = prepareHalfPriceTicket(save, 'dried_fish');
  expect(prepared.activeEffects.halfPriceNextGoodId).toBe('dried_fish');
  expect(prepared.consumableItems.ticket_half_price_good).toBe(1);
});

test('half-price-applies-once: buying clears the ticket effect', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'market', coins: 50, consumableItems: { ticket_half_price_good: 1 } }));
  const prepared = prepareHalfPriceTicket(save, 'dried_fish');
  const next = buyGood(prepared, 'dried_fish');
  expect(next.coins).toBeGreaterThan(40);
  expect(next.activeEffects.halfPriceNextGoodId).toBeUndefined();
  expect(next.consumableItems.ticket_half_price_good).toBeUndefined();
});

test('cargo-protect-prevents-loss: charm blocks one cargo loss', () => {
  const save = normalizeJuniorSave(baseSave({
    currentStep: 'event',
    selectedEventId: 'bandit_spelling_1',
    cargo: [{ id: 'cargo-1', goodId: 'dried_fish', fromCityId: 'busan', buyPrice: 6 }],
    consumableItems: { charm_cargo_guard: 1 }
  }));
  const protectedSave = useStarConsumable(save, 'charm_cargo_guard');
  const next = answerQuiz(protectedSave, '맛춤법');
  expect(next.cargo).toHaveLength(1);
  expect(next.activeEffects.cargoProtectNextEvent).toBe(false);
  expect(next.lastResultChips).toContain('부적이 지켜줌');
});

test('quiz-retry-ticket-allows-retry: wrong answer stays on quiz once', () => {
  const save = normalizeJuniorSave(baseSave({
    currentStep: 'event',
    selectedEventId: 'bandit_spelling_1',
    consumableItems: { ticket_quiz_retry: 1 }
  }));
  const ready = useStarConsumable(save, 'ticket_quiz_retry');
  const retry = answerQuiz(ready, '맛춤법');
  expect(retry.currentStep).toBe('event');
  expect(retry.activeEffects.quizRetryAvailable).toBe(false);
  expect(retry.consumableItems.ticket_quiz_retry).toBeUndefined();
});

test('market-recommend-ticket-highlights-good: ticket marks current market city', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'market', consumableItems: { ticket_market_tip: 1 } }));
  const next = useStarConsumable(save, 'ticket_market_tip');
  expect(next.activeEffects.marketRecommendCityId).toBe('busan');
  expect(next.consumableItems.ticket_market_tip).toBeUndefined();
});

test('rumor-ticket-triggers-regional-event: ticket opens a local story', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'city', consumableItems: { ticket_extra_rumor: 1 } }));
  const next = useStarConsumable(save, 'ticket_extra_rumor');
  expect(next.currentStep).toBe('regionalEvent');
  expect(next.selectedRegionalEventId).toBeTruthy();
  expect(next.consumableItems.ticket_extra_rumor).toBeUndefined();
});

test('consumable-count-decreases and cannot-use-with-zero-count', () => {
  const save = normalizeJuniorSave(baseSave({ currentStep: 'market', consumableItems: { ticket_market_tip: 1 } }));
  const next = useStarConsumable(save, 'ticket_market_tip');
  expect(next.consumableItems.ticket_market_tip).toBeUndefined();
  const again = useStarConsumable(next, 'ticket_market_tip');
  expect(again).toEqual(next);
});

test('tutorial-flow: buy, spelling event, first visit intro, sell', async ({ page }) => {
  await expect(page.getByTestId('screen-intro')).toBeVisible();
  await expect(page.getByRole('button', { name: '시작하기' })).toBeVisible();

  await page.getByTestId('start-play').click();
  await expect(page.getByTestId('screen-city')).toBeVisible();
  await page.getByTestId('open-market').click();
  await expect(page.getByTestId('screen-market')).toBeVisible();

  await page.getByTestId('buy-cotton_cloth').click();
  await expect(page.getByTestId('screen-market')).toBeVisible();
  await expect(page.getByTestId('market-buy-sell-feedback')).toContainText('-');
  await expect(page.getByTestId('market-cargo-summary')).toContainText('내 짐 1/');
  await expect(page.getByTestId('market-cargo-summary')).toContainText('면포');

  await page.getByTestId('market-map').click();
  await expect(page.getByTestId('screen-map')).toBeVisible();
  await departTo(page, 'daegu');
  await expect(page.getByTestId('screen-travel')).toBeVisible();
  await expect(page.getByTestId('screen-event')).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('quiz-question')).toContainText('바른 말');
  await chooseVisibleCorrectSpelling(page);
  await expect(page.getByTestId('screen-event-result')).toBeVisible();
  await expect(page.getByTestId('event-result-card')).toBeVisible();
  await page.getByTestId('event-result-ok').click();

  await expect(page.getByTestId('screen-visit-intro')).toBeVisible();
  await expect(page.getByTestId('screen-visit-intro').getByText('대구', { exact: true })).toBeVisible();
  await page.getByTestId('visit-next').click();
  await page.getByTestId('visit-next').click();
  await page.getByTestId('visit-next').click();
  await page.getByTestId('visit-next').click();
  await expect(page.getByTestId('screen-city')).toBeVisible();

  await page.getByTestId('open-market').click();
  await page.getByTestId('sell-cotton_cloth').click();
  await expect(page.getByTestId('screen-market')).toBeVisible();
  await expect(page.getByTestId('junior-coins')).not.toContainText('돈 20');

  await page.reload();
  await expect(page.getByTestId('screen-market')).toBeVisible();
});

test('city-map-market-flow: expanded map and market stay simple', async ({ page }) => {
  await seed(page, baseSave({ currentCityId: 'busan' }));
  await expect(page.getByTestId('screen-city')).toBeVisible();
  await expect(page.getByTestId('today-goal-card')).toBeVisible();
  await expect(page.getByTestId('city-stamp')).toContainText('부산');
  await expect(page.getByTestId('open-market')).toBeVisible();
  await expect(page.getByTestId('open-map')).toBeVisible();
  await expect(page.getByTestId('open-cargo')).toBeVisible();
  await expect(page.getByTestId('open-shop')).toBeVisible();

  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('screen-map')).toBeVisible();
  await expect(page.locator('.junior-map-bg')).toHaveAttribute('src', '/assets/maps/korea-approved-map.webp');
  await expect(page.getByTestId('map-pan-layer')).toBeVisible();
  await expect(page.getByTestId('map-pan-layer')).toHaveAttribute('style', /scale\(1\.28\)/);
  await expect(page.locator('.junior-city-dot')).toHaveCount(26);
  await expect(page.getByTestId('city-daegu')).toBeEnabled();
  await expect(page.getByTestId('city-jeju')).toHaveClass(/unavailable/);
  await page.getByTestId('city-daegu').click();
  await expect(page.getByTestId('route-card-before-travel')).toBeVisible();
  await expect(page.locator('.junior-city-dot.selected')).toContainText('대구');
  await expect(page.locator('.junior-map-region')).toContainText('경상');
  await expect(page.locator('.junior-map-goods')).toContainText('약초');

  await page.getByTestId('map-back').click();
  await page.getByTestId('open-market').click();
  await expect(page.getByTestId('buy-cotton_cloth')).toBeVisible();
  await expect(page.getByTestId('buy-cotton_cloth')).toContainText('산 값');
});

test('map-layout: southern cities stay on land and city names show old names', async ({ page }) => {
  await seed(page, baseSave({ currentCityId: 'seoul' }));
  await expect(page.getByTestId('junior-city-name')).toContainText('서울(한양)');
  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('city-busan')).toHaveAttribute('aria-label', '부산(부산포)');

  const positions = await page.evaluate(() => {
    return ['mokpo', 'yeosu', 'tongyeong', 'jeju'].map((id) => {
      const button = document.querySelector<HTMLElement>(`[data-testid="city-${id}"]`);
      return { id, left: button?.style.left, top: button?.style.top };
    });
  });

  expect(positions).toEqual([
    { id: 'mokpo', left: '29%', top: '76%' },
    { id: 'yeosu', left: '42%', top: '76%' },
    { id: 'tongyeong', left: '50%', top: '75%' },
    { id: 'jeju', left: '42%', top: '94%' }
  ]);
});

test('market-flow: buying changes price and keeps market open', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'market', currentCityId: 'busan', coins: 60 }));
  const priceBefore = await page.getByTestId('buy-cotton_cloth').locator('b').innerText();
  await page.getByTestId('buy-cotton_cloth').click();
  await expect(page.getByTestId('screen-market')).toBeVisible();
  await expect(page.getByTestId('market-cargo-summary')).toContainText('내 짐 1/');
  await expect(page.getByTestId('market-cargo-summary')).toContainText('면포');
  const priceAfter = await page.getByTestId('buy-cotton_cloth').locator('b').innerText();
  expect(priceAfter).not.toBe(priceBefore);
});

test('market-flow: natural market hint copy avoids awkward sell-there wording', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'market', currentCityId: 'busan', coins: 60 }));
  await expect(page.getByTestId('buy-cotton_cloth')).toBeVisible();
  await expect(page.getByTestId('screen-market')).toContainText(/인기 많아|잘 팔려|값이 좋아|찾는 사람이 많아/);
  await expect(page.getByTestId('screen-market')).not.toContainText('팔아봐');
  await expect(page.getByTestId('screen-market')).not.toContainText('에 팔아');
});

test('market-flow: same city resale shows original buy price and no profit', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'market',
    currentCityId: 'busan',
    coins: 20,
    cargo: [{ id: 'cotton-local', goodId: 'cotton_cloth', fromCityId: 'busan', buyPrice: 10 }]
  }));
  await expect(page.getByTestId('sell-cotton_cloth')).toContainText('산 값 10냥');
  await expect(page.getByTestId('sell-cotton_cloth')).toContainText('파는 돈 10냥');
  await page.getByTestId('sell-cotton_cloth').click();
  await expect(page.getByTestId('junior-coins')).toContainText('30');
});

test('market-flow: a producing city does not buy the same good expensively', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'market',
    currentCityId: 'daegu',
    coins: 20,
    cargo: [{ id: 'herbs-foreign', goodId: 'herbs', fromCityId: 'andong', buyPrice: 12 }]
  }));
  await expect(page.getByTestId('sell-herbs')).toContainText('산 값 12냥');
  await expect(page.getByTestId('sell-herbs')).toContainText('여기에도 많아');
  await expect(page.getByTestId('sell-herbs')).toContainText('파는 돈 11냥');
});

test('market-flow: city development changes market goods count between two and seven', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'market', currentCityId: 'seoul', coins: 120 }));
  await expect(page.getByTestId('screen-market')).toBeVisible();
  await expect(page.getByTestId('screen-market')).toHaveClass(/junior-market-crowded/);
  await expect(page.locator('[data-testid^="buy-"]')).toHaveCount(7);

  await seed(page, baseSave({ currentStep: 'market', currentCityId: 'jeju', coins: 120 }));
  await expect(page.getByTestId('screen-market')).not.toHaveClass(/junior-market-crowded/);
  await expect(page.locator('[data-testid^="buy-"]')).toHaveCount(4);
});

test('audio-flow: sound controls and copied audio assets are available', async ({ page }) => {
  await expect(page.getByTestId('junior-audio-controls')).toBeVisible();
  await expect(page.getByTestId('junior-audio-prime')).toBeVisible();
  expect((await page.request.get('/assets/audio/bgm-port-harbor-first-light.mp3')).ok()).toBeTruthy();
  expect((await page.request.get('/assets/audio/sfx-buy-market-crossing.mp3')).ok()).toBeTruthy();
  await page.getByTestId('junior-audio-prime').click();
  const audioDebug = await page.evaluate(() => (window as unknown as { __JUNIOR_AUDIO_DEBUG__?: { musicOn: boolean } }).__JUNIOR_AUDIO_DEBUG__);
  expect(audioDebug?.musicOn).toBe(true);
});

test('travel-scene: mountain route remains visible long enough', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'travel',
    currentCityId: 'busan',
    destinationCityId: 'daegu',
    completedTutorial: true,
    seenEventIds: ['bandit_spelling_1', 'bandit_spelling_2', 'bandit_spelling_3', 'bandit_spelling_4', 'bandit_spelling_5', 'bandit_spelling_6']
  }));
  await expect(page.getByTestId('screen-travel')).toBeVisible();
  await expect(page.locator('.junior-travel.scenery-mountain')).toBeVisible();
  await page.waitForTimeout(1800);
  await expect(page.getByTestId('screen-travel')).toBeVisible();
  await expect(page.locator('.junior-travel-mountains')).toBeVisible();
});

test('event-quiz-flow: bandit spelling quiz rewards correct answer', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'event', currentCityId: 'busan', coins: 31, selectedEventId: 'bandit_spelling_1' }));
  await expect(page.getByTestId('screen-event')).toBeVisible();
  await expect(page.getByTestId('quiz-question')).toContainText('바른 말');
  await page.getByTestId('quiz-option-맞춤법').click();
  await expect(page.getByText('정답! 길이 열렸어.')).toBeVisible();
  await page.getByTestId('event-result-ok').click();
  await expect(page.locator('.junior-star-pill')).toContainText('별 1');
});

test('event-quiz-flow: pirate spelling quiz works on sea route', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'event',
    currentCityId: 'tongyeong',
    boatId: 'small_ferry',
    visitedCityIds: ['tongyeong'],
    selectedEventId: 'pirate_spelling_1'
  }));
  await expect(page.getByTestId('screen-event')).toBeVisible();
  await expect(page.getByTestId('quiz-question')).toContainText('바른 말');
  await page.getByTestId('quiz-option-바닷길').click();
  await expect(page.getByText('정답! 해적이 길을 비켜줬어.')).toBeVisible();
});

test('event-pool: low chance event data has many spelling encounters', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'map', currentCityId: 'busan' }));
  const eventSummary = await page.evaluate(() => import('/src/juniorData.ts').then((module) => ({
    totalQuiz: module.JUNIOR_EVENTS.filter((event) => event.quiz).length,
    bandit: module.JUNIOR_EVENTS.filter((event) => event.type === 'quiz_bandit').length,
    pirate: module.JUNIOR_EVENTS.filter((event) => event.type === 'quiz_pirate').length,
    animal: module.JUNIOR_EVENTS.filter((event) => event.type === 'quiz_animal').length,
    merchant: module.JUNIOR_EVENTS.filter((event) => event.type === 'quiz_merchant').length,
    folktale: module.JUNIOR_EVENTS.filter((event) => event.type === 'quiz_folktale').length,
    maxChance: Math.max(...module.JUNIOR_EVENTS.map((event) => event.chancePercent))
  })));
  const chanceSummary = await page.evaluate(() => import('/src/juniorFlow.ts').then((module) => module.getTravelEventChanceSummary()));
  expect(eventSummary.totalQuiz).toBeGreaterThanOrEqual(20);
  expect(eventSummary.bandit).toBeGreaterThanOrEqual(5);
  expect(eventSummary.pirate).toBeGreaterThanOrEqual(5);
  expect(eventSummary.animal).toBeGreaterThanOrEqual(5);
  expect(eventSummary.merchant).toBeGreaterThanOrEqual(5);
  expect(eventSummary.folktale).toBeGreaterThanOrEqual(4);
  expect(eventSummary.maxChance).toBeLessThanOrEqual(3);
  expect(chanceSummary).toEqual({ bad: 3, good: 2, talk: 2, story: 1 });
});

test('route-cutscenes: key routes have art and story hooks', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'map', currentCityId: 'busan' }));
  const summary = await page.evaluate(() => import('/src/juniorData.ts').then((module) => {
    const requiredRouteTypes = [
      'inland_market_road',
      'mountain_paper_road',
      'west_river_salt_road',
      'jeju_sea_route',
      'south_coast_market_road',
      'island_sea_route',
      'east_mountain_road',
      'north_capital_road',
      'border_river_road',
      'northeast_coast_road'
    ];
    const routes = module.JUNIOR_ROUTES.filter((route) => requiredRouteTypes.includes(route.routeType));
    return {
      routeCount: routes.length,
      withAssets: routes.filter((route) => route.travelSceneAsset?.includes('/assets/scenes/')).length,
      withStoryHooks: routes.filter((route) => route.storyArcIds?.length).length,
      storyEvents: module.JUNIOR_EVENTS.filter((event) => ['rice_cake_pass', 'fairy_cloth', 'sea_dragon', 'north_merchant'].includes(event.storyArcId)).length,
      maxChance: Math.max(...module.JUNIOR_EVENTS.map((event) => event.chancePercent))
    };
  }));

  expect(summary.routeCount).toBeGreaterThanOrEqual(10);
  expect(summary.withAssets).toBeGreaterThanOrEqual(10);
  expect(summary.withStoryHooks).toBeGreaterThanOrEqual(10);
  expect(summary.storyEvents).toBeGreaterThanOrEqual(12);
  expect(summary.maxChance).toBeLessThanOrEqual(3);
});

test('upgrade-flow: handcart and boat can be bought', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'shop', currentCityId: 'tongyeong', coins: 400 }));
  await expect(page.getByTestId('screen-shop')).toBeVisible();
  await expect(page.getByTestId('vehicle-current-status')).toContainText('수레: 보따리');
  await expect(page.getByTestId('vehicle-current-status')).toContainText('배: 배 없음');
  await expect(page.getByTestId('equipment-goal')).toBeVisible();
  await page.getByTestId('buy-vehicle-handcart').click();
  await expect(page.getByTestId('upgrade-celebration')).toBeVisible();
  await expect(page.getByTestId('upgrade-celebration')).toContainText('손수레를 장만했어!');
  await expect(page.getByText('짐 0/3')).toBeVisible();
  await page.getByTestId('buy-boat-small_ferry').click();
  await expect(page.getByTestId('upgrade-celebration')).toContainText('작은 나룻배를 장만했어!');
  await page.getByTestId('nav-map').click();
  await expect(page.getByTestId('city-jeju')).toBeEnabled();
});

test('vehicle-current-status-visible: shop and footer show current cart and boat', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'shop', vehicleId: 'big_cart', boatId: 'small_ferry', cargoLimit: 4, coins: 80 }));
  await expect(page.getByTestId('vehicle-current-status')).toContainText('수레: 큰 수레');
  await expect(page.getByTestId('vehicle-current-status')).toContainText('땅길 짐칸 4칸');
  await expect(page.getByTestId('vehicle-current-status')).toContainText('배: 작은 나룻배');
  await expect(page.getByTestId('vehicle-current-status')).toContainText('바닷길 짐칸 2칸');
  await expect(page.getByTestId('vehicle-status-footer')).toContainText('땅길 4칸');
  await expect(page.getByTestId('vehicle-status-footer')).toContainText('바닷길 2칸');
});

test('vehicle-shop-layout: shop uses cart-boat wording and scrolls the next goal', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'shop', coins: 120 }));
  await expect(page.getByTestId('vehicle-current-status')).toContainText('현재 수레와 배');
  await expect(page.getByTestId('shop-scroll-area')).toBeVisible();
  await expect(page.getByTestId('shop-scroll-area')).toContainText('다음 목표');
  await expect(page.getByTestId('shop-back')).toHaveCount(0);
  await expect(page.getByTestId('nav-shop')).toContainText('수레·배');
});

test('star-chip-opens-shop: tapping the star chip opens the reward menu', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', starBalance: 4, totalStarsEarned: 6, stars: 4 }));
  await page.getByTestId('star-chip').click();
  await expect(page.getByTestId('star-reward-screen')).toBeVisible();
  await expect(page.getByTestId('star-shop-main')).toContainText('별 4개');
  await expect(page.getByTestId('star-reward-screen')).toContainText('모은 별 6개');
});

test('buy-star-item-spends-star-balance: star shop buys a cosmetic reward', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', starBalance: 4, totalStarsEarned: 6, stars: 4 }));
  await page.getByTestId('star-chip').click();
  await page.getByTestId('star-item-decor_market_staff').click();
  await expect(page.locator('.junior-star-pill')).toContainText('별 0');
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.starBalance).toBe(0);
  expect(saved.stars).toBe(0);
  expect(saved.ownedStarItemIds).toContain('decor_market_staff');
});

test('total-stars-remains-after-purchase: lifetime stars stay unchanged', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', starBalance: 4, totalStarsEarned: 6, stars: 4 }));
  await page.getByTestId('star-chip').click();
  await page.getByTestId('star-item-decor_market_staff').click();
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.totalStarsEarned).toBe(6);
});

test('equip-skin-item: treasure box equips an owned decoration', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', starBalance: 4, totalStarsEarned: 6, stars: 4 }));
  await page.getByTestId('star-chip').click();
  await page.getByTestId('star-item-decor_market_staff').click();
  await page.getByTestId('inventory-tab').click();
  await page.getByTestId('inventory-item-decor_market_staff').getByRole('button', { name: '착용하기' }).click();
  await expect(page.getByTestId('equipped-item')).toContainText('장터 호신봉 장식');
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.equippedStarItems.weapon).toBe('decor_market_staff');
});

test('unequip-skin-item: treasure box can remove a decoration', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'city',
    starBalance: 4,
    totalStarsEarned: 6,
    stars: 4,
    ownedStarItemIds: ['decor_market_staff'],
    equippedStarItems: { weapon: 'decor_market_staff' }
  }));
  await page.getByTestId('star-chip').click();
  await page.getByTestId('inventory-tab').click();
  await page.getByTestId('unequip-weapon').click();
  await expect(page.getByTestId('equipped-item')).toContainText('무기: 없음');
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.equippedStarItems.weapon).toBeUndefined();
});

test('consumable-owned-count: bought consumables appear in the treasure box', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', starBalance: 3, totalStarsEarned: 6, stars: 3 }));
  await page.getByTestId('star-chip').click();
  await page.getByTestId('star-tab-consumables').click();
  await page.getByTestId('star-item-ticket_market_tip').click();
  await page.getByTestId('inventory-tab').click();
  await expect(page.getByTestId('owned-consumable-ticket_market_tip')).toContainText('x1');
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.consumableItems.ticket_market_tip).toBe(1);
});

test('cannot-buy-without-stars: item button explains missing stars', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', starBalance: 0, totalStarsEarned: 6, stars: 0 }));
  await page.getByTestId('star-chip').click();
  const item = page.getByTestId('star-item-decor_market_staff');
  await expect(item).toContainText('별이 부족해');
  await expect(item).toBeDisabled();
});

test('owned-non-consumable-cannot-duplicate: owned cosmetics are not bought twice', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'city',
    starBalance: 10,
    totalStarsEarned: 12,
    stars: 10,
    ownedStarItemIds: ['decor_market_staff']
  }));
  await page.getByTestId('star-chip').click();
  const item = page.getByTestId('star-item-decor_market_staff');
  await expect(item).toContainText('보유 중');
  await expect(item).toBeDisabled();
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.starBalance).toBe(10);
  expect(saved.ownedStarItemIds).toContain('decor_market_staff');
});

test('cart-prices-visible: every cart card shows a price and state', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'shop', coins: 250 }));
  const section = page.getByTestId('vehicle-cart-prices');
  await expect(section).toBeVisible();
  for (const id of ['bundle', 'handcart', 'big_cart', 'merchant_cart']) {
    await expect(page.getByTestId(`buy-vehicle-${id}`)).toContainText('가격');
    await expect(page.getByTestId(`buy-vehicle-${id}`)).toContainText('땅길 짐칸');
  }
  await expect(page.getByTestId('buy-vehicle-bundle')).toContainText('쓰는 중');
  await expect(page.getByTestId('buy-vehicle-handcart')).toContainText('살 수 있어');
});

test('boat-prices-visible: every boat card shows sea cargo and price', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'shop', coins: 250 }));
  const section = page.getByTestId('vehicle-boat-prices');
  await expect(section).toBeVisible();
  for (const id of ['none', 'small_ferry', 'sailboat', 'sturdy_sailboat', 'merchant_ship']) {
    await expect(page.getByTestId(`buy-boat-${id}`)).toContainText('가격');
    await expect(page.getByTestId(`buy-boat-${id}`)).toContainText('바닷길 짐칸');
  }
  await expect(page.getByTestId('buy-boat-none')).toContainText('지금 배');
  await expect(page.getByTestId('buy-boat-small_ferry')).toContainText('살 수 있어');
});

test('land-vs-sea-cargo-visible: map route card explains cart and boat cargo', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'map', currentCityId: 'busan', vehicleId: 'handcart', cargoLimit: 3 }));
  await page.getByTestId('city-daegu').click();
  await expect(page.getByTestId('route-land-cargo')).toContainText('이번 길: 땅길');
  await expect(page.getByTestId('route-land-cargo')).toContainText('수레: 손수레');
  await expect(page.getByTestId('route-land-cargo')).toContainText('3칸');

  await seed(page, baseSave({ currentStep: 'map', currentCityId: 'tongyeong', boatId: 'small_ferry', vehicleId: 'handcart', cargoLimit: 3 }));
  await page.getByTestId('city-jeju').click();
  await expect(page.getByTestId('route-sea-cargo')).toContainText('이번 길: 바닷길');
  await expect(page.getByTestId('route-sea-cargo')).toContainText('배: 작은 나룻배');
  await expect(page.getByTestId('route-sea-cargo')).toContainText('2칸');
});

test('regional-merchant-rumor: regional event card can show merchant rumor', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'regionalEvent', selectedRegionalEventId: 'busan_merchant_dried_fish', regionalReturnStep: 'market' }));
  await expect(page.getByTestId('screen-regional-event')).toBeVisible();
  await expect(page.getByTestId('regional-merchant-rumor')).toContainText('장터 소문');
  await expect(page.getByTestId('regional-merchant-rumor')).toContainText('건어물');
  await page.getByTestId('regional-event-ok').click();
  await expect(page.getByTestId('screen-market')).toBeVisible();
});

test('regional-dialect-event: dialect cards stay short and explained', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'regionalEvent', selectedRegionalEventId: 'jeju_dialect_welcome', regionalReturnStep: 'city', currentCityId: 'jeju' }));
  await expect(page.getByTestId('regional-dialect-event')).toContainText('혼저 옵서예');
  await expect(page.getByTestId('regional-dialect-event')).toContainText('어서 오라는 뜻');
});

test('regional-landmark-event: first-visit style landmark card teaches place', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'regionalEvent', selectedRegionalEventId: 'mokpo_landmark_mudflat', regionalReturnStep: 'city', currentCityId: 'mokpo' }));
  await expect(page.getByTestId('regional-landmark-event')).toContainText('목포 갯벌');
  await expect(page.getByTestId('regional-landmark-event')).toContainText('서해');
});

test('no-repeated-regional-event: selection avoids the last regional event', async ({ page }) => {
  await seed(page, baseSave({
    currentStep: 'market',
    currentCityId: 'busan',
    lastRegionalEventId: 'busan_merchant_dried_fish',
    seenRegionalEventIds: ['busan_merchant_dried_fish']
  }));
  const selected = await page.evaluate(() => import('/src/juniorFlow.ts').then((module) => {
    const save = JSON.parse(localStorage.getItem('joseon_trade_junior_save_v1') ?? '{}');
    const next = module.maybeOpenRegionalEvent(save, 'market', 0);
    return next.selectedRegionalEventId;
  }));
  expect(selected).not.toBe('busan_merchant_dried_fish');
  expect(selected).toBeTruthy();
});

test('ending-flow: 300 coins opens home ending', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', coins: 300, storyClues: 3 }));
  await page.getByTestId('open-ending').click();
  await expect(page.getByTestId('screen-ending-choice')).toBeVisible();
  await expect(page.getByTestId('ending-hint')).toBeVisible();
  await page.getByTestId('go-home').click();
  await expect(page.getByTestId('screen-ending')).toBeVisible();
  await expect(page.getByText('꼬마 거상 정우')).toBeVisible();
  await page.getByTestId('ending-again').click();
  await expect(page.getByTestId('screen-intro')).toBeVisible();
});

test('does not show full mode systems', async ({ page }) => {
  await expect(page.getByText('명성')).toHaveCount(0);
  await expect(page.getByText('신뢰도')).toHaveCount(0);
  await expect(page.getByText('가격표')).toHaveCount(0);
  await expect(page.getByText('위험도')).toHaveCount(0);
  await expect(page.getByText('평균 매입가')).toHaveCount(0);
  await expect(page.getByText('수익률')).toHaveCount(0);
});
