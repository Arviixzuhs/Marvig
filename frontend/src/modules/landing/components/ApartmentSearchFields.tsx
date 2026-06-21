import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Search } from 'lucide-react'
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Button, DateRangePicker, type DateValue, type RangeValue } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'

export const ApartmentSearchFields = () => {
  const navigate = useNavigate()
  const currentZone = getLocalTimeZone()
  const todayDate = today(currentZone)

  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  })
  const [error, setError] = useState<string | null>(null)

  const getDateValue = (): RangeValue<CalendarDate> | undefined => {
    if (dates.startDate && dates.endDate) {
      return {
        start: parseDate(dates.startDate),
        end: parseDate(dates.endDate),
      }
    }
    return undefined
  }

  const handleChangeDate = (e: RangeValue<DateValue> | null) => {
    if (!e || !e.start || !e.end) return
    setError(null)
    setDates({
      startDate: e.start.toString(),
      endDate: e.end.toString(),
    })
  }

  const handleSearch = () => {
    setError(null)

    if (!dates.startDate || !dates.endDate) {
      setError('Por favor, selecciona un rango de fechas válido.')
      return
    }

    navigate(`/apartments?startDate=${dates.startDate}&endDate=${dates.endDate}`)
  }

  return (
    <div className='w-full max-w-md sm:max-w-xl mx-auto'>
      <div className='flex flex-col sm:flex-row gap-2 items-center p-1.5 shadow-md rounded-xl sm:rounded-full backdrop-blur-md'>
        <div className='w-full sm:flex-1'>
          <I18nProvider locale='es'>
            <DateRangePicker
              labelPlacement='outside-left'
              value={getDateValue()}
              onChange={handleChangeDate}
              minValue={todayDate}
              aria-label='Rango de fechas para reserva'
              startContent={
                <Calendar size={14} className='text-default-400 dark:text-default-500 shrink-0' />
              }
              variant='flat'
              radius='full'
              className='w-full'
            />
          </I18nProvider>
        </div>
        <div className='flex items-center gap-1.5 w-full sm:w-auto shrink-0'>
          <Button
            color='primary'
            onPress={handleSearch}
            radius='full'
            size='sm'
            className='flex-1 sm:flex-initial h-9 sm:h-10 px-5 font-medium shadow-sm shadow-primary/20'
          >
            <Search size={14} />
            Buscar
          </Button>
        </div>
      </div>
      {error && (
        <p className='text-[11px] text-danger font-medium mt-1.5 px-3 animate-appearance-in'>
          {error}
        </p>
      )}
    </div>
  )
}
