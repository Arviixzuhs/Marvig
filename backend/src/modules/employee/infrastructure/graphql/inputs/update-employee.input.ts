import { InputType, PartialType } from '@nestjs/graphql'
import { EmployeeInput } from './employee.input'

@InputType()
export class UpdateEmployeeInput extends PartialType(EmployeeInput) {}
