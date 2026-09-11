import { describe, expect, it } from 'vitest';
import reducer, { loadNotifications, markRead, selectUnreadCount } from './notificationsSlice';
import type { AppNotification } from '../services/notificationsService';

const items: AppNotification[] = [
  {
    id: 'n-1',
    severity: 'warning',
    title: 'Renewal due',
    body: 'Policy P-100 renews in 7 days.',
    createdAt: '2026-09-01T10:00:00Z',
    readAt: null,
  },
  {
    id: 'n-2',
    severity: 'info',
    title: 'Quote approved',
    body: 'Quote q-1001 was approved.',
    createdAt: '2026-09-02T10:00:00Z',
    readAt: '2026-09-02T11:00:00Z',
  },
];

describe('notificationsSlice', () => {
  it('stores notifications on fulfilled', () => {
    const state = reducer(undefined, loadNotifications.fulfilled(items, 'req1', undefined));
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(2);
  });

  it('marks a single notification as read without touching the others', () => {
    const loaded = reducer(undefined, loadNotifications.fulfilled(items, 'req1', undefined));
    const state = reducer(loaded, markRead.fulfilled('n-1', 'req2', 'n-1'));

    expect(state.items[0]?.readAt).not.toBeNull();
    expect(state.items[1]?.readAt).toBe('2026-09-02T11:00:00Z');
  });

  it('ignores markRead for an unknown id', () => {
    const loaded = reducer(undefined, loadNotifications.fulfilled(items, 'req1', undefined));
    const state = reducer(loaded, markRead.fulfilled('missing', 'req2', 'missing'));
    expect(state.items).toEqual(items);
  });
});

describe('selectUnreadCount', () => {
  it('counts only unread notifications', () => {
    const state = reducer(undefined, loadNotifications.fulfilled(items, 'req1', undefined));
    // Selector is exercised against the slice shape it owns.
    expect(selectUnreadCount({ notifications: state } as never)).toBe(1);
  });
});
