import { Module } from '@nestjs/common'
import { ReservationResolver } from '@/modules/reservation/infrastructure/graphql/resolvers/reservation.resolver'
import { ReservationApplicationModule } from '@/modules/reservation/application/reservation.application.module'

@Module({
  imports: [ReservationApplicationModule],
  controllers: [],
  providers: [ReservationResolver],
  exports: [],
})
export class ReservationInfrastructureModule {}
