import { NavLink } from 'react-router-dom';
import { FileText, ShieldCheck, ClipboardList } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/quotes', label: 'Quotes', icon: FileText },
  { to: '/policies', label: 'Policies', icon: ShieldCheck },
  { to: '/claims', label: 'Claims', icon: ClipboardList },
];

export function Sidebar() {
  return (
    <nav className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
      <div className="mb-6 px-2 text-lg font-semibold text-brand-800">Quincy UI</div>
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded px-2 py-2 text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
