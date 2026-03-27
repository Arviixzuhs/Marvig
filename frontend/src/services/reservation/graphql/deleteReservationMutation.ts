import { gql } from '@apollo/client'

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: Int!) {
    deleteReservation(id: $id)
  }
`
