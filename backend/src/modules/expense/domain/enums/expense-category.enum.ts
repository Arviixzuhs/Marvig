import { registerEnumType } from '@nestjs/graphql'

export enum ExpenseCategory {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  CLEANING = 'CLEANING',
  TAXES = 'TAXES',
  SUPPLIES = 'SUPPLIES',
  OTHER = 'OTHER',
}

registerEnumType(ExpenseCategory, {
  name: 'ExpenseCategory',
  description: 'Categorías disponibles para los gastos (Expenses)',
})
