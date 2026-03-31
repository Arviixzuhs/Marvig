import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindPromotionUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(id: number): Promise<PromotionModel> {
    const promotion = await this.promotionRepository.findPromotion(id)
    if (!promotion) throw new NotFoundException('Promotion not found')

    return promotion
  }
}
