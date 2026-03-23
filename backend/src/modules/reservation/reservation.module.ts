import { Module } from '@nestjs/common'
import { ReservationDomainModule } from './domain/reservation.domain.module'
import { ReservationApplicationModule } from './application/reservation.application.module'
import { ReservationInfrastructureModule } from './infrastructure/reservation.infrastructure.module'

@Module({
  imports: [ReservationDomainModule, ReservationApplicationModule, ReservationInfrastructureModule],
  controllers: [],
  providers: [],
})
export class ReservationModule {}
