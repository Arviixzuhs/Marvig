import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { EmployeeType } from '@/modules/employee/infrastructure/graphql/types/employee.type'
import { EmployeeInput } from '@/modules/employee/infrastructure/graphql/inputs/employee.input'
import { EmployeePageType } from '@/modules/employee/infrastructure/graphql/types/employee-page.type'
import { EmployeeFilterInput } from '@/modules/employee/infrastructure/graphql/inputs/employee-filter.input'
import { UpdateEmployeeInput } from '@/modules/employee/infrastructure/graphql/inputs/update-employee.input'
import { FindEmployeeUseCase } from '@/modules/employee/application/usecases/find-employee.usecase'
import { FindEmployeesUseCase } from '@/modules/employee/application/usecases/find-employees.usecase'
import { CreateEmployeeUseCase } from '@/modules/employee/application/usecases/create-employee.usecase'
import { DeleteEmployeeUseCase } from '@/modules/employee/application/usecases/delete-employee.usecase'
import { UpdateEmployeeUseCase } from '@/modules/employee/application/usecases/update-employee.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => EmployeeType)
export class EmployeeResolver {
  constructor(
    private readonly findEmployeeUseCase: FindEmployeeUseCase,
    private readonly findEmployeesUseCase: FindEmployeesUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
  ) {}

  @Mutation(() => EmployeeType)
  @RequiredRole(UserRole.ADMIN)
  createEmployee(@Args('data') data: EmployeeInput): Promise<EmployeeType> {
    return this.createEmployeeUseCase.execute(data)
  }

  @Query(() => EmployeePageType)
  @RequiredRole(UserRole.ADMIN)
  findEmployees(@Args('filters') filters: EmployeeFilterInput): Promise<EmployeePageType> {
    return this.findEmployeesUseCase.execute(filters)
  }

  @Query(() => EmployeeType)
  @RequiredRole(UserRole.ADMIN)
  findEmployeeById(@Args('id', { type: () => Int }) id: number): Promise<EmployeeType> {
    return this.findEmployeeUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  @RequiredRole(UserRole.ADMIN)
  async deleteEmployee(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteEmployeeUseCase.execute(id)
    return true
  }

  @Mutation(() => EmployeeType)
  @RequiredRole(UserRole.ADMIN)
  updateEmployee(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateEmployeeInput,
  ): Promise<EmployeeType> {
    return this.updateEmployeeUseCase.execute(id, data)
  }
}
