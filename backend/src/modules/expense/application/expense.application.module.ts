import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindExpenseUseCase } from './usecases/find-expense.usecase'
import { FindExpensesUseCase } from './usecases/find-expenses.usecase'
import { CreateExpenseUseCase } from './usecases/create-expense.usecase'
import { UpdateExpenseUseCase } from './usecases/update-expense.usecase'
import { DeleteExpenseUseCase } from './usecases/delete-expense.usecase'
import { GetExpensesPerformanceUseCase } from './usecases/get-expense-performance-by-category.usecase'
import { PrismaExpenseRepositoryAdapter } from '@/modules/expense/infrastructure/repositories/prisma.expense.repository.adapter'

config()

@Module({
  imports: [],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      }),
    },
    FindExpenseUseCase,
    UpdateExpenseUseCase,
    DeleteExpenseUseCase,
    FindExpensesUseCase,
    CreateExpenseUseCase,
    GetExpensesPerformanceUseCase,
    {
      provide: 'ExpenseRepository',
      useClass: PrismaExpenseRepositoryAdapter,
    },
  ],
  exports: [
    FindExpenseUseCase,
    UpdateExpenseUseCase,
    DeleteExpenseUseCase,
    FindExpensesUseCase,
    CreateExpenseUseCase,
    GetExpensesPerformanceUseCase,
  ],
})
export class ExpenseApplicationModule {}
