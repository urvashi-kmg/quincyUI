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
        className="flex w-56 shrink-0 flex-col border-r border-border-light bg-muted-light p-4"
      >
        <span className="mb-6 px-2 text-lg font-semibold text-brand-600">Quincy</span>
        <ul className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-card px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-brand-50'
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
        <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border-light px-6">
          <NotificationBell onClick={() => {}} />
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
