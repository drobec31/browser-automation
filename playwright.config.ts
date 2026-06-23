import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  webServer: {
    command: 'npx serve form-site -l 3000 --no-clipboard',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
  use: {
    channel: 'chrome',
    baseURL: 'http://localhost:3000',
    headless: false,
    slowMo: 600,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
