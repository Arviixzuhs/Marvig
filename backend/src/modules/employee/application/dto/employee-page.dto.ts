import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'

@ObjectType()
export class EmployeePage extends PageType(EmployeeModel) {}
