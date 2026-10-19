import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  email: string
  code: string
  password?: string
  isLoginModalOpen?: boolean
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    code: '',
    isLoginModalOpen: false,
  } as AuthState,
  reducers: {
    setAuthFormdata: (state, action) => {
      const { name, value } = action.payload
      return {
        ...state,
        [name]: value,
      }
    },
    setIsLoginModal: (state, action) => {
      state.isLoginModalOpen = action.payload
    },
    resetRecoverPasswordData: () => ({
      email: '',
      code: '',
    }),
  },
})

export const { setAuthFormdata, resetRecoverPasswordData, setIsLoginModal } = authSlice.actions
