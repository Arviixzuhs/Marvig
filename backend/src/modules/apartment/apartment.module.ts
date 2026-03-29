import { Module } from '@nestjs/common'
import { ApartmentResolver } from '@/modules/apartment/infrastructure/graphql/resolvers/apartment.resolver'
import { ApartmentDomainModule } from '@/modules/apartment/domain/apartment.domain.module'
import { ApartmentApplicationModule } from '@/modules/apartment/application/apartment.application.module'
import { ApartmentInfrastructureModule } from '@/modules/apartment/infrastructure/apartment.infrastructure.module'

@Module({
  imports: [ApartmentDomainModule, ApartmentApplicationModule, ApartmentInfrastructureModule],
  controllers: [],
  providers: [ApartmentResolver],
})
export class ApartmentModule {}
