import type { PropsWithChildren, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '../stores/authSlice';

/**
 * Route guard: redirects to /login when not authenticated. This is a UX
 * affordance only, same as RequirePermission — the backend gateway is the
 * real boundary (`.claude/rules/security.md`).
 */
export function RequireAuth({ children }: PropsWithChildren): ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
