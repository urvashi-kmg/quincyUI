import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../../../../tests/mocks/server';
import { fetchDashboardSummary } from './dashboardService';

describe('fetchDashboardSummary', () => {
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
