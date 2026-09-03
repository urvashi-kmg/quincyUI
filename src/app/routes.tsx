import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { PageLayout } from '@components/layout/PageLayout';
import { RequireAuth } from '@features/auth';

// Route-level code splitting: every feature page is its own chunk.
// Keep this file free of direct feature imports beyond lazy() calls so
// the router itself never pulls feature code into the main bundle.
const LoginPage = lazy(() => import('@features/auth/components/LoginPage'));
const QuotePage = lazy(() => import('@features/quotes/pages/QuotePage'));
const QuoteReviewPage = lazy(() => import('@features/quotes/pages/QuoteReviewPage'));
const PolicyListPage = lazy(() => import('@features/policies/pages/PolicyListPage'));
const PolicyDetailPage = lazy(() => import('@features/policies/pages/PolicyDetailPage'));
const ClaimsListPage = lazy(() => import('@features/claims/pages/ClaimsListPage'));
const NotFoundPage = lazy(() => import('@components/layout/NotFoundPage'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <PageLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/quotes" replace />} />
        <Route path="/quotes" element={<QuotePage />} />
        <Route path="/quotes/:quoteId/review" element={<QuoteReviewPage />} />
        <Route path="/policies" element={<PolicyListPage />} />
        <Route path="/policies/:policyId" element={<PolicyDetailPage />} />
        <Route path="/claims" element={<ClaimsListPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
