import { authApi } from '@/api/axios-client'

import { type IAuthConfirmSigning, type IAuthSigning, type IAuthLoginUser, IChangePasswordByCode } from './interfaces'

export const authService = {
  login: (data: IAuthLoginUser) => authApi.post('/auth/login', data),
  signing: (data: IAuthSigning) => authApi.post('/auth/signing', data),
  googleAuth: (credential: string) => authApi.post('/auth/google', { credential }),
  confirmSigning: (data: IAuthConfirmSigning) => authApi.post('/auth/confirm-signing', data),
  validateSigningToken: (token: string) => authApi.get(`/auth/validate-signing-token/${token}`),
  changePasswordByCode: (data: IChangePasswordByCode) => authApi.post('/auth/change-password-by-code', data)
}
