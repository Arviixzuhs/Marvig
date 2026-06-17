import { gql } from '@apollo/client'

export const FIND_PAYMENT = gql`
  query FindPaymentById($id: Int!) {
    findPaymentById(id: $id) {
      id
      amount
      method
      status
      reference
      date
    }
  }
`
