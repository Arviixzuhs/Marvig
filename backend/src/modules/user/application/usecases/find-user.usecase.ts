import { UserModel } from '@/modules/user/domain/models/user.model'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindUserUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) { }

  async execute(id: number): Promise<UserModel> {
    const user = await this.userRepository.findUser(id)
    if (!user) throw new NotFoundException("User not found")

    return user
  }
}
