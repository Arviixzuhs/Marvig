import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { UpdateEmployeeDto } from '../dto/update-employee.dto'
import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository') private readonly employeeRepository: EmployeeRepositoryPort,
  ) {}

  async execute(id: number, newData: UpdateEmployeeDto): Promise<EmployeeModel> {
    const employee = await this.employeeRepository.findEmployee(id)
    if (!employee) throw new NotFoundException('Employee not found')

    const updatedEmployee = await this.employeeRepository.updateEmployee(id, newData)
    return updatedEmployee
  }
}
