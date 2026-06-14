import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindPaymentUseCase } from './usecases/find-payment.usecase'
import { FindPaymentsUseCase } from './usecases/find-payments.usecase'
import { CreatePaymentUseCase } from './usecases/create-payment.usecase'
import { UpdatePaymentStatusUseCase } from './usecases/update-payment-status.usecase'
import { GetPaymentsPerformanceUseCase } from './usecases/get-payments-performance.usercase'
import { PrismaExpenseRepositoryAdapter } from '@/modules/expense/infrastructure/repositories/prisma.expense.repository.adapter'
import { PrismaPaymentRepositoryAdapter } from '@/modules/payment/infrastructure/repositories/prisma.payment.repository.adapter'
import { PrismaReservationRepositoryAdapter } from '@/modules/reservation/infrastructure/repositories/prisma.reservation.repository.adapter'

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
    FindPaymentUseCase,
    FindPaymentsUseCase,
    CreatePaymentUseCase,
    UpdatePaymentStatusUseCase,
    GetPaymentsPerformanceUseCase,
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepositoryAdapter,
    },
    {
      provide: 'ExpenseRepository',
      useClass: PrismaExpenseRepositoryAdapter,
    },
    {
      provide: 'ReservationRepository',
      useClass: PrismaReservationRepositoryAdapter,
    },
  ],
  exports: [
    FindPaymentUseCase,
    FindPaymentsUseCase,
    CreatePaymentUseCase,
    UpdatePaymentStatusUseCase,
    GetPaymentsPerformanceUseCase,
  ],
})
export class PaymentApplicationModule {}
