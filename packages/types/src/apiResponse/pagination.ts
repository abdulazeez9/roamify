export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  query?: string;
}

export interface PaginationOptions<TWhereInput = any> {
  page: number;
  limit: number;
  where?: TWhereInput;
  include?: any;
  orderBy?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
