import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import {
  getDaysDifference,
  getPercentageDiff,
  getPreviousPeriod,
} from '@/common/utils/dashboard-date.util'

@Injectable()
export class GetPaymentsPerformanceUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,

    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: PaymentFilterDto) {
    const [currentData, currentExpensesData] = await Promise.all([
      this.paymentRepository.findPayments({ ...filters, isUnpaged: true }),
      this.expenseRepository.findExpenses({
        toDate: filters.toDate,
        fromDate: filters.fromDate,
        isUnpaged: true,
      }),
    ])

    const previousDates = getPreviousPeriod(filters.fromDate, filters.toDate)
    const [previousData, previousExpensesData] = await Promise.all([
      this.paymentRepository.findPayments({
        ...filters,
        toDate: previousDates.toDate,
        fromDate: previousDates.fromDate,
        isUnpaged: true,
      }),
      this.expenseRepository.findExpenses({
        toDate: previousDates.toDate,
        fromDate: previousDates.fromDate,
        isUnpaged: true,
      }),
    ])

    const currentPayments = currentData.content
    const currentExpenses = currentExpensesData.content
    const previousPayments = previousData.content
    const previousExpenses = previousExpensesData.content

    // Simplificación: Se pasa directamente solo la fecha inicial
    const salesPerformanceData = this.mapToMonthly(currentPayments, filters.fromDate)

    // Totales
    const currentIncome = currentPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const currentOutgo = currentExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const currentProfit = currentIncome - currentOutgo

    const previousIncome = previousPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const previousOutgo = previousExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const previousProfit = previousIncome - previousOutgo

    const daysAmount = getDaysDifference(filters.fromDate, filters.toDate) || 30

    return {
      salesPerformanceData,
      metrics: {
        weeklySales: {
          amount: (currentIncome / daysAmount) * 7,
          percentage: getPercentageDiff(currentIncome, previousIncome),
          isPositive: currentIncome >= previousIncome,
        },
        dailySales: {
          amount: currentIncome / daysAmount,
          percentage: getPercentageDiff(currentIncome, previousIncome),
          isPositive: currentIncome >= previousIncome,
        },
        totalSales: {
          count: currentPayments.length,
          percentage: getPercentageDiff(currentPayments.length, previousPayments.length),
          isPositive: currentPayments.length >= previousPayments.length,
        },
        profit: {
          amount: currentProfit,
          percentage: getPercentageDiff(currentProfit, previousProfit),
          isPositive: currentProfit >= previousProfit,
        },
      },
    }
  }

  private mapToMonthly(payments: PaymentModel[], fromDate?: string) {
    const targetYear = fromDate ? new Date(fromDate).getUTCFullYear() : new Date().getUTCFullYear()
    const currentYear = new Date().getUTCFullYear()

    const maxMonth = targetYear === currentYear ? new Date().getUTCMonth() + 1 : 12

    const map: Record<string, number> = {}
    for (let i = 1; i <= maxMonth; i++) {
      map[i.toString().padStart(2, '0')] = 0
    }

    payments.forEach((p) => {
      const m = (new Date(p.date).getUTCMonth() + 1).toString().padStart(2, '0')
      if (map[m] !== undefined) map[m] += Number(p.amount)
    })

    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }
}
