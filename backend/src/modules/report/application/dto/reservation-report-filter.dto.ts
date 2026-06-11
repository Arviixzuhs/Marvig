import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class ReservationReportFilterDto extends PaginationFilterDto {
  startDate?: string
  endDate?: string
  status?: ReservationStatus
  apartmentId?: number
  userId?: number
  search?: string
}
