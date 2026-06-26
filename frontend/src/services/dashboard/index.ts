import { apolloClient } from '@/api/apollo-client'
import { GET_DASHBOARD_PERFORMANCE } from './graphql/GetDashboardStatsQuery'
import { IExpenseFilter, IExpensePerformance } from '@/models/ExpenseModel'
import { IPaymentFilter, IPaymentPerformance } from '@/models/PaymentModel'

export interface IDashboardStatsResponse {
  payments: IPaymentPerformance
  expensesData: IExpensePerformance
}

export interface IDashboardStatsResponseVariables {
  paymentFilters: IPaymentFilter
  expenseFilters: IExpenseFilter
}

export const dashboardService = {
  getStats: async ({ paymentFilters, expenseFilters }: IDashboardStatsResponseVariables) => {
    const { data } = await apolloClient.query<IDashboardStatsResponse | null>({
      query: GET_DASHBOARD_PERFORMANCE,
      variables: {
        paymentFilters,
        expenseFilters,
      },
    })

    if (!data) return null

    return {
      payments: data.payments,
      expensesData: data.expensesData,
    }
  },
}
