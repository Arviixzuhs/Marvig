import { UserModel } from '@/modules/user/domain/models/user.model'
import { UpdateUserDto } from '@/modules/user/application/dto/update-user.dto'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) {}

  async execute(userId: number, newData: UpdateUserDto): Promise<UserModel> {
    const user = await this.userRepository.existsById(userId)
    if (!user) throw new NotFoundException('User not found')

    const updatedUser = await this.userRepository.updateUser(userId, newData)
    return updatedUser
  }
}
