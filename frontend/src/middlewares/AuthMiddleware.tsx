import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthMiddleware = () => {
  const user = useSelector((state: RootState) => state.user)

  if (!user) return <Navigate to='/' />
  return <Outlet />
}
