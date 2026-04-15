import { gql } from '@apollo/client'

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: Int!, $data: UpdateReservationDto!) {
    updateReservation(id: $id, data: $data) {
      id
      clientName
      clientPhone
      clientEmail
      startDate
      endDate
      type
      status
      totalPrice
    }
  }
`
