import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import type { LobId } from '../lobConfig';

export type DashboardPeriod = 'Monthly' | 'Quarterly' | 'Yearly';

interface DashboardState {
  period: DashboardPeriod;
  lob: LobId;
  cfgOpen: boolean;
  selectedLOB: string | null;
}

const initialState: DashboardState = {
  period: 'Monthly',
  lob: 'all',
  cfgOpen: false,
  selectedLOB: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPeriod(state, action: PayloadAction<DashboardPeriod>) {
      state.period = action.payload;
    },
    setLob(state, action: PayloadAction<LobId>) {
      state.lob = action.payload;
    },
    setCfgOpen(state, action: PayloadAction<boolean>) {
      state.cfgOpen = action.payload;
    },
    setSelectedLOB(state, action: PayloadAction<string | null>) {
      state.selectedLOB = action.payload;
    },
  },
});

export const { setPeriod, setLob, setCfgOpen, setSelectedLOB } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const selectDashboardPeriod = (state: RootState) => state.dashboard.period;
export const selectDashboardLob = (state: RootState) => state.dashboard.lob;
export const selectDashboardCfgOpen = (state: RootState) => state.dashboard.cfgOpen;
export const selectDashboardSelectedLOB = (state: RootState) => state.dashboard.selectedLOB;
