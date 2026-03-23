import { EmployeeDto } from '@/modules/employee/application/dto/employee.dto'
import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { FindEmployeeUseCase } from '@/modules/employee/application/usecases/find-employee.usecase'
import { FindEmployeesUseCase } from '@/modules/employee/application/usecases/find-employees.usecase'
import { CreateEmployeeUseCase } from '@/modules/employee/application/usecases/create-employee.usecase'
import { DeleteEmployeeUseCase } from '@/modules/employee/application/usecases/delete-employee.usecase'
import { UpdateEmployeeUseCase } from '@/modules/employee/application/usecases/update-employee.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => EmployeeModel)
export class EmployeeResolver {
  constructor(
    private readonly findEmployeeUseCase: FindEmployeeUseCase,
    private readonly findEmployeesUseCase: FindEmployeesUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
  ) {}

  @Mutation(() => EmployeeModel)
  createEmployee(@Args('data') data: EmployeeDto): Promise<EmployeeModel> {
    return this.createEmployeeUseCase.execute(data)
  }

  @Query(() => [EmployeeModel])
  findEmployees(): Promise<EmployeeModel[]> {
    return this.findEmployeesUseCase.execute()
  }

  @Query(() => EmployeeModel)
  findEmployeeById(@Args('id', { type: () => Int }) id: number): Promise<EmployeeModel> {
    return this.findEmployeeUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  async deleteEmployee(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteEmployeeUseCase.execute(id)
    return true
  }

  @Mutation(() => EmployeeModel)
  updateEmployee(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: EmployeeDto,
  ): Promise<EmployeeModel> {
    return this.updateEmployeeUseCase.execute(id, data)
  }
}
