import { describe, expect, it } from 'vitest';
import reducer, {
  setPeriod,
  setLob,
  setCfgOpen,
  setSelectedLOB,
  selectDashboardPeriod,
  selectDashboardLob,
  selectDashboardCfgOpen,
  selectDashboardSelectedLOB,
} from './dashboardSlice';

describe('dashboardSlice', () => {
  it('starts with the default filter state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ period: 'Monthly', lob: 'all', cfgOpen: false, selectedLOB: null });
  });

  it('sets the period', () => {
    const state = reducer(undefined, setPeriod('Quarterly'));
    expect(state.period).toBe('Quarterly');
  });

  it('sets the LOB filter', () => {
    const state = reducer(undefined, setLob('home'));
    expect(state.lob).toBe('home');
  });

  it('toggles the config panel', () => {
    const state = reducer(undefined, setCfgOpen(true));
    expect(state.cfgOpen).toBe(true);
  });

  it('sets and clears the drill-down selection', () => {
    const selected = reducer(undefined, setSelectedLOB('Home Owners'));
    expect(selected.selectedLOB).toBe('Home Owners');

    const cleared = reducer(selected, setSelectedLOB(null));
    expect(cleared.selectedLOB).toBeNull();
  });
});

describe('dashboard selectors', () => {
  it('read each field off state.dashboard', () => {
    const dashboard = { period: 'Yearly' as const, lob: 'business' as const, cfgOpen: true, selectedLOB: 'x' };
    const state = { dashboard } as never;

    expect(selectDashboardPeriod(state)).toBe('Yearly');
    expect(selectDashboardLob(state)).toBe('business');
    expect(selectDashboardCfgOpen(state)).toBe(true);
    expect(selectDashboardSelectedLOB(state)).toBe('x');
  });
});
