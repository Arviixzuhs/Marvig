import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeePage } from '@/modules/employee/application/dto/employee-page.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeFilterDto } from '@/modules/employee/application/dto/employee-filter.dto'
import { UpdateEmployeeDto } from '@/modules/employee/application/dto/update-employee.dto'

export interface EmployeeRepositoryPort {
  existsById(employeeId: number): Promise<boolean>
  findEmployee(employeeId: number): Promise<EmployeeModel>
  findEmployees(filters: EmployeeFilterDto): Promise<EmployeePage>
  createEmployee(employee: EmployeeDto): Promise<EmployeeModel>
  deleteEmployee(employeeId: number): Promise<void>
  updateEmployee(employeeId: number, newData: UpdateEmployeeDto): Promise<EmployeeModel>
}
