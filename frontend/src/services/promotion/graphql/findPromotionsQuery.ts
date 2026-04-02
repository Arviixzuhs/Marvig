import { gql } from '@apollo/client'

export const FIND_PROMOTIONS = gql`
  query FindPromotions($filters: PromotionFilterDto!) {
    findPromotions(filters: $filters) {
      content {
        id
        name
        description
        type
        value
        createdAt
        updatedAt
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
