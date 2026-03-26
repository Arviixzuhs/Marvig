import { gql } from '@apollo/client'

export const UPDATE_APARTMENT = gql`
  mutation UpdateApartment($id: Int!, $data: UpdateApartmentDto!) {
    updateApartment(id: $id, data: $data) {
        floor
        number
        bedrooms
        bathrooms
        squareMeters
    }
  }
`
