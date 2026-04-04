import { registerEnumType } from '@nestjs/graphql'

export enum PaymentStatus {
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(PaymentStatus, { name: 'PaymentStatusEnum' })
