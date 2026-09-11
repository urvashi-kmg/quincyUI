import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

/**
 * Every feature route is lazy-loaded for route-level code splitting — see
 * .claude/rules/performance.md. Add new feature routes the same way.
 */
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const QuotesListPage = lazy(() => import('@/features/quotes/pages/QuotesListPage'));
const PoliciesListPage = lazy(() => import('@/features/policies/pages/PoliciesListPage'));
const EndorsementsPage = lazy(() => import('@/features/endorsements/pages/EndorsementsPage'));
const RenewalsPage = lazy(() => import('@/features/renewals/pages/RenewalsPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const AiAssistantPage = lazy(() => import('@/features/ai-assistant/pages/AiAssistantPage'));

function RouteFallback() {
  return (
    <div
      role="status"
      className="flex h-full items-center justify-center p-8 text-small text-ink-secondary"
    >
      Loading…
    </div>
  );
}

function lazyRoute(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

function NotFoundPage() {
  return (
    <div>
      <h1 className="mb-2 text-heading-2 font-semibold">Page not found</h1>
      <p className="text-small text-ink-secondary">
        Check the address, or pick a section from the navigation.
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: lazyRoute(<DashboardPage />) },
      { path: 'quotes', element: lazyRoute(<QuotesListPage />) },
      { path: 'policies', element: lazyRoute(<PoliciesListPage />) },
      { path: 'endorsements', element: lazyRoute(<EndorsementsPage />) },
      { path: 'renewals', element: lazyRoute(<RenewalsPage />) },
      { path: 'assistant', element: lazyRoute(<AiAssistantPage />) },
      { path: 'settings', element: lazyRoute(<SettingsPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
