import { PromotionDto } from '@/modules/promotion/application/dto/promotion.dto'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { Inject, Injectable } from '@nestjs/common'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'

@Injectable()
export class CreatePromotionUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(data: PromotionDto): Promise<PromotionModel> {
    return await this.promotionRepository.createPromotion(data)
  }
}
