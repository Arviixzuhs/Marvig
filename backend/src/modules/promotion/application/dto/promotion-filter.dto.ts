import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class PromotionFilterDto extends PaginationFilterDto {
  search?: string
  name?: string
  fromDate?: string
  toDate?: string
}
