import { UserDto } from '@/modules/user/application/dto/user.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) { }

  async execute(userId: number, newData: UserDto): Promise<UserModel> {
    const user = await this.userRepository.findUser(userId)
    if (!user) throw new NotFoundException("User not found")

    const updatedUser = await this.userRepository.updateUser(userId, newData)
    return updatedUser
  }
}
