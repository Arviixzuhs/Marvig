import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject('UserRepository') private userRepository: UserRepositoryPort) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.existsById(id)
    if (!user) throw new NotFoundException('User not found')

    await this.userRepository.deleteUser(id)
  }
}
