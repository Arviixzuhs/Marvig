import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($data: UserDto!) {
    createUser(data: $data) {
      id
      name
      lastName
      email
    }
  }
`
