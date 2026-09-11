/**
 * Shared, cross-feature types. Feature-specific types stay colocated in
 * src/features/<name>/types or beside the code that uses them — see
 * .claude/rules/constants.md.
 */

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}
