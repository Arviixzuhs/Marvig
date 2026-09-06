import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  email: string
  code: string
  password?: string
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    code: '',
  } as AuthState,
  reducers: {
    setAuthFormdata: (state, action) => {
      const { name, value } = action.payload
      return {
        ...state,
        [name]: value,
      }
    },
    resetRecoverPasswordData: () => ({
      email: '',
      code: '',
    }),
  },
})

export const { setAuthFormdata, resetRecoverPasswordData } = authSlice.actions
