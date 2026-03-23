import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository') private readonly employeeRepository: EmployeeRepositoryPort,
  ) {}

  async execute(id: number, newData: EmployeeDto): Promise<EmployeeModel> {
    const employee = await this.employeeRepository.findEmployee(id)
    if (!employee) throw new NotFoundException('Employee not found')

    const updatedEmployee = await this.employeeRepository.updateEmployee(id, newData)
    return updatedEmployee
  }
}
