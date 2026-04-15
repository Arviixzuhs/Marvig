import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_RESERVATION } from './graphql/getReservationQuery'
import { GET_RESERVATIONS } from './graphql/getReservationsQuery'
import { CREATE_RESERVATION } from './graphql/createReservationMutation'
import { UPDATE_RESERVATION } from './graphql/updateReservationMutation'
import { DELETE_RESERVATION } from './graphql/deleteReservationMutation'
import { UPDATE_RESERVATION_STATUS } from './graphql/updateReservationStatusMutation'
import { ReservationModel, IReservationFilter, ReservationStatus } from '@/models/ReservationModel'

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
  create: async (payload: Partial<ReservationModel>): Promise<ReservationModel | undefined> => {
    const { data } = await apolloClient.mutate<{ createReservation: ReservationModel }>({
      mutation: CREATE_RESERVATION,
      variables: {
        data: payload,
      },
    })
    return data?.createReservation
  },
  update: async (
    id: number,
    payload: Partial<ReservationModel>,
  ): Promise<ReservationModel | undefined> => {
    const { data } = await apolloClient.mutate<{ updateReservation: ReservationModel }>({
      mutation: UPDATE_RESERVATION,
      variables: {
        id,
        data: payload,
      },
    })
    return data?.updateReservation
  },
  updateStatus: async (
    id: number,
    status: ReservationStatus,
  ): Promise<ReservationModel | undefined> => {
    const { data } = await apolloClient.mutate<{ updateReservationStatus: ReservationModel }>({
      mutation: UPDATE_RESERVATION_STATUS,
      variables: {
        id,
        status,
      },
    })
    return data?.updateReservationStatus
  },
  delete: async (id: number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<{ deleteReservation: boolean }>({
      mutation: DELETE_RESERVATION,
      variables: { id },
    })
    return !!data?.deleteReservation
  },
}
