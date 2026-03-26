import { InputType, PartialType } from "@nestjs/graphql";
import { EmployeeDto } from "./employee.dto";

@InputType()
export class UpdateEmployeeDto extends PartialType(EmployeeDto) {}
