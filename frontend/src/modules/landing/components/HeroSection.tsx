import BgImage from '@/assets/images/bg-image.jpg'
import { ApartmentSearchFields } from './ApartmentSearchFields'

export const HeroSection = () => {
  return (
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
  )
}
