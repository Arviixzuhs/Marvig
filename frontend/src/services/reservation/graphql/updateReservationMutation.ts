import { gql } from '@apollo/client'

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: Int!, $data: ReservationDto!) {
    updateReservation(id: $id, data: $data) {
      id
      startDate
      endDate
      type
      status
      totalPrice
    }
  }
`
