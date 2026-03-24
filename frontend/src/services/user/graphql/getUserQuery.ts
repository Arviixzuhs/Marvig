import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUsers($id: Int!) {
    user(id: $id) {
      id
      name
      lastName
      email
      createdAt
    }
  }
`
