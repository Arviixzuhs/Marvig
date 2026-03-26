import { gql } from '@apollo/client'

export const DELETE_APARTMENT = gql`
  mutation DeleteApartment($id: Int!) {
    deleteApartment(id: $id)
  }
`
