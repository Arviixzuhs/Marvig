import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'

export class ExpenseModel {
  id: number
  amount: number
  category: ExpenseCategory
  employee?: EmployeeModel | null
  createdAt?: Date | null
  updatedAt?: Date | null
  apartment?: ApartmentModel
  description: string
  apartmentId: number
  employeeId?: number | null
}
