import { gql } from '@apollo/client'

export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($data: UpdateMyProfileInput!) {
    updateMyProfile(data: $data) {
      id
      name
      lastName
      role
      email
      avatar
      phone
      createdAt
    }
  }
`
