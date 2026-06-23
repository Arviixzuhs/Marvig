import { Divider } from '@heroui/react'
import { pluralize } from '@/utils/pluralize'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/formatCurrency'
import { ApartmentMiniCard } from '@/components/ApartmentMiniCard'
import { useCalendarContext } from '@/context/calendarContext'
import { formatCalendarDate } from '@/utils/formatCalendarDate'
import { ApartmentCalendarDateRange } from '@/components/ApartmentCalendarDateRange'

export const Summary = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const { date, nights } = useCalendarContext()
  if (!apartment) return

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-3 bg-card border border-border rounded-2xl p-5 sticky w-full'>
        <h3 className='font-semibold text-sm'>Resumen de reserva</h3>
        <ApartmentMiniCard apartment={apartment} />
        <div className='flex justify-center w-full'>
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
              {nights} <span className='font-normal'>{pluralize(nights, 'noche', 'noches')}</span>
            </span>
          </div>
          <Divider />
          <div className='flex justify-between font-bold text-base w-full'>
            <span>Total</span>
            <span>{formatCurrency(apartment.pricePerDay * nights)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
