import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../../tests/mocks/server';
import { setAuthHeader, clearAuthHeader } from '@/lib/axiosClient';
import { fetchDashboardSummary } from './dashboardService';

describe('fetchDashboardSummary', () => {
  // apiClient rejects any non-auth request made with no Authorization header
  // (see src/lib/axiosClient.ts) — simulate an already-signed-in caller.
  beforeEach(() => setAuthHeader('test-access-token'));
  afterEach(() => clearAuthHeader());

  it('normalizes a missing premium trend to an empty array', async () => {
    server.use(
      http.get('*/dashboard/summary', () =>
        HttpResponse.json({
          openQuotes: 12,
          activePolicies: 348,
          pendingRenewals: 9,
          premiumWrittenCents: 48_250_000,
        }),
      ),
    );

    const summary = await fetchDashboardSummary();

    expect(summary.premiumTrend).toEqual([]);
  });
});
