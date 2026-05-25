import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    /* 
       Base URL to use in actions like `await page.goto('/')`.
       If running in GitHub Actions with Vercel Deployment Trigger, it uses VERCEL_URL via Github event target_url.
       Otherwise it falls back to VERCEL_PROJECT_PRODUCTION_URL if set, or defaults to localhost.
    */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL 
             || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://127.0.0.1:3008'),
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // We only test Chromium for GSD speed in CI. We can add others if needed.
  ],
});
