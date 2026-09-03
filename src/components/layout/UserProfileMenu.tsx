import { LogOut, UserRound } from 'lucide-react';

import { useAuth } from '@features/auth';

export function UserProfileMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      <UserRound className="h-5 w-5" aria-hidden="true" />
      <span>{user?.name ?? 'Guest'}</span>
      <button onClick={logout} aria-label="Log out" className="rounded p-1 text-slate-500 hover:bg-slate-100">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
