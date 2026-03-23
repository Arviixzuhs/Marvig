import { Module } from '@nestjs/common'
import { ApartamentResolver } from './infrastructure/resolvers/apartament.resolver'
import { ApartamentDomainModule } from './domain/apartament.domain.module'
import { ApartamentApplicationModule } from './application/apartament.application.module'
import { ApartamentInfrastructureModule } from './infrastructure/apartament.infrastructure.module'

@Module({
  imports: [ApartamentDomainModule, ApartamentApplicationModule, ApartamentInfrastructureModule],
  controllers: [],
  providers: [ApartamentResolver],
})
export class ApartamentModule {}
