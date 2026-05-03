import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:5174';
const outDir = process.env.SCENE_OUT ?? path.resolve(process.cwd(), '..', '.logs', 'scene-first-ui-pass-2');
fs.mkdirSync(outDir, { recursive: true });

async function closeOpenModal(page) {
  for (let index = 0; index < 4; index += 1) {
    const button = page.locator('.modal-backdrop button:not([disabled])').first();
    if (!(await button.count())) return;
    await button.click();
    await page.waitForTimeout(120);
  }
}

async function start(page) {
  await page.goto(baseURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game-button').click();
  await closeOpenModal(page);
  await page.waitForSelector('[data-testid="status-current-port"]');
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  const scroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (scroll) throw new Error(`${name}: horizontal scroll detected`);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const size of [
    { width: 1365, height: 768, label: '1365x768' },
    { width: 1920, height: 1080, label: '1920x1080' },
    { width: 844, height: 390, label: '844x390' },
    { width: 932, height: 430, label: '932x430' }
  ]) {
    const page = await browser.newPage({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
    await start(page);
    await page.getByTestId('tab-quests').click();
    await shot(page, `quests-main-${size.label}`);
    await page.getByTestId('tab-vehicles').click();
    await shot(page, `equipment-main-${size.label}`);
    await page.getByTestId('tab-ledger').click();
    await shot(page, `ledger-achievements-${size.label}`);
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1 });
  await start(page);
  await page.getByTestId('tab-quests').click();
  await shot(page, 'first-30-growth-route-844x390');
  await page.getByTestId('tab-vehicles').click();
  await page.getByTestId('buy-tool-short_sword').click();
  await shot(page, 'equipment-purchase-modal-844x390');
  await closeOpenModal(page);
  await page.getByTestId('tab-ledger').click();
  await shot(page, 'ledger-seals-achievements-844x390');
  await page.close();
} finally {
  await browser.close();
}
