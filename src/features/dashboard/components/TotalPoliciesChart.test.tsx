import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer from '../stores/dashboardSlice';
import { TotalPoliciesChart } from './TotalPoliciesChart';

function renderWithStore() {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  return render(
    <Provider store={store}>
      <TotalPoliciesChart />
    </Provider>,
  );
}

describe('TotalPoliciesChart', () => {
  it('exposes the segment data as an accessible table alongside the chart', () => {
    renderWithStore();
    const table = screen.getByRole('table', { name: /total policies by line of business/i });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Home Owners' })).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderWithStore();
    expect(await axe(container)).toHaveNoViolations();
  });
});
