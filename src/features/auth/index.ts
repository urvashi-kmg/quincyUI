// Public API of the auth feature. Everything else in this folder is
// implementation detail — other features/app code must import from here,
// never from '@features/auth/stores/authSlice' etc directly
// (enforced by the ESLint `no-restricted-imports` rule).
export { useAuth } from './hooks/useAuth';
export { RequireAuth } from './components/RequireAuth';
export { authReducer, restoreSession, sessionExpired } from './stores/authSlice';
export type { User, Credentials, AuthState } from './types';
