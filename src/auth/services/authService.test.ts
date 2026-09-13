import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../tests/mocks/server';
import { setAuthHeader, clearAuthHeader } from '@/lib/axiosClient';
import { loadConfig } from '@/lib/config';
import { login, autoLogin, fetchUserInfo } from './authService';

describe('login', () => {
  it('returns the token pair on success', async () => {
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json({ accessToken: 'access-1', refreshToken: 'refresh-1' }),
      ),
    );

    const tokens = await login('jane', 'password123');
    expect(tokens).toEqual({ accessToken: 'access-1', refreshToken: 'refresh-1' });
  });

  it('throws when the response has no access token', async () => {
    server.use(http.post('*/auth/login', () => HttpResponse.json({ refreshToken: 'refresh-1' })));
    await expect(login('jane', 'password123')).rejects.toThrow(/no access token/i);
  });
});

describe('autoLogin', () => {
  it('throws when autoLoginUrl is not configured', async () => {
    // Explicit empty string, not `{}` — `??` only falls through on
    // null/undefined, and this machine's own .env.local sets a real
    // VITE_AUTO_LOGIN_URL fallback that `{}` would otherwise pick up.
    server.use(http.get('*/config.json', () => HttpResponse.json({ autoLoginUrl: '' })));
    await loadConfig();

    await expect(autoLogin('some-key')).rejects.toThrow(/not configured/i);
  });

  it('posts the key to the configured autoLoginUrl and returns the token pair', async () => {
    server.use(
      http.get('*/config.json', () => HttpResponse.json({ autoLoginUrl: 'https://sso.example.com/auto-login' })),
      http.post('https://sso.example.com/auto-login', () =>
        HttpResponse.json({ accessToken: 'access-2', refreshToken: 'refresh-2' }),
      ),
    );
    await loadConfig();

    const tokens = await autoLogin('opaque-key');
    expect(tokens).toEqual({ accessToken: 'access-2', refreshToken: 'refresh-2' });
  });
});

describe('fetchUserInfo', () => {
  // Unlike /auth/login, this isn't an auth-exempt endpoint — apiClient rejects
  // it outright with no prior Authorization header (see src/lib/axiosClient.ts).
  beforeEach(() => setAuthHeader('test-access-token'));
  afterEach(() => clearAuthHeader());

  it('returns the raw user info response', async () => {
    server.use(
      http.get('*/GetUserVmByUserName*', () =>
        HttpResponse.json({ userId: 'jane', displayName: 'Jane Doe', email: 'jane@example.com', permissions: ['quotes:read'] }),
      ),
    );

    const info = await fetchUserInfo('jane');
    expect(info).toEqual({
      userId: 'jane',
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      permissions: ['quotes:read'],
    });
  });
});
