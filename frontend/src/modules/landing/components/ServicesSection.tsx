import type { ElementType } from 'react'
import { Wifi, Droplets, Car, MapPin, Utensils } from 'lucide-react'

interface ServiceItem {
  icon: ElementType
  title: string
  description: string
}

const services: ServiceItem[] = [
  {
    icon: Droplets,
    title: 'Agua Garantizada',
    description: 'Sistemas de agua hidroneumáticos para que tu estadía no sufra interrupciones.',
  },
  {
    icon: Wifi,
    title: 'Wi-Fi',
    description:
      'Conexión estable en todos los apartamentos y áreas comunes, ideal tanto para el descanso como para el trabajo remoto.',
  },
  {
    icon: Car,
    title: 'Estacionamiento',
    description: 'Estacionamiento privado para la total tranquilidad de tu vehículo.',
  },
  {
    icon: Utensils,
    title: 'Zona de Parrilleras',
    description:
      'Espacios totalmente equipados para preparar tus asados y compartir momentos especiales al aire libre con tus acompañantes.',
  },
  {
    icon: MapPin,
    title: 'Ubicación Estratégica',
    description:
      'Situados en una zona residencial tranquila, a escasos minutos de las principales playas, restaurantes y centros comerciales.',
  },
]

export const ServicesSection = () => {
  return (
    <section id='services' className='flex justify-center bg-background-2 text-black scroll-mt-10'>
      <div className='flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:gap-14 sm:px-6 sm:py-20 lg:py-24'>
        <div className='flex max-w-2xl flex-col gap-3 sm:gap-4'>
          <h2 className='font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-balance'>
            Servicios
          </h2>
          <p className='text-pretty text-base leading-relaxed text-black/75 sm:text-lg'>
            Nos encargamos de cada detalle para que solo te preocupes por relajarte y disfrutar de
            las instalaciones del complejo.
          </p>
        </div>

        <ul className='flex flex-wrap gap-x-8 gap-y-8 sm:gap-y-10'>
          {services.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className='group flex w-full items-start gap-4 sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]'
            >
              <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black transition-transform duration-500 group-hover:-translate-y-1'>
                <Icon strokeWidth={1.5} className='h-6 w-6 text-tertiary' />
              </span>

              <div className='flex min-w-0 flex-col gap-1'>
                <h3 className='font-serif text-2xl font-semibold leading-tight'>{title}</h3>
                <p className='text-pretty leading-relaxed text-black/75'>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
