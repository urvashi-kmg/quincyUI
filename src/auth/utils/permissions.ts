/**
 * Client-side permission helpers.
 *
 * These are UX affordances ONLY — hiding a button is not authorization. The API
 * is the security boundary (`.claude/rules/security.md`). Never use these to
 * gate anything whose exposure would itself be the breach.
 */
export type Permission =
  | 'quotes:read'
  | 'quotes:write'
  | 'policies:read'
  | 'policies:write'
  | 'endorsements:write'
  | 'settings:manage';

export function hasPermission(granted: readonly Permission[], required: Permission): boolean {
  return granted.includes(required);
}

export function hasAnyPermission(
  granted: readonly Permission[],
  required: readonly Permission[],
): boolean {
  return required.some((permission) => granted.includes(permission));
}
