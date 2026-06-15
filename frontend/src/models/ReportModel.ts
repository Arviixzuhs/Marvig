import { PaymentMethod, PaymentStatus } from './PaymentModel'
import { ExpenseCategory } from './ExpenseModel'
import { ReservationStatus, RentalType } from './ReservationModel'
import { IPageResponse, IPaginationFilter } from '@/api/interfaces'

// ─── Payment Report ───────────────────────────────────────────────────────────

export interface IPaymentReportReservationApartment {
  id: number
  number: string
  floor: number
}

export interface IPaymentReportReservation {
  id: number
  startDate: string
  endDate: string
  clientName?: string
  clientEmail?: string
  apartments?: IPaymentReportReservationApartment[]
}

export interface IPaymentReportItem {
  id: number
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  date: string
  reference: string
  description?: string
  reservationId: number
  reservation?: IPaymentReportReservation
}

export interface IPaymentReportFilter extends IPaginationFilter {
  fromDate?: string
  toDate?: string
  status?: PaymentStatus
  search?: string
}

export type IPaymentReportPage = IPageResponse<IPaymentReportItem>

// ─── Expense Report ───────────────────────────────────────────────────────────

export interface IExpenseReportApartment {
  id: number
  number: string
  floor: number
}

export interface IExpenseReportItem {
  id: number
  amount: number
  category: ExpenseCategory
  date?: string
  description?: string
  paymentMethod?: PaymentMethod
  apartmentId: number
  employeeId?: number
  apartment?: IExpenseReportApartment
}

export interface IExpenseReportFilter extends IPaginationFilter {
  fromDate?: string
  toDate?: string
  category?: ExpenseCategory
  apartmentId?: number
  search?: string
}

export type IExpenseReportPage = IPageResponse<IExpenseReportItem>

// ─── Reservation Report ───────────────────────────────────────────────────────

export interface IReservationReportApartment {
  id: number
  number: string
  floor: number
}

export interface IReservationReportPayment {
  id: number
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  date: string
}

export interface IReservationReportItem {
  id: number
  startDate: string
  endDate: string
  status: ReservationStatus
  type: RentalType
  totalPrice: number
  totalPaid: number
  pendingAmount: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  userId?: number
  apartments: IReservationReportApartment[]
  payments: IReservationReportPayment[]
}

export interface IReservationReportFilter extends IPaginationFilter {
  startDate?: string
  endDate?: string
  status?: ReservationStatus
  search?: string
}

export type IReservationReportPage = IPageResponse<IReservationReportItem>

// ─── Occupancy Report ─────────────────────────────────────────────────────────

export interface IApartmentOccupancy {
  apartmentId: number
  apartmentNumber: string
  floor: number
  totalNights: number
  occupiedNights: number
  blockedNights: number
  availableNights: number
  occupancyPercentage: number
  generatedIncome: number
}

export interface IOccupancyReport {
  fromDate: string
  toDate: string
  apartments: IApartmentOccupancy[]
}

export interface IOccupancyReportFilter {
  fromDate: string
  toDate: string
  apartmentIds?: number[]
}

// ─── Income Summary ───────────────────────────────────────────────────────────

export interface IExpenseByCategory {
  category: ExpenseCategory
  amount: number
  percentage: number
}

export interface IIncomeSummary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  expensesByCategory: IExpenseByCategory[]
}

export interface IIncomeSummaryFilter {
  fromDate: string
  toDate: string
}
