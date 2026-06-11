import { Injectable, Inject } from '@nestjs/common'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import { ExpenseReportFilterDto } from '@/modules/report/application/dto/expense-report-filter.dto'
import { ExpenseReportModel, ExpenseReportPageModel } from '@/modules/report/domain/models/expense-report.model'

@Injectable()
export class ExpenseReportUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: ExpenseReportFilterDto): Promise<ExpenseReportPageModel> {
    const result = await this.expenseRepository.findExpenses(filters)

    const content: ExpenseReportModel[] = result.content.map((e) => ({
      id: e.id,
      amount: e.amount,
      category: e.category,
      date: e.date,
      description: e.description,
      paymentMethod: e.paymentMethod,
      apartmentId: e.apartmentId,
      employeeId: e.employeeId,
      apartment: e.apartment
        ? {
            id: e.apartment.id,
            number: e.apartment.number,
            floor: e.apartment.floor,
          }
        : undefined,
    }))

    return {
      content,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      rowsPerPage: result.rowsPerPage,
    }
  }
}
