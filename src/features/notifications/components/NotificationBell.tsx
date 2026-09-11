import { Bell } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectUnreadCount } from '../stores/notificationsSlice';

export interface NotificationBellProps {
  onClick: () => void;
}

/**
 * The unread count is in the accessible name, not just the visual badge, so
 * screen-reader users get the same information (.claude/rules/accessibility.md).
 */
export function NotificationBell({ onClick }: NotificationBellProps) {
  const unreadCount = useAppSelector(selectUnreadCount);

  const label =
    unreadCount === 0 ? 'Notifications, none unread' : `Notifications, ${unreadCount} unread`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative rounded-card p-2 text-slate-600 hover:bg-muted-light"
    >
      <Bell size={18} aria-hidden="true" />
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
