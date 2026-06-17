import { gql } from '@apollo/client'

export const GET_APARTMENT = gql`
  query FindApartmentById($id: Int!) {
    findApartmentById(id: $id) {
      id
      floor
      number
      bedrooms
      bathrooms
      squareMeters
      pricePerDay
      status
      images {
        id
        url
        isPrimary
      }
    }
  }
`
