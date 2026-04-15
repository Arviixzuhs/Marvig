import { gql } from '@apollo/client'

export const GET_RESERVATIONS = gql`
  query FindReservations($filters: ReservationFilterDto!) {
    findReservations(filters: $filters) {
      content {
        id
        clientName
        clientPhone
        clientEmail
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
