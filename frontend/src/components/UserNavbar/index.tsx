import { NavbarUserOptions } from '@/components/UserOptions'
import { appConfig } from '@/config'
import { RootState } from '@/store'
import { Button } from '@heroui/react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const UserNavbar = () => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur border-b'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        <Link to='/'>
          <h1 className='text-xl font-semibold tracking-tight'>
            Posada<span className='text-blue-600'>{appConfig.company}</span>
          </h1>
        </Link>
        <nav className='hidden md:flex items-center gap-8 text-sm'>
          <a href='#apartments' className='hover:text-blue-600 transition'>
            Apartamentos
          </a>
          <a href='#about' className='hover:text-blue-600 transition'>
            Nosotros
          </a>
          <a href='#contact' className='hover:text-blue-600 transition'>
            Contacto
          </a>
        </nav>
        {user ? (
          <NavbarUserOptions />
        ) : (
          <Link to='/login'>
            <Button color='primary' radius='sm'>
              Iniciar sesión
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
