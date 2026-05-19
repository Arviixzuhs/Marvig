import { InputType } from '@nestjs/graphql'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

@InputType()
export class ApartmentFilterDto extends PaginationFilterDto {
  ids?: number[]
  floor?: number
  search?: string
  number?: string
  status?: ApartmentStatusEnum
  bedrooms?: number
  bathrooms?: number
  minSquareMeters?: number
  maxSquareMeters?: number
}
