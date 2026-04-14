import { EmployeeModel } from './EmployeeModel'
import { IPaginationFilter } from '@/api/interfaces'
import { ApartmentModel } from './ApartmentModel'

export enum ExpenseCategory {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  CLEANING = 'CLEANING',
  TAXES = 'TAXES',
  SUPPLIES = 'SUPPLIES',
  OTHER = 'OTHER',
}

export interface ExpenseModel {
  id: number
  amount: number
  employee?: EmployeeModel
  apartment?: ApartmentModel
  category: ExpenseCategory
  description?: string | null
  apartmentId?: number | null
  employeeId?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface IExpenseFilter extends IPaginationFilter {
  search?: string
  apartmentId?: number
  employeeId?: number
  category?: ExpenseCategory
  minAmount?: number
  maxAmount?: number
  fromDate?: string
  toDate?: string
}

export interface IExpensePerformance {
  month: string
  MAINTENANCE: number
  UTILITIES: number
  CLEANING: number
  TAXES: number
  SUPPLIES: number
  OTHER: number
}
