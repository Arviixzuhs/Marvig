import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'

export class UpdateReservationDto {
  status?: ReservationStatus
  persons?: number
  endDate?: string
  startDate?: string
  totalPrice?: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}
