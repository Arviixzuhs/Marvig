import { Decimal } from '@prisma/client/runtime/index-browser'
import { RentalType, ReservationStatus } from 'generated/prisma/enums'

export class ReservationModel {
  id: number
  type: RentalType
  status: ReservationStatus
  userId: number
  endDate: Date
  startDate: Date
  createdAt?: Date
  updatedAt?: Date
  totalPrice: Decimal
}
