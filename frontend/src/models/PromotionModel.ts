import { ApartmentModel } from './ApartmentModel'
import { IPaginationFilter } from '@/api/interfaces'

export enum PromotionType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export interface PromotionModel {
  id: number
  name: string
  type: PromotionType
  value: number | string
  createdAt: Date
  updatedAt: Date
  description: string | null
  apartments?: ApartmentModel[]
}

export interface IPromotionFilter extends IPaginationFilter {
  name?: string
  search?: string
  toDate?: string
  fromDate?: string
}
