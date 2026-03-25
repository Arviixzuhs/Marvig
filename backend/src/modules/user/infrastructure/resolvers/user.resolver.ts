import { UserDto } from '@/modules/user/application/dto/user.dto'
import { UserPage } from '@/modules/user/application/dto/user-page.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { UserFilterDto } from '@/modules/user/application/dto/user-filter.dto'
import { FindUserUseCase } from '@/modules/user/application/usecases/find-user.usecase'
import { FindUsersUseCase } from '@/modules/user/application/usecases/find-users.usecase'
import { CreateUserUseCase } from '@/modules/user/application/usecases/create-user.usecase'
import { DeleteUserUseCase } from '@/modules/user/application/usecases/delete-user.usecase'
import { UpdateUserUseCase } from '@/modules/user/application/usecases/update-user.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Mutation(() => UserModel, { name: 'createUser' })
  createUser(@Args('data') data: UserDto): Promise<UserModel> {
    return this.createUserUseCase.execute(data)
  }

  @Query(() => UserPage, { name: 'users' })
  findUsers(@Args('filters') filters: UserFilterDto): Promise<UserPage> {
    return this.findUsersUseCase.execute(filters)
  }

  @Query(() => UserModel, { name: 'user' })
  findOne(@Args('id') id: number): Promise<UserModel> {
    return this.findUserUseCase.execute(id)
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteUserUseCase.execute(id)
    return true
  }

  @Mutation(() => UserModel, { name: 'updateUser' })
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UserDto,
  ): Promise<UserModel> {
    return this.updateUserUseCase.execute(id, data)
  }
}
