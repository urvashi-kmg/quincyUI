import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AiAssistantPage from './AiAssistantPage';
import { MAX_MESSAGE_LENGTH } from '../constants';

describe('AiAssistantPage', () => {
  it('warns against including personal information', () => {
    render(<AiAssistantPage />);
    expect(screen.getByRole('note')).toHaveTextContent(/personal information/i);
  });

  it('disables Send until the draft has content', async () => {
    render(<AiAssistantPage />);
    const send = screen.getByRole('button', { name: /send/i });
    expect(send).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Message'), 'When does P-100 renew?');
    expect(send).toBeEnabled();
  });

  it('reports and blocks an over-length draft', async () => {
    render(<AiAssistantPage />);
    await userEvent.click(screen.getByLabelText('Message'));
    await userEvent.paste('x'.repeat(MAX_MESSAGE_LENGTH + 3));

    expect(screen.getByRole('alert')).toHaveTextContent(/3 characters over/i);
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    expect(screen.getByLabelText('Message')).toHaveAttribute('aria-invalid', 'true');
  });
});
