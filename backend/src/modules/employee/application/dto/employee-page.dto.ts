import { PageType } from '@/common/dto/page-response.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'

export class EmployeePage extends PageType(EmployeeModel) {}
