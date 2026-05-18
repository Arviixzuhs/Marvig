import React from 'react'
import { UserRole } from '@/models/UserModel'
import { setMyUser } from '@/features/userSlice'
import { userService } from '@/services/user'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

export const IsAdminMiddleware = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [isAdminVerified, setIsAdminVerified] = React.useState(false)

  const loadData = async () => {
    try {
      const data = await userService.findCurrent()

      if (!data || data.role !== UserRole.ADMIN) {
        navigate('/', { replace: true })
        return
      }

      dispatch(setMyUser(data))

      setIsAdminVerified(true)
      setLoading(false)
    } catch (error) {
      navigate('/', { replace: true })
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  if (loading || !isAdminVerified) {
    return <></>
  }

  return <Outlet />
}
