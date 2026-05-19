import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'

export class UpdateReservationDto {
  type?: RentalType
  status?: ReservationStatus
  endDate?: string
  startDate?: string
  totalPrice?: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  apartmentIds?: number[]
}
