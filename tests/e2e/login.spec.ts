import { test, expect } from '@playwright/test';

const defaultLoginOffConfig = {
  apiBaseUrl: '',
  apiRegisterUrl: '',
  apiXKey: 'e2e-key',
  autoLoginUrl: 'https://sso.example.com/auto-login',
  notepadListTempBaseUrl: '',
  notepadListTempApiKey: '',
  smartyKey: '',
  smartyEndpoint: '',
  defaultLogin: false,
  defaultUserId: '',
  defaultPassword: '',
};

/**
 * Critical-journey E2E only, per .claude/rules/testing.md. Network is mocked
 * at the route level so this never depends on a live backend.
 */
test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/config.json', (route) => route.fulfill({ json: defaultLoginOffConfig }));
  });

  test('redirects an unauthenticated visitor from / to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('logs in with valid credentials and lands on the dashboard', async ({ page }) => {
    await page.route('**/auth/login', (route) =>
      route.fulfill({ json: { accessToken: 'e2e-token', refreshToken: 'e2e-refresh' } }),
    );
    await page.route('**/GetUserVmByUserName*', (route) =>
      route.fulfill({ json: { userId: 'jane', displayName: 'Jane Doe', permissions: [] } }),
    );
    await page.route('**/dashboard/summary', (route) =>
      route.fulfill({
        json: { openQuotes: 0, activePolicies: 0, pendingRenewals: 0, premiumWrittenCents: 0, premiumTrend: [] },
      }),
    );

    await page.goto('/login');
    await page.getByLabel('User ID').fill('jane');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('shows an error banner for invalid credentials and stays on /login', async ({ page }) => {
    await page.route('**/auth/login', (route) =>
      route.fulfill({ status: 400, json: { message: 'Invalid user ID or password.' } }),
    );

    await page.goto('/login');
    await page.getByLabel('User ID').fill('jane');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid user ID or password.');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('auto-login exchanges the key and lands on the dashboard', async ({ page }) => {
    // getUsernameFromJwt() (src/auth/utils/jwt.ts) decodes the access token's
    // own claims to resolve who signed in — the mock token needs a real
    // base64url-ish payload, not an opaque string.
    const jwtPayload = Buffer.from(JSON.stringify({ preferred_username: 'jane' })).toString('base64');
    const ssoAccessToken = `e2e-header.${jwtPayload}.e2e-signature`;

    await page.route('https://sso.example.com/auto-login', (route) =>
      route.fulfill({ json: { accessToken: ssoAccessToken, refreshToken: 'e2e-sso-refresh' } }),
    );
    await page.route('**/GetUserVmByUserName*', (route) =>
      route.fulfill({ json: { userId: 'jane', displayName: 'Jane Doe', permissions: [] } }),
    );
    await page.route('**/dashboard/summary', (route) =>
      route.fulfill({
        json: { openQuotes: 0, activePolicies: 0, pendingRenewals: 0, premiumWrittenCents: 0, premiumTrend: [] },
      }),
    );

    await page.goto('/autoLogin?key=demo-key');

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('auto-login shows an error and a working link back to /login', async ({ page }) => {
    await page.goto('/autoLogin');

    await expect(page.getByRole('alert')).toContainText(/missing or empty authentication key/i);
    await page.getByRole('link', { name: 'Go to Login' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
