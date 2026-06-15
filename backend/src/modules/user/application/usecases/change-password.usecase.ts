import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { ChangePasswordDto } from '@/modules/user/application/dto/change-password.dto'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { PasswordHasherPort } from '@/modules/user/domain/ports/password-hasher.port'

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryPort,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(userId: number, data: ChangePasswordDto): Promise<boolean> {
    const userExists = await this.userRepository.existsById(userId)
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    const currentPasswordHash = await this.userRepository.getPasswordHash(userId)
    if (!currentPasswordHash) {
      throw new BadRequestException(
        'Esta cuenta está registrada con Google. No es posible cambiar la contraseña por este medio.',
      )
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException('La nueva contraseña y su confirmación no coinciden.')
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      data.currentPassword,
      currentPasswordHash,
    )
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.')
    }

    const isSamePassword = await this.passwordHasher.compare(data.newPassword, currentPasswordHash)
    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contraseña no puede ser igual a la contraseña actual.',
      )
    }

    const hashedPassword = await this.passwordHasher.hash(data.newPassword)

    await this.userRepository.updatePassword(userId, hashedPassword)

    return true
  }
}
