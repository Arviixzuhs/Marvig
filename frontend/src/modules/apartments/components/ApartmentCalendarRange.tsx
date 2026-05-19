import React from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { I18nProvider } from '@react-aria/i18n'
import { formatCurrency } from '@/utils/formatCurrency'
import { today, getLocalTimeZone } from '@internationalized/date'
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
  const apartment = useSelector((state: RootState) => state.apartment)
  const [value, setValue] = React.useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  })

  const startMs = value.start.toDate(getLocalTimeZone()).getTime()
  const endMs = value.end.toDate(getLocalTimeZone()).getTime()

  const totalDays = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24))

  if (!apartment) return

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
              aria-label='Date (Controlled)'
              value={value}
              onChange={setValue}
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
              <span>{formatCurrency(Math.round(apartment?.pricePerDay * totalDays))}</span>
            </div>
          </div>
          <Button className='w-full' color='primary' isDisabled={totalDays === 0}>
            {totalDays === 0 ? 'Selecciona una fecha' : 'Reservar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
