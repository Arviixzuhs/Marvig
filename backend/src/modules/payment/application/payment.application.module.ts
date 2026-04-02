import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindPaymentUseCase } from './usecases/find-payments.usecase'
import { FindPaymentsUseCase } from './usecases/find-payment.usecase'
import { CreatePaymentUseCase } from './usecases/create-payment.usecase'
import { PrismaPaymentRepositoryAdapter } from '@/modules/payment/infrastructure/repositories/prisma.payment.repository.adapter'

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
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepositoryAdapter,
    },
  ],
  exports: [FindPaymentUseCase, FindPaymentsUseCase, CreatePaymentUseCase],
})
export class PaymentApplicationModule {}
