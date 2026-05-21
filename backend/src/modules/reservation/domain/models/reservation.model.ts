import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'

export class ReservationModel {
  id: number
  type: RentalType
  status: ReservationStatus
  userId?: number
  endDate: Date
  startDate: Date
  createdAt?: Date
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  updatedAt?: Date
  totalPrice: number
  payments?: PaymentModel[]
  apartments?: ApartmentModel[]
}
