import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { WrittenPremiumByLobChart } from './WrittenPremiumByLobChart';

describe('WrittenPremiumByLobChart', () => {
  it('exposes the current/prior/change data as an accessible table', () => {
    render(<WrittenPremiumByLobChart />);
    const table = screen.getByRole('table', { name: /written premium by line of business/i });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Dwelling Fire' })).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<WrittenPremiumByLobChart />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
