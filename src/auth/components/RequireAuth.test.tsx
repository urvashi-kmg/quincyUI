import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import authReducer from '../stores/authSlice';
import type { AuthenticatedUser } from '../services/authService';
import { RequireAuth } from './RequireAuth';

const user: AuthenticatedUser = { id: 'u-1', displayName: 'Jane Doe', email: 'jane@example.com', permissions: [] };

function renderWithAuthState(authUser: AuthenticatedUser | null) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: authUser, status: 'idle' as const, error: null } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <div>Protected content</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('RequireAuth', () => {
  it('redirects to /login when there is no authenticated user', () => {
    renderWithAuthState(null);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders its children when a user is authenticated', () => {
    renderWithAuthState(user);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
