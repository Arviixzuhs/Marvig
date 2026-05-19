import { createSlice } from '@reduxjs/toolkit'
import { ApartmentModel } from '@/models/ApartmentModel'

export const manageApartmentSlice = createSlice({
  name: 'apartment',
  initialState: null as ApartmentModel | null,
  reducers: {
    setApartment: (_, action) => action.payload,
  },
})

export const { setApartment } = manageApartmentSlice.actions
