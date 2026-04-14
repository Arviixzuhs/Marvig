import { apolloClient } from '@/api/apollo-client'
import { FIND_PAYMENT } from './graphql/getPaymentQuery'
import { IPageResponse } from '@/api/interfaces'
import { FIND_PAYMENTS } from './graphql/getPaymentsQuery'
import { CREATE_PAYMENT } from './graphql/createPaymentMutation'
import { IPaymentPerformance } from '@/models/PaymentModel'
import { GET_PAYMENTS_PERFORMANCE } from './graphql/getPaymentPerformanceQuery'
import { PaymentModel, IPaymentFilter } from '@/models/PaymentModel'

export const paymentService = {
  get: async (id: number): Promise<PaymentModel | null> => {
    const { data } = await apolloClient.query<{ findPaymentById: PaymentModel }>({
      query: FIND_PAYMENT,
      variables: { id },
    })
    return data?.findPaymentById || null
  },

  getAll: async (filters: IPaymentFilter): Promise<IPageResponse<PaymentModel> | null> => {
    const { data } = await apolloClient.query<{ findPayments: IPageResponse<PaymentModel> }>({
      query: FIND_PAYMENTS,
      variables: { filters },
    })
    return data?.findPayments || null
  },
  getPerformance: async (filters: IPaymentFilter): Promise<IPaymentPerformance | null> => {
    const { data } = await apolloClient.query<{ getPaymentsPerformance: IPaymentPerformance }>({
      query: GET_PAYMENTS_PERFORMANCE,
      variables: { filters },
    })
    return data?.getPaymentsPerformance || null
  },
  create: async (payload: PaymentModel): Promise<PaymentModel | undefined> => {
    const { data } = await apolloClient.mutate<{ createPayment: PaymentModel }>({
      mutation: CREATE_PAYMENT,
      variables: {
        data: payload,
      },
    })
    return data?.createPayment
  },
}
