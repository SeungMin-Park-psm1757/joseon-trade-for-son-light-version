import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5174',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5 landscape'],
        viewport: { width: 844, height: 390 },
        baseURL: 'http://127.0.0.1:5174'
      }
    }
  ]
});
