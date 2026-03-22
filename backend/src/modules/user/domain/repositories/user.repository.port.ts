import { UserModel } from '@/modules/user/domain/models/user.model'
import { UserDto } from '@/modules/user/application/dto/user.dto'

export interface UserRepositoryPort {
  findUser(userId: number): Promise<UserModel>
  findUsers(): Promise<UserModel[]>
  createUser(user: UserDto): Promise<UserModel>
  deleteUser(userId: number): Promise<void>
  updateUser(userId: number, newData: UserDto): Promise<UserModel>
}
