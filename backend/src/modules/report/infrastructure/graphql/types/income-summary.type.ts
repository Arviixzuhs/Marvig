import { ObjectType, Field, Float } from '@nestjs/graphql'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'

@ObjectType()
export class ExpenseByCategoryType {
  @Field(() => ExpenseCategory)
  category: ExpenseCategory

  @Field(() => Float)
  amount: number

  @Field(() => Float)
  percentage: number
}

@ObjectType()
export class IncomeSummaryType {
  @Field(() => Float)
  totalIncome: number

  @Field(() => Float)
  totalExpenses: number

  @Field(() => Float)
  netProfit: number

  @Field(() => [ExpenseByCategoryType])
  expensesByCategory: ExpenseByCategoryType[]
}
