import { gql } from '@apollo/client'

export const GET_APARTMENTS = gql`
  query FindApartments($filters: ApartmentFilterDto!) {
    findApartments(filters: $filters) {
      content {
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
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
