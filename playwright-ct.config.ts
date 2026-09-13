import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Component-testing layer (Playwright CT), distinct from Vitest unit tests
// and from the E2E layer above. Use this for interaction-heavy components
// (forms, grids, popups) that benefit from a real browser + real DOM.
export default defineConfig({
  testDir: './tests/ct',
  // Playwright's default testMatch only picks up *.spec/*.test files, but
  // this repo's CT convention is *.ct.tsx (see .claude/rules/testing.md) —
  // without this, CT specs are silently never discovered ("No tests found").
  testMatch: /.*\.ct\.tsx?$/,
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
