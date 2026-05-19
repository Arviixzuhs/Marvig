import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class UserFilterDto extends PaginationFilterDto {
  name?: string
  email?: string
  search?: string
  toDate?: string
  fromDate?: string
}
