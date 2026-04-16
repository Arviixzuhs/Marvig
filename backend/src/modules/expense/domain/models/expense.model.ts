import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { ExpenseImageModel } from '@/modules/expense/domain/models/expense-image.model'

export class ExpenseModel {
  id: number
  date?: Date
  amount: number
  images?: ExpenseImageModel[]
  category: ExpenseCategory
  employee?: EmployeeModel | null
  createdAt?: Date | null
  updatedAt?: Date | null
  apartment?: ApartmentModel
  description: string
  apartmentId: number
  employeeId?: number | null
  paymentMethod: PaymentMethod
}
