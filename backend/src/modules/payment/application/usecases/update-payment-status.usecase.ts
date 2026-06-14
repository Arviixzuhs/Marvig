import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async execute(id: number, status: PaymentStatus): Promise<PaymentModel> {
    const payment = await this.paymentRepository.existsById(id)
    if (!payment) throw new Error('Payment not found')

    return this.paymentRepository.updateStatus(id, status)
  }
}
