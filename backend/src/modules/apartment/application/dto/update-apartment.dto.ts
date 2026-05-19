import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'

export class UpdateApartmentDto {
  floor?: number
  number?: string
  status?: ApartmentStatusEnum
  bedrooms?: number
  pricePerDay?: number
  bathrooms?: number
  squareMeters?: number
}
