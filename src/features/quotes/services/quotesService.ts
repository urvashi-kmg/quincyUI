import { apiClient } from '@/lib/axiosClient';
import type { PaginatedResult } from '@/types';

export interface Quote {
  id: string;
  applicantName: string;
  premiumCents: number;
  status: 'draft' | 'submitted' | 'approved' | 'declined';
  createdAt: string;
}

export async function fetchQuotes(page = 1, pageSize = 25): Promise<PaginatedResult<Quote>> {
  const { data } = await apiClient.get<PaginatedResult<Quote>>('/quotes', {
    params: { page, pageSize },
  });
  return data;
}
