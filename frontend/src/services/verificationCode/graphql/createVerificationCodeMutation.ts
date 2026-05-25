import { gql } from '@apollo/client'

export const CREATE_VERIFICATION_CODE = gql`
  mutation CreateVerificationCode($data: CreateVerificationCodeInput!) {
    createVerificationCode(data: $data)
  }
`
