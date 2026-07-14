import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Injectable } from '@nestjs/common'
import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { PrismaService } from '@/prisma/prisma.service'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PdfGeneratorService } from '@/common/utils/pdf-generator.service'
import { FindPaymentsUseCase } from '@/modules/payment/application/usecases/find-payments.usecase'
import { FindExpensesUseCase } from '@/modules/expense/application/usecases/find-expenses.usecase'
import { getFormattedDateTime } from '@/common/utils/getFormattedDateTime'
import { PaymentReportQueryDto } from './dto/payment-report-query.dto'
import { ExpenseReportQueryDto } from './dto/expense-report-query.dto'
import { FindReservationsUseCase } from '@/modules/reservation/application/usecases/find-reservations.usecase'
import { OccupancyReportQueryDto } from './dto/occupancy-report-query.dto'
import { ReservationReportQueryDto } from './dto/reservation-report-query.dto'

interface OccupancyReportInput {
  fromDate: string
  toDate: string
  apartmentIds?: number[]
}

const paymentMethodConfig = {
  [PaymentMethod.CASH]: { label: 'Efectivo', color: '#4B5563' },
  [PaymentMethod.PAYPAL]: { label: 'PayPal', color: '#003087' },
  [PaymentMethod.STRIPE]: { label: 'Stripe', color: '#635BFF' },
  [PaymentMethod.PAGO_MOVIL]: { label: 'Pago Móvil', color: '#8B5CF6' },
  [PaymentMethod.DEBIT_CARD]: { label: 'T. Débito', color: '#3B82F6' },
  [PaymentMethod.CREDID_CARD]: { label: 'T. Crédito', color: '#1E40AF' },
  [PaymentMethod.BANK_TRANSFER]: { label: 'Transferencia', color: '#10B981' },
};

const statusConfig = {
  [PaymentStatus.PENDING]: { label: 'Pendiente', color: '#F59E0B' },
  [PaymentStatus.CONFIRMED]: { label: 'Confirmado', color: '#10B981' },
  [PaymentStatus.FAILED]: { label: 'Fallido', color: '#EF4444' },
  [PaymentStatus.CANCELLED]: { label: 'Cancelado', color: '#6B7280' },
};

export const expenseCategoryConfig = {
  [ExpenseCategory.MAINTENANCE]: { label: 'Mantenimiento', color: '#F59E0B' },
  [ExpenseCategory.UTILITIES]: { label: 'Servicios', color: '#3B82F6' },
  [ExpenseCategory.CLEANING]: { label: 'Limpieza', color: '#10B981' },
  [ExpenseCategory.TAXES]: { label: 'Impuestos', color: '#EF4444' },
  [ExpenseCategory.SUPPLIES]: { label: 'Suministros', color: '#8B5CF6' },
  [ExpenseCategory.OTHER]: { label: 'Otros', color: '#6B7280' },
};

export const reservationTypeConfig = {
  [RentalType.DAILY]: { label: 'Diario', color: '#3B82F6' },
  [RentalType.FIXED_SEASON]: { label: 'Temporada', color: '#8B5CF6' },
};

