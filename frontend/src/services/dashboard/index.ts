import { IDateFilter } from '@/api/interfaces'
import { apolloClient } from '@/api/apollo-client'
import { IExpensePerformance } from '@/models/ExpenseModel'
import { IPaymentPerformance } from '@/models/PaymentModel'
import { GET_DASHBOARD_PERFORMANCE } from './graphql/GetDashboardStatsQuery'

export interface IDashboardStatsResponse {
  payments: IPaymentPerformance
  expenses: IExpensePerformance[]
}

export const dashboardService = {
  getStats: async (filters: IDateFilter) => {
    const { data } = await apolloClient.query<IDashboardStatsResponse | null>({
      query: GET_DASHBOARD_PERFORMANCE,
      variables: {
        paymentFilters: filters,
        expenseFilters: filters,
      },
    })

    if (!data) return null

    return {
      payments: data.payments,
      expenses: data.expenses,
    }
  },
}
