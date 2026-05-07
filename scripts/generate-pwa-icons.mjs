import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const iconDir = path.join(root, 'public', 'icons');
const sourcePath = path.join(iconDir, 'icon-source.svg');
const sourceSvg = await fs.readFile(sourcePath, 'utf8');

await fs.mkdir(iconDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<style>html,body{width:${size}px;height:${size}px;margin:0;overflow:hidden}svg{width:${size}px;height:${size}px;display:block}</style>${sourceSvg}`);
    await page.screenshot({
      path: path.join(iconDir, `icon-${size}.png`),
      clip: { x: 0, y: 0, width: size, height: size },
      omitBackground: true
    });
    await page.close();
  }
} finally {
  await browser.close();
}
