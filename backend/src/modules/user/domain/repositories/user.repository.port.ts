import { UserDto } from '@/modules/user/application/dto/user.dto'
import { UserPage } from '@/modules/user/application/dto/user-page.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { UserFilterDto } from '@/modules/user/application/dto/user-filter.dto'
import { UpdateUserDto } from '@/modules/user/application/dto/update-user.dto'

export interface UserRepositoryPort {
  findUser(userId: number): Promise<UserModel>
  findUsers(filters: UserFilterDto): Promise<UserPage>
  createUser(user: UserDto): Promise<UserModel>
  deleteUser(userId: number): Promise<void>
  updateUser(userId: number, newData: UpdateUserDto): Promise<UserModel>
}
