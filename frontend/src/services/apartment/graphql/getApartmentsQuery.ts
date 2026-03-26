import { gql } from '@apollo/client'

export const GET_APARTMENTS = gql`
  query FindApartments($filters: ApartmentFilterDto!) {
    findApartments(filters: $filters) {
      content {
        id
        floor
        number
        bedrooms
        bathrooms
        squareMeters
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
