import logo from '@/assets/icons/logo.jpg'
import { Button } from '@heroui/react'
import { RootState } from '@/store'
import { appConfig } from '@/config'
import { ChevronLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import { NavbarUserOptions } from '@/components/UserOptions'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const UserNavbar = () => {
  const user = useSelector((state: RootState) => state.user)
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!isLanding) {
      setIsScrolled(false)
      return
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLanding, pathname])

  return (
    <div
      className={`${isLanding ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <header
        className={`w-full transition-background py-3 duration-300 ${
          isLanding
            ? isScrolled
              ? 'bg-white/80 backdrop-blur text-slate-800'
              : 'bg-transparent text-white'
            : 'bg-white/80 backdrop-blur text-slate-800'
        }`}
      >
        <div className='max-w-7xl mx-auto flex items-center justify-between px-5'>
          <Link to='/' className='transition-colors duration-300'>
            <div className='flex items-center flex-shrink-0 gap-2'>
              <img src={logo} alt='' className='w-8 h-8 rounded-sm' />
              <span
                className={`font-bold whitespace-nowrap ${isLanding && !isScrolled ? 'text-white' : 'text-slate-900'}`}
              >
                {appConfig.company}
              </span>
            </div>
          </Link>
          <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
            <a
              href='#apartments'
              className={`transition-colors duration-300 ${isScrolled ? 'hover:text-blue-600' : 'hover:text-blue-200'}`}
            >
              Apartamentos
            </a>
            <a
              href='#about'
              className={`transition-colors duration-300 ${isScrolled ? 'hover:text-blue-600' : 'hover:text-blue-200'}`}
            >
              Nosotros
            </a>
            <a
              href='#contact'
              className={`transition-colors duration-300 ${isScrolled ? 'hover:text-blue-600' : 'hover:text-blue-200'}`}
            >
              Contacto
            </a>
          </nav>
          {user ? (
            <NavbarUserOptions />
          ) : (
            <Link to='/login'>
              <Button
                color={isLanding && !isScrolled ? 'default' : 'primary'}
                variant={isLanding && !isScrolled ? 'flat' : 'solid'}
                radius='sm'
                className={
                  isLanding && !isScrolled ? 'bg-white/20 text-white backdrop-blur-sm' : ''
                }
              >
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </header>
      {!isLanding && (
        <div className='w-full bg-slate-50/90 backdrop-blur border-b border-t border-gray-200 py-2'>
          <div className='max-w-7xl mx-auto px-5'>
            <Link
              to='/'
              className='text-xs font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors w-fit'
            >
              <ChevronLeft size={14} /> Volver al inicio
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
