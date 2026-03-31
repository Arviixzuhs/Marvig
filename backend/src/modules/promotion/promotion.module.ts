import { Module } from '@nestjs/common'
import { PromotionDomainModule } from './domain/promotion.domain.module'
import { PromotionApplicationModule } from './application/promotion.application.module'
import { PromotionInfrastructureModule } from './infrastructure/promotion.infrastructure.module'

@Module({
  imports: [PromotionDomainModule, PromotionApplicationModule, PromotionInfrastructureModule],
  controllers: [],
  providers: [],
})
export class PromotionModule {}
