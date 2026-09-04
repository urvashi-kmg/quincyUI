import { useEffect, type ReactNode } from 'react';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { restoreSession, sessionExpired } from '@features/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  // On first mount, check for an existing session token and resolve who the
  // user is (or that there isn't one). Until this settles, `isInitializing`
  // stays true and RequireAuth shows a loader instead of bouncing straight
  // to /login.
  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);

  // apiClient's response interceptor dispatches this window event on a 401
  // (token expired/revoked mid-session) — clear auth state so RequireAuth
  // redirects to /login instead of leaving the app stuck on a dead token.
  useEffect(() => {
    const handleUnauthorized = () => dispatch(sessionExpired());
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch]);

  return <>{children}</>;
}
