import React from 'react'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { I18nProvider } from '@react-aria/i18n'
import { RangeCalendar } from '@heroui/react'
import { setTotalPrice } from '@/features/checkoutSlice'
import { reservationService } from '@/services/reservation'
import { useCalendarContext } from '@/context/calendarContext'
import { useDispatch, useSelector } from 'react-redux'
import { CALCULATE_RESERVATION_TOTAL } from '@/services/reservation/graphql/calculateReservationTotalQuery'
import { CalendarDate, DateValue, getLocalTimeZone, today } from '@internationalized/date'

/** "YYYY-MM-DD" del calendario -> medianoche UTC (mismo criterio que usa el backend para las temporadas) */
const toUtcMidnightISO = (value: DateValue) => `${value.toString().slice(0, 10)}T00:00:00.000Z`

export const ApartmentCalendarDateRange = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const [invalidDates, setInvalidDates] = React.useState<CalendarDate[]>([])
  const { date, setDate, refresh } = useCalendarContext()
  const dispatch = useDispatch()

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

  const isRangeReady =
    !!apartment?.id && !!date?.start && !!date?.end && date.end.compare(date.start) > 0

  const { data } = useQuery<{ calculateReservationTotal: number }>(
    CALCULATE_RESERVATION_TOTAL,
    {
      variables: {
        data: {
          apartmentIds: apartment ? [apartment.id] : [],
          startDate: date?.start ? toUtcMidnightISO(date.start) : undefined,
          endDate: date?.end ? toUtcMidnightISO(date.end) : undefined,
        },
      },
      skip: !isRangeReady,
      fetchPolicy: 'network-only',
    },
  )

  React.useEffect(() => {
    if (!isRangeReady) {
      dispatch(setTotalPrice(0))
      return
    }

    if (data) {
      dispatch(setTotalPrice(data.calculateReservationTotal))
    }
  }, [isRangeReady, data])

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
