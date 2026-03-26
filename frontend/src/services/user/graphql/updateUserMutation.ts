import { gql } from '@apollo/client'

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $data: UpdateUserDto!) {
    updateUser(id: $id, data: $data) {
      name
      lastName
      email
    }
  }
`
