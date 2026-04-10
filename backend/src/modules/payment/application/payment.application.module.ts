import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindPaymentUseCase } from './usecases/find-payment.usecase'
import { FindPaymentsUseCase } from './usecases/find-payments.usecase'
import { CreatePaymentUseCase } from './usecases/create-payment.usecase'
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
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepositoryAdapter,
    },
    {
      provide: 'ReservationRepository',
      useClass: PrismaReservationRepositoryAdapter,
    },
  ],
  exports: [FindPaymentUseCase, FindPaymentsUseCase, CreatePaymentUseCase],
})
export class PaymentApplicationModule {}
