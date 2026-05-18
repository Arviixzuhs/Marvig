import { User } from '@/interfaces/user.interface'
import { UserDto } from '@/modules/user/application/dto/user.dto'
import { UserRole } from '@/common/enums/user-role.enum'
import { UserType } from '@/modules/user/infrastructure/graphql/types/user.type'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { UserPageType } from '@/modules/user/infrastructure/graphql/types/user-page.type'
import { UserFilterDto } from '@/modules/user/application/dto/user-filter.dto'
import { UpdateUserDto } from '@/modules/user/application/dto/update-user.dto'
import { FindUserUseCase } from '@/modules/user/application/usecases/find-user.usecase'
import { FindUsersUseCase } from '@/modules/user/application/usecases/find-users.usecase'
import { DeleteUserUseCase } from '@/modules/user/application/usecases/delete-user.usecase'
import { UpdateUserUseCase } from '@/modules/user/application/usecases/update-user.usecase'
import { CreateUserUseCase } from '@/modules/user/application/usecases/create-user.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Mutation(() => UserType)
  createUser(@Args('data') data: UserDto): Promise<UserType> {
    return this.createUserUseCase.execute(data)
  }

  @Query(() => UserPageType, { name: 'users' })
  @RequiredRole(UserRole.ADMIN)
  findUsers(@Args('filters') filters: UserFilterDto): Promise<UserPageType> {
    return this.findUsersUseCase.execute(filters)
  }

  @Query(() => UserType, { name: 'user' })
  @RequiredRole(UserRole.ADMIN)
  findOne(@Args('id') id: number): Promise<UserType> {
    return this.findUserUseCase.execute(id)
  }

  @Query(() => UserType)
  findCurrentUser(@CurrentUser() user: User): Promise<UserType> {
    return this.findUserUseCase.execute(user.userId)
  }

  @Mutation(() => Boolean)
  @RequiredRole(UserRole.ADMIN)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteUserUseCase.execute(id)
    return true
  }

  @Mutation(() => UserType)
  @RequiredRole(UserRole.ADMIN)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateUserDto,
  ): Promise<UserType> {
    return this.updateUserUseCase.execute(id, data)
  }
}
