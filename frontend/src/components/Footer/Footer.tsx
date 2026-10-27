import logo from '@/assets/icons/logo.jpg'
import { useLenis } from 'lenis/react'
import { companyInfo } from '@/constants'
import { BsInstagram } from 'react-icons/bs'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const sections = [
  { label: 'Apartamentos', id: 'apartments' },
  { label: 'Servicios', id: 'services' },
  { label: 'Ubicación', id: 'address' },
  { label: 'Contacto', id: 'contact' },
]

const linkClass =
  'inline-flex items-center gap-2 min-h-8 text-white/75 hover:text-tertiary transition-colors duration-300'

export const Footer = () => {
  const { pathname } = useLocation()
  const lenis = useLenis()
  const isLanding = pathname === '/'

  const goTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) lenis?.scrollTo(element)
  }

  return (
    <footer className='w-full shrink-0 bg-black text-white pb-[env(safe-area-inset-bottom)]'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16 pb-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8'>
          <div className='lg:col-span-5'>
            <Link to='/' className='inline-flex items-center gap-2.5' aria-label='Ir al inicio'>
              <img src={logo} alt='' className='w-9 h-9 rounded-md object-cover' />
              <span className='font-serif text-3xl font-semibold'>{companyInfo.company}</span>
            </Link>
            <p className='mt-4 max-w-sm text-white/75 leading-relaxed'>
              Tu refugio de serenidad en la Isla de Margarita. Reserva directo, sin intermediarios.
            </p>
            <p className='mt-4 flex items-start gap-2 text-sm text-white/75'>
              <MapPin size={16} className='mt-0.5 shrink-0 text-tertiary' aria-hidden />
              {companyInfo.address}
            </p>
          </div>
          <nav className='lg:col-span-3' aria-label='Mapa del sitio'>
            <h3 className='font-serif text-xl font-semibold mb-3'>Mapa del sitio</h3>
            <ul>
              {isLanding ? (
                sections.map((item) => (
                  <li key={item.id}>
                    <button type='button' onClick={() => goTo(item.id)} className={linkClass}>
                      {item.label}
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link to='/' className={linkClass}>
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link to='/apartments' className={linkClass}>
                      Apartamentos
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className='lg:col-span-4'>
            <h3 className='font-serif text-xl font-semibold mb-3'>Contacto</h3>
            <ul>
              <li>
                <a href={`tel:${companyInfo.contact.phone}`} className={linkClass}>
                  <Phone size={16} className='text-tertiary' aria-hidden />
                  {companyInfo.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${companyInfo.contact.mail}`} className={`${linkClass} break-all`}>
                  <Mail size={16} className='text-tertiary shrink-0' aria-hidden />
                  {companyInfo.contact.mail}
                </a>
              </li>
              <li>
                <a
                  href={companyInfo.socials.instagram.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClass}
                >
                  <BsInstagram size={16} className='text-tertiary' aria-hidden />
                  {companyInfo.socials.instagram.user}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-white/65'>
          <span>
            © {new Date().getFullYear()} Posada {companyInfo.company} C.A. Todos los derechos
            reservados.
          </span>
          <span>Isla de Margarita, Venezuela</span>
        </div>
      </div>
    </footer>
  )
}
