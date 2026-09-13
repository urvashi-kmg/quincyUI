import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import dashboardReducer from '../stores/dashboardSlice';
import DashboardPage from './DashboardPage';

function renderPage() {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  return render(
    <Provider store={store}>
      <DashboardPage />
    </Provider>,
  );
}

describe('DashboardPage', () => {
  it('renders every dashboard section', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /filter dashboard by line of business/i })).toBeInTheDocument();
    expect(screen.getByText('Total Written Premium')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /total policies by line of business/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /loss ratio detail/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /written premium by line of business/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /policy analysis by category/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /cancel reasons by count/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /agency experience by year/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /task manager summary/i })).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderPage();
    expect(await axe(container)).toHaveNoViolations();
  });
});
