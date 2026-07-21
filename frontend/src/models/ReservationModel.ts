import { UserModel } from './UserModel'
import { ApartmentModel } from './ApartmentModel'
import { IPaginationFilter } from '@/api/interfaces'
import { PaymentModel } from './PaymentModel'

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
  persons: number
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
  payments?: PaymentModel[]
}

export interface ICreateReservation {
  type?: RentalType
  status?: ReservationStatus
  payment: Partial<PaymentModel>
  endDate: string
  persons?: number
  startDate: string
  totalPrice: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  apartmentIds: number[]
}

export interface IUpdateReservation {
  status?: ReservationStatus
  persons?: number
  endDate?: string
  startDate?: string
  clientName?: string
  totalPrice?: number
  clientEmail?: string
  clientPhone?: string
}

export interface IReservationFilter extends IPaginationFilter {
  userId?: number
  mine?: boolean
  apartmentId?: number
  status?: ReservationStatus[]
  type?: RentalType[]
  search?: string
  startDate?: string
  endDate?: string
  minPrice?: number
  maxPrice?: number
}

export interface InvalidDate {
  year: string
  month: string
  day: string
}
