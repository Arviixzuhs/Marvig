import { registerEnumType } from '@nestjs/graphql'

export enum PromotionTypeEnum {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

registerEnumType(PromotionTypeEnum, { name: 'PromotionTypeEnum' })
