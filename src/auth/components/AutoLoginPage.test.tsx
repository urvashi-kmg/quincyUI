import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { axe } from 'jest-axe';
import { server } from '../../../tests/mocks/server';
import { loadConfig } from '@/lib/config';
import authReducer from '../stores/authSlice';
import { AutoLoginPage } from './AutoLoginPage';

function renderAutoLoginPage(initialPath: string) {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/autoLogin" element={<AutoLoginPage />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('AutoLoginPage', () => {
  it('shows an error when the key is missing', async () => {
    renderAutoLoginPage('/autoLogin');
    expect(await screen.findByRole('alert')).toHaveTextContent(/missing or empty authentication key/i);
  });

  it('exchanges the key and navigates to / on success', async () => {
    // getUsernameFromJwt() needs a real (fake-signed) JWT shape to resolve a
    // username from its claims — see src/auth/utils/jwt.ts.
    const jwt = `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify({ preferred_username: 'jane' }))}.sig`;

    server.use(
      http.get('*/config.json', () => HttpResponse.json({ autoLoginUrl: 'https://sso.example.com/auto-login' })),
      http.post('https://sso.example.com/auto-login', () =>
        HttpResponse.json({ accessToken: jwt, refreshToken: 'ref-1' }),
      ),
      http.get('*/GetUserVmByUserName*', () => HttpResponse.json({ userId: 'jane', displayName: 'Jane Doe' })),
    );
    await loadConfig();

    renderAutoLoginPage('/autoLogin?key=abc123');

    await waitFor(() => expect(screen.getByText('Home')).toBeInTheDocument());
  });

  it('shows an error banner and a working "Go to Login" link when autoLoginUrl is not configured', async () => {
    // Explicit, rather than relying on default module state — a preceding
    // test in this file may have already called loadConfig() with a real
    // autoLoginUrl, and getConfig()'s state is shared across this file.
    server.use(http.get('*/config.json', () => HttpResponse.json({ autoLoginUrl: '' })));
    await loadConfig();

    renderAutoLoginPage('/autoLogin?key=abc123');

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /go to login/i }));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('has no detectable accessibility violations while showing the error state', async () => {
    const { container } = renderAutoLoginPage('/autoLogin');
    await screen.findByRole('alert');
    expect(await axe(container)).toHaveNoViolations();
  });
});
