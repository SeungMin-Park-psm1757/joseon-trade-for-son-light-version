import { expect, test } from '@playwright/test';

async function closeOpenModal(page: import('@playwright/test').Page) {
  for (let index = 0; index < 8; index += 1) {
    const button = page.locator('.modal-backdrop button:not([disabled])').first();
    if (!(await button.count())) return;
    await button.click();
    await page.waitForTimeout(150);
  }
}

function parseTradePrices(text: string) {
  const match = text.match(/사는 값 ([\d,]+)냥 · 파는 값 ([\d,]+)냥/);
  if (!match) throw new Error(`Cannot parse trade prices from: ${text}`);
  return {
    buy: Number(match[1].replace(/,/g, '')),
    sell: Number(match[2].replace(/,/g, ''))
  };
}

test.describe('팔도상단 가로 모바일 smoke test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('앱이 가로 화면에서 열리고 그림 중심 동선이 준비되어 있다', async ({ page }) => {
    await expect(page.getByTestId('new-game-button')).toBeVisible();
    await page.getByTestId('new-game-button').click();
    await expect(page.getByTestId('discovery-modal')).toBeVisible();
    await closeOpenModal(page);
    await expect(page.getByTestId('status-current-port')).toBeVisible();
    await expect(page.getByTestId('status-money')).toBeVisible();
    await expect(page.getByTestId('fame-merchant')).toBeVisible();
    await expect(page.getByTestId('fame-exploration')).toBeVisible();
    await expect(page.getByTestId('fame-guard')).toBeVisible();
    await expect(page.getByTestId('tutorial-path')).toBeVisible();
    await expect(page.getByTestId('tutorial-step-active')).toBeVisible();
    await expect(page.getByTestId('facility-market')).toBeVisible();
    await expect(page.getByTestId('port-flavor-card')).toBeVisible();
    await expect(page.locator('.port-hero-ctas')).toBeVisible();
    await expect(page.getByTestId('port-trust-chip')).toBeVisible();
    await expect(page.getByTestId('audio-controls')).toBeVisible();
    await page.getByTestId('tab-market').click();
    await closeOpenModal(page);
    await page.getByTestId('market-good-cotton_cloth').click();
    await closeOpenModal(page);
    await expect(page.getByTestId('buy-button-cotton_cloth')).toBeVisible();
    await expect(page.getByTestId('trade-estimate-cotton_cloth')).toBeVisible();
    await expect(page.getByTestId('price-label-cotton_cloth')).toBeVisible();
    await expect(page.getByTestId('trade-popover')).toContainText('보통 값과 비교');
    await expect(page.getByTestId('trade-popover')).toContainText('바로 다시 팔면');
    const cottonTradeText = await page.getByTestId('trade-popover').innerText();
    const cottonPrices = parseTradePrices(cottonTradeText);
    expect(cottonPrices.sell).toBeLessThan(cottonPrices.buy);
    await page.getByTestId('buy-button-cotton_cloth').click();
    await closeOpenModal(page);
    await expect(page.locator('.market-good-icon').first()).toBeVisible();
    await expect(page.locator('.recommend-badge').first()).toBeVisible();
    await page.getByTestId('market-good-dried_fish').click();
    await expect(page.getByTestId('trade-popover')).toBeVisible();
    await expect(page.locator('.good-stall-token.active').first()).toBeVisible();
    await expect(page.locator('.market-stall-shelf').first()).toBeVisible();
    await page.getByTestId('tab-quests').click();
    await expect(page.getByTestId('growth-journey-map')).toBeVisible();
    await page.getByTestId('tab-map').click();
    await expect(page.locator('.korea-map-layer')).toBeVisible();
    await expect(page.getByTestId('route-preview')).toBeVisible();
    await expect(page.getByTestId('map-sale-guide-panel')).toBeVisible();
    await expect(page.locator('.map-sale-guide-pop').first()).toBeVisible();
    await expect(page.getByTestId('route-prep-board')).toBeVisible();
    await expect(page.getByTestId('cargo-slot-strip').first()).toBeVisible();
    await closeOpenModal(page);
    await page.getByTestId('tab-cargo').click();
    await expect(page.getByTestId('discovery-log')).toBeVisible();
    await expect(page.getByTestId('ledger-seal-card').first()).toBeVisible();
    await expect(page.getByTestId('cargo-sale-hint-cotton_cloth')).toBeVisible();
    await page.getByTestId('cargo-sale-hint-cotton_cloth').click();
    await expect(page.getByTestId('route-preview')).toBeVisible();
    await closeOpenModal(page);
    await page.getByTestId('tab-vehicles').click();
    await expect(page.getByTestId('fleet-panel')).toBeVisible();
    await expect(page.getByTestId('personal-kit-path')).toBeVisible();
    await page.getByTestId('tab-map').click();
    await page.locator('[data-testid^="travel-button-"]').first().click();
    await expect(page.getByTestId('travel-animation-token')).toBeVisible();
  });

  test('fishing opens a multi-step minigame before rewards are recorded', async ({ page }) => {
    await page.getByTestId('new-game-button').click();
    await closeOpenModal(page);
    await page.getByTestId('fishing-open-hero').click();
    await expect(page.getByTestId('fishing-modal')).toBeVisible();
    await expect(page.getByTestId('fishing-modal')).toContainText('어장');
    await page.getByTestId('fishing-spot-open_current').click();
    await expect(page.getByTestId('fishing-current-gauge')).toBeVisible();
    await page.getByTestId('fishing-timing-sweet').click();
    await expect(page.getByTestId('fishing-net-preview')).toBeVisible();
    await page.getByTestId('fishing-haul-angle').click();
    await expect(page.getByTestId('fishing-result-panel')).toBeVisible();
    await page.getByTestId('fishing-accept-result').click();
    await expect(page.getByTestId('fishing-modal')).toHaveCount(0);
    await page.getByTestId('tab-ledger').click();
    await expect(page.locator('[data-testid="ledger-entry"]').filter({ hasText: '어업' }).first()).toBeVisible();
  });

  test('audio manager unlocks and plays scene-specific cues', async ({ page }) => {
    await page.getByTestId('new-game-button').click();
    await closeOpenModal(page);
    await page.getByTestId('audio-prime-button').click();
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { unlocked: boolean } }).__JOSEON_AUDIO_DEBUG__?.unlocked ?? false)).toBe(true);
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { ctxState: string } }).__JOSEON_AUDIO_DEBUG__?.ctxState ?? 'none')).toBe('running');
    await page.getByTestId('tab-market').click();
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { scene: string } }).__JOSEON_AUDIO_DEBUG__?.scene ?? '')).toBe('market');
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { lastSfx: string } }).__JOSEON_AUDIO_DEBUG__?.lastSfx ?? '')).toBe('door');
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { musicSource: string } }).__JOSEON_AUDIO_DEBUG__?.musicSource ?? '')).toBe('file');
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { lastSfxSource: string } }).__JOSEON_AUDIO_DEBUG__?.lastSfxSource ?? '')).toBe('file');
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { currentTrack: string } }).__JOSEON_AUDIO_DEBUG__?.currentTrack.includes('bgm-market-wooden-port.mp3') ?? false)).toBe(true);
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { lastSfxTrack: string } }).__JOSEON_AUDIO_DEBUG__?.lastSfxTrack.includes('sfx-shop-door-bell.mp3') ?? false)).toBe(true);
    await expect.poll(async () => page.evaluate(() => (window as unknown as { __JOSEON_AUDIO_DEBUG__?: { musicTicks: number } }).__JOSEON_AUDIO_DEBUG__?.musicTicks ?? 0)).toBeGreaterThan(0);
  });

  test('개인 장비와 동료가 구매 연출과 사건 조언으로 이어진다', async ({ page }) => {
    await page.getByTestId('new-game-button').click();
    await closeOpenModal(page);
    await page.getByTestId('tab-vehicles').click();
    await page.getByTestId('buy-tool-short_sword').click();
    await expect(page.getByTestId('equipment-notice-modal')).toBeVisible();
    await expect(page.locator('.notice-detail-list')).toContainText('호위');
    await closeOpenModal(page);
    await page.getByTestId('recruit-companion-park_siwoo').click();
    await expect(page.getByTestId('equipment-notice-modal')).toBeVisible();
    await expect(page.getByTestId('equipment-notice-modal')).toContainText('박시우');
    await closeOpenModal(page);
    await expect(page.getByTestId('fleet-companion-advice')).toBeVisible();
    await expect(page.locator('.companion-avatar img').first()).toBeVisible();
    await expect(page.getByTestId('facility-companion-line')).toBeVisible();
    await page.evaluate(() => {
      const key = 'joseon_trade_save_v1';
      const raw = localStorage.getItem(key);
      if (!raw) throw new Error('missing save');
      const state = JSON.parse(raw);
      state.pendingEventId = 'bandit_ambush';
      state.lastTravelRouteId = 'daegu-busanpo';
      localStorage.setItem(key, JSON.stringify(state));
    });
    await page.reload();
    await page.getByTestId('continue-button').click();
    await expect(page.getByTestId('event-modal')).toBeVisible();
    await expect(page.getByTestId('event-companion-line')).toBeVisible();
    await page.getByTestId('event-choice-visual').first().click();
    await expect(page.getByTestId('event-companion-result')).toBeVisible();
  });

  test('가로 스크롤이 생기지 않는다', async ({ page }) => {
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasHorizontalScroll).toBe(false);
  });

  test('첫 장사 완료 보상 모달이 다음 목표로 이어진다', async ({ page }) => {
    await page.getByTestId('new-game-button').click();
    await closeOpenModal(page);
    await page.getByTestId('tab-market').click();
    await closeOpenModal(page);
    await page.getByTestId('market-good-cotton_cloth').click();
    await closeOpenModal(page);
    await page.getByTestId('buy-button-cotton_cloth').click();
    await closeOpenModal(page);
    await page.getByTestId('buy-button-cotton_cloth').click();
    await page.getByTestId('tutorial-step-active').click();
    await closeOpenModal(page);
    await expect(page.getByTestId('route-preview')).toContainText('대구');
    await page.locator('[data-testid^="travel-button-"]').first().click();
    await page.waitForTimeout(1200);
    await closeOpenModal(page);
    await page.getByTestId('tab-market').click();
    await closeOpenModal(page);
    await page.getByTestId('market-good-cotton_cloth').click();
    await closeOpenModal(page);
    await page.getByTestId('sell-button-cotton_cloth').click();
    await closeOpenModal(page);
    await page.getByTestId('sell-button-cotton_cloth').click();
    await expect(page.getByTestId('quest-complete-modal')).toBeVisible();
    await expect(page.getByTestId('quest-next-goal')).toContainText('소금 장사');
  });
});
