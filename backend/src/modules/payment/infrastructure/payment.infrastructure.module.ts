import { Module } from '@nestjs/common'
import { PaymentResolver } from '@/modules/payment/infrastructure/graphql/resolvers/payment.resolver'
import { StripeController } from './controllers/stripe.controller'
import { PaymentApplicationModule } from '@/modules/payment/application/payment.application.module'
import { ReservationApplicationModule } from '@/modules/reservation/application/reservation.application.module'

@Module({
  imports: [PaymentApplicationModule, ReservationApplicationModule],
  controllers: [StripeController],
  providers: [PaymentResolver],
  exports: [],
})
export class PaymentInfrastructureModule {}
