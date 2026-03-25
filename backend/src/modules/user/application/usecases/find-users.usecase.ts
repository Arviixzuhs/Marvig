import { UserPage } from '@/modules/user/application/dto/user-page.dto'
import { UserFilterDto } from '@/modules/user/application/dto/user-filter.dto'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class FindUsersUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) {}

  async execute(filters: UserFilterDto): Promise<UserPage> {
    const users = await this.userRepository.findUsers(filters)
    return users
  }
}
