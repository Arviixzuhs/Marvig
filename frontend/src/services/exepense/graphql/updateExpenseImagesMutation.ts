import { gql } from '@apollo/client'

export const UPDATE_EXPENSE_IMAGES = gql`
  mutation UpdateExpenseImages($data: ExpenseImageDto!) {
    updateExpenseImages(data: $data) {
      id
      images {
        id
        url
      }
    }
  }
`
