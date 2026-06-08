import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppTableInterface {
  formData: Record<string, string | unknown>
  nights: number
}

const initialState = {
  formData: {},
  nights: 0,
} as AppTableInterface

export const manageCheckoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    clearCheckout: () => initialState,
    setCheckoutFormData: (
      state,
      action: PayloadAction<{ name: string; value: string | unknown }>,
    ) => {
      const { name, value } = action.payload
      if (state.formData) {
        state.formData[name] = value
      }
    },
    setNights: (state, action: PayloadAction<number>) => {
      state.nights = action.payload
    },
  },
})

export const { clearCheckout, setCheckoutFormData, setNights } = manageCheckoutSlice.actions
