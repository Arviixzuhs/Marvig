import { PaymentPageType } from '@/modules/payment/infrastructure/graphql/types/payment-page.type'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'

@Injectable()
export class FindPaymentsUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async execute(filters: PaymentFilterDto): Promise<PaymentPageType> {
    return await this.paymentRepository.findPayments(filters)
  }
}
