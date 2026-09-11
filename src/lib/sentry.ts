import * as Sentry from '@sentry/react';

/**
 * Sentry init, scrubbed of PII per .claude/rules/security.md. Call once from
 * src/main.tsx before the app renders.
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // no-op locally unless a DSN is configured

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_APP_ENV ?? 'development',
    tracesSampleRate: import.meta.env.VITE_APP_ENV === 'production' ? 0.2 : 1.0,
    beforeSend(event) {
      // Strip anything that could carry policyholder PII before it leaves the browser.
      delete event.request?.cookies;
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
      }
      return event;
    },
  });
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
