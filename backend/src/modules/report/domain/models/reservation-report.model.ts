import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'

export class ReservationReportApartmentModel {
  id: number
  number: string
  floor: number
}

export class ReservationReportPaymentModel {
  id: number
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  date: Date
}

export class ReservationReportModel {
  id: number
  startDate: Date
  endDate: Date
  status: ReservationStatus
  type: RentalType
  totalPrice: number
  totalPaid: number
  pendingAmount: number
  clientName?: string | null
  clientEmail?: string | null
  clientPhone?: string | null
  userId?: number | null
  apartments: ReservationReportApartmentModel[]
  payments: ReservationReportPaymentModel[]
}

export class ReservationReportPageModel {
  content: ReservationReportModel[]
  totalItems: number
  totalPages: number
  currentPage?: number
  rowsPerPage?: number
}
