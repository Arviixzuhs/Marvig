import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
export class DeleteExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(expenseId: number): Promise<void> {
    const expense = await this.expenseRepository.existsExpenseById(expenseId)
    if (!expense) throw new NotFoundException('Expense not found')

    await this.expenseRepository.deleteExpense(expenseId)
  }
}
