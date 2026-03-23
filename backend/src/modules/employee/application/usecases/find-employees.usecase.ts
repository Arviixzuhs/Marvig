import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { Inject, Injectable } from '@nestjs/common'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'

@Injectable()
export class FindEmployeesUseCase {
  constructor(
    @Inject('EmployeeRepository') private readonly employeeRepository: EmployeeRepositoryPort,
  ) {}

  async execute(): Promise<EmployeeModel[]> {
    const employees = await this.employeeRepository.findEmployees()
    return employees
  }
}
