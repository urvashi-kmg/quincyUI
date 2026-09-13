import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { server } from '../../../tests/mocks/server';
import { clearAuthHeader } from '@/lib/axiosClient';
import { loadConfig } from '@/lib/config';
import { tokenStorage } from '../utils/tokenStorage';
import reducer, { loginAsync, autoLoginAsync, initializeAuthAsync, signOut, selectIsAuthenticated } from './authSlice';

function makeStore() {
  return configureStore({ reducer: { auth: reducer } });
}

afterEach(() => {
  tokenStorage.clearTokens();
  clearAuthHeader();
});

describe('loginAsync', () => {
  it('populates the user on success', async () => {
    server.use(
      http.post('*/auth/login', () => HttpResponse.json({ accessToken: 'tok-1', refreshToken: 'ref-1' })),
      http.get('*/GetUserVmByUserName*', () =>
        HttpResponse.json({ userId: 'jane', displayName: 'Jane Doe', email: 'jane@example.com', permissions: ['quotes:read'] }),
      ),
    );

    const store = makeStore();
    await store.dispatch(loginAsync({ userId: 'jane', password: 'password123' }));

    const state = store.getState().auth;
    expect(state.status).toBe('succeeded');
    expect(state.user).toEqual({
      id: 'jane',
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      permissions: ['quotes:read'],
    });
    expect(selectIsAuthenticated({ auth: state })).toBe(true);
    expect(tokenStorage.getAccessToken()).toBe('tok-1');
  });

  it('drops permission strings the app does not recognize, rather than throwing', async () => {
    server.use(
      http.post('*/auth/login', () => HttpResponse.json({ accessToken: 'tok-1', refreshToken: 'ref-1' })),
      http.get('*/GetUserVmByUserName*', () =>
        HttpResponse.json({ userId: 'jane', permissions: ['quotes:read', 'some:unknown-permission'] }),
      ),
    );

    const store = makeStore();
    await store.dispatch(loginAsync({ userId: 'jane', password: 'password123' }));

    expect(store.getState().auth.user?.permissions).toEqual(['quotes:read']);
  });

  it('records a rejected status and error message on failure, without authenticating', async () => {
    server.use(
      http.post('*/auth/login', () => HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 })),
    );

    const store = makeStore();
    await store.dispatch(loginAsync({ userId: 'jane', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid credentials');
    expect(state.user).toBeNull();
    expect(selectIsAuthenticated({ auth: state })).toBe(false);
  });
});

describe('autoLoginAsync', () => {
  it('resolves the username from the token claims and populates the user', async () => {
    const header = btoa(JSON.stringify({ alg: 'none' }));
    const body = btoa(JSON.stringify({ preferred_username: 'jane' }));
    const jwt = `${header}.${body}.sig`;

    server.use(
      http.get('*/config.json', () => HttpResponse.json({ autoLoginUrl: 'https://sso.example.com/auto-login' })),
      http.post('https://sso.example.com/auto-login', () =>
        HttpResponse.json({ accessToken: jwt, refreshToken: 'ref-1' }),
      ),
      http.get('*/GetUserVmByUserName*', () => HttpResponse.json({ userId: 'jane', displayName: 'Jane Doe' })),
    );
    await loadConfig();

    const store = makeStore();
    await store.dispatch(autoLoginAsync('some-key'));

    const state = store.getState().auth;
    expect(state.status).toBe('succeeded');
    expect(state.user?.displayName).toBe('Jane Doe');
    expect(tokenStorage.getUserName()).toBe('jane');
  });

  it('fails when the access token carries no recognizable username claim', async () => {
    const header = btoa(JSON.stringify({ alg: 'none' }));
    const body = btoa(JSON.stringify({ foo: 'bar' }));
    const jwt = `${header}.${body}.sig`;

    server.use(
      http.get('*/config.json', () => HttpResponse.json({ autoLoginUrl: 'https://sso.example.com/auto-login' })),
      http.post('https://sso.example.com/auto-login', () =>
        HttpResponse.json({ accessToken: jwt, refreshToken: 'ref-1' }),
      ),
    );
    await loadConfig();

    const store = makeStore();
    await store.dispatch(autoLoginAsync('some-key'));

    expect(store.getState().auth.status).toBe('failed');
  });
});

describe('initializeAuthAsync', () => {
  it('resolves to no user when defaultLogin is not configured', async () => {
    // Self-contained: don't rely on another test's loadConfig() call having
    // already populated getConfig() — it throws until loadConfig() resolves.
    server.use(http.get('*/config.json', () => HttpResponse.json({ defaultLogin: false })));
    await loadConfig();

    const store = makeStore();
    await store.dispatch(initializeAuthAsync());

    const state = store.getState().auth;
    expect(state.status).toBe('succeeded');
    expect(state.user).toBeNull();
  });

  it('logs in with the configured default credentials when defaultLogin is true', async () => {
    server.use(
      http.get('*/config.json', () =>
        HttpResponse.json({ defaultLogin: true, defaultUserId: 'demo', defaultPassword: 'demo-pass' }),
      ),
      http.post('*/auth/login', () => HttpResponse.json({ accessToken: 'tok-1', refreshToken: 'ref-1' })),
      http.get('*/GetUserVmByUserName*', () => HttpResponse.json({ userId: 'demo', displayName: 'Demo User' })),
    );
    await loadConfig();

    const store = makeStore();
    await store.dispatch(initializeAuthAsync());

    const state = store.getState().auth;
    expect(state.status).toBe('succeeded');
    expect(state.user?.displayName).toBe('Demo User');
  });

  it('falls back to no user (without throwing) when default login fails', async () => {
    server.use(
      http.get('*/config.json', () =>
        HttpResponse.json({ defaultLogin: true, defaultUserId: 'demo', defaultPassword: 'wrong' }),
      ),
      http.post('*/auth/login', () => HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 })),
    );
    await loadConfig();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = makeStore();
    await store.dispatch(initializeAuthAsync());

    expect(store.getState().auth.user).toBeNull();
    vi.restoreAllMocks();
  });
});

describe('signOut', () => {
  it('clears the user and tokens', async () => {
    server.use(http.post('*/auth/logout', () => new HttpResponse(null, { status: 204 })));
    tokenStorage.setTokens('tok', 'ref', 'jane');

    const store = makeStore();
    await store.dispatch(signOut());

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(tokenStorage.getAccessToken()).toBeNull();
  });
});

describe('selectIsAuthenticated', () => {
  it('is false when there is no user', () => {
    expect(selectIsAuthenticated({ auth: { user: null, status: 'idle', error: null } })).toBe(false);
  });
});
