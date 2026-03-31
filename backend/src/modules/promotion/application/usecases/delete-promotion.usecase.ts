import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeletePromotionUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.promotionRepository.existsById(id)
    if (!exists) throw new NotFoundException('Promotion not found')

    await this.promotionRepository.deletePromotion(id)
  }
}
