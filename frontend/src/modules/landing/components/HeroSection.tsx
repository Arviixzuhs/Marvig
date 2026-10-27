import BgImage from '@/assets/images/bg-image.jpg'
import { Check, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApartmentSearchFields } from './ApartmentSearchFields'

const MOMENTS = ['en familia', 'en pareja', 'con amigos', 'sin prisa']

const RotatingMoment = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % MOMENTS.length), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <span key={index} aria-hidden className='block italic text-tertiary animate-appearance-in'>
      {MOMENTS[index]}.
    </span>
  )
}

const PERKS = ['Reserva directa', 'Precios claros', 'Sin intermediarios']

export const HeroSection = () => {
  return (
    <section className='relative flex h-dvh flex-col items-center bg-black text-white'>
      <div className='absolute inset-0 overflow-hidden'>
        <img
          src={BgImage}
          alt='Atardecer en la playa de Margarita'
          className='h-full w-full object-cover object-[65%_50%] md:object-center'
        />
        <div
          aria-hidden
          className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/95'
        />
        <div
          aria-hidden
          className='absolute inset-0 bg-[radial-gradient(60%_40%_at_30%_45%,rgba(233,168,149,0.35),transparent_60%)]'
        />

        <div
          aria-hidden
          className='pointer-events-none absolute -right-[30%] top-[10%] aspect-square w-[min(34rem,90vw,80vh)] rounded-full bg-[radial-gradient(circle,rgba(243,207,194,0.55)_0%,rgba(201,124,112,0.22)_45%,transparent_70%)] blur-2xl animate-[pulse_7s_ease-in-out_infinite] sm:-right-24'
        />
      </div>

      <div aria-hidden className='relative w-full shrink-0 h-[clamp(3.5rem,9vh,5rem)]' />

      <div className='relative flex min-h-0 w-full max-w-6xl flex-1 items-center px-4 sm:px-6 lg:px-8 2xl:max-w-7xl pb-[clamp(0.75rem,4vh,3.5rem)]'>
        <div className='flex w-full flex-col gap-[clamp(0.75rem,2.6vh,2.5rem)]'>
          <div className='flex flex-col gap-[clamp(0.5rem,1.8vh,1.25rem)]'>
            <span className='inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm animate-appearance-in sm:px-4 sm:text-sm sm:tracking-[0.18em]'>
              <MapPin size={14} className='shrink-0 text-tertiary' />
              <span className='truncate'>Posada Marvig · Isla de Margarita</span>
            </span>

            <h1
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className='max-w-3xl text-[clamp(2.5rem,min(8vw,10.5vh),6rem)] font-semibold leading-[1.02] tracking-tight animate-appearance-in'
            >
              <span className='sr-only'>
                Margarita se vive en familia, en pareja, con amigos o sin prisa.
              </span>
              <span aria-hidden>Margarita se vive</span>
              <RotatingMoment />
            </h1>

            {/* Se oculta en pantallas muy bajas para que todo siga cabiendo */}
            <p
              style={{ animationDelay: '250ms', animationFillMode: 'both' }}
              className='max-w-xl text-pretty leading-relaxed text-white/80 animate-appearance-in text-[clamp(0.9rem,min(2.5vh,4.2vw),1.25rem)] [@media(max-height:540px)]:hidden'
            >
              Apartamentos acogedores en Posada Marvig para que tus vacaciones empiecen apenas
              llegues. Reserva en minutos y sin intermediarios.
            </p>
          </div>

          <ApartmentSearchFields />

          <ul
            style={{ animationDelay: '450ms', animationFillMode: 'both' }}
            className='flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75 animate-appearance-in sm:gap-x-6 [@media(max-height:620px)]:hidden'
          >
            {PERKS.map((perk) => (
              <li key={perk} className='inline-flex items-center gap-2'>
                <Check size={16} className='shrink-0 text-tertiary' />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
