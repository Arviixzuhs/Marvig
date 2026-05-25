import { BaseMapper } from '@/common/mappers/base.mapper'
import { VerificationCode } from 'generated/prisma/client'
import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'
import { VerificationCodeModel } from '@/modules/verificationCode/domain/models/verificationCode.model'

export class VerificationCodeMapper extends BaseMapper<VerificationCode, VerificationCodeModel> {
  modelToDomain(model: VerificationCode): VerificationCodeModel {
    return {
      id: model.id,
      code: model.code,
      type: model.type as VerificationCodeType,
      isUsed: model.isUsed,
      userId: model.userId,
      attempts: model.attempts,
      createdAt: model.createdAt,
      expiresAt: model.expiresAt,
      nextAllowedAt: model.nextAllowedAt,
    }
  }
}
