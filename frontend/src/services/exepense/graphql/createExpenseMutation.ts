import { gql } from '@apollo/client'

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($data: ExpenseDto!) {
    createExpense(data: $data) {
      id
      amount
      category
      description
      createdAt
    }
  }
`
