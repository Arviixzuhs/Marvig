export interface IPaginationFilter {
  page?: number
  pageSize?: number
}

export interface IPageResponse<T> {
  content: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  rowsPerPage: number
}
