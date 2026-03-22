import { UserDto } from '@/modules/user/application/dto/user.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { Inject, Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) {}

  async execute(data: UserDto): Promise<UserModel> {
    const createdAuthor = await this.userRepository.createUser(data)
    return createdAuthor
  }
}
