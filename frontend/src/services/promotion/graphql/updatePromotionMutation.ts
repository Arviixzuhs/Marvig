import { gql } from '@apollo/client'

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: Int!, $data: UpdatePromotionInput!) {
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
