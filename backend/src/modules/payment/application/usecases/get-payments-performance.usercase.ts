import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
export class GetPaymentsPerformanceUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,

    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: PaymentFilterDto) {
    const currentData = await this.paymentRepository.findPayments(filters)
    const currentExpensesData = await this.expenseRepository.findExpenses(filters)

    const previousFilters = this.getPreviousPeriod(filters)
    const previousData = await this.paymentRepository.findPayments(previousFilters)
    const previousExpensesData = await this.expenseRepository.findExpenses(previousFilters)

    const currentPayments = currentData.content
    const currentExpenses = currentExpensesData.content

    const previousPayments = previousData.content
    const previousExpenses = previousExpensesData.content

    // 3. Agrupar para el gráfico recortado al mes actual
    const salesPerformanceData = this.mapToMonthly(currentPayments)

    // 4. Cálculos de Totales
    const currentIncome = currentPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const currentOutgo = currentExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const currentProfit = currentIncome - currentOutgo

    const previousIncome = previousPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const previousOutgo = previousExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const previousProfit = previousIncome - previousOutgo

    return {
      salesPerformanceData,
      metrics: {
        weeklySales: {
          amount: (currentIncome / 4).toLocaleString(),
          percentage: this.getDiff(currentIncome / 4, previousIncome / 4),
          isPositive: currentIncome / 4 >= previousIncome / 4,
        },
        dailySales: {
          amount: (currentIncome / 30).toLocaleString(),
          percentage: this.getDiff(currentIncome / 30, previousIncome / 30),
          isPositive: currentIncome / 30 >= previousIncome / 30,
        },
        totalSales: {
          count: currentPayments.length,
          percentage: this.getDiff(currentPayments.length, previousPayments.length),
          isPositive: currentPayments.length >= previousPayments.length,
        },
        profit: {
          amount: currentProfit.toLocaleString(),
          percentage: this.getDiff(currentProfit, previousProfit),
          isPositive: currentProfit >= previousProfit && previousProfit > 0,
        },
      },
    }
  }

  private getDiff(curr: number, prev: number): string {
    if (prev === 0) return curr > 0 ? '100' : '0'
    const diff = ((curr - prev) / prev) * 100
    return Math.abs(diff).toFixed(1)
  }

  private mapToMonthly(payments: PaymentModel[]) {
    const currentMonthIndex = new Date().getMonth() + 1

    const months = Array.from({ length: currentMonthIndex }, (_, i) =>
      (i + 1).toString().padStart(2, '0'),
    )

    const map: Record<string, number> = {}
    months.forEach((m) => (map[m] = 0))

    payments.forEach((p) => {
      const m = (new Date(p.date).getMonth() + 1).toString().padStart(2, '0')
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
