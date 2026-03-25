import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers($filters: UserFilterDto!) {
    users(filters: $filters) {
      content {
        id
        name
        lastName
        email
        avatar
        createdAt
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
