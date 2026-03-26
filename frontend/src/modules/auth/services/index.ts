import { authApi } from '@/api/axios-client'

import { type IAuthLoginUser, type IAuthRegisterUser } from './interfaces'

export const authService = {
  login: (data: IAuthLoginUser) => authApi.post('/auth/login', data),
  register: (data: IAuthRegisterUser) => authApi.post('/auth/register', data),
}
