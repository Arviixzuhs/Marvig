import { manageAppTableSlice } from '@/features/appTableSlice'
import { manageUserSlice } from '@/features/userSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const appReducer = combineReducers({
  appTable: manageAppTableSlice.reducer,
  user: manageUserSlice.reducer,
})

const store = configureStore({
  reducer: appReducer,
})

export type RootState = ReturnType<typeof store.getState>

export default store
