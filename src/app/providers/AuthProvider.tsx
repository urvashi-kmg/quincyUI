import { createContext, useContext, useEffect, type ReactNode } from 'react';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { restoreSession, useAuth as useAuthStore } from '@features/auth';

// Thin context wrapper around the auth feature's Redux slice so consumers
// outside the feature depend on this stable provider API, not on Redux
// selectors directly. Keeps `features/auth` swappable in isolation.
interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitializing } = useAuthStore();

  // On first mount, check for an existing session token and resolve who the
  // user is (or that there isn't one). Until this settles, `isInitializing`
  // stays true and RequireAuth shows a loader instead of bouncing straight
  // to /login — this is the dispatch that was missing before, which left
  // isInitializing stuck at true forever.
  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
