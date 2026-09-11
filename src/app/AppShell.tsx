import { NavLink, Outlet } from 'react-router-dom';
import {
  Bot,
  FileText,
  LayoutDashboard,
  RefreshCw,
  ScrollText,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/quotes', label: 'Quotes', icon: FileText, end: false },
  { to: '/policies', label: 'Policies', icon: ShieldCheck, end: false },
  { to: '/endorsements', label: 'Endorsements', icon: ScrollText, end: false },
  { to: '/renewals', label: 'Renewals', icon: RefreshCw, end: false },
  { to: '/assistant', label: 'Assistant', icon: Bot, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

/** App-wide layout frame. No business logic lives here — see .claude/rules/components.md. */
export function AppShell() {
  return (
    <div className="flex h-screen">
      <nav
        aria-label="Primary"
        className="flex w-56 shrink-0 flex-col border-r border-line-decorative bg-white p-4"
      >
        <span className="mb-6 px-2 text-heading-2 font-semibold text-brand-purple">Quincy</span>
        <ul className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-card px-3 py-2 text-small font-medium transition-colors ${
                    // No light purple/pink tint token exists in the spec for a
                    // subtle hover surface — bg-page (the plain page
                    // background) is used as a neutral substitute. See the
                    // token migration report's "no spec equivalent" list.
                    isActive ? 'bg-brand-purple text-white' : 'text-ink-secondary hover:bg-page'
                  }`
                }
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-line-decorative bg-white px-6">
          <NotificationBell onClick={() => {}} />
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
