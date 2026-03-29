import { ExpenseDto } from '@/modules/expense/application/dto/expense.dto'
import { ExpensePage } from '@/modules/expense/application/dto/expense-page.dto'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { UpdateExpenseDto } from '@/modules/expense/application/dto/update-expense.dto'
import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'

export interface ExpenseRepositoryPort {
  findExpense(expenseId: number): Promise<ExpenseModel>
  findExpenses(filters: ExpenseFilterDto): Promise<ExpensePage>
  createExpense(expense: ExpenseDto): Promise<ExpenseModel>
  deleteExpense(expenseId: number): Promise<void>
  updateExpense(expenseId: number, newData: UpdateExpenseDto): Promise<ExpenseModel>
  existsExpenseById(expenseId: number): Promise<boolean>
  findExpensesByApartment(apartmentId: number): Promise<ExpenseModel[]>
}
