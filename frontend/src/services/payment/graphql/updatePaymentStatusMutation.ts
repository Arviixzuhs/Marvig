import { gql } from '@apollo/client'

export const UPDATE_PAYMENT_STATUS = gql`
    mutation UpdatePaymentStatus($id: Int!, $status: String!) {
        updatePaymentStatus(id: $id, status: $status) {
            id
            amount
            method
            status
            reference
            date
        }
    }
`