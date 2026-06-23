import { ApartmentModel } from '@/models/ApartmentModel'
import { formatCurrency } from '@/utils/formatCurrency'
import { Bath, Bed, Square } from 'lucide-react'

interface ApartmentMiniCardProps {
  apartment: ApartmentModel
}

export const ApartmentMiniCard = ({ apartment }: ApartmentMiniCardProps) => {
  return (
    <div className='flex gap-3 w-full'>
      <div className='w-20 h-16 rounded-xl bg-muted overflow-hidden shrink-0'>
        <img className='w-full h-full object-cover' src={apartment.images?.[0].url} />
      </div>
      <div className='flex-1'>
        <h3 className='font-semibold text-sm mb-0.5'>Suit #{apartment.number}</h3>
        <div className='flex items-center gap-3 text-xs text-muted-foreground mb-3'>
          <span className='flex items-center gap-1'>
            <Bed size={11} /> {apartment.bedrooms} hab.
          </span>
          <span className='flex items-center gap-1'>
            <Bath size={11} /> {apartment.bathrooms} baños
          </span>
          <span className='flex items-center gap-1'>
            <Square size={11} /> {apartment.squareMeters}m²
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='font-bold text-sm'>
            {formatCurrency(apartment.pricePerDay)}
            <span className='text-muted-foreground font-normal text-xs'>/noche</span>
          </span>
        </div>
      </div>
    </div>
  )
}
