import { manageUserSlice } from '@/features/userSlice'
import { manageCheckoutSlice } from '@/features/checkoutSlice'
import { manageAppTableSlice } from '@/features/appTableSlice'
import { manageApartmentSlice } from '@/features/apartmentSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const appReducer = combineReducers({
  user: manageUserSlice.reducer,
  checkout: manageCheckoutSlice.reducer,
  appTable: manageAppTableSlice.reducer,
  apartment: manageApartmentSlice.reducer,
})

const store = configureStore({
  reducer: appReducer,
})

export type RootState = ReturnType<typeof store.getState>

export default store
