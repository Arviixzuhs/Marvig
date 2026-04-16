import { gql } from '@apollo/client'

export const GET_EXPENSES = gql`
  query FindExpenses($filters: ExpenseFilterDto!) {
    findExpenses(filters: $filters) {
      content {
        id
        amount
        date
        paymentMethod
        images {
          id
          url
        }
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
