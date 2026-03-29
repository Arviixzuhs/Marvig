import { Injectable } from '@nestjs/common'
import { EmployeePage } from '@/modules/employee/application/dto/employee-page.dto'
import { PrismaClient } from 'generated/prisma/client'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { UpdateEmployeeDto } from '@/modules/employee/application/dto/update-employee.dto'
import { EmployeeFilterDto } from '@/modules/employee/application/dto/employee-filter.dto'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'
import { EmployeeSpecificationBuilder } from './prisma.employee.specificationBuilder'

@Injectable()
export class PrismaEmployeeRepositoryAdapter implements EmployeeRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createEmployee(data: EmployeeModel): Promise<EmployeeModel> {
    const createdEmployee = await this.prisma.employee.create({
      data: { ...data },
    })
    return createdEmployee
  }

  async findEmployees(filters: EmployeeFilterDto): Promise<EmployeePage> {
    const query = new EmployeeSpecificationBuilder()
      .withName(filters.name)
      .withEmail(filters.email)
      .withPhone(filters.phone)
      .withSearch(filters.search)
      .withOrderBy({ createdAt: 'desc' })
      .withLastName(filters.lastName)
      .withIsDeleted(false)
      .withPagination(filters.page, filters.pageSize)
      .withCreatedAtBetween(filters.fromDate, filters.toDate)
      .build()

    const [employees, employeesCount] = await this.prisma.$transaction([
      this.prisma.employee.findMany(query),
      this.prisma.employee.count({
        where: query.where,
      }),
    ])

    return {
      content: employees,
      totalPages: Math.ceil(employeesCount / query.take),
      totalItems: employeesCount,
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })
  }

  async updateEmployee(id: number, newData: UpdateEmployeeDto): Promise<EmployeeModel> {
    const updatedEmployee = await this.prisma.employee.update({
      where: { id, isDeleted: false },
      data: newData,
    })
    return updatedEmployee
  }

  async existsById(id: number): Promise<boolean> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    })
    return !!employee
  }

  async findEmployee(id: number): Promise<EmployeeModel> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    })
    return employee
  }
}
