import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Bath, Bed, Building, Car, Dumbbell, Shield, Square, Wifi, Wind } from 'lucide-react'

export const ApartmentDetails = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  if (!apartment) return null

  return (
    <div className='lg:col-span-2 flex flex-col gap-7'>
      <div className='flex items-center gap-7 py-5 border-y border-border'>
        <span className='flex items-center gap-2 text-sm font-medium'>
          <Bed size={17} /> {apartment.bedrooms} habitaciones
        </span>
        <span className='flex items-center gap-2 text-sm font-medium'>
          <Bath size={17} /> {apartment.bathrooms} baños
        </span>
        <span className='flex items-center gap-2 text-sm font-medium'>
          <Square size={17} /> {apartment.squareMeters} m²
        </span>
      </div>
      <div className='flex flex-col gap-3'>
        <h2 className='font-semibold'>Descripción</h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          Hermoso penthouse en el corazón de Chapinero Alto, con vista panorámica de la ciudad.
          Acabados de lujo, cocina integral completamente equipada, terraza privada y parqueadero
          doble. A 5 minutos de los principales centros comerciales y restaurantes del sector.
          Edificio con lobby 24 horas, portería y CCTV en todas las áreas comunes.
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <h2 className='font-semibold'>Amenidades</h2>
        <div className='grid grid-cols-2 gap-3'>
          {[
            { icon: Wifi, label: 'Wifi de alta velocidad' },
            { icon: Car, label: 'Parqueadero doble' },
            { icon: Dumbbell, label: 'Gimnasio privado' },
            { icon: Wind, label: 'Aire acondicionado' },
            { icon: Shield, label: 'Seguridad 24/7' },
            { icon: Building, label: 'Terraza privada' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className='flex items-center gap-2.5 text-sm'>
              <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center'>
                <Icon size={15} className='text-muted-foreground' />
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
