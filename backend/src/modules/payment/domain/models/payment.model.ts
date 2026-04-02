import { Decimal } from '@prisma/client/runtime/client'

export class PaymentModel {
  id: number
  amount: Decimal
  createdAt?: Date | null
  description?: string | null
  reservationId: number
}
