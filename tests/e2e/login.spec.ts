import { test, expect } from '@playwright/test';

// E2E mocking pattern: route-level interception via page.route rather than
// MSW (MSW is used in the unit/CT layers; Playwright's own router is
// simpler for full page-navigation E2E flows and needs no extra runtime).
test.describe('login', () => {
  test('redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs in and lands on the quotes page', async ({ page }) => {
    await page.route('**/POC13/QuincyGateway/auth/login', async (route) => {
      await route.fulfill({
        json: {
          token: 'test-token',
          user: { id: 'u1', name: 'Test User', email: 'test@quincy.dev', roles: ['agent'] },
        },
      });
    });
    await page.route('**/POC13/QuincyGateway/quotes', async (route) => {
      await route.fulfill({ path: 'tests/e2e/fixtures/quotes.json' });
    });

    await page.goto('/login');
    await page.getByLabel('Email').fill('test@quincy.dev');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL(/\/quotes/);
    await expect(page.getByText('Q-100234')).toBeVisible();
  });
});
