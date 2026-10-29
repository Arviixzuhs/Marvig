import { UserRole } from '@/common/enums/user-role.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { CreateReservationDto } from './create-reservation.dto'

export class CreateReservationTransactionInput {
  userId: number
  userRole: UserRole
  reservation: CreateReservationDto
  payment: {
    date: Date
    amount: number
    status: PaymentStatus
    method: PaymentMethod
    reference: string
    description?: string
  }
}
