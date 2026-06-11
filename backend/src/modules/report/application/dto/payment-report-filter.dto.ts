import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class PaymentReportFilterDto extends PaginationFilterDto {
  fromDate?: string
  toDate?: string
  status?: PaymentStatus
  search?: string
  reservationId?: number
}
