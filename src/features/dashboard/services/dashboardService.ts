import { httpClient } from '@/lib/httpClient';
import type { PremiumTrendPoint } from '../components/PremiumTrendChart';

export interface DashboardSummary {
  openQuotes: number;
  activePolicies: number;
  pendingRenewals: number;
  premiumWrittenCents: number;
  premiumTrend: PremiumTrendPoint[];
}

/** Only service-layer files may import httpClient/axios. */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await httpClient.get<DashboardSummary>('/dashboard/summary');
  return {
    ...data,
    premiumTrend: Array.isArray(data?.premiumTrend) ? data.premiumTrend : [],
  };
}
