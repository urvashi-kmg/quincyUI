import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@components/ui/Button';

describe('Button', () => {
  it('renders children and handles click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables interaction while loading', () => {
    render(
      <Button isLoading onClick={vi.fn()}>
        Submitting
      </Button>,
    );

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });
});
