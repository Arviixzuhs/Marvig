import { ExpensePage } from '@/modules/expense/application/dto/expense-page.dto'
import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
export class FindExpensesUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(filters: ExpenseFilterDto): Promise<ExpensePage> {
    return await this.expenseRepository.findExpenses(filters)
  }
}
