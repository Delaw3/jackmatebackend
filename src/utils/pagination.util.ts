import { PaginatedResult, PaginationOptions } from "../interfaces/pagination.interface";



export function paginate<T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> {
  const page = Math.max(options.page || 1, 1);
  const limit = Math.max(options.limit || 10, 1);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}
