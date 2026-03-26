import { cn } from '@heroui/theme'
import { Button } from '@heroui/button'
import { useState } from 'react'
import { appConfig } from '@/config'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutDashboard, Home, Users } from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    title: 'Apartmentos',
    icon: Home,
    href: '/admin/apartments',
  },
  {
    title: 'Usuarios',
    icon: Users,
    href: '/admin/users',
  },
]

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { pathname } = useLocation()
  const user = useSelector((state: RootState) => state.user)

  return (
    <aside
      className={cn(
        'absolute z-50 flex h-screen flex-col bg-sidebar transition-all duration-300 sm:relative',
        isCollapsed ? 'w-15' : 'w-82',
      )}
    >
      <div className='flex h-16 items-center justify-between border-b border-gray-300 px-4'>
        {!isCollapsed && <h2 className='text-lg font-semibold text-nowrap'>{appConfig.company}</h2>}

        <Button
          size='sm'
          variant='light'
          color='primary'
          isIconOnly
          onPress={() => setIsCollapsed(!isCollapsed)}
          className='h-8 w-8 hover:bg-sidebar-accent'
        >
          {isCollapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
        </Button>
      </div>
      <nav className='flex-1 space-y-1 p-2'>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'hover:bg-primary/10 hover:text-primary',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className='h-5 w-5 flex-shrink-0 transition-colors' />

              <span
                className={cn(
                  'transition-all duration-200',
                  isCollapsed ? 'opacity-0' : 'opacity-100',
                )}
              >
                {item.title}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className='border-t border-gray-300 p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex min-h-8 min-w-8 items-center justify-center rounded-full bg-primary text-sidebar-primary-foreground'>
            <span className='text-sm font-semibold'>{user?.name?.charAt(0)}</span>
          </div>
          <div
            className={cn(
              'flex-1 overflow-hidden transition-all duration-200',
              isCollapsed ? 'opacity-0' : 'opacity-100',
            )}
          >
            <p className='truncate text-sm font-medium'>
              {user?.name} {user?.lastName}
            </p>
            <p className='truncate text-xs'>{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
