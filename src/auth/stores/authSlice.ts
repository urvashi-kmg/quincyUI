import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncStatus } from '@/types';
import { setAccessToken, clearAccessToken } from '../services/tokenStore';
import { logout as logoutRequest, refreshSession, type AuthenticatedUser } from '../services/authService';

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

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const session = await refreshSession();
  // The token lives in memory only, never in the Redux store — keeping it out
  // of state also keeps it out of Redux devtools and any state serialization.
  setAccessToken(session.accessToken);
  return session.user;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await logoutRequest();
  clearAccessToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        // Deliberately generic: do not surface auth internals to the UI.
        state.error = 'Your session has expired. Please sign in again.';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
