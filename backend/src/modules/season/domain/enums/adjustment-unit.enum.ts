import { registerEnumType } from '@nestjs/graphql'

export enum AdjustmentUnit {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

registerEnumType(AdjustmentUnit, { name: 'AdjustmentUnit' })
