import { gql } from '@apollo/client'

export const VALIDATE_VERIFICATION_CODE = gql`
  mutation ValidateVerificationCode($data: ValidateVerificationCodeInput!) {
    validateVerificationCode(data: $data)
  }
`
