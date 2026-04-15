import { UserModel } from './UserModel'
import { ApartmentModel } from './ApartmentModel'
import { IPaginationFilter } from '@/api/interfaces'

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum RentalType {
  FIXED_SEASON = 'FIXED_SEASON',
  DAILY = 'DAILY',
}

export interface ReservationModel {
  id: number
  startDate: Date | string
  endDate: Date | string
  type: RentalType
  status: ReservationStatus
  totalPrice: number
  userId: number
  apartmentIds: number[]
  isDeleted?: boolean | null
  deletedAt?: Date | null
  clientName?: string | null
  clientEmail?: string | null
  clientPhone?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
  user?: UserModel
  apartments?: ApartmentModel[]
}

export interface IReservationFilter extends IPaginationFilter {
  userId?: number
  apartmentId?: number
  status?: ReservationStatus
  type?: RentalType
  search?: string
  startDate?: string
  endDate?: string
  minPrice?: number
  maxPrice?: number
}
