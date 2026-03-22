import { UserModel } from '@/modules/user/domain/models/user.model'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class FindUsersUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserModel[]> {
    const users = await this.userRepository.findUsers()
    return users
  }
}
