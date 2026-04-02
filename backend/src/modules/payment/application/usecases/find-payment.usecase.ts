import { PaymentPage } from '@/modules/payment/application/dto/payment-page.dto'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'

@Injectable()
export class FindPaymentsUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async execute(filters: PaymentFilterDto): Promise<PaymentPage> {
    return await this.paymentRepository.findPayments(filters)
  }
}
