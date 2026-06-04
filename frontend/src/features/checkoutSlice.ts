import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppTableInterface {
  formData: Record<string, string | unknown>
  date: {
    start: Date | null
    end: Date | null
  }
  nights: number
}

export const manageCheckoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    formData: {},
    date: {
      start: null,
      end: null,
    },
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
    setDate: (state, action: PayloadAction<{ start: Date | null; end: Date | null }>) => {
      const { start, end } = action.payload
      state.date.start = start
      state.date.end = end
    },
    setNights: (state, action: PayloadAction<number>) => {
      state.nights = action.payload
    },
  },
})

export const { setCheckoutFormData, setDate, setNights } = manageCheckoutSlice.actions
