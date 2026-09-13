import { describe, expect, it } from 'vitest';
import { isJwtExpired, getUsernameFromJwt } from './jwt';

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe('isJwtExpired', () => {
  it('is false for a token whose exp is well in the future', () => {
    expect(isJwtExpired(makeJwt({ exp: Date.now() / 1000 + 3600 }))).toBe(false);
  });

  it('is true for a token whose exp has already passed', () => {
    expect(isJwtExpired(makeJwt({ exp: Date.now() / 1000 - 3600 }))).toBe(true);
  });

  it('is true within the 30s expiry buffer', () => {
    expect(isJwtExpired(makeJwt({ exp: Date.now() / 1000 + 10 }))).toBe(true);
  });

  it('is true for an undecodable token', () => {
    expect(isJwtExpired('not-a-jwt')).toBe(true);
  });
});

describe('getUsernameFromJwt', () => {
  it('prefers preferred_username over other claims', () => {
    const token = makeJwt({ preferred_username: 'jane', sub: 'user-123', email: 'jane@example.com' });
    expect(getUsernameFromJwt(token)).toBe('jane');
  });

  it('falls back through unique_name, upn, sub, email in order', () => {
    expect(getUsernameFromJwt(makeJwt({ unique_name: 'jane.unique' }))).toBe('jane.unique');
    expect(getUsernameFromJwt(makeJwt({ upn: 'jane@upn' }))).toBe('jane@upn');
    expect(getUsernameFromJwt(makeJwt({ sub: 'user-123' }))).toBe('user-123');
    expect(getUsernameFromJwt(makeJwt({ email: 'jane@example.com' }))).toBe('jane@example.com');
  });

  it('returns null when no known claim is present', () => {
    expect(getUsernameFromJwt(makeJwt({ foo: 'bar' }))).toBeNull();
  });

  it('returns null for an undecodable token', () => {
    expect(getUsernameFromJwt('not-a-jwt')).toBeNull();
  });
});
