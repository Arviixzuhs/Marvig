import { Module } from '@nestjs/common'
import { ReportController } from './report.controller'
import { ReportService } from './report.service'
import { PrismaService } from '@/prisma/prisma.service'
import { PdfGeneratorService } from '@/common/utils/pdf-generator.service'
import { PaymentApplicationModule } from '@/modules/payment/application/payment.application.module'
import { ExpenseApplicationModule } from '@/modules/expense/application/expense.application.module'
import { ReservationApplicationModule } from '@/modules/reservation/application/reservation.application.module'

@Module({
  imports: [PaymentApplicationModule, ExpenseApplicationModule, ReservationApplicationModule],
  controllers: [ReportController],
  providers: [ReportService, PrismaService, PdfGeneratorService],
})
export class ReportModule {}
