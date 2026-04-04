import { registerEnumType } from '@nestjs/graphql'

export enum PaymentMethod {
  CASH = 'CASH',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  PAGO_MOVIL = 'PAGO_MOVIL',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDID_CARD = 'CREDID_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

registerEnumType(PaymentMethod, { name: 'PaymentMethodEnum' })
