import * as crypto from 'crypto'
import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'
import { VerificationCodeRepositoryPort } from '@/modules/verificationCode/domain/repositories/verificationCode.repository.port'
import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common'

@Injectable()
export class ValidateVarificationCodeUseCase {
  constructor(
    @Inject('VerificationCodeRepository')
    private verificationCodeRepository: VerificationCodeRepositoryPort,
  ) {}

  async execute(code: string, type: VerificationCodeType, email: string): Promise<boolean> {
    const MAX_ATTEMPTS = 3

    const latestVerificationCode = await this.verificationCodeRepository.findLastest(email, type)
    if (!latestVerificationCode) {
      throw new NotFoundException('Código de verificación no encontrado.')
    }

    if (latestVerificationCode.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException('Has superado el número máximo de intentos permitidos.')
    }

    if (latestVerificationCode.isUsed) {
      throw new BadRequestException('Este código ya ha sido utilizado.')
    }

    const now = new Date()
    if (now > latestVerificationCode.expiresAt) {
      throw new BadRequestException('El código de verificación ha expirado.')
    }

    const hashedInputCode = crypto.createHash('sha256').update(code).digest('hex')

    if (latestVerificationCode.code !== hashedInputCode) {
      await this.verificationCodeRepository.update(latestVerificationCode.id, {
        attempts: latestVerificationCode.attempts + 1,
      })

      throw new BadRequestException('El código de verificación es incorrecto.')
    }

    await this.verificationCodeRepository.update(latestVerificationCode.id, {
      isUsed: true,
    })

    return true
  }
}
