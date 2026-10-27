import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ApartmentsGrid } from './ApartmentsGrid'

export const ApartmentsSection = () => {
  return (
    <section id='apartments' className='flex justify-center bg-c-co text-black scroll-mt-10'>
      <div className='flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:gap-12 sm:px-6 sm:py-20 lg:py-24'>
        <div className='flex flex-col gap-3'>
          {/* Título y botón: siempre en la misma fila, separados por justify-between */}
          <div className='flex items-center justify-between gap-4'>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className='min-w-0 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight'
            >
              Apartamentos
            </h2>

            <Link
              to='/apartments'
              className='group inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-black px-4 text-xs font-semibold transition-colors hover:bg-black hover:text-white sm:min-h-11 sm:gap-2 sm:px-6 sm:text-sm'
            >
              Ver todos
              <ArrowRight
                size={14}
                className='transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4'
              />
            </Link>
          </div>

          <p className='max-w-xl text-pretty text-base leading-relaxed text-black/75 sm:text-lg'>
            Espacios cómodos y acogedores para que tu estadía en Margarita se sienta como en casa.
          </p>
        </div>

        <ApartmentsGrid />
      </div>
    </section>
  )
}
