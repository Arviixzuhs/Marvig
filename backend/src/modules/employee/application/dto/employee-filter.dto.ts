import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class EmployeeFilterDto extends PaginationFilterDto {
  name?: string
  email?: string
  phone?: string
  toDate?: string
  search?: string
  lastName?: string
  fromDate?: string
}
