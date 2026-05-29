import { User } from '@/interfaces/user.interface'
import { UserRole } from '@/common/enums/user-role.enum'
import { UserType } from '@/modules/user/infrastructure/graphql/types/user.type'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { UserPageType } from '@/modules/user/infrastructure/graphql/types/user-page.type'
import { UserFilterInput } from '@/modules/user/infrastructure/graphql/inputs/user-filter.input'
import { UpdateUserInput } from '@/modules/user/infrastructure/graphql/inputs/update-user.input'
import { CreateUserInput } from '@/modules/user/infrastructure/graphql/inputs/create-user.input'
import { FindUserUseCase } from '@/modules/user/application/usecases/find-user.usecase'
import { FindUsersUseCase } from '@/modules/user/application/usecases/find-users.usecase'
import { DeleteUserUseCase } from '@/modules/user/application/usecases/delete-user.usecase'
import { UpdateUserUseCase } from '@/modules/user/application/usecases/update-user.usecase'
import { CreateUserUseCase } from '@/modules/user/application/usecases/create-user.usecase'
import { ChangePasswordUseCase } from '@/modules/user/application/usecases/change-password.usecase'
import { UpdateMyProfileInput } from '@/modules/user/infrastructure/graphql/inputs/update-my-profile.input'
import { ChangePasswordInput } from '@/modules/user/infrastructure/graphql/inputs/change-password.input'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'


@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Mutation(() => UserType)
  createUser(@Args('data') data: CreateUserInput): Promise<UserType> {
    return this.createUserUseCase.execute(data)
  }

  @Query(() => UserPageType, { name: 'users' })
  @RequiredRole(UserRole.ADMIN)
  findUsers(@Args('filters') filters: UserFilterInput): Promise<UserPageType> {
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
    @Args('data') data: UpdateUserInput,
  ): Promise<UserType> {
    return this.updateUserUseCase.execute(id, data)
  }

  @Mutation(() => UserType)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('data') data: UpdateMyProfileInput,
  ): Promise<UserType> {
    const dto: import('@/modules/user/application/dto/update-my-profile.dto').UpdateMyProfileDto = {
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
      avatar: data.avatar,
    }
    return this.updateUserUseCase.execute(user.userId, dto)
  }

  @Mutation(() => Boolean)
  changePassword(
    @CurrentUser() user: User,
    @Args('data') data: ChangePasswordInput,
  ): Promise<boolean> {
    return this.changePasswordUseCase.execute(user.userId, data)
  }
}
