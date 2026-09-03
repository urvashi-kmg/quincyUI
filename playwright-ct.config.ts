import { defineConfig, devices } from '@playwright/experimental-ct-react';
import { resolve } from 'node:path';

// Component-test config: mounts individual React components in a real
// browser via Playwright CT, separate from the full-app E2E suite above.
export default defineConfig({
  testDir: './tests/ct',
  snapshotDir: './tests/ct/__snapshots__',
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['junit', { outputFile: 'test-results/ct-junit.xml' }]] : 'html',
  use: {
    trace: 'on-first-retry',
    ctViteConfig: {
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
          '@components': resolve(__dirname, './src/components'),
        },
      },
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
