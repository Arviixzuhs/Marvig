import { Module } from '@nestjs/common'
import { SeasonResolver } from './graphql/resolvers/season.resolver'
import { SeasonApplicationModule } from '@/modules/season/application/season.application.module'

@Module({
  imports: [SeasonApplicationModule],
  providers: [SeasonResolver],
})
export class SeasonInfrastructureModule {}
