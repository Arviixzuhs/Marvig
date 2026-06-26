import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
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
      this.expenseRepository.findExpenses({ ...filters, isUnpaged: true }),
    ])

    const previousFilters = this.getPreviousPeriod(filters)
    const [previousData, previousExpensesData] = await Promise.all([
      this.paymentRepository.findPayments({ ...previousFilters, isUnpaged: true }),
      this.expenseRepository.findExpenses({ ...previousFilters, isUnpaged: true }),
    ])

    const currentPayments = currentData.content
    const currentExpenses = currentExpensesData.content
    const previousPayments = previousData.content
    const previousExpenses = previousExpensesData.content

    const salesPerformanceData = this.mapToMonthly(currentPayments, filters)

    // Totales
    const currentIncome = currentPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const currentOutgo = currentExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const currentProfit = currentIncome - currentOutgo

    const previousIncome = previousPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const previousOutgo = previousExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const previousProfit = previousIncome - previousOutgo

    // Calcular días reales del periodo para promedios exactos
    const daysAmount = this.getDaysDifference(filters.fromDate, filters.toDate) || 30

    return {
      salesPerformanceData,
      metrics: {
        weeklySales: {
          amount: (currentIncome / daysAmount) * 7,
          percentage: this.getDiff(currentIncome, previousIncome),
          isPositive: currentIncome >= previousIncome,
        },
        dailySales: {
          amount: currentIncome / daysAmount,
          percentage: this.getDiff(currentIncome, previousIncome),
          isPositive: currentIncome >= previousIncome,
        },
        totalSales: {
          count: currentPayments.length,
          percentage: this.getDiff(currentPayments.length, previousPayments.length),
          isPositive: currentPayments.length >= previousPayments.length,
        },
        profit: {
          amount: currentProfit,
          percentage: this.getDiff(currentProfit, previousProfit),
          isPositive: currentProfit >= previousProfit,
        },
      },
    }
  }

  private getDiff(curr: number, prev: number): string {
    if (prev === 0) return curr > 0 ? '100' : '0'
    const diff = ((curr - prev) / Math.abs(prev)) * 100
    return Math.abs(diff).toFixed(1)
  }

  private getDaysDifference(from?: string, to?: string): number {
    if (!from || !to) return 30
    const diff = new Date(to).getTime() - new Date(from).getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  private mapToMonthly(payments: PaymentModel[], filters: PaymentFilterDto) {
    const targetYear = filters.fromDate
      ? new Date(filters.fromDate).getUTCFullYear()
      : new Date().getUTCFullYear()
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

  private getPreviousPeriod(f: PaymentFilterDto): PaymentFilterDto {
    const pf = { ...f }
    if (f.fromDate && f.toDate) {
      const start = new Date(f.fromDate)
      const end = new Date(f.toDate)
      const diff = end.getTime() - start.getTime()
      pf.fromDate = new Date(start.getTime() - diff).toISOString()
      pf.toDate = new Date(start.getTime()).toISOString()
    }
    return pf
  }
}
