import { IPaginationFilter } from '@/api/interfaces'
import { ReservationModel } from './ReservationModel'

export enum PaymentMethod {
  CASH = 'CASH',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  PAGO_MOVIL = 'PAGO_MOVIL',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDID_CARD = 'CREDID_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface PaymentModel {
  id: number
  date: Date
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  reference?: string
  createdAt: Date
  description?: string
  reservation: ReservationModel
  reservationId: number
}

export interface IPaymentFilter extends IPaginationFilter {
  search?: string
  reservationId?: number
  fromDate?: string
  toDate?: string
}
