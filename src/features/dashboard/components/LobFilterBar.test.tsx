import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer, { selectDashboardLob } from '../stores/dashboardSlice';
import { LobFilterBar } from './LobFilterBar';

function renderWithStore() {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  render(
    <Provider store={store}>
      <LobFilterBar />
    </Provider>,
  );
  return store;
}

describe('LobFilterBar', () => {
  it('marks the active LOB pill as pressed', () => {
    renderWithStore();
    expect(screen.getByRole('button', { name: 'All Lobs' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Home Owners' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('dispatches setLob when a pill is clicked', async () => {
    const store = renderWithStore();
    await userEvent.click(screen.getByRole('button', { name: 'Home Owners' }));
    expect(selectDashboardLob(store.getState() as never)).toBe('home');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Provider store={configureStore({ reducer: { dashboard: dashboardReducer } })}>
        <LobFilterBar />
      </Provider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
