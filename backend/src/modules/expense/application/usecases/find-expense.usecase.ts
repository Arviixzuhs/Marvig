import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
export class FindExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(expenseId: number): Promise<ExpenseModel> {
    const expense = await this.expenseRepository.findExpense(expenseId)

    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${expenseId} no encontrado`)
    }

    return expense
  }
}
