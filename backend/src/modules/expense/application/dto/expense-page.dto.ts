import { PageType } from '@/common/dto/page-response.dto'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'

export class ExpensePage extends PageType(ExpenseModel) {}
