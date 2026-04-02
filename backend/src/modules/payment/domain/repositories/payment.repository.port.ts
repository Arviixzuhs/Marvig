import { PaymentPage } from '@/modules/payment/application/dto/payment-page.dto'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { CreatePaymentDto } from '@/modules/payment/application/dto/create-payment.dto'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'

export interface PaymentRepositoryPort {
  existsById(paymentId: number): Promise<boolean>
  findPayment(paymentId: number): Promise<PaymentModel | null>
  findPayments(filters: PaymentFilterDto): Promise<PaymentPage>
  createPayment(payment: CreatePaymentDto): Promise<PaymentModel>
}
