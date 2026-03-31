import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { UpdatePromotionDto } from '@/modules/promotion/application/dto/update-promotion.dto'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdatePromotionUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(id: number, data: UpdatePromotionDto): Promise<PromotionModel> {
    const exists = await this.promotionRepository.existsById(id)
    if (!exists) throw new NotFoundException('Promotion not found')

    return await this.promotionRepository.updatePromotion(id, data)
  }
}
