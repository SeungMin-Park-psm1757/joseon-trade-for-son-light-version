import { expect, test } from '@playwright/test';

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
    cargo: [],
    cargoLimit: 2,
    vehicleId: 'bundle',
    boatId: 'none',
    unlockedCities: allCities,
    visitedCityIds: ['busan'],
    completedTutorial: true,
    tutorialStage: 9,
    seenEventIds: [],
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
  await seed(page, baseSave({ currentStep: 'intro', completedTutorial: true, coins: 84, stars: 2, cargoLimit: 3 }));
  await expect(page.getByTestId('continue-card')).toBeVisible();
  await expect(page.getByTestId('continue-card')).toContainText('부산');
  await expect(page.getByTestId('continue-card')).toContainText('돈 84');
  await expect(page.getByTestId('continue-card')).toContainText('별 2');
  await page.getByTestId('start-play').click();
  const saved = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key) ?? '{}'), [saveKey]);
  expect(saved.saveVersion).toBe(2);
  expect(typeof saved.lastSavedAt).toBe('string');
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
  await expect(page.locator('.junior-city-dot')).toHaveCount(26);
  await expect(page.getByTestId('city-daegu')).toBeEnabled();
  await expect(page.getByTestId('city-jeju')).toBeDisabled();
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
  await expect(page.getByTestId('equipment-goal')).toBeVisible();
  await page.getByTestId('buy-vehicle-handcart').click();
  await expect(page.getByTestId('upgrade-celebration')).toBeVisible();
  await expect(page.getByTestId('upgrade-celebration')).toContainText('손수레를 장만했어!');
  await expect(page.getByText('짐 0/3')).toBeVisible();
  await page.getByTestId('buy-boat-small_ferry').click();
  await expect(page.getByTestId('upgrade-celebration')).toContainText('작은 나룻배를 장만했어!');
  await page.getByTestId('shop-back').click();
  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('city-jeju')).toBeEnabled();
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
