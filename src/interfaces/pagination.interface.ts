export interface PaginationOptions {
  page?: number;   // current page number
  limit?: number;  // items per page
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}