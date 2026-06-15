export abstract class PaginationFilterDto {
  page?: number
  pageSize?: number
  isUnpaged?: boolean = false
}
