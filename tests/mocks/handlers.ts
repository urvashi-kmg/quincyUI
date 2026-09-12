import { http, HttpResponse } from 'msw';

/**
 * Shared MSW handlers used by Vitest component tests and (as a reference for)
 * Playwright route mocks — see .claude/rules/testing.md: "network is mocked via
 * MSW or Playwright route interception — never hits a live backend".
 *
 * Keep these shapes in sync with the service-layer types. If an API contract
 * changes, update the service, the slice, these handlers, and the tests in the
 * same change.
 */
const premiumTrend = [
  { month: '2026-01', premiumCents: 3_120_000, policyCount: 240 },
  { month: '2026-02', premiumCents: 3_480_000, policyCount: 258 },
  { month: '2026-03', premiumCents: 3_310_000, policyCount: 251 },
  { month: '2026-04', premiumCents: 4_020_000, policyCount: 289 },
  { month: '2026-05', premiumCents: 4_460_000, policyCount: 312 },
  { month: '2026-06', premiumCents: 4_280_000, policyCount: 305 },
];

export const handlers = [
  http.post('*/auth/refresh', () =>
    HttpResponse.json({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    }),
  ),

  http.post('*/auth/logout', () => new HttpResponse(null, { status: 204 })),

  http.get('*/dashboard/summary', () =>
    HttpResponse.json({
      openQuotes: 12,
      activePolicies: 348,
      pendingRenewals: 9,
      premiumWrittenCents: 48_250_000,
      premiumTrend,
    }),
  ),

  http.get('*/quotes', () =>
    HttpResponse.json({
      items: [
        {
          id: 'q-1001',
          applicantName: 'Jordan Lee',
          premiumCents: 128500,
          status: 'submitted',
          createdAt: '2026-08-04',
        },
        {
          id: 'q-1002',
          applicantName: 'Casey Morgan',
          premiumCents: 96000,
          status: 'draft',
          createdAt: '2026-08-11',
        },
      ],
      total: 2,
      page: 1,
      pageSize: 25,
    }),
  ),
];
