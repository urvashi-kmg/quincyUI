import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CancelReasonChart } from './CancelReasonChart';

describe('CancelReasonChart', () => {
  it('exposes cancel reasons as an accessible table', () => {
    render(<CancelReasonChart />);
    const table = screen.getByRole('table', { name: /cancel reasons by count/i });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Vehicle Sold' })).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<CancelReasonChart />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
