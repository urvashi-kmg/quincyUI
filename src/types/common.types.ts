export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}
