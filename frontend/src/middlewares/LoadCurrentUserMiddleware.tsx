import React from 'react'
import { Outlet } from 'react-router-dom'
import { setMyUser } from '@/features/userSlice'
import { userService } from '@/services/user'
import { useDispatch } from 'react-redux'

export const LoadCurrentUserMiddleware = () => {
  const dispatch = useDispatch()

  const loadData = async () => {
    const data = await userService.findCurrent()
    if (!data) return
    dispatch(setMyUser(data))
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return <Outlet />
}
