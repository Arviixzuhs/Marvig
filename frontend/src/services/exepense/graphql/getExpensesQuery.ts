import { gql } from '@apollo/client'

export const GET_EXPENSES = gql`
  query FindExpenses($filters: ExpenseFilterDto!) {
    findExpenses(filters: $filters) {
      content {
        id
        amount
        category
        description
        createdAt
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
