import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { CreatePaymentDto } from '@/modules/payment/application/dto/create-payment.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async execute(filters: CreatePaymentDto): Promise<PaymentModel> {
    return await this.paymentRepository.createPayment(filters)
  }
}
