import { Outlet } from 'react-router-dom'
import { UserNavbar } from '@/components/UserNavbar'

export const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  )
}
