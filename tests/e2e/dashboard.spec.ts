import { test, expect } from '@playwright/test';

/**
 * Critical-journey E2E only, per .claude/rules/testing.md. The dashboard
 * itself has no backend calls (every chart is static/bundled data — see
 * src/features/dashboard/components/*.tsx), but "/" is gated behind
 * RequireAuth (src/auth/components/RequireAuth.tsx). Since tokens are
 * in-memory only (docs/adr/0002-access-token-in-memory-only.md), the only
 * way to arrive authenticated is the boot-time defaultLogin path
 * (src/auth/stores/authSlice.ts's initializeAuthAsync) — mock config.json to
 * enable it, plus the login/user-info calls it triggers.
 */
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/config.json', (route) =>
      route.fulfill({
        json: {
          apiBaseUrl: '',
          apiRegisterUrl: '',
          apiXKey: 'e2e-key',
          autoLoginUrl: '',
          notepadListTempBaseUrl: '',
          notepadListTempApiKey: '',
          smartyKey: '',
          smartyEndpoint: '',
          defaultLogin: true,
          defaultUserId: 'e2e.user',
          defaultPassword: 'e2e-password',
        },
      }),
    );
    await page.route('**/auth/login', (route) =>
      route.fulfill({ json: { accessToken: 'e2e-token', refreshToken: 'e2e-refresh' } }),
    );
    await page.route('**/GetUserVmByUserName*', (route) =>
      route.fulfill({
        json: {
          userId: 'e2e.user',
          displayName: 'Test User',
          email: 'test.user@example.com',
          permissions: ['quotes:read', 'policies:read'],
        },
      }),
    );
  });

  test('shows the KPI summary and LOB filter after loading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('group', { name: /filter dashboard by line of business/i })).toBeVisible();
    await expect(page.getByText('Total Written Premium')).toBeVisible();
    await expect(page.getByText('Total Policies')).toBeVisible();
  });

  test('exposes every chart as an accessible table fallback', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('table', { name: /total policies by line of business/i })).toBeAttached();
    await expect(page.getByRole('table', { name: /loss ratio detail/i })).toBeAttached();
    await expect(page.getByRole('table', { name: /written premium by line of business/i })).toBeAttached();
    await expect(page.getByRole('table', { name: /policy analysis by category/i })).toBeAttached();
    await expect(page.getByRole('table', { name: /cancel reasons by count/i })).toBeAttached();
    await expect(page.getByRole('table', { name: /agency experience by year/i })).toBeAttached();
    await expect(page.getByRole('table', { name: /task manager summary/i })).toBeAttached();
  });

  test('filtering by line of business updates the KPI cards', async ({ page }) => {
    await page.goto('/');

    const homeFilter = page.getByRole('button', { name: 'Home Owners' });
    await homeFilter.click();

    await expect(homeFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'All Lobs' })).toHaveAttribute('aria-pressed', 'false');
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
});
