import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { UpdateExpenseDto } from '@/modules/expense/application/dto/update-expense.dto'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(expenseId: number, data: UpdateExpenseDto): Promise<ExpenseModel> {
    const expense = await this.expenseRepository.existsExpenseById(expenseId)
    if (!expense) throw new NotFoundException('Expense not found')

    return await this.expenseRepository.updateExpense(expenseId, data)
  }
}
