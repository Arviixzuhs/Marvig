import { gql } from '@apollo/client'

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($data: CreatePaymentInput!) {
    createPayment(data: $data) {
      id
      amount
      method
      status
      reference
      date
    }
  }
`
