import { Divider } from '@heroui/react'
import { pluralize } from '@/utils/pluralize'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/formatCurrency'
import { Bath, Bed, Square } from 'lucide-react'
import { useCalendarContext } from '@/context/calendarContext'
import { ApartmentCalendarDateRange } from '@/components/ApartmentCalendarDateRange'
import { formatCalendarDate } from '@/utils/formatCalendarDate'

export const Summary = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const checkout = useSelector((state: RootState) => state.checkout)
  const { date } = useCalendarContext()
  if (!apartment) return

  return (
    <div className='w-full'>
      <div className='bg-card border border-border rounded-2xl p-5 sticky w-full'>
        <h3 className='font-semibold mb-4 text-sm'>Resumen de reserva</h3>
        <div className='flex gap-3 mb-5 w-full'>
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
        <div className='flex justify-center w-full mb-5'>
          <ApartmentCalendarDateRange />
        </div>
        <div className='text-sm flex flex-col gap-3 w-full'>
          <Divider />
          <div className='flex justify-between w-full'>
            <span className='text-muted-foreground'>
              {date?.start && date?.end
                ? `${formatCalendarDate(date.start)} - ${formatCalendarDate(date.end)}`
                : 'Seleccione fechas'}
            </span>
            <span className='text-muted-foreground font-bold'>
              {checkout.nights}{' '}
              <span className='font-normal'>{pluralize(checkout.nights, 'noche', 'noches')}</span>
            </span>
          </div>
          <Divider />
          <div className='flex justify-between font-bold text-base w-full'>
            <span>Total</span>
            <span>{formatCurrency(apartment.pricePerDay * checkout.nights)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
