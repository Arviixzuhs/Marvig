import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { Inject, Injectable } from '@nestjs/common'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'

@Injectable()
export class CreateEmployeeUseCase {
  constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepositoryPort) {}

  async execute(data: EmployeeDto): Promise<EmployeeModel> {
    const createdAuthor = await this.employeeRepository.createEmployee(data)
    return createdAuthor
  }
}
