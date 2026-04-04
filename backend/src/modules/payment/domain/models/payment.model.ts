import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

export class PaymentModel {
  id: number
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  reference: string
  date: Date
  createdAt?: Date | null
  reservation: ReservationModel
  description?: string | null
  reservationId: number
}
