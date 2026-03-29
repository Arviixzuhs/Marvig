import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ExpenseType } from '@/modules/expense/infrastructure/graphql/types/expense.type'

@ObjectType()
export class ExpensePage extends PageType(ExpenseType) {}
