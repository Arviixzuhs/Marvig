import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

export class UpdateExpenseDto {
  date?: Date
  amount?: number
  category?: ExpenseCategory
  employeeId?: number
  description?: string
  apartmentId?: number
  paymentMethod?: PaymentMethod
}
