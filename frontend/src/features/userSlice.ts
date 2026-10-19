import { createSlice } from '@reduxjs/toolkit'
import { UserModel } from '@/models/UserModel'

export interface IUserSlice {
  data: UserModel | null
  isLoading: boolean
}

export const manageUserSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    isLoading: false,
  } as IUserSlice,
  reducers: {
    setMyUser: (state, action) => {
      state.data = action.payload
    },
    setIsUserLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setMyUser, setIsUserLoading } = manageUserSlice.actions
