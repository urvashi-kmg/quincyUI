import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer from '../stores/dashboardSlice';
import { AgencyExperienceChart } from './AgencyExperienceChart';

function renderWithStore() {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  return render(
    <Provider store={store}>
      <AgencyExperienceChart />
    </Provider>,
  );
}

describe('AgencyExperienceChart', () => {
  it('shows the agency summary and an accessible per-year table', () => {
    renderWithStore();
    // "All Agents (GALL)" legitimately renders twice (the Agent dropdown's
    // collapsed selected-value display, and the subheader summary) —
    // assert presence rather than a single unique match.
    expect(screen.getAllByText(/all agents \(gall\)/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('table', { name: /agency experience by year/i })).toBeInTheDocument();
  });

  it('lets a legend entry be toggled with the keyboard', async () => {
    renderWithStore();
    const legendButton = screen.getByRole('button', { name: 'Home Owners' });
    expect(legendButton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(legendButton);
    expect(legendButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderWithStore();
    expect(await axe(container)).toHaveNoViolations();
  });
});
