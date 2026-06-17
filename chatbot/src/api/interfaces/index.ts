export interface IPaginationFilter {
  page?: number
  pageSize?: number
}

export interface IDateFilter {
  startDate?: string
  endDate?: string
}

export interface IPageResponse<T> {
  content: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  rowsPerPage: number
}

export enum ServerMode {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}
