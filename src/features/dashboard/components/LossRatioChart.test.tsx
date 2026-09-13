import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer, { setSelectedLOB } from '../stores/dashboardSlice';
import { LossRatioChart } from './LossRatioChart';

function renderWithStore() {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  render(
    <Provider store={store}>
      <LossRatioChart />
    </Provider>,
  );
  return store;
}

describe('LossRatioChart', () => {
  it('shows the all-LOB trend table by default', () => {
    renderWithStore();
    expect(screen.getByRole('table', { name: /loss ratio detail/i })).toBeInTheDocument();
    expect(screen.getByText(/click a point on the chart/i)).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Provider store={configureStore({ reducer: { dashboard: dashboardReducer } })}>
        <LossRatioChart />
      </Provider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LossRatioChart drill-down', () => {
  it('renders the per-LOB breakdown once a LOB is selected in the store', () => {
    const store = configureStore({ reducer: { dashboard: dashboardReducer } });
    store.dispatch(setSelectedLOB('Home Owners'));
    render(
      <Provider store={store}>
        <LossRatioChart />
      </Provider>,
    );
    expect(screen.getAllByText('Home Owners').length).toBeGreaterThan(0);
    expect(screen.getByRole('table', { name: /loss ratio detail/i })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Home Owners' })).toBeInTheDocument();
  });
});
