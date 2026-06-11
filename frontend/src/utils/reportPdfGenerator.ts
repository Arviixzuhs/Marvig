import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  IPaymentReportPage,
  IExpenseReportPage,
  IReservationReportPage,
  IOccupancyReport,
  IIncomeSummary,
} from '@/models/ReportModel'
import { formatCurrency, formatDate } from './formatters'

const BRAND_COLOR: [number, number, number] = [30, 41, 59] // slate-800
const ACCENT_COLOR: [number, number, number] = [59, 130, 246] // blue-500
const LIGHT_COLOR: [number, number, number] = [248, 250, 252] // slate-50
const TEXT_MUTED: [number, number, number] = [100, 116, 139] // slate-500

function addPdfHeader(doc: jsPDF, title: string, subtitle: string) {
  const pageW = doc.internal.pageSize.getWidth()

  // Header background
  doc.setFillColor(...BRAND_COLOR)
  doc.rect(0, 0, pageW, 40, 'F')

  // Brand mark – small accent bar
  doc.setFillColor(...ACCENT_COLOR)
  doc.rect(0, 0, 5, 40, 'F')

  // Logo / company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('MARVIG', 14, 16)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184) // slate-400
  doc.text('Sistema de Gestión', 14, 23)

  // Report title (right-aligned)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(title, pageW - 14, 16, { align: 'right' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184)
  doc.text(subtitle, pageW - 14, 23, { align: 'right' })

  // Separator line
  doc.setDrawColor(...ACCENT_COLOR)
  doc.setLineWidth(0.5)
  doc.line(0, 40, pageW, 40)
}

function addPdfFooter(doc: jsPDF) {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const totalPages = (doc as any).internal.getNumberOfPages()

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(...LIGHT_COLOR)
    doc.rect(0, pageH - 14, pageW, 14, 'F')

    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.line(0, pageH - 14, pageW, pageH - 14)

    doc.setTextColor(...TEXT_MUTED)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generado el ${formatDate(new Date().toISOString())}`, 14, pageH - 5)
    doc.text(`Página ${i} de ${totalPages}`, pageW - 14, pageH - 5, { align: 'right' })
  }
}

function addSummaryBox(
  doc: jsPDF,
  items: { label: string; value: string }[],
  startY: number,
): number {
  const pageW = doc.internal.pageSize.getWidth()
  const boxPad = 12
  const itemW = (pageW - boxPad * 2) / items.length

  doc.setFillColor(...LIGHT_COLOR)
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.roundedRect(boxPad, startY, pageW - boxPad * 2, 24, 2, 2, 'FD')

  items.forEach((item, i) => {
    const x = boxPad + i * itemW + itemW / 2
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT_MUTED)
    doc.text(item.label.toUpperCase(), x, startY + 8, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...BRAND_COLOR)
    doc.text(item.value, x, startY + 18, { align: 'center' })
  })

  return startY + 32
}

// ──────────────────────────────────────────────────────────────────────────────
// Payment Report PDF
// ──────────────────────────────────────────────────────────────────────────────
export function generatePaymentReportPdf(
  data: IPaymentReportPage,
  filters: { fromDate?: string; toDate?: string },
) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const subtitle = filters.fromDate && filters.toDate
    ? `${formatDate(filters.fromDate)} — ${formatDate(filters.toDate)}`
    : 'Todos los registros'

  addPdfHeader(doc, 'Reporte de Pagos', subtitle)

  const total = data.content.reduce((s, p) => s + p.amount, 0)
  let currentY = addSummaryBox(doc, [
    { label: 'Total de pagos', value: data.totalItems.toString() },
    { label: 'Monto total', value: formatCurrency(total) },
    { label: 'Páginas', value: data.totalPages.toString() },
  ], 48)

  autoTable(doc, {
    startY: currentY,
    head: [['ID', 'Fecha', 'Monto', 'Estado', 'Método', 'Referencia', 'Cliente', 'Apartamento']],
    body: data.content.map((p) => [
      p.id,
      formatDate(p.date),
      formatCurrency(p.amount),
      p.status,
      p.method,
      p.reference || '—',
      p.reservation?.clientName || '—',
      p.reservation?.apartments?.map((a) => `#${a.number}`).join(', ') || '—',
    ]),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT_COLOR },
    columnStyles: { 2: { halign: 'right' } },
  })

  addPdfFooter(doc)
  doc.save(`reporte-pagos-${Date.now()}.pdf`)
}

