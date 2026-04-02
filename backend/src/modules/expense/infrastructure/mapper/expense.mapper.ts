import { BaseMapper } from '@/common/mappers/base.mapper'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import {
  Expense as PrismaExpense,
  Employee as PrismaEmployee,
  Apartment as PrismaApartment,
} from 'generated/prisma/client'
import { ApartmentMapper } from '@/modules/apartment/infrastructure/mappers/apartment.mapper'
import { EmployeeMapper } from '@/modules/employee/infrastructure/mappers/employee.mapper'

type PrismaExpenseWithRelations = PrismaExpense & {
  apartment?: PrismaApartment
  employee?: PrismaEmployee
}

export class ExpenseMapper extends BaseMapper<PrismaExpenseWithRelations, ExpenseModel> {
  private readonly apartmentMapper = new ApartmentMapper()
  private readonly employeeMapper = new EmployeeMapper()

  modelToDomain(model: PrismaExpenseWithRelations): ExpenseModel {
    return {
      id: model.id,
      amount: Number(model.amount),
      category: model.category as unknown as ExpenseCategory,
      description: model.description,
      apartmentId: model.apartmentId,
      employeeId: model.employeeId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,

      apartment: model.apartment ? this.apartmentMapper.modelToDomain(model.apartment) : undefined,

      employee: model.employee ? this.employeeMapper.modelToDomain(model.employee) : undefined,
    }
  }
}
