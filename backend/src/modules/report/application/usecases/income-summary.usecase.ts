import { Injectable, Inject } from '@nestjs/common'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import { OccupancyReportFilterDto } from '@/modules/report/application/dto/occupancy-report-filter.dto'
import { IncomeSummaryModel, ExpenseByCategoryModel } from '@/modules/report/domain/models/income-summary.model'

@Injectable()
export class IncomeSummaryUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: OccupancyReportFilterDto): Promise<IncomeSummaryModel> {
    const [paymentsResult, expensesResult] = await Promise.all([
      this.paymentRepository.findPayments({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        status: PaymentStatus.CONFIRMED,
        page: 0,
        pageSize: 99999,
      }),
      this.expenseRepository.findExpenses({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        page: 0,
        pageSize: 99999,
      }),
    ])

    const totalIncome = paymentsResult.content.reduce((sum, p) => sum + p.amount, 0)
    const totalExpenses = expensesResult.content.reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalIncome - totalExpenses

    // Group expenses by category
    const categoryMap = new Map<string, number>()
    for (const expense of expensesResult.content) {
      const current = categoryMap.get(expense.category) ?? 0
      categoryMap.set(expense.category, current + expense.amount)
    }

    const expensesByCategory: ExpenseByCategoryModel[] = Array.from(categoryMap.entries()).map(
      ([category, amount]) => ({
        category: category as any,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 10000) / 100 : 0,
      }),
    )

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      expensesByCategory,
    }
  }
}
