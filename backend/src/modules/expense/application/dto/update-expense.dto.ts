import { ExpenseDto } from './expense.dto'
import { InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateExpenseDto extends PartialType(ExpenseDto) {}
