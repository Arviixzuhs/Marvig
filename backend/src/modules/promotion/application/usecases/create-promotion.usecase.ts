import { PromotionDto } from '@/modules/promotion/application/dto/promotion.dto'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreatePromotionUseCase {
  constructor(
    @Inject('PromotionRepository')
    private promotionRepository: PromotionRepositoryPort,
  ) {}

  async execute(data: PromotionDto): Promise<PromotionModel> {
    if (data.type === PromotionTypeEnum.PERCENTAGE && data.value > 100) {
      throw new BadRequestException('El porcentaje no puede ser mayor a 100.');
    }

    return await this.promotionRepository.createPromotion(data)
  }
}
