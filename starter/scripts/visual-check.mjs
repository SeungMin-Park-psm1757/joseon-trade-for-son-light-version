import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:5174';
const outDir = process.env.VISUAL_OUT ?? path.resolve(process.cwd(), '..', '.logs', 'visual-regression-current');
let devServer;

fs.mkdirSync(outDir, { recursive: true });

async function canReach(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await canReach(baseURL)) return;

  devServer = spawn(
    'npm',
    ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5174'],
    {
      cwd: process.cwd(),
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, BROWSER: 'none' }
    }
  );

  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    if (await canReach(baseURL)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Unable to start or reach dev server at ${baseURL}`);
}

async function start(page) {
  await page.goto(baseURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game-button').click();
  await page.getByTestId('discovery-modal').waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
  await closeOpenModal(page);
  await page.waitForSelector('[data-testid="status-current-port"]');
}

async function closeOpenModal(page) {
  for (let index = 0; index < 8; index += 1) {
    const button = page.locator('.modal-backdrop button:not([disabled])').first();
    if (!(await button.count())) break;
    await button.click();
    await page.waitForTimeout(150);
  }
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  const scroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (scroll) throw new Error(`${name}: horizontal scroll detected`);
}

await ensureServer();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1 });

try {
  await start(page);
  await shot(page, 'port');
  await page.getByTestId('tab-market').click();
  await closeOpenModal(page);
  await page.getByTestId('market-good-cotton_cloth').click();
  await closeOpenModal(page);
  await shot(page, 'market');
  await page.getByTestId('tab-map').click();
  await closeOpenModal(page);
  await shot(page, 'map');
  await page.getByTestId('tab-quests').click();
  await shot(page, 'quests');
  await page.getByTestId('tab-vehicles').click();
  await shot(page, 'vehicles');
  await page.getByTestId('tab-cargo').click();
  await shot(page, 'cargo');

  await page.setViewportSize({ width: 932, height: 430 });
  await page.getByTestId('tab-market').click();
  await closeOpenModal(page);
  await shot(page, 'market-932');
} finally {
  await browser.close();
  if (devServer) devServer.kill();
}
