import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

export class PaymentModel {
  id: number
  amount: number
  createdAt?: Date | null
  reservation: ReservationModel
  description?: string | null
  reservationId: number
}
