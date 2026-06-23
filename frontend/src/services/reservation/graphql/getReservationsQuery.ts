import { gql } from '@apollo/client'

export const GET_RESERVATIONS = gql`
  query FindReservations($filters: ReservationFilterInput!) {
    findReservations(filters: $filters) {
      content {
        id
        clientName
        clientPhone
        clientEmail
        startDate
        endDate
        type
        persons
        status
        totalPrice
        userId
        apartments {
          id
          floor
          number
          status
          images {
            id
            url
            isPrimary
          }
          bedrooms
          bathrooms
          pricePerDay
          squareMeters
        }
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
