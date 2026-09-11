import { describe, expect, it } from 'vitest';
import { isCancellable, isEditable, statusLabel } from './quoteStatus';
import type { Quote } from '../services/quotesService';

function quote(status: Quote['status']): Quote {
  return {
    id: 'q-1',
    applicantName: 'Jordan Lee',
    premiumCents: 100000,
    status,
    createdAt: '2026-08-04',
  };
}

describe('isEditable', () => {
  it('allows editing only a draft', () => {
    expect(isEditable(quote('draft'))).toBe(true);
    expect(isEditable(quote('submitted'))).toBe(false);
    expect(isEditable(quote('approved'))).toBe(false);
    expect(isEditable(quote('declined'))).toBe(false);
  });
});

describe('isCancellable', () => {
  it('allows cancelling a submitted or approved quote', () => {
    expect(isCancellable(quote('submitted'))).toBe(true);
    expect(isCancellable(quote('approved'))).toBe(true);
  });

  it('does not allow cancelling a draft or declined quote', () => {
    expect(isCancellable(quote('draft'))).toBe(false);
    expect(isCancellable(quote('declined'))).toBe(false);
  });
});

describe('statusLabel', () => {
  it('maps every status to a human label', () => {
    expect(statusLabel('draft')).toBe('Draft');
    expect(statusLabel('declined')).toBe('Declined');
  });
});
