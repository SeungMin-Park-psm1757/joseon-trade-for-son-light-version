import { expect, test } from '@playwright/test';

const saveKey = 'joseon_trade_junior_save_v1';
const allCities = [
  'seoul', 'gaeseong', 'pyongyang', 'sinuiju', 'chuncheon', 'gangneung', 'wonsan',
  'hamheung', 'cheongjin', 'andong', 'daegu', 'jeonju', 'gwangju', 'mokpo',
  'yeosu', 'suncheon', 'jinju', 'tongyeong', 'busan', 'ulsan', 'jeju'
];

function baseSave(overrides = {}) {
  return {
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
    storyClues: 0,
    badges: [],
    completedEnding: false,
    completedRuns: 0,
    marketPressure: { buy: {}, sell: {} },
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
  const answer = options.find((option) => correctWords.includes(option.trim()));
  expect(answer).toBeTruthy();
  await page.getByTestId(`quiz-option-${answer}`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
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
  await expect(page.locator('.junior-cargo-slot.filled')).toHaveCount(1);

  await page.getByTestId('market-map').click();
  await expect(page.getByTestId('screen-map')).toBeVisible();
  await departTo(page, 'daegu');
  await expect(page.getByTestId('screen-travel')).toBeVisible();
  await expect(page.getByTestId('screen-event')).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('quiz-question')).toContainText('바른 말');
  await chooseVisibleCorrectSpelling(page);
  await expect(page.getByTestId('screen-event-result')).toBeVisible();
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
  await expect(page.getByTestId('open-market')).toBeVisible();
  await expect(page.getByTestId('open-map')).toBeVisible();
  await expect(page.getByTestId('open-cargo')).toBeVisible();
  await expect(page.getByTestId('open-shop')).toBeVisible();

  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('screen-map')).toBeVisible();
  await expect(page.locator('.junior-map-bg')).toHaveAttribute('src', '/assets/maps/korea-light-map.svg');
  await expect(page.locator('.junior-city-dot')).toHaveCount(21);
  await expect(page.getByTestId('city-daegu')).toBeEnabled();
  await expect(page.getByTestId('city-jeju')).toBeDisabled();
  await page.getByTestId('city-daegu').click();
  await expect(page.locator('.junior-city-dot.selected')).toContainText('대구');
  await expect(page.locator('.junior-map-region')).toContainText('경상');
  await expect(page.locator('.junior-map-goods')).toContainText('약초');

  await page.getByTestId('map-back').click();
  await page.getByTestId('open-market').click();
  await expect(page.getByTestId('buy-cotton_cloth')).toBeVisible();
  await expect(page.getByTestId('buy-cotton_cloth')).toContainText('사는 값');
});

test('market-flow: buying changes price and keeps market open', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'market', currentCityId: 'busan', coins: 60 }));
  const priceBefore = await page.getByTestId('buy-cotton_cloth').locator('b').innerText();
  await page.getByTestId('buy-cotton_cloth').click();
  await expect(page.getByTestId('screen-market')).toBeVisible();
  await expect(page.locator('.junior-cargo-slot.filled')).toHaveCount(1);
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

test('upgrade-flow: handcart and boat can be bought', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'shop', currentCityId: 'tongyeong', coins: 400 }));
  await expect(page.getByTestId('screen-shop')).toBeVisible();
  await page.getByTestId('buy-vehicle-handcart').click();
  await expect(page.getByText('손수레를 장만했어!')).toBeVisible();
  await expect(page.getByText('짐 0/3')).toBeVisible();
  await page.getByTestId('buy-boat-small_ferry').click();
  await expect(page.getByText('작은 나룻배를 장만했어!')).toBeVisible();
  await page.getByTestId('shop-back').click();
  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('city-jeju')).toBeEnabled();
});

test('ending-flow: 300 coins opens home ending', async ({ page }) => {
  await seed(page, baseSave({ currentStep: 'city', coins: 300, storyClues: 3 }));
  await page.getByTestId('open-ending').click();
  await expect(page.getByTestId('screen-ending-choice')).toBeVisible();
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
