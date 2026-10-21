import { Module } from '@nestjs/common'
import { SeasonResolver } from './infrastructure/graphql/resolvers/season.resolver'
import { SeasonDomainModule } from './domain/season.domain.module'
import { SeasonApplicationModule } from '@/modules/season/application/season.application.module'
import { SeasonInfrastructureModule } from './infrastructure/season.infrastructure.module'

@Module({
  imports: [SeasonDomainModule, SeasonApplicationModule, SeasonInfrastructureModule],
  providers: [SeasonResolver],
})
export class SeasonModule {}
