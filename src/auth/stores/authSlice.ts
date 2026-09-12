import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncStatus } from '@/types';
import { tokenStorage } from '../utils/tokenStorage';
import { clearAuthHeader } from '@/lib/axiosClient';
import { logout as logoutRequest, type AuthenticatedUser } from '../services/authService';

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
    builder.addCase(signOut.fulfilled, (state) => {
      state.status = 'idle';
      state.user = null;
      state.error = null;
    });
  },
});

export default authSlice.reducer;
