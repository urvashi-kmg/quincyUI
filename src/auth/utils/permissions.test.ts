import { describe, expect, it } from 'vitest';
import { hasAnyPermission, hasPermission, type Permission } from './permissions';

const granted: Permission[] = ['quotes:read', 'policies:read'];

describe('hasPermission', () => {
  it('returns true for a granted permission', () => {
    expect(hasPermission(granted, 'quotes:read')).toBe(true);
  });

  it('returns false for a permission that was not granted', () => {
    expect(hasPermission(granted, 'quotes:write')).toBe(false);
  });

  it('returns false against an empty grant list', () => {
    expect(hasPermission([], 'quotes:read')).toBe(false);
  });
});

describe('hasAnyPermission', () => {
  it('returns true when at least one required permission is granted', () => {
    expect(hasAnyPermission(granted, ['quotes:write', 'policies:read'])).toBe(true);
  });

  it('returns false when none are granted', () => {
    expect(hasAnyPermission(granted, ['quotes:write', 'settings:manage'])).toBe(false);
  });

  it('returns false for an empty requirement list', () => {
    expect(hasAnyPermission(granted, [])).toBe(false);
  });
});
