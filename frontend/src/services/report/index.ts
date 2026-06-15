import { api } from '@/api/axios-client'
import {
  IExpenseReportFilter,
  IIncomeSummaryFilter,
  IOccupancyReportFilter,
  IPaymentReportFilter,
  IReservationReportFilter,
} from '@/models/ReportModel'

export const reportService = {

  downloadPaymentReportPdf: async (
    filters: IPaymentReportFilter,
  ): Promise<Blob> => {
    const { data } = await api.get<Blob>('/reports/payments/pdf', {
      params: filters,
      responseType: 'blob',
    })
    return data
  },

  downloadExpenseReportPdf: async (
    filters: IExpenseReportFilter,
  ): Promise<Blob> => {
    const { data } = await api.get<Blob>('/reports/expenses/pdf', {
      params: filters,
      responseType: 'blob',
    })
    return data
  },

  downloadReservationReportPdf: async (
    filters: IReservationReportFilter,
  ): Promise<Blob> => {
    const { data } = await api.get<Blob>('/reports/reservations/pdf', {
      params: filters,
      responseType: 'blob',
    })
    return data
  },

  downloadOccupancyReportPdf: async (
    filters: IOccupancyReportFilter,
  ): Promise<Blob> => {
    const { data } = await api.get<Blob>('/reports/occupancy/pdf', {
      params: filters,
      responseType: 'blob',
    })
    return data
  },

  downloadIncomeSummaryPdf: async (
    filters: IIncomeSummaryFilter,
  ): Promise<Blob> => {
    const { data } = await api.get<Blob>('/reports/income-summary/pdf', {
      params: filters,
      responseType: 'blob',
    })
    return data
  },
}
