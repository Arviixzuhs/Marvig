export interface VerificationCodeModel {
  id: number
  code: string
  type: VerificationCodeType
  attempts: number
  isUsed: boolean
  createdAt: Date | null
  expiresAt: Date
  nextAllowedAt: Date
  userId: number
}

export enum VerificationCodeType {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface CreateVerificationCodeInput {
  email: string
  type: VerificationCodeType
}

export interface ValidateVerificationCodeInput {
  email: string
  code: string
  type: VerificationCodeType
}
