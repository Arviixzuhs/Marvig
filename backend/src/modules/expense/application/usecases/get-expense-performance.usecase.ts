import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import {
  getDaysDifference,
  getPercentageDiff,
  getPreviousPeriod,
} from '@/common/utils/dashboard-date.util'
import {
  ExpensePerformanceResponseDto,
  ExpenseMonthlyPerformanceDto,
} from '@/modules/expense/application/dto/expense-performance.dto'

@Injectable()
export class GetExpensesPerformanceUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: ExpenseFilterDto): Promise<ExpensePerformanceResponseDto> {
    const previousDates = getPreviousPeriod(filters.fromDate, filters.toDate)

    const [currentData, previousData] = await Promise.all([
      this.expenseRepository.findExpenses({ ...filters, isUnpaged: true }),
      this.expenseRepository.findExpenses({
        ...filters,
        fromDate: previousDates.fromDate,
        toDate: previousDates.toDate,
        isUnpaged: true,
      }),
    ])

    const currentExpenses = currentData.content
    const previousExpenses = previousData.content

    const expensesPerformanceData = this.mapToMonthly(currentExpenses, filters.fromDate)

    // Cálculos directos
    const currentTotal = currentExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const previousTotal = previousExpenses.reduce((acc, e) => acc + Number(e.amount), 0)

    const daysAmount = getDaysDifference(filters.fromDate, filters.toDate)
    const currentDailyAvg = currentTotal / daysAmount
    const previousDailyAvg = previousTotal / daysAmount

    return {
      expenses: expensesPerformanceData,
      metrics: {
        totalExpenses: {
          amount: currentTotal.toString(),
          percentage: getPercentageDiff(currentTotal, previousTotal),
          isPositive: currentTotal <= previousTotal,
        },
        dailyExpenses: {
          amount: currentDailyAvg.toFixed(2),
          percentage: getPercentageDiff(currentDailyAvg, previousDailyAvg),
          isPositive: currentDailyAvg <= previousDailyAvg,
        },
      },
    }
  }

  private mapToMonthly(
    expenses: ExpenseModel[],
    fromDate?: string,
  ): ExpenseMonthlyPerformanceDto[] {
    const allMonths = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const targetYear = fromDate ? new Date(fromDate).getUTCFullYear() : new Date().getUTCFullYear()
    const maxMonth = targetYear === new Date().getUTCFullYear() ? new Date().getUTCMonth() : 11

    const performanceMap: Record<string, any> = {}

    for (let i = 0; i <= maxMonth; i++) {
      const monthName = allMonths[i]
      performanceMap[monthName] = {
        month: monthName,
        MAINTENANCE: 0,
        UTILITIES: 0,
        CLEANING: 0,
        TAXES: 0,
        SUPPLIES: 0,
        OTHER: 0,
      }
    }

    expenses.forEach((expense) => {
      const monthName = allMonths[new Date(expense.createdAt).getUTCMonth()]
      if (performanceMap[monthName] && performanceMap[monthName][expense.category] !== undefined) {
        performanceMap[monthName][expense.category] += Number(expense.amount)
      }
    })

    return Object.values(performanceMap)
  }
}
