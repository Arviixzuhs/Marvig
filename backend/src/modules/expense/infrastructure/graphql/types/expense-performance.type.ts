import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType()
export class ExpenseMonthlyCategoryPerformanceType {
  @Field()
  month: string

  @Field(() => Float)
  MAINTENANCE: number

  @Field(() => Float)
  UTILITIES: number

  @Field(() => Float)
  CLEANING: number

  @Field(() => Float)
  TAXES: number

  @Field(() => Float)
  SUPPLIES: number

  @Field(() => Float)
  OTHER: number
}

@ObjectType()
export class ExpenseMetricItem {
  @Field()
  amount: string

  @Field()
  percentage: string

  @Field()
  isPositive: boolean
}

@ObjectType()
export class ExpenseMetrics {
  @Field(() => ExpenseMetricItem)
  totalExpenses: ExpenseMetricItem

  @Field(() => ExpenseMetricItem)
  dailyExpenses: ExpenseMetricItem
}

@ObjectType()
export class ExpensePerformanceType {
  @Field(() => [ExpenseMonthlyCategoryPerformanceType])
  expenses: ExpenseMonthlyCategoryPerformanceType[]

  @Field(() => ExpenseMetrics)
  metrics: ExpenseMetrics
}
