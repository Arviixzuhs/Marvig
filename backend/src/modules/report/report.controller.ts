import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ReportService } from './report.service'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { UserRole } from '@/common/enums/user-role.enum'
import { PaymentReportQueryDto } from './dto/payment-report-query.dto'
import { ExpenseReportQueryDto } from './dto/expense-report-query.dto'
import { ReservationReportQueryDto } from './dto/reservation-report-query.dto'
import { OccupancyReportQueryDto } from './dto/occupancy-report-query.dto'

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }


  @Get('payments/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getPaymentReportPdf(@Query() query: PaymentReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getPaymentReportPdf(query)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-pagos-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Get('expenses/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getExpenseReportPdf(@Query() query: ExpenseReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getExpenseReportPdf(query)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-gastos-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Get('reservations/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getReservationReportPdf(@Query() query: ReservationReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getReservationReportPdf(query)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-reservas-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Get('occupancy/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getOccupancyReportPdf(@Query() query: OccupancyReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getOccupancyReportPdf(query)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-ocupacion-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Get('income-summary/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getIncomeSummaryPdf(@Query() query: OccupancyReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getIncomeSummaryPdf(query)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resumen-ingresos-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }
}
