import { gql } from '@apollo/client'

export const GET_EMPLOYEE = gql`
  query GetAmployee($id: Int!) {
    employee(id: $id) {
      id
      name
      email
      phone
      address
      lastName
    }
  }
`
