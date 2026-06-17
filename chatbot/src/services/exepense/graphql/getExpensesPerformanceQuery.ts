import { gql } from '@apollo/client'

export const GET_EXPENSES_PERFORMANCE = gql`
  query GetExpensesPerformance($filters: ExpenseFilterInput!) {
    getExpensesPerformance(filters: $filters) {
      month
      MAINTENANCE
      UTILITIES
      CLEANING
      TAXES
      SUPPLIES
      OTHER
    }
  }
`
