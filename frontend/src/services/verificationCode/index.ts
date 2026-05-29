import { apolloClient } from '@/api/apollo-client'
import { CREATE_VERIFICATION_CODE } from './graphql/createVerificationCodeMutation'
import { VALIDATE_VERIFICATION_CODE } from './graphql/validateVerificationCodeMutation'
import {
  ValidateVerificationCodeInput,
  CreateVerificationCodeInput,
} from '@/models/VerificationCodeModel'

export const verificationCodeService = {
  create: async (payload: CreateVerificationCodeInput): Promise<string | null> => {
    const { data } = await apolloClient.mutate<{ createVerificationCode: string }>({
      mutation: CREATE_VERIFICATION_CODE,
      variables: {
        data: payload,
      },
    })
    return data?.createVerificationCode || null
  },

  validate: async (payload: ValidateVerificationCodeInput): Promise<boolean> => {
    const { data } = await apolloClient.mutate<{ validateVerificationCode: boolean }>({
      mutation: VALIDATE_VERIFICATION_CODE,
      variables: {
        data: payload,
      },
    })
    return !!data?.validateVerificationCode
  },
}
