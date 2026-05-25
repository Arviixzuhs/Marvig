import { registerEnumType } from '@nestjs/graphql'

export enum VerificationCodeType {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

registerEnumType(VerificationCodeType, {
  name: 'VerificationCodeType',
  description: 'Tipos disponibles de códigos de verificación',
})
