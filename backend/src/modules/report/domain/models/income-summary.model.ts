import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'

export class ExpenseByCategoryModel {
  category: ExpenseCategory
  amount: number
  percentage: number
}

export class IncomeSummaryModel {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  expensesByCategory: ExpenseByCategoryModel[]
}
