export class ExpenseMonthlyPerformanceDto {
  month: string
  TAXES: number
  OTHER: number
  SUPPLIES: number
  CLEANING: number
  UTILITIES: number
  MAINTENANCE: number
}

export class ExpenseMetricItemDto {
  amount: string
  percentage: string
  isPositive: boolean
}

export class ExpenseMetricsSummaryDto {
  totalExpenses: ExpenseMetricItemDto
  dailyExpenses: ExpenseMetricItemDto
}

export class ExpensePerformanceResponseDto {
  expenses: ExpenseMonthlyPerformanceDto[]
  metrics: ExpenseMetricsSummaryDto
}
