import { ExpenseImageDto } from '@/modules/expense/application/dto/expense-image.dto'
import { ExpenseImageModel } from '@/modules/expense/domain/models/expense-image.model'

export interface ExpenseImageRepositoryPort {
  createImages(data: ExpenseImageDto): Promise<void>
  getImagesByExpense(expenseId: number): Promise<ExpenseImageModel[]>
  deleteImagesByExpense(expenseId: number): Promise<void>
}
