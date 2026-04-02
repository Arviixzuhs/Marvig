import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { EmployeeType } from '@/modules/employee/infrastructure/graphql/types/employee.type'

@ObjectType()
export class EmployeePageType extends PageType(EmployeeType) {}
