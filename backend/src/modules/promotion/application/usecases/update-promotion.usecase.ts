import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { UpdatePromotionDto } from '@/modules/promotion/application/dto/update-promotion.dto'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'
import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdatePromotionUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(id: number, data: UpdatePromotionDto): Promise<PromotionModel> {
    const exists = await this.promotionRepository.existsById(id)
    if (!exists) throw new NotFoundException('Promoción no encontrada')

    if (data.type === PromotionTypeEnum.PERCENTAGE && data.value > 100) {
      throw new BadRequestException('El porcentaje no puede ser mayor a 100.');
    }

    return await this.promotionRepository.updatePromotion(id, data)
  }
}
