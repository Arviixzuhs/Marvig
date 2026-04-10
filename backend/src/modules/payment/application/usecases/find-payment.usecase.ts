import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindPaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async execute(id: number): Promise<PaymentModel> {
    const payment = await this.paymentRepository.existsById(id)
    if (!payment) throw new NotFoundException('Payment not found')

    return await this.paymentRepository.findPayment(id)
  }
}
