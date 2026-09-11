import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer, { loadNotifications } from '../stores/notificationsSlice';
import { NotificationBell } from './NotificationBell';
import type { AppNotification } from '../services/notificationsService';

function renderBell(items: AppNotification[], onClick = vi.fn()) {
  const store = configureStore({ reducer: { notifications: notificationsReducer } });
  store.dispatch(loadNotifications.fulfilled(items, 'req', undefined));

  render(
    <Provider store={store}>
      <NotificationBell onClick={onClick} />
    </Provider>,
  );

  return { onClick };
}

const unread: AppNotification = {
  id: 'n-1',
  severity: 'warning',
  title: 'Renewal due',
  body: 'Policy P-100 renews in 7 days.',
  createdAt: '2026-09-01T10:00:00Z',
  readAt: null,
};

describe('NotificationBell', () => {
  it('announces when there is nothing unread', () => {
    renderBell([]);
    expect(screen.getByRole('button', { name: /none unread/i })).toBeInTheDocument();
  });

  it('puts the unread count in the accessible name', () => {
    renderBell([unread, { ...unread, id: 'n-2' }]);
    expect(screen.getByRole('button', { name: /2 unread/i })).toBeInTheDocument();
  });

  it('calls onClick when activated', async () => {
    const { onClick } = renderBell([unread]);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
