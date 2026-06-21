import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppTableInterface {
  formData: Record<string, string | unknown>
}

const initialState = {
  formData: {},
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
  },
})

export const { clearCheckout, setCheckoutFormData } = manageCheckoutSlice.actions
