import { registerEnumType } from '@nestjs/graphql'

export enum ApartmentStatusEnum {
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
}

registerEnumType(ApartmentStatusEnum, { name: 'ApartmentStatusEnum' })
