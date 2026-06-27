import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'

export class PromotionFilterDto extends PaginationFilterDto {
  search?: string
  name?: string
  fromDate?: string
  toDate?: string
  type?: PromotionTypeEnum | PromotionTypeEnum[]
}
