import { PromotionPage } from '@/modules/promotion/application/dto/promotion-page.dto'
import { PromotionFilterDto } from '@/modules/promotion/application/dto/promotion-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'

@Injectable()
export class FindPromotionsUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(filters: PromotionFilterDto): Promise<PromotionPage> {
    return await this.promotionRepository.findPromotions(filters)
  }
}
