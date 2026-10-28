import { ReservationModel } from '@/models/ReservationModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ReservationStateInterface {
  data: ReservationModel | null
}

const initialState: ReservationStateInterface = {
  data: null,
}

export const manageReservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservation: (state, action: PayloadAction<ReservationModel>) => {
      state.data = action.payload
    },
    clearReservation: () => initialState,
  },
})

export const { setReservation, clearReservation  } = manageReservationSlice.actions
