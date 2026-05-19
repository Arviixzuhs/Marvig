import { ExpenseInput } from './expense.input'
import { InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateExpenseInput extends PartialType(ExpenseInput) {}
