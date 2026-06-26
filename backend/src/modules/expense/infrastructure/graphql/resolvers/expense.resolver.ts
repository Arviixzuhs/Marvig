import { UserRole } from '@/common/enums/user-role.enum'
import { ExpenseType } from '@/modules/expense/infrastructure/graphql/types/expense.type'
import { ExpenseInput } from '@/modules/expense/infrastructure/graphql/inputs/expense.input'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { ExpensePageType } from '@/modules/expense/infrastructure/graphql/types/expense-page.type'
import { ExpenseImageInput } from '@/modules/expense/infrastructure/graphql/inputs/expense-image.input'
import { UpdateExpenseInput } from '@/modules/expense/infrastructure/graphql/inputs/update-expense.input'
import { ExpenseFilterInput } from '@/modules/expense/infrastructure/graphql/inputs/expense-filter.input'
import { FindExpenseUseCase } from '@/modules/expense/application/usecases/find-expense.usecase'
import { FindExpensesUseCase } from '@/modules/expense/application/usecases/find-expenses.usecase'
import { CreateExpenseUseCase } from '@/modules/expense/application/usecases/create-expense.usecase'
import { DeleteExpenseUseCase } from '@/modules/expense/application/usecases/delete-expense.usecase'
import { UpdateExpenseUseCase } from '@/modules/expense/application/usecases/update-expense.usecase'
import { ExpensePerformanceType } from '@/modules/expense/infrastructure/graphql/types/expense-performance.type'
import { UpdateExpenseImagesUseCase } from '@/modules/expense/application/usecases/update-expense-image.usecase'
import { GetExpensesPerformanceUseCase } from '@/modules/expense/application/usecases/get-expense-performance.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ExpenseType)
export class ExpenseResolver {
  constructor(
    private readonly findExpenseUseCase: FindExpenseUseCase,
    private readonly findExpensesUseCase: FindExpensesUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly updateExpenseImagesUseCase: UpdateExpenseImagesUseCase,
    private readonly getExpensesPerformanceUseCase: GetExpensesPerformanceUseCase,
  ) {}

  @Mutation(() => ExpenseType)
  @RequiredRole(UserRole.ADMIN)
  createExpense(@Args('data') data: ExpenseInput): Promise<ExpenseType> {
    return this.createExpenseUseCase.execute(data)
  }

  @Query(() => ExpensePageType)
  @RequiredRole(UserRole.ADMIN)
  findExpenses(@Args('filters') filters: ExpenseFilterInput): Promise<ExpensePageType> {
    return this.findExpensesUseCase.execute(filters)
  }

  @Query(() => ExpenseType)
  @RequiredRole(UserRole.ADMIN)
  findExpenseById(@Args('id', { type: () => Int }) id: number): Promise<ExpenseType> {
    return this.findExpenseUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  @RequiredRole(UserRole.ADMIN)
  async deleteExpense(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteExpenseUseCase.execute(id)
    return true
  }

  @Mutation(() => ExpenseType)
  @RequiredRole(UserRole.ADMIN)
  updateExpense(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateExpenseInput,
  ): Promise<ExpenseType> {
    return this.updateExpenseUseCase.execute(id, data)
  }

  @Mutation(() => ExpenseType)
  @RequiredRole(UserRole.ADMIN)
  async updateExpenseImages(@Args('data') data: ExpenseImageInput): Promise<ExpenseType> {
    return this.updateExpenseImagesUseCase.execute(data)
  }

  @Query(() => ExpensePerformanceType)
  @RequiredRole(UserRole.ADMIN)
  async getExpensesPerformance(
    @Args('filters') filters: ExpenseFilterInput,
  ): Promise<ExpensePerformanceType> {
    return this.getExpensesPerformanceUseCase.execute(filters)
  }
}
