import { Injectable } from '@nestjs/common'
import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { PrismaClient } from 'generated/prisma/client'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'

@Injectable()
export class PrismaEmployeeRepositoryAdapter implements EmployeeRepositoryPort {
  constructor(private prisma: PrismaClient) { }

  async createEmployee(data: EmployeeModel): Promise<EmployeeModel> {
    const createdEmployee = await this.prisma.employee.create({
      data: { ...data },
    })
    return createdEmployee
  }

  async findEmployees(): Promise<EmployeeModel[]> {
    const employees = await this.prisma.employee.findMany({
      where: { isDeleted: false }
    })
    return employees
  }

  async deleteEmployee(userId: number): Promise<void> {
    await this.prisma.employee.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    })
  }

  async updateEmployee(userId: number, newData: EmployeeDto): Promise<EmployeeModel> {
    const updatedEmployee = await this.prisma.employee.update({
      where: { id: userId, isDeleted: false },
      data: newData,
    })
    return updatedEmployee
  }

  async findEmployee(userId: number): Promise<EmployeeModel> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: userId, isDeleted: false },
    })
    return employee
  }
}
