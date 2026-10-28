import { EmployeeRepositoryPort } from '@/modules/employee/domain/repositories/employee.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const employee = await this.employeeRepository.findEmployee(id)
    if (!employee) throw new NotFoundException('Empleado no encontrado.')

    await this.employeeRepository.deleteEmployee(id)
  }
}
