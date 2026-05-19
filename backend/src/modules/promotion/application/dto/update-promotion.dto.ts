import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'

export class UpdatePromotionDto {
  name?: string
  type?: PromotionTypeEnum
  value?: number
  description?: string
}
