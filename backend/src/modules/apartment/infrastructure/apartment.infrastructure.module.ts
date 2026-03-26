import { Module } from '@nestjs/common'
import { ApartmentResolver } from '@/modules/apartment/infrastructure/resolvers/apartment.resolver'
import { ApartmentApplicationModule } from '@/modules/apartment/application/apartment.application.module'

@Module({
  imports: [ApartmentApplicationModule],
  controllers: [],
  providers: [ApartmentResolver],
  exports: [],
})
export class ApartmentInfrastructureModule {}
