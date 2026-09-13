import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import { server } from '../../../tests/mocks/server';
import authReducer from '../stores/authSlice';
import { LoginPage } from './LoginPage';

function renderLoginPage() {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );
}

describe('LoginPage', () => {
  it('shows validation errors when submitted empty', async () => {
    renderLoginPage();

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Yup's required() check reports before min() for an empty string.
    expect(await screen.findByText('User ID is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('shows the min-length error for a too-short, non-empty password', async () => {
    renderLoginPage();

    await userEvent.type(screen.getByLabelText('Password'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Password must be at least 6 characters.')).toBeInTheDocument();
  });

  it('logs in successfully and clears any error state', async () => {
    server.use(
      http.post('*/auth/login', () => HttpResponse.json({ accessToken: 'tok-1', refreshToken: 'ref-1' })),
      http.get('*/GetUserVmByUserName*', () => HttpResponse.json({ userId: 'jane', displayName: 'Jane Doe' })),
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText('User ID'), 'jane');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('shows an error banner when login fails', async () => {
    server.use(http.post('*/auth/login', () => HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 })));
    renderLoginPage();

    await userEvent.type(screen.getByLabelText('User ID'), 'jane');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('shows the session-expired banner left by axiosClient, once', () => {
    sessionStorage.setItem('_auth_logout_message', 'Your session has expired. Please log in again.');
    renderLoginPage();

    expect(screen.getByText('Your session has expired. Please log in again.')).toBeInTheDocument();
    expect(sessionStorage.getItem('_auth_logout_message')).toBeNull();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderLoginPage();
    expect(await axe(container)).toHaveNoViolations();
  });
});
