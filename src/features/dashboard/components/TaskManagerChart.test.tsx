import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { TaskManagerChart } from './TaskManagerChart';

describe('TaskManagerChart', () => {
  it('renders the aggregate task summary as an accessible table', () => {
    render(<TaskManagerChart />);
    expect(screen.getByRole('table', { name: /task manager summary/i })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Overdue Tasks' })).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<TaskManagerChart />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
