// src/interface/query/base.query.ts
export interface BaseQuery<TFilter = any> {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  filter?: TFilter;
}

// Chuẩn hóa query, tránh undefined & giới hạn dữ liệu xấu
export const normalizeQuery = (query: any): BaseQuery => ({
  page: Math.max(Number(query.page) || 1, 1),
  limit: Math.min(Number(query.limit) || 10, 100),
  search: query.search?.trim() || "",
  sort: query.sort || "-createdAt",
});
export interface FilterBuilder<T> {
  build(query: any): T;
}
// Kết quả phân trang chuẩn
export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const buildQuery = <TFilter>(
  query: any,
  filterBuilder: FilterBuilder<TFilter>,
) => ({
  ...normalizeQuery(query),
  filter: filterBuilder.build(query),
});
