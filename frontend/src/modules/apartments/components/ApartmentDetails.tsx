import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import {
  Bath,
  Bed,
  Square,
  ChefHat,
  Refrigerator,
  Sofa,
  UtensilsCrossed,
  Utensils,
} from 'lucide-react'

export const ApartmentDetails = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  if (!apartment) return null

  const amenities = [
    { icon: ChefHat, label: 'Cocina' },
    { icon: Refrigerator, label: 'Nevera' },
    { icon: Sofa, label: 'Sala' },
    { icon: UtensilsCrossed, label: 'Comedor' },
    { icon: Utensils, label: 'Cuchillos, cubiertos y platos' },
  ]

  return (
    <div className='flex flex-col gap-7 w-full'>
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
      <div className='flex flex-col gap-4'>
        <h2 className='font-semibold'>Amenidades</h2>
        <div className='grid grid-cols-2 gap-3'>
          {amenities.map(({ icon: Icon, label }) => (
            <div key={label} className='flex items-center gap-2.5 text-sm'>
              <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0'>
                <Icon size={15} className='text-muted-foreground' />
              </div>
              <span className='truncate'>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}