import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_RESERVATION } from './graphql/getReservationQuery'
import { GET_RESERVATIONS } from './graphql/getReservationsQuery'
import { ReservationModel, IReservationFilter } from '@/models/ReservationModel'

export const reservationService = {
  get: async (id: number): Promise<ReservationModel | null> => {
    const { data } = await apolloClient.query<{ findReservation: ReservationModel }>({
      query: GET_RESERVATION,
      variables: { id },
    })
    return data?.findReservation || null
  },
  getAll: async (filters: IReservationFilter): Promise<IPageResponse<ReservationModel> | null> => {
    const { data } = await apolloClient.query<{
      findReservations: IPageResponse<ReservationModel>
    }>({
      query: GET_RESERVATIONS,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.findReservations || null
  },
}
