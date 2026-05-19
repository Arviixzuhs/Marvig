import { gql } from '@apollo/client'

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($data: ExpenseInput!) {
    createExpense(data: $data) {
      id
      amount
      category
      description
      createdAt
    }
  }
`
