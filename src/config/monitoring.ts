import * as Sentry from '@sentry/react';

import { env } from './env';

// Sentry for runtime error monitoring; Playwright's built-in HTML/JUnit
// reporters (or Monocart-reporter, see playwright.config.ts) cover test
// reporting. Keeping these separate avoids conflating "production errors"
// with "test run results" in one dashboard.
export function initMonitoring(): void {
  if (!env.sentryDsn || env.environment === 'development') return;

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.environment,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: env.environment === 'production' ? 0.2 : 1.0,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
  });
}
