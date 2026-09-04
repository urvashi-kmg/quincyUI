import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { authApi } from '../services/authApi';
import type { AuthState, Credentials, User } from '../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: Credentials) => {
  const { user, token } = await authApi.login(credentials);
  sessionStorage.setItem('quincy-access-token', token);
  return user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
  sessionStorage.removeItem('quincy-access-token');
});

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  if (!sessionStorage.getItem('quincy-access-token')) return null;
  return authApi.me();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Dispatched when apiClient's response interceptor sees a 401 on an
    // already-authenticated session (token expired/revoked server-side).
    sessionExpired: (state) => {
      sessionStorage.removeItem('quincy-access-token');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitializing = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        sessionStorage.removeItem('quincy-access-token');
        state.isInitializing = false;
      });
  },
});

export const { setUser, sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;
