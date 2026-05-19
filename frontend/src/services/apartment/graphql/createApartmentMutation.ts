import { gql } from '@apollo/client'

export const CREATE_APARTMENT = gql`
  mutation CreateApartment($data: ApartmentInput!) {
    createApartment(data: $data) {
      id
      floor
      number
      bedrooms
      bathrooms
      squareMeters
    }
  }
`
