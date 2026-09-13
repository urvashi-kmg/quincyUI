import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer from '../stores/dashboardSlice';
import { PolicyAnalysisChart } from './PolicyAnalysisChart';

function renderWithStore() {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  return render(
    <Provider store={store}>
      <PolicyAnalysisChart />
    </Provider>,
  );
}

describe('PolicyAnalysisChart', () => {
  it('shows the agency name and an accessible category breakdown', () => {
    renderWithStore();
    expect(screen.getByText(/burgin platner/i)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /policy analysis by category/i })).toBeInTheDocument();
  });

  it('labels its agency-code input for assistive tech', () => {
    renderWithStore();
    expect(screen.getByLabelText(/agency code/i)).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderWithStore();
    expect(await axe(container)).toHaveNoViolations();
  });
});
