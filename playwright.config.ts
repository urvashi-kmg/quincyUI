import { defineConfig, devices } from '@playwright/test';

// E2E layer. Talks to the app through msw-mocked network boundaries
// (see tests/mocks) rather than a live backend, per docs/prompts testing policy.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['monocart-reporter', { outputFile: './coverage/e2e-report/index.html' }],
  ],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    // Builds in the 'e2e' mode (skips tsc — already covered by the separate
    // typecheck CI job) so import.meta.env.MODE === 'e2e' is baked into the
    // bundle, gating the test-only session seed in main.tsx/e2eTestSession.ts.
    command: 'npx vite build --mode e2e && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
