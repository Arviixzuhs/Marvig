import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class ExpenseReportFilterDto extends PaginationFilterDto {
  fromDate?: string
  toDate?: string
  category?: ExpenseCategory
  search?: string
  minAmount?: number
  maxAmount?: number
  employeeId?: number
  apartmentId?: number
}
