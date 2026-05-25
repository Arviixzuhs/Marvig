import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'
import { VerificationCodeModel } from '@/modules/verificationCode/domain/models/verificationCode.model'
import { UpdateVerificationDto } from '@/modules/verificationCode/application/dto/update-verification-code.dto'

export interface VerificationCodeRepositoryPort {
  update(id: number, newData: UpdateVerificationDto): Promise<VerificationCodeModel>
  create(
    email: string,
    type: VerificationCodeType,
    code: string,
    expiresAt: Date,
    nextAllowedAt: Date,
  ): Promise<VerificationCodeModel>
  findLastest(email: string, type: VerificationCodeType): Promise<VerificationCodeModel>
}
