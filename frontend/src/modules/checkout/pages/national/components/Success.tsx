import { Check } from 'lucide-react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCalendarContext } from '@/context/calendarContext'
import { formatCalendarDate } from '@/utils/formatCalendarDate'
import { calcTotalByApartmentAndNights } from '@/utils/calcTotalByApartmentAndNights'

export const Success = () => {
  const checkout = useSelector((state: RootState) => state.checkout)
  const apartment = useSelector((state: RootState) => state.apartment)
  const { date } = useCalendarContext()
  if (!apartment) return null

  return (
    <div className='flex flex-col items-center justify-center text-center w-full min-h-[400px]'>
      <div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mb-5 shrink-0'>
        <Check size={36} className='text-green-600 dark:text-green-500' strokeWidth={2.5} />
      </div>
      <h2 className='text-2xl font-semibold mb-2 tracking-tight text-foreground'>
        ¡Reserva confirmada!
      </h2>
      <p className='text-muted-foreground text-sm mb-7 max-w-sm leading-relaxed px-4'>
        Tu reserva para ha sido confirmada con éxito. Recibirás un correo con todos los detalles.
      </p>
      <div className='bg-muted/60 border border-border rounded-xl p-5 text-left text-sm space-y-2.5 w-full max-w-sm mb-7'>
        <div className='flex justify-between items-center'>
          <span className='text-muted-foreground'>Entrada</span>
          <span className='font-medium text-foreground'>
            {date?.start && formatCalendarDate(date.start)}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-muted-foreground'>Sálida</span>
          <span className='font-medium text-foreground'>
            {date?.end && formatCalendarDate(date.end)}
          </span>
        </div>
        <div className='flex justify-between items-center font-bold border-t border-border pt-2.5 mt-1'>
          <span className='text-foreground'>Total pagado</span>
          <span className='text-foreground'>
            {formatCurrency(
              calcTotalByApartmentAndNights({
                nights: checkout.nights,
                pricePerDay: apartment.pricePerDay,
                ...(apartment.promotion && {
                  promotion: {
                    type: apartment.promotion.type,
                    value: apartment.promotion.value,
                  },
                }),
              }),
            )}
          </span>
        </div>
      </div>
      <button
        type='button'
        className='text-sm font-bold underline hover:opacity-80 transition-opacity'
        style={{ color: '#2B4FFF' }}
      >
        Ver mis reservas
      </button>
    </div>
  )
}
