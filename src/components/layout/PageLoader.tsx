import { Loader2 } from 'lucide-react';

// Suspense fallback shown while a lazy route chunk loads.
export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-brand-700" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
