import { gql } from '@apollo/client'

export const UPDATE_APARTMENT_IMAGES = gql`
  mutation UpdateApartmentImages($data: ApartmentImageDto!) {
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
