import { test, expect } from '@playwright/test';

const summary = {
  openQuotes: 12,
  activePolicies: 348,
  pendingRenewals: 9,
  premiumWrittenCents: 48_250_000,
  premiumTrend: [
    { month: '2026-01', premiumCents: 3_120_000, policyCount: 240 },
    { month: '2026-02', premiumCents: 3_480_000, policyCount: 258 },
  ],
};

/**
 * Critical-journey E2E only, per .claude/rules/testing.md. Network is mocked at
 * the route level so this never depends on a live backend.
 */
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/dashboard/summary', (route) => route.fulfill({ json: summary }));
    await page.route('**/auth/refresh', (route) =>
      route.fulfill({
        json: {
          accessToken: 'e2e-token',
          user: {
            id: 'u-1',
            displayName: 'Test User',
            email: 'test.user@example.com',
            permissions: ['quotes:read', 'policies:read'],
          },
        },
      }),
    );
  });

  test('shows the summary cards after loading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Open quotes')).toBeVisible();
    await expect(page.getByText('$482,500.00')).toBeVisible();
  });

  test('exposes the premium chart data as an accessible table', async ({ page }) => {
    await page.goto('/');

    const table = page.getByRole('table', { name: /premium written by month/i });
    await expect(table).toBeAttached();
    await expect(table.getByRole('rowheader', { name: 'Jan' })).toBeAttached();
  });

  test('navigates to the Quotes route from the primary nav', async ({ page }) => {
    await page.route('**/quotes*', (route) =>
      route.fulfill({ json: { items: [], total: 0, page: 1, pageSize: 25 } }),
    );

    await page.goto('/');
    await page.getByRole('link', { name: 'Quotes' }).click();

    await expect(page).toHaveURL(/\/quotes$/);
    await expect(page.getByRole('heading', { name: 'Quotes' })).toBeVisible();
  });

  test('surfaces an error state when the summary request fails', async ({ page }) => {
    await page.route('**/dashboard/summary', (route) =>
      route.fulfill({ status: 500, json: { message: 'Internal error' } }),
    );

    await page.goto('/');
    await expect(page.getByRole('alert')).toContainText(/couldn't load the dashboard/i);
  });
});
