import type { Quote } from '../services/quotesService';

/**
 * Domain vocabulary for quote status. Named rather than scattered as string
 * literals, per .claude/rules/constants.md (avoid magic values where the value
 * is a domain contract).
 */
export const QUOTE_STATUS_LABELS: Record<Quote['status'], string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  declined: 'Declined',
};

const EDITABLE_STATUSES: ReadonlySet<Quote['status']> = new Set(['draft']);

export function isEditable(quote: Quote): boolean {
  return EDITABLE_STATUSES.has(quote.status);
}

export function isCancellable(quote: Quote): boolean {
  return quote.status === 'submitted' || quote.status === 'approved';
}

export function statusLabel(status: Quote['status']): string {
  return QUOTE_STATUS_LABELS[status];
}
