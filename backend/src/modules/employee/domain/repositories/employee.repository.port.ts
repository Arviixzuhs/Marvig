import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'

export interface EmployeeRepositoryPort {
  findEmployee(employeeId: number): Promise<EmployeeModel>
  findEmployees(): Promise<EmployeeModel[]>
  createEmployee(employee: EmployeeDto): Promise<EmployeeModel>
  deleteEmployee(employeeId: number): Promise<void>
  updateEmployee(employeeId: number, newData: EmployeeDto): Promise<EmployeeModel>
}
