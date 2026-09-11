import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PremiumTrendChart } from './PremiumTrendChart';
import { samplePremiumTrend } from '../data/premiumTrend';

describe('PremiumTrendChart', () => {
  it('renders an empty state when there is no data', () => {
    render(<PremiumTrendChart data={[]} />);
    expect(screen.getByText(/no premium history/i)).toBeInTheDocument();
  });

  it('exposes the data as an accessible table alongside the chart', () => {
    render(<PremiumTrendChart data={samplePremiumTrend} />);

    const table = screen.getByRole('table', { name: /premium written by month/i });
    expect(table).toBeInTheDocument();

    // One row per data point, plus the header row.
    expect(screen.getAllByRole('row')).toHaveLength(samplePremiumTrend.length + 1);
    expect(screen.getByRole('rowheader', { name: 'Jan' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$31,200.00' })).toBeInTheDocument();
  });
});
