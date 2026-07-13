import React from 'react'
import { Card, CardBody, Button } from '@heroui/react'
import { MapPin, Compass, Car, Palmtree, Utensils, FerrisWheel, ShoppingBag } from 'lucide-react'

interface NearbyPlace {
  name: string
  distance: string
  type: 'playa' | 'restaurante' | 'atraccion' | 'compras'
}

export const LocationSection: React.FC = () => {
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

  const googleMapsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.085516587624!2d-63.818048725837635!3d11.006707989156379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318ff9503cc53d%3A0x4c968cbf8c34dca8!2sPosada%20Marvig!5e1!3m2!1ses!2sve!4v1783901480227!5m2!1ses!2sve'


  const googleMapsNavigationUrl =
    'https://www.google.com/maps/place/Posada+Marvig/@11.006708,-63.818049,16z'

  const getIcon = (type: string) => {
    switch (type) {
      case 'playa':
        return <Palmtree className='w-4 h-4 text-green-400' />
      case 'restaurante':
        return <Utensils className='w-4 h-4 text-warning' />
      case 'atraccion':
        return <FerrisWheel className='w-4 h-4 text-red-400' />
      case 'compras':
        return <ShoppingBag className='w-4 h-4 text-info text-blue-500' />
      default:
        return <MapPin className='w-4 h-4 text-red-400' />
    }
  }

  return (
    <section className='max-w-6xl mx-auto px-6 py-16'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        <div className='lg:col-span-4 space-y-6'>
          <div>
            <p className='text-small font-semibold tracking-wider text-primary uppercase mb-2'>
              Ubicación Estratégica
            </p>
            <h2 className='text-3xl font-bold tracking-tight text-default-900'>
              El corazón de tu próxima aventura
            </h2>
            <p className='mt-4 text-default-500 text-medium leading-relaxed'>
              Disfruta del equilibrio perfecto: la tranquilidad exclusiva dentro de nuestras
              instalaciones y la cercanía inmediata a las mejores playas, centros de compras, clubes
              costeros y parques temáticos de la Isla de Margarita.
            </p>
          </div>
          <Card className='bg-default-50 dark:bg-default-100 border-none shadow-sm'>
            <CardBody className='p-4 flex flex-row items-center gap-4'>
              <div className='p-3 bg-primary/10 rounded-xl'>
                <MapPin className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h4 className='font-semibold text-default-800 text-small'>
                  Dirección de la Posada
                </h4>
                <p className='text-tiny text-default-500'>
                  Sector El Yaque / Zonas Aledañas, Isla de Margarita, Nueva Esparta.
                </p>
              </div>
            </CardBody>
          </Card>
          <div className='space-y-3'>
            <h4 className='font-bold text-default-800 text-medium flex items-center gap-2'>
              <Compass className='w-4 h-4 text-default-600' />
              <span>Lugares de interés cercanos:</span>
            </h4>
            <div className='space-y-2'>
              {nearbyPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className='flex justify-between items-center text-small py-2 border-b border-default-200/50'
                >
                  <div className='flex items-center gap-2'>
                    {getIcon(place.type)}
                    <span className='text-default-700 font-medium'>{place.name}</span>
                  </div>
                  {/* <span className='text-default-500 text-tiny text-right shrink-0 ml-2'>
                    {place.distance}
                  </span> */}
                </div>
              ))}
            </div>
          </div>
          <Button
            as='a'
            href={googleMapsNavigationUrl}
            target='_blank'
            variant='flat'
            className='w-full font-semibold'
            startContent={<Car className='w-4 h-4' />}
          >
            Cómo llegar con GPS
          </Button>
        </div>
        <div className='lg:col-span-8 w-full h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-sm border border-default-200/60 relative bg-default-100'>
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
    </section>
  )
}
