import React from 'react'
import { Outlet } from 'react-router-dom'
import { setIsUserLoading, setMyUser } from '@/features/userSlice'
import { userService } from '@/services/user'
import { useDispatch } from 'react-redux'

export const LoadCurrentUserMiddleware = () => {
  const dispatch = useDispatch()

  const loadData = async () => {
    try {
      dispatch(setIsUserLoading(true))
      const data = await userService.findCurrent()
      if (!data) return
      dispatch(setMyUser(data))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setIsUserLoading(false))
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return <Outlet />
}
