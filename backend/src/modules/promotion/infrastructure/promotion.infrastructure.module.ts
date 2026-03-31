import { Module } from '@nestjs/common'
import { PromotionResolver } from './graphql/resolvers/promotion.resolver'
import { PromotionApplicationModule } from '@/modules/promotion/application/promotion.application.module'

@Module({
  imports: [PromotionApplicationModule],
  controllers: [],
  providers: [PromotionResolver],
  exports: [],
})
export class PromotionInfrastructureModule {}
