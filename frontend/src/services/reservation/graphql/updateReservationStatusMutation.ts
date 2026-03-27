import { gql } from '@apollo/client'

export const UPDATE_RESERVATION_STATUS = gql`
  mutation UpdateReservationStatus($id: Int!, $status: String!) {
    updateReservationStatus(id: $id, status: $status) {
      id
      status
    }
  }
`
