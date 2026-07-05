import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class ReservationFilterDto extends PaginationFilterDto {
  type?: RentalType | RentalType[]
  mine?: boolean
  userId?: number
  search?: string
  status?: ReservationStatus | ReservationStatus[]
  endDate?: string
  maxPrice?: number
  minPrice?: number
  startDate?: string
  apartmentId?: number
  apartmentIds?: number[]
}
