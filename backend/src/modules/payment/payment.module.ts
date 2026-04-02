import { Module } from '@nestjs/common'
import { PaymentDomainModule } from './domain/payment.domain.module'
import { PaymentApplicationModule } from './application/payment.application.module'
import { PaymentInfrastructureModule } from './infrastructure/payment.infrastructure.module'

@Module({
  imports: [PaymentDomainModule, PaymentApplicationModule, PaymentInfrastructureModule],
  controllers: [],
  providers: [],
})
export class PaymentModule {}
