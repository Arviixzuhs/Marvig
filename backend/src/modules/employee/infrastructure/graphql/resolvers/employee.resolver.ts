import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeeType } from '@/modules/employee/infrastructure/graphql/types/employee.type'
import { EmployeePageType } from '@/modules/employee/infrastructure/graphql/types/employee-page.type'
import { EmployeeFilterDto } from '@/modules/employee/application/dto/employee-filter.dto'
import { UpdateEmployeeDto } from '@/modules/employee/application/dto/update-employee.dto'
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
  createEmployee(@Args('data') data: EmployeeDto): Promise<EmployeeType> {
    return this.createEmployeeUseCase.execute(data)
  }

  @Query(() => EmployeePageType)
  findEmployees(@Args('filters') filters: EmployeeFilterDto): Promise<EmployeePageType> {
    return this.findEmployeesUseCase.execute(filters)
  }

  @Query(() => EmployeeType)
  findEmployeeById(@Args('id', { type: () => Int }) id: number): Promise<EmployeeType> {
    return this.findEmployeeUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  async deleteEmployee(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteEmployeeUseCase.execute(id)
    return true
  }

  @Mutation(() => EmployeeType)
  updateEmployee(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateEmployeeDto,
  ): Promise<EmployeeType> {
    return this.updateEmployeeUseCase.execute(id, data)
  }
}
