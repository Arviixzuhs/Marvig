import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      name
      lastName
      email
    }
  }
`
