import { api } from '@/api/axios-client'
import {
  IExpenseReportFilter,
  IIncomeSummaryFilter,
  IOccupancyReportFilter,
  IPaymentReportFilter,
  IReservationReportFilter,
} from '@/models/ReportModel'

const downloadPdf = async <T>(endpoint: string, filename: string, filters?: T) => {
  const response = await api.post<Blob>(endpoint, filters || {}, { responseType: 'blob' })

  const { data } = response

  const url = URL.createObjectURL(data)
  const link = document.createElement('a')

  link.href = url
  link.download = `${filename}-${Date.now()}.pdf`

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const reportService = {
  downloadPaymentReportPdf(filters: IPaymentReportFilter) {
    return downloadPdf('/reports/payments/pdf', 'reporte-pagos', filters)
  },

  downloadExpenseReportPdf(filters: IExpenseReportFilter) {
    return downloadPdf('/reports/expenses/pdf', 'reporte-gastos', filters)
  },

  downloadReservationReportPdf(filters: IReservationReportFilter) {
    return downloadPdf('/reports/reservations/pdf', 'reporte-reservas', filters)
  },

  downloadOccupancyReportPdf(filters: IOccupancyReportFilter) {
    return downloadPdf('/reports/occupancy/pdf', 'reporte-ocupacion', filters)
  },

  downloadIncomeSummaryPdf(filters: IIncomeSummaryFilter) {
    return downloadPdf('/reports/income-summary/pdf', 'resumen-ingresos', filters)
  },

  downloadPaymentById(id: number) {
    return downloadPdf(`/reports/payment/${id}/pdf`, 'reporte-pago')
  },
}
