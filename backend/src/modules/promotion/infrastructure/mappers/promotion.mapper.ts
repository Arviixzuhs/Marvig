import { BaseMapper } from '@/common/mappers/base.mapper'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { Promotion as PrismaPromotion } from 'generated/prisma/client'

export class PromotionMapper extends BaseMapper<PrismaPromotion, PromotionModel> {
  modelToDomain(model: PrismaPromotion): PromotionModel {
    return {
      id: model.id,
      name: model.name,
      type: model.type as PromotionTypeEnum,
      value: Number(model.value),
      description: model.description,
      isDeleted: model.isDeleted,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }
  }
}
