import { ExpenseDto } from '@/modules/expense/application/dto/expense.dto'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { Inject, Injectable } from '@nestjs/common'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  async execute(data: ExpenseDto): Promise<ExpenseModel> {
    const createdExpense = await this.expenseRepository.createExpense(data)

    return createdExpense
  }
}
