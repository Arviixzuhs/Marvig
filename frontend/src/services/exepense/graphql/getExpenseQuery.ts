import { gql } from '@apollo/client'

export const GET_EXPENSE = gql`
  query FindExpenseById($id: Int!) {
    findExpenseById(id: $id) {
      id
      amount
      category
      description
      apartmentId
      employeeId
      createdAt
      updatedAt
    }
  }
`
