import logo from '@/assets/icons/logo.jpg'
import { MdMenu } from 'react-icons/md'
import { useState } from 'react'
import { Button, cn } from '@heroui/react'
import { BiSolidDockRight } from 'react-icons/bi'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Home,
  Users,
  Receipt,
  Wallet,
  Tag,
  Info,
  CreditCard,
} from 'lucide-react'

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    label: 'Reservas',
    icon: Receipt,
    href: '/admin/reservations',
  },
  {
    label: 'Pagos',
    icon: CreditCard,
    href: '/admin/payments',
  },
  {
    label: 'Gastos',
    icon: Wallet,
    href: '/admin/expenses',
  },
  {
    label: 'Apartamentos',
    icon: Home,
    href: '/admin/apartments',
  },
  {
    label: 'Promociones',
    icon: Tag,
    href: '/admin/promotions',
  },
  {
    label: 'Usuarios',
    icon: Users,
    href: '/admin/users',
  },
  {
    label: 'Empleados',
    icon: Briefcase,
    href: '/admin/employees',
  },
  {
    label: 'Reportes',
    icon: Info,
    href: '/admin/reports',
  }
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <>
      <aside
        className={cn(
          'rounded-r-2xl absolute z-50 flex h-screen flex-col bg-sidebar transition-all duration-300 lg:relative',
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-[68px] lg:translate-x-0',
        )}
      >
        <div className='flex items-center h-16 px-5 flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <Link to={'/'} className='flex-shrink-0'>
              <img src={logo} alt='' className='w-8 h-8 rounded-sm' />
            </Link>
            <span
              className={`font-bold whitespace-nowrap transition-opacity ${!isOpen ? 'opacity-0' : 'opacity-100'}`}
            >
              Marvig
            </span>
          </div>
        </div>
        <nav className='flex flex-col h-full px-3 py-4 overflow-y-auto overflow-x-hidden justify-between'>
          <ul className='space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon size={20} className='flex-shrink-0' />
                    <span
                      className={`whitespace-nowrap transition-opacity ${!isOpen && 'opacity-0'} text-sm`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className='cursor-pointer h-[44px] w-full items-center rounded-md  flex'
          >
            <BiSolidDockRight
              className={`transition-all duration-300 text-[24px] ml-2 ${isOpen && 'rotate-180'}`}
            />
          </div>
        </nav>
      </aside>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/20 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className='lg:hidden fixed top-0 left-0 p-3 z-[40]'>
        <Button isIconOnly radius='sm' variant='flat' onPress={() => setIsOpen(!isOpen)}>
          <MdMenu size={24} />
        </Button>
      </div>
    </>
  )
}
