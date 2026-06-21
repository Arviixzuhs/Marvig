import { gql } from '@apollo/client'

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    findCurrentUser {
      id
      name
      lastName
      role
      email
      avatar
      phone
      createdAt
      hasPassword
    }
  }
`
