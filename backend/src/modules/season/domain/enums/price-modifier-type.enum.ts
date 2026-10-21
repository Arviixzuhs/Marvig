import { registerEnumType } from '@nestjs/graphql'

export enum PriceModifierType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

registerEnumType(PriceModifierType, { name: 'PriceModifierType' })
