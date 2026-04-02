import { BaseMapper } from '@/common/mappers/base.mapper'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { Employee as PrismaEmployee } from 'generated/prisma/client'

export class EmployeeMapper extends BaseMapper<PrismaEmployee, EmployeeModel> {
  modelToDomain(model: PrismaEmployee): EmployeeModel {
    return {
      id: model.id,
      name: model.name,
      lastName: model.lastName,
      phone: model.phone,
      email: model.email,
      address: model.address,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