export const reservationStatusConfig = {
  [ReservationStatus.PENDING]: { label: 'Pendiente', color: '#F59E0B' },
  [ReservationStatus.CONFIRMED]: { label: 'Confirmado', color: '#10B981' },
  [ReservationStatus.CANCELLED]: { label: 'Cancelado', color: '#EF4444' },
  [ReservationStatus.COMPLETED]: { label: 'Completado', color: '#6B7280' },
};

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdf: PdfGeneratorService,
    private readonly findPaymentsUseCase: FindPaymentsUseCase,
    private readonly findExpensesUseCase: FindExpensesUseCase,
    private readonly findReservationsUseCase: FindReservationsUseCase,
  ) {}

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
      this.prisma.payment.findMany({ where: { ...where, status: PaymentStatus.CONFIRMED } }),
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


  async getPaymentReportPdf(filters: PaymentReportQueryDto): Promise<Buffer> {


    const data = await this.getPaymentReport({ ...filters, page: 0, pageSize: 10000 })
    const doc = new jsPDF({ orientation: 'landscape' })
    const subtitle =
      filters.fromDate && filters.toDate
        ? `${getFormattedDateTime({ value: filters.fromDate })} - ${getFormattedDateTime({ value: filters.toDate })}`
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
        getFormattedDateTime({ value: p.date }),
        this.pdf.formatCurrency(p.amount),
        '',
        '',
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
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        2: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        3: { halign: 'center', cellWidth: 26 },
        4: { halign: 'center', cellWidth: 26 },
        5: { halign: 'center' },
      },
      didDrawCell: (dataCell) => {
        if (dataCell.cell.section === 'body') {
          const rowIndex = dataCell.row.index;
          const record = data.content[rowIndex];
          if (!record) return;

          let config: { label: string; color: string } | null = null;

          if (dataCell.column.index === 3) {
            config = statusConfig[record.status];
          } else if (dataCell.column.index === 4) {
            config = paymentMethodConfig[record.method];
          }

          if (config) {
            const { x, y, width, height } = dataCell.cell;


            const chipWidth = width - 4;
            const chipHeight = 5.2;
            const chipX = x + (width - chipWidth) / 2;
            const chipY = y + (height - chipHeight) / 2;
            const borderRadius = 1;

            const rgb = this.hexToRgb(config.color);


            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(chipX, chipY, chipWidth, chipHeight, borderRadius, borderRadius, 'F');


            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(255, 255, 255);

            const textX = chipX + (chipWidth / 2);
            const textY = chipY + (chipHeight / 2) + 0.3;

            doc.text(config.label, textX, textY, {
              align: 'center',
              baseline: 'middle',
            });
          }
        }
      },
    });

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  async getSinglePaymentPdf(id: number): Promise<Buffer> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
      },
      include: {
        reservation: {
          include: {
            apartments: true
          }
        }
      }
    })

    const doc = new jsPDF({ orientation: 'portrait' })

    const subtitle = `Comprobante emitido el ${getFormattedDateTime({ value: new Date() })}`
    this.pdf.addPdfHeader(doc, 'Detalle de Pago', subtitle)

    const currentY = this.pdf.addSummaryBox(
      doc,
      [
        { label: 'Referencia / Operación', value: payment.reference || '—' },
        { label: 'Monto Total', value: this.pdf.formatCurrency(payment.amount.toNumber()) },
      ],
      34,
    )

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Concepto', 'Detalle']],
      body: [
        ['ID de Pago', payment.id],
        ['Fecha de Registro', getFormattedDateTime({ value: payment.date })],
        ['Método de Pago', ''],
        ['Estado del Pago', ''],
        ['Cliente', payment.reservation?.clientName || '—'],
        ['Apartamento(s)', payment.reservation?.apartments?.map((a) => `#${a.number}`).join(', ') || '—'],
      ],
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 6,
        lineColor: this.pdf.BORDER_COLOR,
        lineWidth: 0.3,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 45 },
        1: { halign: 'left' },
      },
      didDrawCell: (dataCell) => {
        if (dataCell.cell.section === 'body' && dataCell.column.index === 1) {
          const rowIndex = dataCell.row.index;
          let config: { label: string; color: string } | null = null;


          if (rowIndex === 2) {
            config = paymentMethodConfig[payment.method];
          } else if (rowIndex === 3) {
            config = statusConfig[payment.status];
          }

          if (config) {
            const { x, y, height } = dataCell.cell;

       
            const chipWidth = 28;
            const chipHeight = 4.8;
            const chipX = x + 6;
            const chipY = y + (height - chipHeight) / 2;
            const borderRadius = 1;

            const rgb = this.hexToRgb(config.color);

            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(chipX, chipY, chipWidth, chipHeight, borderRadius, borderRadius, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(255, 255, 255);

            const textX = chipX + (chipWidth / 2);
            const textY = chipY + (chipHeight / 2) + 0.3;

            doc.text(config.label, textX, textY, {
              align: 'center',
              baseline: 'middle',
            });
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
        ? `${getFormattedDateTime({ value: filters.fromDate })} - ${getFormattedDateTime({ value: filters.toDate })}`
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
      head: [['ID', 'Fecha', 'Monto', 'Categoría', 'Método de Pago', 'Descripción', 'Apartamento']],
      body: data.content.map((e) => [
        e.id,
        e.date ? getFormattedDateTime({ value: e.date }) : '—',
        this.pdf.formatCurrency(e.amount),
        '',
        '',
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
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        2: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        3: { halign: 'center', cellWidth: 28 },
        4: { halign: 'center', cellWidth: 28 },
      },
      didDrawCell: (dataCell) => {
        if (dataCell.cell.section === 'body') {
          const rowIndex = dataCell.row.index;
          const expense = data.content[rowIndex];
          if (!expense) return;

          let config: { label: string; color: string } | null = null;

          if (dataCell.column.index === 3) {
            config = expenseCategoryConfig[expense.category];
          } else if (dataCell.column.index === 4) {
            config = paymentMethodConfig[expense.paymentMethod]; // Nota: Asegúrate que el campo del backend coincida con 'paymentMethod'
          }

          if (config) {
            const { x, y, width, height } = dataCell.cell;

            const chipWidth = width - 4;
            const chipHeight = 5.2;
            const chipX = x + (width - chipWidth) / 2;
            const chipY = y + (height - chipHeight) / 2;
            const borderRadius = 1;

            const rgb = this.hexToRgb(config.color);

            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(chipX, chipY, chipWidth, chipHeight, borderRadius, borderRadius, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(255, 255, 255);

            const textX = chipX + (chipWidth / 2);
            const textY = chipY + (chipHeight / 2) + 0.3;

            doc.text(config.label, textX, textY, {
              align: 'center',
              baseline: 'middle',
            });
          }
        }
      },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  async getReservationReportPdf(filters: ReservationReportQueryDto): Promise<Buffer> {
    const data = await this.getReservationReport({ ...filters, page: 0, pageSize: 10000 })
    const doc = new jsPDF({ orientation: 'landscape' })
    const subtitle =
      filters.startDate && filters.endDate
        ? `${getFormattedDateTime({ value: filters.startDate })} - ${getFormattedDateTime({ value: filters.endDate })}`
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
          'Tipo',
          'Cliente',
          'Apartamentos',
          'Total',
          'Pagado',
          'Pendiente',
        ],
      ],
      body: rows.map((r) => [
        r.id,
        getFormattedDateTime({ value: r.startDate }),
        getFormattedDateTime({ value: r.endDate }),
        '',
        '',
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
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        3: { halign: 'center', cellWidth: 23 },
        4: { halign: 'center', cellWidth: 23 },
        7: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        8: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] }, 
        9: { halign: 'right', fontStyle: 'bold', textColor: [220, 38, 38] },
      },
      didDrawCell: (dataCell) => {
        if (dataCell.cell.section === 'body') {
          const rowIndex = dataCell.row.index;
          const reservation = rows[rowIndex];
          if (!reservation) return;

          let config: { label: string; color: string } | null = null;

          if (dataCell.column.index === 3) {
            config = reservationStatusConfig[reservation.status];
          } else if (dataCell.column.index === 4) {
            config = reservationTypeConfig[reservation.type];
          }

          if (config) {
            const { x, y, width, height } = dataCell.cell;

            const chipWidth = width - 4;
            const chipHeight = 5.2;
            const chipX = x + (width - chipWidth) / 2;
            const chipY = y + (height - chipHeight) / 2;
            const borderRadius = 1;

            const rgb = this.hexToRgb(config.color);

            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(chipX, chipY, chipWidth, chipHeight, borderRadius, borderRadius, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(255, 255, 255);

            const textX = chipX + (chipWidth / 2);
            const textY = chipY + (chipHeight / 2) + 0.3;

            doc.text(config.label, textX, textY, {
              align: 'center',
              baseline: 'middle',
            });
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
    const subtitle = `${getFormattedDateTime({ value: filters.fromDate })} - ${getFormattedDateTime({ value: filters.toDate })}`

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
        fillColor: [0, 0, 0],
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
    const subtitle = `${getFormattedDateTime({ value: filters.fromDate })} - ${getFormattedDateTime({ value: filters.toDate })}`

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
      `${isProfitable ? 'Rentabilidad Positiva' : 'Balance de Pérdida Neta'}  •  Diferencial Operativo: ${this.pdf.formatCurrency(data.netProfit)}`,
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
        '',
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
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 32 },
        1: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        2: { halign: 'center', textColor: [100, 116, 139] },
      },
      didDrawCell: (dataCell) => {
        if (dataCell.cell.section === 'body' && dataCell.column.index === 0) {
          const rowIndex = dataCell.row.index;
          const item = data.expensesByCategory[rowIndex];
          if (!item) return;

          const config = expenseCategoryConfig[item.category];

          if (config) {
            const { x, y, width, height } = dataCell.cell;

            const chipWidth = width - 4;
            const chipHeight = 5.2;
            const chipX = x + (width - chipWidth) / 2;
            const chipY = y + (height - chipHeight) / 2;
            const borderRadius = 1;

            const rgb = this.hexToRgb(config.color);

            // 1. Dibujar fondo del Chip
            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(chipX, chipY, chipWidth, chipHeight, borderRadius, borderRadius, 'F');

            // 2. Dibujar texto del Chip centrado
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(255, 255, 255);

            const textX = chipX + (chipWidth / 2);
            const textY = chipY + (chipHeight / 2) + 0.3; 

            doc.text(config.label, textX, textY, {
              align: 'center',
              baseline: 'middle',
            });
          }
        }
      },
    })

    this.pdf.addPdfFooter(doc)
    return Buffer.from(doc.output('arraybuffer') as ArrayBuffer)
  }

  hexToRgb(hex: string): [number, number, number] {
    const num = parseInt(hex.replace('#', ''), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };
}
