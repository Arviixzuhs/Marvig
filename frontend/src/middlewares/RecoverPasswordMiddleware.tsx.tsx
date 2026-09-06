import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { RootState } from '@/store'

export const RecoverPasswordMiddleware = () => {
  const location = useLocation()
  const recoverPasswordData = useSelector((state: RootState) => state.auth)

  if (location.pathname === '/recovery-password/code' && !recoverPasswordData.email) {
    return <Navigate to={'/recovery-password/email'} />
  }

  if (location.pathname === '/recovery-password/change' && !recoverPasswordData.code) {
    return <Navigate to={'/recovery-password/code'} />
  }

  return <Outlet />
}