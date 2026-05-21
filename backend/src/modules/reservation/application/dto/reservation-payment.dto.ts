import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

export class ReservationPaymentDto {
  date: Date
  method: PaymentMethod
  reference: string
  description?: string
}
