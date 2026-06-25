import BgImage from '@/assets/images/bg-image.jpg'
import { Link } from 'react-router-dom'
import { ChatBot } from './components/ChatBot'
import { ArrowRight } from 'lucide-react'
import { ApartmentsGrid } from './components/Apartments'
import { ApartmentSearchFields } from './components/ApartmentSearchFields'

export const LandingPage = () => {
  return (
    <div className='min-h-screen bg-background'>
      <section className='relative bg-[#000000] text-white h-screen px-6 overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src={BgImage}
            alt='Atardecer playa en Margarita'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='absolute inset-0 bg-gradient-to-b from-[#000000]/60 to-[#000000]/80' />
        <div className='relative h-full flex flex-col items-center justify-center text-center max-w-7xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-extrabold mb-5 leading-none tracking-tight'>
            Tu lugar vacacional
            <br />
            <span>sin complicaciones.</span>
          </h1>
          <p className='text-white/60 text-lg mb-12 max-w-xl mx-auto leading-relaxed'>
            Encuentra, reserva y gestiona tu apartamento en minutos. Transparencia total, sin
            intermediarios.
          </p>
          <ApartmentSearchFields />
        </div>
      </section>
      <section className='max-w-6xl mx-auto px-6 py-16'>
        <div className='flex items-end justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold'>Destacados esta semana</h2>
            <p className='text-muted-foreground text-sm mt-1'>Los más buscados en la plataforma</p>
          </div>
          <Link
            to={'/apartments'}
            className='text-sm flex items-center gap-1 font-medium hover:underline transition-all'
            style={{ color: '#2B4FFF' }}
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <ApartmentsGrid />
      </section>
      <ChatBot />
    </div>
  )
}
