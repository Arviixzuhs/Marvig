import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { PaymentReportUseCase } from './usecases/payment-report.usecase'
import { ExpenseReportUseCase } from './usecases/expense-report.usecase'
import { ReservationReportUseCase } from './usecases/reservation-report.usecase'
import { OccupancyReportUseCase } from './usecases/occupancy-report.usecase'
import { IncomeSummaryUseCase } from './usecases/income-summary.usecase'
import { PrismaPaymentRepositoryAdapter } from '@/modules/payment/infrastructure/repositories/prisma.payment.repository.adapter'
import { PrismaExpenseRepositoryAdapter } from '@/modules/expense/infrastructure/repositories/prisma.expense.repository.adapter'
import { PrismaReservationRepositoryAdapter } from '@/modules/reservation/infrastructure/repositories/prisma.reservation.repository.adapter'
import { PrismaApartmentRepositoryAdapter } from '@/modules/apartment/infrastructure/repositories/prisma.apartment.repository.adapter'

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
    {
      provide: 'ApartmentRepository',
      useClass: PrismaApartmentRepositoryAdapter,
    },
    PaymentReportUseCase,
    ExpenseReportUseCase,
    ReservationReportUseCase,
    OccupancyReportUseCase,
    IncomeSummaryUseCase,
  ],
  exports: [
    PaymentReportUseCase,
    ExpenseReportUseCase,
    ReservationReportUseCase,
    OccupancyReportUseCase,
    IncomeSummaryUseCase,
  ],
})
export class ReportApplicationModule {}
