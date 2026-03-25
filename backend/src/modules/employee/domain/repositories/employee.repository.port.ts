import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeFilterDto } from '@/modules/employee/application/dto/employee-filter.dto'
import { EmployeePage } from '../../application/dto/employee-page.dto'

export interface EmployeeRepositoryPort {
  findEmployee(employeeId: number): Promise<EmployeeModel>
  findEmployees(filters: EmployeeFilterDto): Promise<EmployeePage>
  createEmployee(employee: EmployeeDto): Promise<EmployeeModel>
  deleteEmployee(employeeId: number): Promise<void>
  updateEmployee(employeeId: number, newData: EmployeeDto): Promise<EmployeeModel>
}
