import { gql } from '@apollo/client'

export const UPDATE_APARTMENT = gql`
  mutation UpdateApartment($id: Int!, $data: UpdateApartmentDto!) {
    updateApartment(id: $id, data: $data) {
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
