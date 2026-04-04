import { apolloClient } from '@/api/apollo-client'
import { FIND_PAYMENT } from './graphql/getPaymentQuery'
import { IPageResponse } from '@/api/interfaces'
import { FIND_PAYMENTS } from './graphql/getPaymentsQuery'
import { CREATE_PAYMENT } from './graphql/createPaymentMutation'
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
