import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppTableInterface {
  formData: Record<string, string | unknown>
  totalPrice: number
}

const initialState = {
  formData: {},
  totalPrice: 0,
} as AppTableInterface

export const manageCheckoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    clearCheckout: () => initialState,
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload
    },
    setCheckoutFormData: (
      state,
      action: PayloadAction<{ name: string; value: string | unknown }>,
    ) => {
      const { name, value } = action.payload
      if (state.formData) {
        state.formData[name] = value
      }
    },
  },
})

export const { clearCheckout, setCheckoutFormData, setTotalPrice } = manageCheckoutSlice.actions
