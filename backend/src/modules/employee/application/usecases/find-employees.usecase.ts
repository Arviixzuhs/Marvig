import { EmployeePage } from '@/modules/employee/application/dto/employee-page.dto'
import { EmployeeFilterDto } from '@/modules/employee/application/dto/employee-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'

@Injectable()
export class FindEmployeesUseCase {
  constructor(
    @Inject('EmployeeRepository') private readonly employeeRepository: EmployeeRepositoryPort,
  ) {}

  async execute(filters: EmployeeFilterDto): Promise<EmployeePage> {
    const employees = await this.employeeRepository.findEmployees(filters)
    return employees
  }
}
