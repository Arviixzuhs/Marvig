import { registerEnumType } from '@nestjs/graphql'

export enum ReservationStatus {
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(ReservationStatus, { name: 'ReservationStatus' })
