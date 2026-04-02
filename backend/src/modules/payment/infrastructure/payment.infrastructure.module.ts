import { Module } from '@nestjs/common'
import { PaymentResolver } from '@/modules/payment/infrastructure/graphql/resolvers/payment.resolver'
import { StripeController } from './controllers/stripe.controller'
import { PaymentApplicationModule } from '@/modules/payment/application/payment.application.module'

@Module({
  imports: [PaymentApplicationModule],
  controllers: [StripeController],
  providers: [PaymentResolver],
  exports: [],
})
export class PaymentInfrastructureModule {}
