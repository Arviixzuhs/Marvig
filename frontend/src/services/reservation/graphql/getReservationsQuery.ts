import { gql } from '@apollo/client'

export const GET_RESERVATIONS = gql`
  query FindReservations($filters: ReservationFilterDto!) {
    findReservations(filters: $filters) {
      content {
        id
        startDate
        endDate
        type
        status
        totalPrice
        userId
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
