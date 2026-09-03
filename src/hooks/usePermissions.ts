import { useAppSelector } from './useAppSelector';

export function usePermissions() {
  const roles = useAppSelector((s) => s.auth.user?.roles ?? []);
  const hasRole = (role: string) => roles.includes(role);
  return { roles, hasRole };
}
