import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/formatCurrency'
import { Bath, Bed, Square } from 'lucide-react'

export const Summary = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const checkout = useSelector((state: RootState) => state.checkout)
  if (!apartment) return

  return (
    <div className='w-full'>
      <div className='bg-card border border-border rounded-2xl p-5 sticky top-8'>
        <h3 className='font-semibold mb-4 text-sm'>Resumen de reserva</h3>
        <div className='flex gap-3 mb-5'>
          <div className='w-20 h-16 rounded-xl bg-muted overflow-hidden shrink-0'>
            <img className='w-full h-full object-cover' src={apartment.images?.[0].url} />
          </div>
          <div>
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
              <span className='text-xs text-muted-foreground'>5 reseñas</span>
            </div>
          </div>
        </div>
        <div className='border-t border-border pt-4 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>
              {checkout.date.start?.toLocaleDateString('es-ES')} -{' '}
              {checkout.date.end?.toLocaleDateString('es-ES')}
            </span>
            <span className='text-muted-foreground font-bold'>
              {checkout.nights} <span className='font-normal'>Noches</span>
            </span>
          </div>
          <div className='flex justify-between font-bold border-t border-border pt-3 text-base'>
            <span>Total</span>
            <span>{formatCurrency(apartment.pricePerDay * checkout.nights)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
