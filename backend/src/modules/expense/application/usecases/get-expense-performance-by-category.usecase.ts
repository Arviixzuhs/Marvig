import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
export class GetExpensesPerformanceUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: ExpenseFilterDto) {
    const { content: expenses } = await this.expenseRepository.findExpenses(filters)
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

    const currentMonthIndex = new Date().getMonth()

    const activeMonths = allMonths.slice(0, currentMonthIndex + 1)

    const performanceMap: Record<string, any> = {}

    activeMonths.forEach((month) => {
      performanceMap[month] = {
        month,
        MAINTENANCE: 0,
        UTILITIES: 0,
        CLEANING: 0,
        TAXES: 0,
        SUPPLIES: 0,
        OTHER: 0,
      }
    })

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt)
      const monthName = allMonths[date.getMonth()]
      const category = expense.category

      if (performanceMap[monthName]) {
        performanceMap[monthName][category] += Number(expense.amount)
      }
    })

    return Object.values(performanceMap)
  }
}
