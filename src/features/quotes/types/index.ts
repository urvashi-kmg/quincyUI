export interface Quote {
  id: string;
  quoteNumber: string;
  applicantName: string;
  productLine: 'auto' | 'home' | 'umbrella';
  premium: number;
  status: 'draft' | 'quoted' | 'bound' | 'expired';
  createdAt: string;
}

export interface QuoteListParams {
  status?: Quote['status'];
  page?: number;
  pageSize?: number;
}
