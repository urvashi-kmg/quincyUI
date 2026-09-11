import { httpClient } from '@/lib/httpClient';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

export interface AppNotification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data } = await httpClient.get<AppNotification[]>('/notifications');
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await httpClient.post(`/notifications/${id}/read`);
}
