import { Module } from '@nestjs/common'
import { ApartmentResolver } from './infrastructure/resolvers/apartment.resolver'
import { ApartmentDomainModule } from './domain/apartment.domain.module'
import { ApartmentApplicationModule } from './application/apartment.application.module'
import { ApartmentInfrastructureModule } from './infrastructure/apartment.infrastructure.module'

@Module({
  imports: [ApartmentDomainModule, ApartmentApplicationModule, ApartmentInfrastructureModule],
  controllers: [],
  providers: [ApartmentResolver],
})
export class ApartmentModule {}
