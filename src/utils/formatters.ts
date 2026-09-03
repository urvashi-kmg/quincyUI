export function formatCurrency(amount: number, currency = 'USD'): string {
  return amount.toLocaleString('en-US', { style: 'currency', currency });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
