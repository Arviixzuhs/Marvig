import React from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { AdminNavbar } from '../components/Navbar'
import { AdminSidebar } from '../components/Sidebar'

export const AdminLayout = () => {
  const location = useLocation()

  React.useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location])

  return (
    <div className='flex h-screen'>
      <AdminSidebar />
      <div className='flex flex-col h-full w-full'>
        <AdminNavbar />
        <div className='h-full w-full p-4 pl-20 sm:pl-4 overflow-auto hoverScrollbar'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
