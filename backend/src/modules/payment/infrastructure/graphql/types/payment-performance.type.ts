import { Field, ObjectType, Float, Int } from '@nestjs/graphql'

@ObjectType()
class SalesPerformanceData {
  @Field()
  name: string

  @Field(() => Float)
  value: number
}

@ObjectType()
class MetricDetail {
  @Field()
  amount: string

  @Field()
  percentage: string

  @Field()
  isPositive: boolean
}

@ObjectType()
class TotalSalesMetric {
  @Field(() => Int)
  count: number

  @Field()
  percentage: string

  @Field()
  isPositive: boolean
}

@ObjectType()
class ProfitMetric {
  @Field()
  amount: string

  @Field()
  percentage: string

  @Field()
  isPositive: boolean
}

@ObjectType()
class PaymentMetrics {
  @Field(() => MetricDetail)
  weeklySales: MetricDetail

  @Field(() => MetricDetail)
  dailySales: MetricDetail

  @Field(() => TotalSalesMetric)
  totalSales: TotalSalesMetric

  @Field(() => ProfitMetric)
  profit: ProfitMetric
}

@ObjectType()
export class PaymentPerformanceType {
  @Field(() => [SalesPerformanceData])
  salesPerformanceData: SalesPerformanceData[]

  @Field(() => PaymentMetrics)
  metrics: PaymentMetrics
}
