import React from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { I18nProvider } from '@react-aria/i18n'
import { RangeCalendar } from '@heroui/react'
import { reservationService } from '@/services/reservation'
import { useCalendarContext } from '@/context/calendarContext'
import { CalendarDate, DateValue, getLocalTimeZone, today } from '@internationalized/date'

export const ApartmentCalendarDateRange = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const [invalidDates, setInvalidDates] = React.useState<CalendarDate[]>([])
  const { date, setDate, refresh } = useCalendarContext()

  React.useEffect(() => {
    if (!apartment?.id) return

    const loadData = async () => {
      try {
        const response = await reservationService.getInvalidDates([apartment.id])
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
  }, [apartment?.id, refresh])

  if (!apartment) return null

  const isDateUnavailable = (date: DateValue) => {
    if (date.compare(today(getLocalTimeZone())) < 0) return true
    return invalidDates.some((invalidDate) => date.compare(invalidDate) === 0)
  }

  return (
    <I18nProvider locale='es'>
      <RangeCalendar
        value={date}
        aria-label='Date (Controlled)'
        onChange={setDate}
        errorMessage='Selecciona una fecha disponible'
        isDateUnavailable={isDateUnavailable}
        classNames={{
          base: 'shadow-none ',
        }}
      />
    </I18nProvider>
  )
}
