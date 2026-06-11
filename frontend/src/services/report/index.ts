import { apolloClient } from '@/api/apollo-client'
import {
  EXPENSE_REPORT_QUERY,
  INCOME_SUMMARY_QUERY,
  OCCUPANCY_REPORT_QUERY,
  PAYMENT_REPORT_QUERY,
  RESERVATION_REPORT_QUERY,
} from './graphql/reportQueries'
import {
  IExpenseReportFilter,
  IExpenseReportPage,
  IIncomeSummary,
  IIncomeSummaryFilter,
  IOccupancyReport,
  IOccupancyReportFilter,
  IPaymentReportFilter,
  IPaymentReportPage,
  IReservationReportFilter,
  IReservationReportPage,
} from '@/models/ReportModel'

export const reportService = {
  getPaymentReport: async (
    filters: IPaymentReportFilter,
  ): Promise<IPaymentReportPage | null> => {
    const { data } = await apolloClient.query<{
      paymentReport: IPaymentReportPage
    }>({
      query: PAYMENT_REPORT_QUERY,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.paymentReport || null
  },

  getExpenseReport: async (
    filters: IExpenseReportFilter,
  ): Promise<IExpenseReportPage | null> => {
    const { data } = await apolloClient.query<{
      expenseReport: IExpenseReportPage
    }>({
      query: EXPENSE_REPORT_QUERY,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.expenseReport || null
  },

  getReservationReport: async (
    filters: IReservationReportFilter,
  ): Promise<IReservationReportPage | null> => {
    const { data } = await apolloClient.query<{
      reservationReport: IReservationReportPage
    }>({
      query: RESERVATION_REPORT_QUERY,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.reservationReport || null
  },

  getOccupancyReport: async (
    filters: IOccupancyReportFilter,
  ): Promise<IOccupancyReport | null> => {
    const { data } = await apolloClient.query<{
      occupancyReport: IOccupancyReport
    }>({
      query: OCCUPANCY_REPORT_QUERY,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.occupancyReport || null
  },

  getIncomeSummary: async (
    filters: IIncomeSummaryFilter,
  ): Promise<IIncomeSummary | null> => {
    const { data } = await apolloClient.query<{
      incomeSummary: IIncomeSummary
    }>({
      query: INCOME_SUMMARY_QUERY,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.incomeSummary || null
  },
}
