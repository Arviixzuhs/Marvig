import { IPaginationFilter } from '@/api/interfaces'
import { PromotionModel } from './PromotionModel'

export interface ApartmentModel {
  id: number
  floor: number
  number: string
  status: ApartmentStatus
  bedrooms: number
  bathrooms: number
  pricePerDay: number
  squareMeters?: number | null
  promotion: PromotionModel
  images?: IApartmentImage[] | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export enum ApartmentStatus {
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface IApartmentImage {
  id: number
  url: string
  isPrimary: boolean
  apartmentId: number
}

export interface IApartmentFilter extends IPaginationFilter {
  search?: string
  number?: string
  floor?: number
  ids?: number[]
  status?: ApartmentStatus
  bedrooms?: number
  bathrooms?: number
  minSquareMeters?: number
  maxSquareMeters?: number
}
