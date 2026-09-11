import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate } from '../formatters';

describe('formatCurrency', () => {
  it('formats cents as USD by default', () => {
    expect(formatCurrency(150000)).toBe('$1,500.00');
  });

  it('formats a different currency when given one', () => {
    expect(formatCurrency(150000, 'EUR')).toBe('€1,500.00');
  });
});

describe('formatDate', () => {
  it('formats an ISO date as a medium-style date', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15, 2026');
  });
});
