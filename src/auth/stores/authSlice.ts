import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncStatus } from '@/types';
import { getConfig } from '@/lib/config';
import { setAuthHeader, clearAuthHeader } from '@/lib/axiosClient';
import { getErrorMessage } from '@/utils/errorMessages';
import { tokenStorage } from '../utils/tokenStorage';
import { getUsernameFromJwt } from '../utils/jwt';
import { hasPermission, type Permission } from '../utils/permissions';
import {
  login,
  autoLogin,
  fetchUserInfo,
  logout as logoutRequest,
  type AuthenticatedUser,
  type UserInfoResponse,
} from '../services/authService';

interface AuthState {
  user: AuthenticatedUser | null;
  status: AsyncStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const KNOWN_PERMISSIONS: readonly Permission[] = [
  'quotes:read',
  'quotes:write',
  'policies:read',
  'policies:write',
  'endorsements:write',
  'settings:manage',
];

/**
 * Maps the backend's free-form permission strings onto our closed
 * `Permission` union, silently dropping anything unrecognized rather than
 * widening the type — an unrecognized permission is treated as "not
 * granted" (the safe default), not a crash.
 */
function toAuthenticatedUser(fallbackId: string, info: UserInfoResponse): AuthenticatedUser {
  const permissions = (info.permissions ?? []).filter((candidate): candidate is Permission =>
    hasPermission(KNOWN_PERMISSIONS, candidate as Permission),
  );
  return {
    id: info.userId || fallbackId,
    displayName: info.displayName || fallbackId,
    email: info.email ?? '',
    permissions,
  };
}

function toRejectionMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return getErrorMessage(err).message;
  return fallback;
}

/**
 * Credential (user id + password) login. On success, stores tokens
 * in-memory (see docs/adr/0002-access-token-in-memory-only.md), sets the
 * Bearer header, and fetches the user's profile/permissions.
 */
export const loginAsync = createAsyncThunk<
  AuthenticatedUser,
  { userId: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ userId, password }, { rejectWithValue }) => {
  try {
    const tokens = await login(userId, password);
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, userId);
    setAuthHeader(tokens.accessToken);
    const info = await fetchUserInfo(userId);
    return toAuthenticatedUser(userId, info);
  } catch (err) {
    return rejectWithValue(toRejectionMessage(err, 'Login failed.'));
  }
});

/**
 * SSO auto-login: exchanges an opaque `?key=` for a token pair, then
 * resolves the username by decoding the access token's own claims (display
 * purposes only — see auth/utils/jwt.ts) to look up the user's profile.
 */
export const autoLoginAsync = createAsyncThunk<AuthenticatedUser, string, { rejectValue: string }>(
  'auth/autoLogin',
  async (key, { rejectWithValue }) => {
    try {
      const tokens = await autoLogin(key);
      const username = getUsernameFromJwt(tokens.accessToken);
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, username ?? undefined);
      setAuthHeader(tokens.accessToken);
      if (!username) {
        throw new Error('Could not determine the signed-in user from the SSO token.');
      }
      const info = await fetchUserInfo(username);
      return toAuthenticatedUser(username, info);
    } catch (err) {
      return rejectWithValue(toRejectionMessage(err, 'Authentication failed. Please try again.'));
    }
  },
);

/**
 * Bootstrap thunk, dispatched once at app startup (see src/main.tsx) after
 * loadConfig()/initApiClient() resolve. Because tokens are in-memory only,
 * there is never a session to restore on a fresh load — the only way to
 * start already-authenticated is the `defaultLogin` config flag (POC/demo
 * use only; forced off in production by config.ts). Any other case resolves
 * to unauthenticated so the router sends the user to /login.
 */
export const initializeAuthAsync = createAsyncThunk<AuthenticatedUser | null, void>(
  'auth/initialize',
  async () => {
    const { defaultLogin, defaultUserId, defaultPassword } = getConfig();
    if (!defaultLogin || !defaultUserId || !defaultPassword) return null;

    try {
      const tokens = await login(defaultUserId, defaultPassword);
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, defaultUserId);
      setAuthHeader(tokens.accessToken);
      const info = await fetchUserInfo(defaultUserId);
      return toAuthenticatedUser(defaultUserId, info);
    } catch (err) {
      // Default login is a best-effort convenience, not a real error state —
      // any failure just falls through to the login page, same as source.
      console.error('[Quincy] Default login failed:', err);
      return null;
    }
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await logoutRequest();
  tokenStorage.clearTokens();
  clearAuthHeader();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed.';
      });

    builder
      .addCase(autoLoginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(autoLoginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(autoLoginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Authentication failed.';
      });

    builder
      .addCase(initializeAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(initializeAuthAsync.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
      });

    builder.addCase(signOut.fulfilled, (state) => {
      state.status = 'idle';
      state.user = null;
      state.error = null;
    });
  },
});

export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => state.auth.user !== null;

export default authSlice.reducer;
