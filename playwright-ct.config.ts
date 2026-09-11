import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'node:path';

// Component-testing layer (Playwright CT), distinct from Vitest unit tests
// and from the E2E layer above. Use this for interaction-heavy components
// (forms, grids, popups) that benefit from a real browser + real DOM.
export default defineConfig({
  testDir: './tests/ct',
  snapshotDir: './tests/ct/__snapshots__',
  timeout: 10_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'playwright-ct-report', open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    ctViteConfig: {
      resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
