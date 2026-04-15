import { gql } from '@apollo/client'

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($data: ReservationDto!) {
    createReservation(data: $data) {
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
