import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { SentryErrorBoundary } from '@/lib/sentry';

/**
 * Composition root: Redux + error boundary. Add new cross-cutting providers
 * here (never inside a feature or a presentational component).
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SentryErrorBoundary fallback={<ErrorFallback />}>
      <Provider store={store}>{children}</Provider>
    </SentryErrorBoundary>
  );
}

function ErrorFallback() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-heading-1 font-semibold">Something went wrong</h1>
      <p className="text-small text-ink-secondary">
        The error has been reported. Try reloading the page.
      </p>
    </div>
  );
}
