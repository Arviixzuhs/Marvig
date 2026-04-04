import { gql } from '@apollo/client'

export const FIND_PAYMENTS = gql`
  query FindPayments($filters: PaymentFilterDto!) {
    findPayments(filters: $filters) {
      content {
        id
        amount
        method
        status
        reference
        date
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
