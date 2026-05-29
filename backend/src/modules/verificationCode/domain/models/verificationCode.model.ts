import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'

export class VerificationCodeModel {
  id: number
  code: string
  type: VerificationCodeType
  isUsed: boolean
  userId: number
  attempts: number
  createdAt: Date
  expiresAt: Date
  nextAllowedAt: Date
}
