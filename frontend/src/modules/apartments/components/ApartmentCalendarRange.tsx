import React from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { I18nProvider } from '@react-aria/i18n'
import { formatCurrency } from '@/utils/formatCurrency'
import { reservationService } from '@/services/reservation'
import { today, getLocalTimeZone, CalendarDate, DateValue } from '@internationalized/date' // Importamos CalendarDate
import {
  Card,
  Button,
  Divider,
  CardBody,
  CardFooter,
  CardHeader,
  RangeCalendar,
} from '@heroui/react'

export const ApartmentCalendarRange = () => {
  const navigate = useNavigate()
  const apartment = useSelector((state: RootState) => state.apartment)
  const [invalidDates, setInvalidDates] = React.useState<CalendarDate[]>([])
  const [value, setValue] = React.useState<{
    start: DateValue
    end: DateValue
  } | null>(null)

  const startMs = value?.start.toDate(getLocalTimeZone()).getTime() ?? 0
  const endMs = value?.end.toDate(getLocalTimeZone()).getTime() ?? 0
  const totalDays = value ? Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) : 0

  React.useEffect(() => {
    if (!apartment?.id) return

    const loadData = async () => {
      try {
        const response = await reservationService.getInvalidDates(apartment.id)
        if (!response) return

        const formattedDates = response.map(
          (d) => new CalendarDate(parseInt(d.year), parseInt(d.month), parseInt(d.day)),
        )

        setInvalidDates(formattedDates)
      } catch (error) {
        console.error('Error cargando fechas no disponibles:', error)
      }
    }

    loadData()
  }, [apartment?.id])

  if (!apartment) return null

  const isDateUnavailable = (date: DateValue) => {
    if (date.compare(today(getLocalTimeZone())) < 0) return true
    return invalidDates.some((invalidDate) => date.compare(invalidDate) === 0)
  }

  return (
    <div>
      <Card className='w-fit'>
        <CardHeader className='flex gap-3'>
          <div className='flex items-baseline gap-1'>
            <span className='text-2xl font-extrabold'>{formatCurrency(apartment.pricePerDay)}</span>
            <span className='text-muted-foreground text-sm'>/noche</span>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <I18nProvider locale='es'>
            <RangeCalendar
              value={value}
              aria-label='Date (Controlled)'
              onChange={setValue}
              errorMessage='Selecciona una fecha disponible'
              isDateUnavailable={isDateUnavailable}
              classNames={{
                base: 'shadow-none',
              }}
            />
          </I18nProvider>
        </CardBody>
        <CardFooter className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2 w-full'>
            <span className='text-muted-foreground text-sm'>{totalDays} noches seleccionadas</span>
            <Divider />
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>{formatCurrency(Math.round(apartment.pricePerDay * totalDays))}</span>
            </div>
          </div>
          <Button
            color='primary'
            className='w-full'
            isDisabled={totalDays === 0}
            onPress={() => navigate('/checkout/national')}
          >
            {totalDays === 0 ? 'Selecciona una fecha' : 'Reservar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
