import { createSlice } from '@reduxjs/toolkit'
import { ApartmentModel } from '@/models/ApartmentModel'

export interface IApartmentSlice {
  data: ApartmentModel | null
  isLoading: boolean
}

export const manageApartmentSlice = createSlice({
  name: 'apartment',
  initialState: {
    data: null,
    isLoading: false,
  } as IApartmentSlice,
  reducers: {
    setApartment: (state, action) => {
      state.data = action.payload
    },
    setIsApartmentLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setApartment, setIsApartmentLoading } = manageApartmentSlice.actions
