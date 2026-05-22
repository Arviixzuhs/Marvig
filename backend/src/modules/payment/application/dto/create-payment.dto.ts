import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'

export class CreatePaymentDto {
  date: Date
  amount: number
  method: PaymentMethod
  status?: PaymentStatus
  reference: string
  description?: string
  reservationId: number
}
