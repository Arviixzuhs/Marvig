import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

export class ExpenseReportApartmentModel {
  id: number
  number: string
  floor: number
}

export class ExpenseReportModel {
  id: number
  amount: number
  category: ExpenseCategory
  date?: Date | null
  description: string
  paymentMethod: PaymentMethod
  apartmentId: number
  employeeId?: number | null
  createdAt?: Date | null
  apartment?: ExpenseReportApartmentModel | null
}

export class ExpenseReportPageModel {
  content: ExpenseReportModel[]
  totalItems: number
  totalPages: number
  currentPage?: number
  rowsPerPage?: number
}
