import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

export class PaymentReportReservationModel {
  id: number
  startDate: Date
  endDate: Date
  clientName?: string | null
  clientEmail?: string | null
  clientPhone?: string | null
  apartments?: { id: number; number: string; floor: number }[]
}

export class PaymentReportModel {
  id: number
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  date: Date
  reference: string
  description?: string | null
  reservationId: number
  reservation?: PaymentReportReservationModel | null
}

export class PaymentReportPageModel {
  content: PaymentReportModel[]
  totalItems: number
  totalPages: number
  currentPage?: number
  rowsPerPage?: number
}
