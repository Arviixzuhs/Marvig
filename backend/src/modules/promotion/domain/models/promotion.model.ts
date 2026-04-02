import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'

export class PromotionModel {
  id: number
  name: string
  type: PromotionTypeEnum
  value: number
  createdAt?: Date | null
  updatedAt?: Date | null
  deletedAt?: Date | null
  isDeleted?: boolean | null
  description?: string | null
}
