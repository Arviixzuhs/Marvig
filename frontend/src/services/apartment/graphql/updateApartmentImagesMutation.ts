import { gql } from '@apollo/client'

export const UPDATE_APARTMENT_IMAGES = gql`
  mutation UpdateApartmentImages($data: ApartmentImageInput!) {
    updateApartmentImages(data: $data) {
      id
      number
      images {
        id
        url
        isPrimary
      }
    }
  }
`
