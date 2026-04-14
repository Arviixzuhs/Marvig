import { ExpenseDto } from '@/modules/expense/application/dto/expense.dto'
import { ExpenseType } from '@/modules/expense/infrastructure/graphql/types/expense.type'
import { ExpensePageType } from '@/modules/expense/infrastructure/graphql/types/expense-page.type'
import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { UpdateExpenseDto } from '@/modules/expense/application/dto/update-expense.dto'
import { FindExpenseUseCase } from '@/modules/expense/application/usecases/find-expense.usecase'
import { FindExpensesUseCase } from '@/modules/expense/application/usecases/find-expenses.usecase'
import { CreateExpenseUseCase } from '@/modules/expense/application/usecases/create-expense.usecase'
import { DeleteExpenseUseCase } from '@/modules/expense/application/usecases/delete-expense.usecase'
import { UpdateExpenseUseCase } from '@/modules/expense/application/usecases/update-expense.usecase'
import { ExpensePerformanceType } from '@/modules/expense/infrastructure/graphql/types/expense-performance.type'
import { GetExpensesPerformanceUseCase } from '@/modules/expense/application/usecases/get-expense-performance-by-category.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ExpenseType)
export class ExpenseResolver {
  constructor(
    private readonly findExpenseUseCase: FindExpenseUseCase,
    private readonly findExpensesUseCase: FindExpensesUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly getExpensesPerformanceUseCase: GetExpensesPerformanceUseCase,
  ) {}

  @Mutation(() => ExpenseType)
  createExpense(@Args('data') data: ExpenseDto): Promise<ExpenseType> {
    return this.createExpenseUseCase.execute(data)
  }

  @Query(() => ExpensePageType)
  findExpenses(@Args('filters') filters: ExpenseFilterDto): Promise<ExpensePageType> {
    return this.findExpensesUseCase.execute(filters)
  }

  @Query(() => ExpenseType)
  findExpenseById(@Args('id', { type: () => Int }) id: number): Promise<ExpenseType> {
    return this.findExpenseUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  async deleteExpense(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteExpenseUseCase.execute(id)
    return true
  }

  @Mutation(() => ExpenseType)
  updateExpense(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateExpenseDto,
  ): Promise<ExpenseType> {
    return this.updateExpenseUseCase.execute(id, data)
  }

  @Query(() => [ExpensePerformanceType])
  async getExpensesPerformance(
    @Args('filters') filters: ExpenseFilterDto,
  ): Promise<ExpensePerformanceType[]> {
    return this.getExpensesPerformanceUseCase.execute(filters)
  }
}
