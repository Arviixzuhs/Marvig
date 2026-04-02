import { gql } from '@apollo/client'

export const FIND_PROMOTION = gql`
  query FindPromotion($id: Int!) {
    findPromotion(id: $id) {
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
