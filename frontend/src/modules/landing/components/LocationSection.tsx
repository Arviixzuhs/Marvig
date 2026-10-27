import React from 'react'
import { Button } from '@heroui/react'
import { MapPin, Car, Palmtree, Utensils, FerrisWheel, ShoppingBag } from 'lucide-react'
import { companyInfo } from '@/constants'

interface NearbyPlace {
  name: string
  distance: string
  type: 'playa' | 'restaurante' | 'atraccion' | 'compras'
}

const nearbyPlaces: NearbyPlace[] = [
  { name: 'Centro Comercial Sambil Margarita', distance: 'a 15 min en auto', type: 'compras' },
  {
    name: 'Casamare Club de Playa (El Yaque)',
    distance: 'a pocos minutos (Acceso a pie/auto)',
    type: 'playa',
  },
  {
    name: 'Madero Restaurant (Av. Mario Oliveros)',
    distance: 'a 5 min en auto',
    type: 'restaurante',
  },
  { name: 'Sharks Restaurante & Mare Mare', distance: 'a 4 min en auto', type: 'restaurante' },
  { name: 'Parque de Atracciones Diverland', distance: 'a 20 min en auto', type: 'atraccion' },
  { name: 'Waterland Mundo Marino', distance: 'a 22 min en auto', type: 'atraccion' },
  { name: 'Faro de Punta Ballena (Pampatar)', distance: 'a 25 min en auto', type: 'atraccion' },
]

const icons: Record<NearbyPlace['type'], React.ElementType> = {
  playa: Palmtree,
  restaurante: Utensils,
  atraccion: FerrisWheel,
  compras: ShoppingBag,
}

const googleMapsEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.085516587624!2d-63.818048725837635!3d11.006707989156379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318ff9503cc53d%3A0x4c968cbf8c34dca8!2sPosada%20Marvig!5e1!3m2!1ses!2sve!4v1783901480227!5m2!1ses!2sve'

const googleMapsNavigationUrl =
  'https://www.google.com/maps/place/Posada+Marvig/@11.006708,-63.818049,16z'

export const LocationSection: React.FC = () => {
  return (
    <section id='address' className='flex justify-center bg-background-2 text-black scroll-mt-10'>
      <div className='w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-24'>
        <div className='flex flex-col lg:flex-row items-stretch gap-10 lg:gap-14'>
          {/* Información */}
          <div className='flex flex-col gap-8 lg:gap-10 lg:basis-5/12 lg:shrink-0'>
            <h2 className='font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-balance'>
              Ubicación
            </h2>

            <div className='flex items-center gap-4'>
              <span className='flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-black'>
                <MapPin className='w-5 h-5 text-tertiary' />
              </span>
              <div className='flex flex-col'>
                <p className='font-semibold'>Dirección de la posada</p>
                <p className='text-sm text-black/70'>{companyInfo.address}</p>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <h3 className='font-serif text-3xl font-semibold'>Lugares de interés cercanos</h3>
              <ul className='flex flex-col'>
                {nearbyPlaces.map(({ name, type }) => {
                  const Icon = icons[type]
                  return (
                    <li
                      key={name}
                      className='flex items-center gap-3 py-3 border-b border-black/15'
                    >
                      <Icon strokeWidth={1.5} className='w-5 h-5 shrink-0 text-black/70' />
                      <span className='font-medium'>{name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <Button
              as='a'
              href={googleMapsNavigationUrl}
              target='_blank'
              rel='noopener noreferrer'
              size='lg'
              radius='full'
              className='self-start bg-black text-white'
              startContent={<Car className='w-4 h-4' />}
            >
              Cómo llegar con GPS
            </Button>
          </div>

          <div className='relative w-full lg:flex-1 h-[360px] sm:h-[450px] lg:h-[620px] rounded-3xl overflow-hidden bg-black/5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.5)]'>
            <iframe
              src={googleMapsEmbedUrl}
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen={true}
              loading='lazy'
              referrerPolicy='strict-origin-when-cross-origin'
              title='Ubicación de Posada Marvig en Google Maps'
              className='absolute inset-0 w-full h-full'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
