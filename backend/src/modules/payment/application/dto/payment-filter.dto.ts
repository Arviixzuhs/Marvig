import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class PaymentFilterDto extends PaginationFilterDto {
  toDate?: string
  status?: PaymentStatus
  search?: string
  fromDate?: string
  reservationId?: number
}
