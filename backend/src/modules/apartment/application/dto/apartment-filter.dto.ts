import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class ApartmentFilterDto extends PaginationFilterDto {
  ids?: number[]
  floor?: number
  search?: string
  number?: string
  status?: ApartmentStatusEnum | ApartmentStatusEnum[]
  toDate?: string
  fromDate?: string
  bedrooms?: number
  minPrice?: number
  maxPrice?: number
  bathrooms?: number
  minSquareMeters?: number
  maxSquareMeters?: number
}
