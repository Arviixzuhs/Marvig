import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'
import { ExpenseDto } from '@/modules/expense/application/dto/expense.dto'
import { ExpensePage } from '@/modules/expense/application/dto/expense-page.dto'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { UpdateExpenseDto } from '@/modules/expense/application/dto/update-expense.dto'
import { FindExpenseUseCase } from '@/modules/expense/application/usecases/find-expense.usecase'
import { FindExpensesUseCase } from '@/modules/expense/application/usecases/find-expenses.usecase'
import { CreateExpenseUseCase } from '@/modules/expense/application/usecases/create-expense.usecase'
import { DeleteExpenseUseCase } from '@/modules/expense/application/usecases/delete-expense.usecase'
import { UpdateExpenseUseCase } from '@/modules/expense/application/usecases/update-expense.usecase'

@Resolver(() => ExpenseModel)
export class ExpenseResolver {
  constructor(
    private readonly findExpenseUseCase: FindExpenseUseCase,
    private readonly findExpensesUseCase: FindExpensesUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
    private readonly createExpenseUseCase: CreateExpenseUseCase,
  ) {}

  @Mutation(() => ExpenseModel)
  createExpense(@Args('data') data: ExpenseDto): Promise<ExpenseModel> {
    return this.createExpenseUseCase.execute(data)
  }

  @Query(() => ExpensePage)
  findExpenses(@Args('filters') filters: ExpenseFilterDto): Promise<ExpensePage> {
    return this.findExpensesUseCase.execute(filters)
  }

  @Query(() => ExpenseModel)
  findExpenseById(@Args('id', { type: () => Int }) id: number): Promise<ExpenseModel> {
    return this.findExpenseUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  async deleteExpense(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteExpenseUseCase.execute(id)
    return true
  }

  @Mutation(() => ExpenseModel)
  updateExpense(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateExpenseDto,
  ): Promise<ExpenseModel> {
    return this.updateExpenseUseCase.execute(id, data)
  }
}
