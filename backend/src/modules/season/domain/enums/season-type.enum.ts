import { registerEnumType } from '@nestjs/graphql'

export enum SeasonType {
  LOW = 'LOW',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  SPECIAL = 'SPECIAL',
}

registerEnumType(SeasonType, { name: 'SeasonType' })
