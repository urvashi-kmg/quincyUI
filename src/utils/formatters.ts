/** Small, pure formatting utilities — see .claude/rules/components.md (utils is not a dumping
 * ground for business logic; these are presentation-only). */

export function formatCurrency(amountInCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    amountInCents / 100,
  );
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(isoDate));
}
