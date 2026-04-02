import { Decimal } from '@prisma/client/runtime/client'
import { PromotionType } from 'generated/prisma/enums'

export class PromotionModel {
  id: number
  name: string
  description?: string | null
  isDeleted?: boolean | null
  type: PromotionType
  value: Decimal
  createdAt?: Date | null
  updatedAt?: Date | null
  deletedAt?: Date | null
}
