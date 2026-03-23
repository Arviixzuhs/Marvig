import { Module } from '@nestjs/common'
import { ApartamentResolver } from '@/modules/apartament/infrastructure/resolvers/apartament.resolver'
import { ApartamentApplicationModule } from '@/modules/apartament/application/apartament.application.module'

@Module({
  imports: [ApartamentApplicationModule],
  controllers: [],
  providers: [ApartamentResolver],
  exports: [],
})
export class ApartamentInfrastructureModule {}
