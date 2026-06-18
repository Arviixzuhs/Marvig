import React from 'react'
import { setMyUser } from '@/features/userSlice'
import { userService } from '@/services/user'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

export const AuthMiddleware = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)

  const loadData = async () => {
    try {
      const data = await userService.findCurrent()

      if (!data) {
        navigate('/', { replace: true })
        return
      }

      dispatch(setMyUser(data))
      setLoading(false)
    } catch (error) {
      navigate('/', { replace: true })
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  if (loading) return <></>

  return <Outlet />
}
