import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class PaymentFilterDto extends PaginationFilterDto {
  toDate?: string
  search?: string
  fromDate?: string
  reservationId?: number
}
