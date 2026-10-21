import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'

export class SeasonModel {
  id: number
  name: string
  description?: string | null
  startDate: Date
  endDate: Date
  value: number
  unit: AdjustmentUnit
  action: PriceModifierType

  type: SeasonType
  isActive: boolean

  apartmentIds?: number[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