// ──────────────────────────────────────────────────────────────────────────────
// Expense Report PDF
// ──────────────────────────────────────────────────────────────────────────────
export function generateExpenseReportPdf(
  data: IExpenseReportPage,
  filters: { fromDate?: string; toDate?: string },
) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const subtitle = filters.fromDate && filters.toDate
    ? `${formatDate(filters.fromDate)} — ${formatDate(filters.toDate)}`
    : 'Todos los registros'

  addPdfHeader(doc, 'Reporte de Gastos', subtitle)

  const total = data.content.reduce((s, e) => s + e.amount, 0)
  let currentY = addSummaryBox(doc, [
    { label: 'Total de gastos', value: data.totalItems.toString() },
    { label: 'Monto total', value: formatCurrency(total) },
    { label: 'Registros', value: data.content.length.toString() },
  ], 48)

  autoTable(doc, {
    startY: currentY,
    head: [['ID', 'Fecha', 'Monto', 'Categoría', 'Descripción', 'Apartamento']],
    body: data.content.map((e) => [
      e.id,
      e.date ? formatDate(e.date) : '—',
      formatCurrency(e.amount),
      e.category,
      e.description || '—',
      e.apartment ? `#${e.apartment.number} (Piso ${e.apartment.floor})` : '—',
    ]),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT_COLOR },
    columnStyles: { 2: { halign: 'right' } },
  })

  addPdfFooter(doc)
  doc.save(`reporte-gastos-${Date.now()}.pdf`)
}

// ──────────────────────────────────────────────────────────────────────────────
// Reservation Report PDF
// ──────────────────────────────────────────────────────────────────────────────
export function generateReservationReportPdf(
  data: IReservationReportPage,
  filters: { startDate?: string; endDate?: string },
) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const subtitle = filters.startDate && filters.endDate
    ? `${formatDate(filters.startDate)} — ${formatDate(filters.endDate)}`
    : 'Todos los registros'

  addPdfHeader(doc, 'Reporte de Reservas', subtitle)

  const totalIncome = data.content.reduce((s, r) => s + r.totalPaid, 0)
  const totalPending = data.content.reduce((s, r) => s + r.pendingAmount, 0)
  let currentY = addSummaryBox(doc, [
    { label: 'Total reservas', value: data.totalItems.toString() },
    { label: 'Ingresos cobrados', value: formatCurrency(totalIncome) },
    { label: 'Pendiente de cobro', value: formatCurrency(totalPending) },
  ], 48)

  autoTable(doc, {
    startY: currentY,
    head: [['ID', 'Entrada', 'Salida', 'Estado', 'Cliente', 'Apartamentos', 'Total', 'Pagado', 'Pendiente']],
    body: data.content.map((r) => [
      r.id,
      formatDate(r.startDate),
      formatDate(r.endDate),
      r.status,
      r.clientName || '—',
      r.apartments.map((a) => `#${a.number}`).join(', ') || '—',
      formatCurrency(r.totalPrice),
      formatCurrency(r.totalPaid),
      formatCurrency(r.pendingAmount),
    ]),
    styles: { fontSize: 7.5, cellPadding: 3.5 },
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: LIGHT_COLOR },
    columnStyles: {
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
    },
  })

  addPdfFooter(doc)
  doc.save(`reporte-reservas-${Date.now()}.pdf`)
}

