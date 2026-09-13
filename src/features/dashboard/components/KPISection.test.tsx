import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer, { setLob } from '../stores/dashboardSlice';
import { KPISection } from './KPISection';

function renderWithStore(lob: Parameters<typeof setLob>[0] = 'all') {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  store.dispatch(setLob(lob));
  return render(
    <Provider store={store}>
      <KPISection />
    </Provider>,
  );
}

describe('KPISection', () => {
  it('renders all four KPI cards for the all-LOB view', () => {
    renderWithStore('all');
    expect(screen.getByText('Total Policies')).toBeInTheDocument();
    expect(screen.getByText('Total Written Premium')).toBeInTheDocument();
    expect(screen.getByText('Incurred Losses')).toBeInTheDocument();
    expect(screen.getByText('Loss Ratio')).toBeInTheDocument();
  });

  it('shows LOB-specific values when a LOB filter is active', () => {
    renderWithStore('home');
    // Home Owners has a mapped entry in every data source, so all four cards resolve.
    expect(screen.queryAllByText('—')).toHaveLength(0);
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderWithStore('all');
    expect(await axe(container)).toHaveNoViolations();
  });
});
