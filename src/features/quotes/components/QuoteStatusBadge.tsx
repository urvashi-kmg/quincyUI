import type { Quote } from '../services/quotesService';
import { statusLabel } from '../utils/quoteStatus';

const badgeClasses: Record<Quote['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-brand-50 text-brand-700',
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
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClasses[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