// ──────────────────────────────────────────────────────────────────────────────
// Occupancy Report PDF
// ──────────────────────────────────────────────────────────────────────────────
export function generateOccupancyReportPdf(data: IOccupancyReport) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const subtitle = `${formatDate(data.fromDate)} — ${formatDate(data.toDate)}`

  addPdfHeader(doc, 'Reporte de Ocupación', subtitle)

  const totalIncome = data.apartments.reduce((s, a) => s + a.generatedIncome, 0)
  const avgOccupancy =
    data.apartments.reduce((s, a) => s + a.occupancyPercentage, 0) /
    (data.apartments.length || 1)

  let currentY = addSummaryBox(doc, [
    { label: 'Apartamentos', value: data.apartments.length.toString() },
    { label: 'Ocupación promedio', value: `${avgOccupancy.toFixed(1)}%` },
    { label: 'Ingresos generados', value: formatCurrency(totalIncome) },
  ], 48)

  autoTable(doc, {
    startY: currentY,
    head: [['Apartamento', 'Piso', 'Total noches', 'Ocupadas', 'Bloqueadas', 'Disponibles', '% Ocupación', 'Ingresos generados']],
    body: data.apartments.map((a) => [
      `#${a.apartmentNumber}`,
      a.floor,
      a.totalNights,
      a.occupiedNights,
      a.blockedNights,
      a.availableNights,
      `${a.occupancyPercentage.toFixed(1)}%`,
      formatCurrency(a.generatedIncome),
    ]),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT_COLOR },
    columnStyles: {
      6: { halign: 'center' },
      7: { halign: 'right' },
    },
  })

  addPdfFooter(doc)
  doc.save(`reporte-ocupacion-${Date.now()}.pdf`)
}

// ──────────────────────────────────────────────────────────────────────────────
// Income Summary PDF
// ──────────────────────────────────────────────────────────────────────────────
export function generateIncomeSummaryPdf(
  data: IIncomeSummary,
  filters: { fromDate: string; toDate: string },
) {
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const subtitle = `${formatDate(filters.fromDate)} — ${formatDate(filters.toDate)}`

  addPdfHeader(doc, 'Resumen de Ingresos', subtitle)

  let y = addSummaryBox(doc, [
    { label: 'Ingresos totales', value: formatCurrency(data.totalIncome) },
    { label: 'Gastos totales', value: formatCurrency(data.totalExpenses) },
    { label: 'Ganancia neta', value: formatCurrency(data.netProfit) },
  ], 48)

  // Net profit highlight box
  const isProfitable = data.netProfit >= 0
  doc.setFillColor(...(isProfitable ? ([220, 252, 231] as [number,number,number]) : ([254, 226, 226] as [number,number,number])))
  doc.setDrawColor(...(isProfitable ? ([134, 239, 172] as [number,number,number]) : ([252, 165, 165] as [number,number,number])))
  doc.setLineWidth(0.5)
  doc.roundedRect(12, y, pageW - 24, 18, 2, 2, 'FD')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(isProfitable ? 22 : 153, isProfitable ? 101 : 27, isProfitable ? 52 : 27)
  doc.text(
    `${isProfitable ? '✓ Rentabilidad positiva' : '⚠ Pérdida neta'}  •  Ganancia Neta: ${formatCurrency(data.netProfit)}`,
    pageW / 2,
    y + 11,
    { align: 'center' },
  )
  y += 26

  // Expenses by category table
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BRAND_COLOR)
  doc.text('Desglose de Gastos por Categoría', 14, y + 6)
  y += 12

  autoTable(doc, {
    startY: y,
    head: [['Categoría', 'Monto', '% del Total']],
    body: data.expensesByCategory.map((e) => [
      e.category,
      formatCurrency(e.amount),
      `${e.percentage.toFixed(1)}%`,
    ]),
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: LIGHT_COLOR },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'center' } },
  })

  addPdfFooter(doc)
  doc.save(`resumen-ingresos-${Date.now()}.pdf`)
}
