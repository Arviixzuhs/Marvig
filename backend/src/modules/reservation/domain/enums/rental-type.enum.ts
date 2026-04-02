import { registerEnumType } from '@nestjs/graphql'

export enum RentalType {
  FIXED_SEASON = 'FIXED_SEASON',
  DAILY = 'DAILY',
}

registerEnumType(RentalType, { name: 'RentalType' })
