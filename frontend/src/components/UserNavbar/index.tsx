import logo from '@/assets/icons/logo.jpg'
import { Button } from '@heroui/react'
import { useLenis } from 'lenis/react'
import { RootState } from '@/store'
import { appConfig } from '@/config'
import { ChevronLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import { NavbarUserOptions } from '@/components/UserOptions'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export const UserNavbar = () => {
  const user = useSelector((state: RootState) => state.user)
  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  const navigate = useNavigate()
  const lenis = useLenis()
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

  const links = [
    { label: 'Apartamentos', id: 'apartments' },
    { label: 'Servicios', id: 'services' },
    { label: 'Ubicación', id: 'address' },
    { label: 'Contacto', id: 'contact' },
  ]

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
        <div className='max-w-6xl mx-auto flex items-center justify-between px-6 min-h-[40px]'>
          <Link to='/' className='transition-colors duration-300 flex-shrink-0'>
            <div className='flex items-center gap-2'>
              <img src={logo} alt='' className='w-8 h-8 rounded-sm' />
              <span
                className={`font-bold whitespace-nowrap ${
                  isLanding && !isScrolled ? 'text-white' : 'text-slate-900'
                }`}
              >
                {appConfig.company}
              </span>
            </div>
          </Link>
          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${
              isLanding ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
            }`}
          >
            {links.map((item, index) => (
              <a
                key={index}
                onClick={() => {
                  const element = document.getElementById(item.id)
                  if (element) {
                    lenis?.scrollTo(element)
                  }
                }}
                className={`cursor-pointer transition-colors duration-300 ${
                  isScrolled ? 'hover:text-blue-600' : 'hover:text-blue-200'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className='flex items-center justify-end h-[36px] min-w-[215px] flex-shrink-0'>
            {user.isLoading ? (
              <div className='h-9 w-[215px] rounded-sm animate-pulse' />
            ) : user.data ? (
              <NavbarUserOptions />
            ) : (
              <div className='flex items-center gap-2 h-9 w-[215px] justify-end whitespace-nowrap'>
                <Link to='/login' className='inline-block'>
                  <Button
                    color={isLanding && !isScrolled ? 'default' : 'primary'}
                    variant='light'
                    radius='sm'
                    className={isLanding && !isScrolled ? 'text-white' : ''}
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to='/register' className='inline-block'>
                  <Button
                    color={isLanding && !isScrolled ? 'default' : 'primary'}
                    variant={isLanding && !isScrolled ? 'flat' : 'solid'}
                    radius='sm'
                    className={
                      isLanding && !isScrolled ? 'bg-white/20 text-white backdrop-blur-sm' : ''
                    }
                  >
                    Registrarme
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {!isLanding && (
        <div className='w-full bg-slate-50/90 backdrop-blur border-b border-t border-gray-200 py-2'>
          <div className='max-w-6xl mx-auto px-6'>
            <button
              onClick={() => navigate(-1)}
              className='text-xs font-medium cursor-pointer text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors w-fit'
            >
              <ChevronLeft size={14} /> Volver
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
