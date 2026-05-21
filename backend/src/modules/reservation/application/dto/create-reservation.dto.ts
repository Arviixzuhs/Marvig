import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationPaymentDto } from './reservation-payment.dto'

export class CreateReservationDto {
  type: RentalType
  status: ReservationStatus
  payment: ReservationPaymentDto
  endDate: string
  startDate: string
  totalPrice: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  apartmentIds: number[]
}
