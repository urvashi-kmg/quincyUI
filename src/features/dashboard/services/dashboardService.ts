import { apiClient } from '@/lib/axiosClient';
import type { PremiumTrendPoint } from '../components/PremiumTrendChart';

export interface DashboardSummary {
  openQuotes: number;
  activePolicies: number;
  pendingRenewals: number;
  premiumWrittenCents: number;
  premiumTrend: PremiumTrendPoint[];
}

/** Only service-layer files may import apiClient/axios. */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return {
    ...data,
    premiumTrend: Array.isArray(data?.premiumTrend) ? data.premiumTrend : [],
  };
}
