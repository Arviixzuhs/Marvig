import React from 'react'
import { Footer } from '@/components/Footer/Footer'
import { UserNavbar } from '@/components/UserNavbar'
import { Outlet, useLocation } from 'react-router-dom'

export const UserLayout = () => {
  const { pathname } = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  React.useEffect(() => {
    document.body.classList = ''
  }, [])

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground'>
      <UserNavbar />
      <main className='flex-grow w-full'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
