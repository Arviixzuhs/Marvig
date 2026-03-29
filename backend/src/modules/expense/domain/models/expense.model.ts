import { Decimal } from '@prisma/client/runtime/client'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ExpenseCategory } from 'generated/prisma/enums'

export class ExpenseModel {
  id: number
  amount: Decimal
  category: ExpenseCategory
  employee?: EmployeeModel | null
  createdAt?: Date | null
  updatedAt?: Date | null
  apartment?: ApartmentModel
  description: string
  apartmentId: number
  employeeId?: number | null
}
