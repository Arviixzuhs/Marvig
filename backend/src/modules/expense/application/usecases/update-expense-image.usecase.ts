import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { ExpenseImageDto } from '@/modules/expense/application/dto/expense-image.dto'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import { ExpenseImageRepositoryPort } from '@/modules/expense/domain/repositories/expense-image.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateExpenseImagesUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly expenseRepository: ExpenseRepositoryPort,

    @Inject('ExpenseImageRepository')
    private readonly expenseImageRepository: ExpenseImageRepositoryPort,
  ) {}

  async execute(data: ExpenseImageDto): Promise<ExpenseModel> {
    const expense = await this.expenseRepository.existsExpenseById(data.id)
    if (!expense) throw new NotFoundException('Expense not found')

    await this.expenseImageRepository.deleteImagesByExpense(data.id)

    if (data.imageUrls.length > 0) {
      await this.expenseImageRepository.createImages(data)
    }

    const updatedExpense = await this.expenseRepository.findExpense(data.id)
    return updatedExpense!
  }
}
