import { gql } from '@apollo/client'

export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($data: CreatePromotionInput!) {
    createPromotion(data: $data) {
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
