import { Response } from 'express'
import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { ReportService } from './report.service'
import { PaymentReportQueryDto } from './dto/payment-report-query.dto'
import { ExpenseReportQueryDto } from './dto/expense-report-query.dto'
import { OccupancyReportQueryDto } from './dto/occupancy-report-query.dto'
import { ReservationReportQueryDto } from './dto/reservation-report-query.dto'
import { Controller, Post, Body, Param, ParseIntPipe, Res } from '@nestjs/common'

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Post('payments/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getPaymentReportPdf(@Body() body: PaymentReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getPaymentReportPdf(body)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-pagos-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }
  
  @Post('payment/:id/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getSinglePaymentPdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const buffer = await this.reportService.getSinglePaymentPdf(id)

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="pago-${id}-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Post('expenses/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getExpenseReportPdf(@Body() body: ExpenseReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getExpenseReportPdf(body)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-gastos-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Post('reservations/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getReservationReportPdf(@Body() body: ReservationReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getReservationReportPdf(body)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-reservas-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Post('occupancy/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getOccupancyReportPdf(@Body() body: OccupancyReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getOccupancyReportPdf(body)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-ocupacion-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Post('income-summary/pdf')
  @RequiredRole(UserRole.ADMIN)
  async getIncomeSummaryPdf(@Body() body: OccupancyReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.getIncomeSummaryPdf(body)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resumen-ingresos-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }
}