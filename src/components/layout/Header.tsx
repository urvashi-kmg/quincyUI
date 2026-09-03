import { UserProfileMenu } from './UserProfileMenu';

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <UserProfileMenu />
      </div>
    </header>
  );
}
