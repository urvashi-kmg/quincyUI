import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popup } from './Popup';

describe('Popup', () => {
  it('renders nothing when closed', () => {
    render(
      <Popup isOpen={false} onClose={vi.fn()} title="Confirm">
        body
      </Popup>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Popup isOpen onClose={onClose} title="Confirm">
        body
      </Popup>,
    );

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Popup isOpen onClose={onClose} title="Confirm">
        body
      </Popup>,
    );

    await userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
