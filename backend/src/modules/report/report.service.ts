import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PdfGeneratorService } from '@/common/utils/pdf-generator.service'
import { FindPaymentsUseCase } from '@/modules/payment/application/usecases/find-payments.usecase'
import { FindExpensesUseCase } from '@/modules/expense/application/usecases/find-expenses.usecase'
import { FindReservationsUseCase } from '@/modules/reservation/application/usecases/find-reservations.usecase'
import { PaymentReportQueryDto } from './dto/payment-report-query.dto'
import { ExpenseReportQueryDto } from './dto/expense-report-query.dto'
import { ReservationReportQueryDto } from './dto/reservation-report-query.dto'
import { OccupancyReportQueryDto } from './dto/occupancy-report-query.dto'

interface OccupancyReportInput {
  fromDate: string
  toDate: string
  apartmentIds?: number[]
}

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdf: PdfGeneratorService,
    private readonly findPaymentsUseCase: FindPaymentsUseCase,
    private readonly findExpensesUseCase: FindExpensesUseCase,
    private readonly findReservationsUseCase: FindReservationsUseCase,
  ) {}

  // ─── DATA METHODS ─────────────────────────────────────────────────────────────

  async getPaymentReport(filters: PaymentReportQueryDto) {
    return this.findPaymentsUseCase.execute(filters)
  }

  async getExpenseReport(filters: ExpenseReportQueryDto) {
    return this.findExpensesUseCase.execute(filters)
  }

  async getReservationReport(filters: ReservationReportQueryDto) {
    return this.findReservationsUseCase.execute(filters)
  }

  async getOccupancyReport(filters: OccupancyReportInput) {
    const fromDate = new Date(filters.fromDate)
    const toDate = new Date(filters.toDate)
    const fromTs = fromDate.getTime()
    const toTs = toDate.getTime()
    const totalNights = Math.round((toTs - fromTs) / 86400000)

    const apartments = await this.prisma.apartment.findMany({
      where: {
        isDeleted: false,
        ...(filters.apartmentIds?.length && { id: { in: filters.apartmentIds } }),
      },
      include: {
        reservations: {
          where: { isDeleted: false },
          include: { payments: true },
        },
      },
    })

    const result = apartments.map((apt) => {
      let occupiedNights = 0
      let blockedNights = 0
      let generatedIncome = 0

      for (const r of apt.reservations) {
        const rStart = new Date(r.startDate).getTime()
        const rEnd = new Date(r.endDate).getTime()
        const overlapStart = Math.max(fromTs, rStart)
        const overlapEnd = Math.min(toTs, rEnd)
        const nights = Math.max(0, Math.round((overlapEnd - overlapStart) / 86400000))

        if (r.status === 'CONFIRMED') {
          occupiedNights += nights
          const confirmed = r.payments.filter(
            (p) =>
              p.status === 'CONFIRMED' &&
              p.date &&
              new Date(p.date).getTime() >= fromTs &&
              new Date(p.date).getTime() <= toTs,
          )
          generatedIncome += confirmed.reduce((sum, p) => sum + Number(p.amount), 0)
        } else if (r.status === 'PENDING') {
          blockedNights += nights
        }
      }

      const availableNights = Math.max(0, totalNights - occupiedNights - blockedNights)
      const occupancyPercentage =
        totalNights > 0 ? Math.round((occupiedNights / totalNights) * 10000) / 100 : 0

      return {
        apartmentNumber: apt.number,
        floor: apt.floor,
        totalNights,
        occupiedNights,
        blockedNights,
        availableNights,
        occupancyPercentage,
        generatedIncome,
      }
    })

    return { fromDate, toDate, apartments: result }
  }

  async getIncomeSummary(filters: OccupancyReportInput) {
    const where = {
      ...(filters.fromDate || filters.toDate
        ? {
            createdAt: {
              ...(filters.fromDate && { gte: new Date(filters.fromDate) }),
              ...(filters.toDate && { lte: new Date(filters.toDate) }),
            },
          }
        : {}),
    }

    const [payments, expenses] = await Promise.all([
      this.prisma.payment.findMany({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.expense.findMany({ where: { ...where, isDeleted: false } }),
    ])

    const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const netProfit = totalIncome - totalExpenses

    const categoryMap = new Map<string, number>()
    for (const expense of expenses) {
      const current = categoryMap.get(expense.category) ?? 0
      categoryMap.set(expense.category, current + Number(expense.amount))
    }

    const expensesByCategory = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 10000) / 100 : 0,
    }))

    return { totalIncome, totalExpenses, netProfit, expensesByCategory }
  }

  // ─── PDF GENERATION METHODS ───────────────────────────────────────────────────

  async getPaymentReportPdf(filters: PaymentReportQueryDto): Promise<Buffer> {
    const data = await this.getPaymentReport({ ...filters, page: 0, pageSize: 10000 })
    const doc = new jsPDF({ orientation: 'landscape' })
    const subtitle =
      filters.fromDate && filters.toDate
        ? `${this.pdf.formatDate(filters.fromDate)} — ${this.pdf.formatDate(filters.toDate)}`
        : 'Historial completo de registros conocidos'

    this.pdf.addPdfHeader(doc, 'Reporte de Pagos', subtitle)

    const totalAmount = data.content.reduce((s, p) => s + p.amount, 0)
    const currentY = this.pdf.addSummaryBox(
      doc,
      [
        { label: 'Cantidad de Transacciones', value: data.totalItems.toString() },
        { label: 'Monto Total Recaudado', value: this.pdf.formatCurrency(totalAmount) },
      ],
      34,
    )

    autoTable(doc, {
      startY: currentY,
      head: [['ID', 'Fecha', 'Monto', 'Estado', 'Método', 'Referencia', 'Cliente', 'Apartamento']],
      body: data.content.map((p) => [
        p.id,
        this.pdf.formatDate(p.date),
        this.pdf.formatCurrency(p.amount),
        p.status,
        p.method,
        p.reference || '—',
        p.reservation?.clientName || '—',
        p.reservation?.apartments?.map((a) => `#${a.number}`).join(', ') || '—',
      ]),
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 4.5,
        lineColor: this.pdf.BORDER_COLOR,
        lineWidth: 0.3,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        2: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
      },
      willDrawCell: (data) => {
        if (data.cell.section === 'body' && data.column.index === 3) {
          const status = String(data.cell.raw).toUpperCase()
          if (status.includes('CONFIRM') || status.includes('PAGADO')) {
            data.cell.styles.textColor = [22, 163, 74]
            data.cell.styles.fontStyle = 'bold'
          } else if (status.includes('PEND')) {
            data.cell.styles.textColor = [217, 119, 6]
            data.cell.styles.fontStyle = 'bold'
          } else if (
            status.includes('REJECT') ||
            status.includes('RECHAZ') ||
            status.includes('CANCEL')
          ) {
            data.cell.styles.textColor = [220, 38, 38]
            data.cell.styles.fontStyle = 'bold'
          }
        }
      },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  async getExpenseReportPdf(filters: ExpenseReportQueryDto): Promise<Buffer> {
    const data = await this.getExpenseReport({ ...filters, page: 0, pageSize: 10000 })
    const doc = new jsPDF({ orientation: 'landscape' })
    const subtitle =
      filters.fromDate && filters.toDate
        ? `${this.pdf.formatDate(filters.fromDate)} — ${this.pdf.formatDate(filters.toDate)}`
        : 'Historial completo de registros conocidos'

    this.pdf.addPdfHeader(doc, 'Reporte de Gastos', subtitle)

    const totalAmount = data.content.reduce((s, e) => s + e.amount, 0)
    const currentY = this.pdf.addSummaryBox(
      doc,
      [
        { label: 'Total de Comprobantes', value: data.totalItems.toString() },
        { label: 'Monto Total Egresado', value: this.pdf.formatCurrency(totalAmount) },
      ],
      34,
    )

    autoTable(doc, {
      startY: currentY,
      head: [['ID', 'Fecha', 'Monto', 'Categoría', 'Descripción', 'Apartamento']],
      body: data.content.map((e) => [
        e.id,
        e.date ? this.pdf.formatDate(e.date) : '—',
        this.pdf.formatCurrency(e.amount),
        e.category.replace(/_/g, ' '),
        e.description || '—',
        e.apartment ? `#${e.apartment.number} (Piso ${e.apartment.floor})` : '—',
      ]),
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 4.5,
        lineColor: this.pdf.BORDER_COLOR,
        lineWidth: 0.3,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 2: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] } },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  async getReservationReportPdf(filters: ReservationReportQueryDto): Promise<Buffer> {
    const data = await this.getReservationReport({ ...filters, page: 0, pageSize: 10000 })
    const doc = new jsPDF({ orientation: 'landscape' })
    const subtitle =
      filters.startDate && filters.endDate
        ? `${this.pdf.formatDate(filters.startDate)} — ${this.pdf.formatDate(filters.endDate)}`
        : 'Historial completo de registros conocidos'

    this.pdf.addPdfHeader(doc, 'Reporte de Reservas', subtitle)

    const rows = data.content.map((r) => {
      const payments = r.payments ?? []
      const totalPaid = payments
        .filter((p) => p.status === PaymentStatus.CONFIRMED)
        .reduce((sum, p) => sum + p.amount, 0)
      const pendingAmount = r.totalPrice - totalPaid
      return { ...r, totalPaid, pendingAmount }
    })

    const totalIncome = rows.reduce((s, r) => s + r.totalPaid, 0)
    const totalPending = rows.reduce((s, r) => s + r.pendingAmount, 0)

    const currentY = this.pdf.addSummaryBox(
      doc,
      [
        { label: 'Total Reservas', value: data.totalItems.toString() },
        { label: 'Ingresos Cobrados', value: this.pdf.formatCurrency(totalIncome) },
        { label: 'Pendiente de Cobro', value: this.pdf.formatCurrency(totalPending) },
      ],
      34,
    )

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          'ID',
          'Entrada',
          'Salida',
          'Estado',
          'Cliente',
          'Apartamentos',
          'Total',
          'Pagado',
          'Pendiente',
        ],
      ],
      body: rows.map((r) => [
        r.id,
        this.pdf.formatDate(r.startDate),
        this.pdf.formatDate(r.endDate),
        r.status,
        r.clientName || '—',
        r.apartments?.map((a) => `#${a.number}`).join(', ') || '—',
        this.pdf.formatCurrency(r.totalPrice),
        this.pdf.formatCurrency(r.totalPaid),
        this.pdf.formatCurrency(r.pendingAmount),
      ]),
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 7.5,
        cellPadding: 4,
        lineColor: this.pdf.BORDER_COLOR,
        lineWidth: 0.3,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        3: { halign: 'center' },
        6: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        7: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] },
        8: { halign: 'right', fontStyle: 'bold', textColor: [220, 38, 38] },
      },
      willDrawCell: (data) => {
        if (data.cell.section === 'body' && data.column.index === 3) {
          const status = String(data.cell.raw).toUpperCase()
          if (status.includes('CONFIRM') || status.includes('PAGADO')) {
            data.cell.styles.textColor = [22, 163, 74]
            data.cell.styles.fontStyle = 'bold'
          } else if (status.includes('PEND')) {
            data.cell.styles.textColor = [217, 119, 6]
            data.cell.styles.fontStyle = 'bold'
          } else if (
            status.includes('REJECT') ||
            status.includes('RECHAZ') ||
            status.includes('CANCEL')
          ) {
            data.cell.styles.textColor = [220, 38, 38]
            data.cell.styles.fontStyle = 'bold'
          }
        }
      },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  async getOccupancyReportPdf(filters: OccupancyReportQueryDto): Promise<Buffer> {
    const data = await this.getOccupancyReport(filters)
    const doc = new jsPDF({ orientation: 'landscape' })
    const subtitle = `${this.pdf.formatDate(data.fromDate)} — ${this.pdf.formatDate(data.toDate)}`

    this.pdf.addPdfHeader(doc, 'Reporte de Ocupación', subtitle)

    const totalIncome = data.apartments.reduce((s, a) => s + a.generatedIncome, 0)
    const avgOccupancy =
      data.apartments.reduce((s, a) => s + a.occupancyPercentage, 0) / (data.apartments.length || 1)

    const currentY = this.pdf.addSummaryBox(
      doc,
      [
        { label: 'Unidades Auditadas', value: data.apartments.length.toString() },
        { label: 'Ocupación Promedio', value: `${avgOccupancy.toFixed(1)}%` },
        { label: 'Ingresos Generados', value: this.pdf.formatCurrency(totalIncome) },
      ],
      34,
    )

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          'Apartamento',
          'Piso',
          'Total noches',
          'Ocupadas',
          'Bloqueadas',
          'Disponibles',
          '% Ocupación',
          'Ingresos',
        ],
      ],
      body: data.apartments.map((a) => [
        `#${a.apartmentNumber}`,
        a.floor,
        a.totalNights,
        a.occupiedNights,
        a.blockedNights,
        a.availableNights,
        `${a.occupancyPercentage.toFixed(1)}%`,
        this.pdf.formatCurrency(a.generatedIncome),
      ]),
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 4.5,
        lineColor: this.pdf.BORDER_COLOR,
        lineWidth: 0.3,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [15, 23, 42] },
        6: { halign: 'center', fontStyle: 'bold' },
        7: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
      },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  async getIncomeSummaryPdf(filters: OccupancyReportQueryDto): Promise<Buffer> {
    const data = await this.getIncomeSummary(filters)
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()
    const subtitle = `${this.pdf.formatDate(filters.fromDate)} — ${this.pdf.formatDate(filters.toDate)}`

    this.pdf.addPdfHeader(doc, 'Resumen de Ingresos', subtitle)

    let y = this.pdf.addSummaryBox(
      doc,
      [
        { label: 'Ingresos totales', value: this.pdf.formatCurrency(data.totalIncome) },
        { label: 'Gastos totales', value: this.pdf.formatCurrency(data.totalExpenses) },
        { label: 'Ganancia neta', value: this.pdf.formatCurrency(data.netProfit) },
      ],
      34,
    )

    const isProfitable = data.netProfit >= 0
    const alertBg: [number, number, number] = isProfitable ? [240, 253, 244] : [254, 242, 242]
    const alertText: [number, number, number] = isProfitable ? [21, 128, 61] : [185, 28, 28]
    const alertBorder: [number, number, number] = isProfitable ? [187, 247, 208] : [254, 202, 202]

    doc.setFillColor(...alertBg)
    doc.setDrawColor(...alertBorder)
    doc.setLineWidth(0.4)
    doc.roundedRect(14, y, pageW - 28, 12, 1, 1, 'FD')

    // Add a tiny colored bar on the left of the card
    doc.setFillColor(...alertText)
    doc.roundedRect(14, y, 2.5, 12, 0.5, 0.5, 'F')

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...alertText)
    doc.text(
      `${isProfitable ? '✓ Rentabilidad Positiva' : '⚠ Balance de Pérdida Neta'}  •  Diferencial Operativo: ${this.pdf.formatCurrency(data.netProfit)}`,
      19,
      y + 8,
    )
    y += 18

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...this.pdf.BRAND_COLOR)
    doc.text('Gastos Distribuidos por Categoría', 14, y + 4)
    y += 10

    autoTable(doc, {
      startY: y,
      head: [['Categoría', 'Monto Total Desembolsado', '% del Total']],
      body: data.expensesByCategory.map((e) => [
        e.category.replace(/_/g, ' '),
        this.pdf.formatCurrency(e.amount),
        `${e.percentage.toFixed(1)}%`,
      ]),
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 4.5,
        lineColor: this.pdf.BORDER_COLOR,
        lineWidth: 0.3,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        1: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        2: { halign: 'center', textColor: [100, 116, 139] },
      },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }
}
