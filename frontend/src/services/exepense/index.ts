import { GET_EXPENSE } from './graphql/getExpenseQuery'
import { GET_EXPENSES } from './graphql/getExpensesQuery'
import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { DELETE_EXPENSE } from './graphql/deleteExpenseMutation'
import { CREATE_EXPENSE } from './graphql/createExpenseMutation'
import { UPDATE_EXPENSE } from './graphql/updateExpenseMutation'
import { ExpenseModel, IExpenseFilter } from '@/models/ExpenseModel'

export const expenseService = {
  get: async (id: number): Promise<ExpenseModel | null> => {
    const { data } = await apolloClient.query<{ findExpenseById: ExpenseModel }>({
      query: GET_EXPENSE,
      variables: { id },
    })
    return data?.findExpenseById || null
  },
  getAll: async (filters: IExpenseFilter): Promise<IPageResponse<ExpenseModel> | null> => {
    const { data } = await apolloClient.query<{ findExpenses: IPageResponse<ExpenseModel> }>({
      query: GET_EXPENSES,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.findExpenses || null
  },
  create: async (payload: Partial<ExpenseModel>): Promise<ExpenseModel | undefined> => {
    const { data } = await apolloClient.mutate<{ createExpense: ExpenseModel }>({
      mutation: CREATE_EXPENSE,
      variables: {
        data: payload,
      },
    })
    return data?.createExpense
  },
  update: async (id: number, payload: Partial<ExpenseModel>): Promise<ExpenseModel | undefined> => {
    const { data } = await apolloClient.mutate<{ updateExpense: ExpenseModel }>({
      mutation: UPDATE_EXPENSE,
      variables: {
        id,
        data: payload,
      },
    })
    return data?.updateExpense
  },
  delete: async (id: number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<{ deleteExpense: boolean }>({
      mutation: DELETE_EXPENSE,
      variables: { id },
    })
    return !!data?.deleteExpense
  },
}
