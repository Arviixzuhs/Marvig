import { Footer } from '@/components/Footer/Footer'
import { UserNavbar } from '@/components/UserNavbar'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export const UserLayout = () => {
  const { pathname } = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div>
      <UserNavbar />
      <Outlet />
      <Footer />
    </div>
  )
}
