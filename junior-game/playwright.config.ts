import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:4186',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'junior-portrait-390',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } }
    },
    {
      name: 'junior-portrait-412',
      use: { ...devices['Pixel 5'], viewport: { width: 412, height: 915 } }
    },
    {
      name: 'junior-portrait-430',
      use: { ...devices['Pixel 5'], viewport: { width: 430, height: 932 } }
    },
    {
      name: 'junior-landscape',
      use: { ...devices['Desktop Chrome'], viewport: { width: 844, height: 390 } }
    }
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4186',
    url: 'http://127.0.0.1:4186',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
