import { GET_EXPENSE } from './graphql/getExpenseQuery'
import { GET_EXPENSES } from './graphql/getExpensesQuery'
import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_EXPENSES_PERFORMANCE } from './graphql/getExpensesPerformanceQuery'
import { ExpenseModel, IExpenseFilter, IExpensePerformance } from '@/models/ExpenseModel'

export const expenseService = {
  get: async (id: number): Promise<ExpenseModel | null> => {
    const { data } = await apolloClient.query<{ findExpenseById: ExpenseModel }>({
      query: GET_EXPENSE,
      variables: { id },
    })
    return data?.findExpenseById || null
  },
  getPerformance: async (filters: IExpenseFilter): Promise<IExpensePerformance[] | null> => {
    const { data } = await apolloClient.query<{ getExpensesPerformance: IExpensePerformance[] }>({
      query: GET_EXPENSES_PERFORMANCE,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.getExpensesPerformance || null
  },
  getAll: async (filters: IExpenseFilter): Promise<IPageResponse<ExpenseModel> | null> => {
    const { data } = await apolloClient.query<{ findExpenses: IPageResponse<ExpenseModel> }>({
      query: GET_EXPENSES,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.findExpenses || null
  },
}
