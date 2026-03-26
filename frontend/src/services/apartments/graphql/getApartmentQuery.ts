import { gql } from '@apollo/client'

export const GET_APARTMENT = gql`
  query GetApartment($id: Int!) {
    apartment(id: $id) {
        id
        floor
        number
        bedrooms
        bathrooms
        squareMeters
    }
  }
`
