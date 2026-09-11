import type { Quote } from '../services/quotesService';
import { statusLabel } from '../utils/quoteStatus';

// No status-badge palette exists anywhere in the design spec — kept on
// Tailwind's stock colors, out of scope (see the token migration report's
// "no spec equivalent" list). `submitted` moves from the now-deleted custom
// brand-* tint scale to Tailwind's stock blue, preserving the same visual
// (a blue "informational" badge) without depending on a removed token.
const badgeClasses: Record<Quote['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-blue-50 text-blue-700',
  approved: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-red-50 text-red-700',
};

/**
 * Status is conveyed by label text, not colour alone
 * (.claude/rules/accessibility.md).
 */
export function QuoteStatusBadge({ status }: { status: Quote['status'] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium ${badgeClasses[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
