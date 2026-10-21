import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class SeasonFilterDto extends PaginationFilterDto {
  name?: string
  types?: SeasonType[]
  units?: AdjustmentUnit[]
  actions?: PriceModifierType[]
  isActive?: boolean
  apartmentId?: number
  fromDate?: string
  toDate?: string
}
