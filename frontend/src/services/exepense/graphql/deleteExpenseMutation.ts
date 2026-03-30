import { gql } from '@apollo/client'

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: Int!) {
    deleteExpense(id: $id)
  }
`
