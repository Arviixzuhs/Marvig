import { manageApartmentSlice } from '@/features/apartmentSlice'
import { manageAppTableSlice } from '@/features/appTableSlice'
import { manageUserSlice } from '@/features/userSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const appReducer = combineReducers({
  user: manageUserSlice.reducer,
  appTable: manageAppTableSlice.reducer,
  apartment: manageApartmentSlice.reducer,
})

const store = configureStore({
  reducer: appReducer,
})

export type RootState = ReturnType<typeof store.getState>

export default store
