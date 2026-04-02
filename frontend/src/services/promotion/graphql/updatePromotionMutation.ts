import { gql } from '@apollo/client'

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: Int!, $data: UpdatePromotionDto!) {
    updatePromotion(id: $id, data: $data) {
      id
      name
      description
      type
      value
      createdAt
      updatedAt
    }
  }
`
