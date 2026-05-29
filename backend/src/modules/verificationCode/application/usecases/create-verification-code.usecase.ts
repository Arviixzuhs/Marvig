import * as crypto from 'crypto'
import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'
import { VerificationCodeRepositoryPort } from '@/modules/verificationCode/domain/repositories/verificationCode.repository.port'
import { ConflictException, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreateVarificationCodeUseCase {
  constructor(
    @Inject('VerificationCodeRepository')
    private readonly verificationCodeRepository: VerificationCodeRepositoryPort,
  ) {}

  async execute(type: VerificationCodeType, email: string): Promise<void> {
    const now = new Date()
    const latestCode = await this.verificationCodeRepository.findLastest(email, type)

    if (latestCode && now < latestCode.nextAllowedAt) {
      throw new ConflictException(`Debes esperar para solicitar un nuevo PIN.`)
    }

    const rawCode = crypto.randomBytes(5).toString('hex')
    const hashedCode = crypto.createHash('sha256').update(rawCode).digest('hex')

    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000)
    const nextAllowedAt = new Date(now.getTime() + 6 * 60 * 60 * 1000)

    const createdVerificationCode = await this.verificationCodeRepository.create(
      email,
      type,
      hashedCode,
      expiresAt,
      nextAllowedAt,
    )

    console.log(createdVerificationCode)
  }
}
