import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ChangePasswordDto } from '@/modules/user/application/dto/change-password.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class ChangePasswordUseCase {
  constructor(private readonly prisma: PrismaClient) {}


  async execute(userId: number, data: ChangePasswordDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    if (!user.password) {
      throw new BadRequestException(
        'Esta cuenta está registrada con Google. No es posible cambiar la contraseña por este medio.',
      )
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException('La nueva contraseña y su confirmación no coinciden.')
    }

    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.')
    }

    const isSamePassword = await bcrypt.compare(data.newPassword, user.password)
    if (isSamePassword) {
      throw new BadRequestException('La nueva contraseña no puede ser igual a la contraseña actual.')
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12)

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return true
  }
}
