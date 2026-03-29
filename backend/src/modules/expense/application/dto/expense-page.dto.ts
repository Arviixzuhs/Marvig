import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'

@ObjectType()
export class ExpensePage extends PageType(ExpenseModel) {}
