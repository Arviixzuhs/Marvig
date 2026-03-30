import { gql } from '@apollo/client'

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($id: Int!, $data: UpdateExpenseDto!) {
    updateExpense(id: $id, data: $data) {
      id
      amount
      category
      description
      updatedAt
    }
  }
`
