import type { PropsWithChildren, ReactElement } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { hasPermission, type Permission } from '../utils/permissions';

export interface RequirePermissionProps extends PropsWithChildren {
  permission: Permission;
  fallback?: ReactElement | null;
}

/**
 * Hides UI the current user cannot act on. This is UX only — the API enforces
 * the actual boundary (`.claude/rules/security.md`). Do not use this to
 * protect data that has already been fetched into the client.
 */
export function RequirePermission({
  permission,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);
  return hasPermission(permissions, permission) ? <>{children}</> : fallback;
}
