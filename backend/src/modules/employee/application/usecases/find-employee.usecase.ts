import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository') private readonly employeeRepository: EmployeeRepositoryPort,
  ) {}

  async execute(id: number): Promise<EmployeeModel> {
    const employee = await this.employeeRepository.findEmployee(id)
    if (!employee) throw new NotFoundException('Employee not found')

    return employee
  }
}
