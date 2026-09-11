import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label and responds to a click', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save changes</Button>);

    const button = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled and non-interactive while loading', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
