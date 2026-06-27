import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class ExpenseFilterDto extends PaginationFilterDto {
  search?: string
  toDate?: string
  category?: ExpenseCategory | ExpenseCategory[]
  fromDate?: string
  minAmount?: number
  maxAmount?: number
  employeeId?: number
  apartmentId?: number
  paymentMethod?: PaymentMethod | PaymentMethod[]
}
