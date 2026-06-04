import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppTableInterface {
  formData: Record<string, string | unknown>
  nights: number
}

export const manageCheckoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    formData: {},
    nights: 0,
  } as AppTableInterface,
  reducers: {
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

export const { setCheckoutFormData, setNights } = manageCheckoutSlice.actions
