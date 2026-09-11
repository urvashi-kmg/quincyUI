import { describe, expect, it } from 'vitest';
import reducer, { loadDashboardSummary, resetDashboard } from './dashboardSlice';
import type { DashboardSummary } from '../services/dashboardService';

const summary: DashboardSummary = {
  openQuotes: 4,
  activePolicies: 120,
  pendingRenewals: 6,
  premiumWrittenCents: 1_250_000,
  premiumTrend: [{ month: '2026-01', premiumCents: 1_250_000, policyCount: 120 }],
};

describe('dashboardSlice', () => {
  it('starts idle', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ data: null, status: 'idle', error: null });
  });

  it('sets status to loading on pending', () => {
    const state = reducer(undefined, loadDashboardSummary.pending('req1', undefined));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores the summary on fulfilled', () => {
    const state = reducer(undefined, loadDashboardSummary.fulfilled(summary, 'req1', undefined));
    expect(state.status).toBe('succeeded');
    expect(state.data).toEqual(summary);
  });

  it('captures an error message on rejected', () => {
    const pendingState = reducer(undefined, loadDashboardSummary.pending('req1', undefined));
    const state = reducer(
      pendingState,
      loadDashboardSummary.rejected(new Error('network down'), 'req1', undefined),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('network down');
  });

  it('clears a previous error when a new request starts', () => {
    const failed = reducer(
      undefined,
      loadDashboardSummary.rejected(new Error('network down'), 'req1', undefined),
    );
    const reloading = reducer(failed, loadDashboardSummary.pending('req2', undefined));
    expect(reloading.error).toBeNull();
  });

  it('resets to idle', () => {
    const loaded = reducer(undefined, loadDashboardSummary.fulfilled(summary, 'req1', undefined));
    expect(reducer(loaded, resetDashboard())).toEqual({
      data: null,
      status: 'idle',
      error: null,
    });
  });
});
