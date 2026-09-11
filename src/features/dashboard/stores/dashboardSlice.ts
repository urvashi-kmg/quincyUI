import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncState } from '@/types';
import { fetchDashboardSummary, type DashboardSummary } from '../services/dashboardService';

type DashboardState = AsyncState<DashboardSummary>;

const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

export const loadDashboardSummary = createAsyncThunk(
  'dashboard/loadSummary',
  async () => fetchDashboardSummary(),
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset(state) {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        loadDashboardSummary.fulfilled,
        (state, action: PayloadAction<DashboardSummary>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        },
      )
      .addCase(loadDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load dashboard summary';
      });
  },
});

export const { reset: resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
